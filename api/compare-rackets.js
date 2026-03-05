module.exports = async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const API_KEY = process.env.ANTHROPIC_API_KEY;
  if (!API_KEY) return res.status(500).json({ error: 'API key not configured' });

  try {
    const { clientImage, candidates } = req.body;
    if (!clientImage || !candidates || !Array.isArray(candidates) || candidates.length === 0) {
      return res.status(400).json({ error: 'Missing clientImage or candidates' });
    }

    // Detect real image format from magic bytes
    function detectMediaType(buffer) {
      const bytes = new Uint8Array(buffer.slice(0, 16));
      if (bytes[0] === 0xFF && bytes[1] === 0xD8) return 'image/jpeg';
      if (bytes[0] === 0x89 && bytes[1] === 0x50) return 'image/png';
      if (bytes[0] === 0x52 && bytes[1] === 0x49 && bytes[2] === 0x46 && bytes[3] === 0x46) return 'image/webp';
      if (bytes[0] === 0x47 && bytes[1] === 0x49) return 'image/gif';
      return 'image/png'; // fallback
    }

    // Fetch and encode all candidate images in parallel
    const candidateImages = await Promise.all(
      candidates.slice(0, 5).map(async (c, i) => {
        try {
          const resp = await fetch(c.imageUrl);
          if (!resp.ok) return null;
          const buf = await resp.arrayBuffer();
          return {
            index: i + 1,
            id: c.id,
            name: c.name,
            base64: Buffer.from(buf).toString('base64'),
            mediaType: detectMediaType(buf),
          };
        } catch { return null; }
      })
    );

    const validCandidates = candidateImages.filter(Boolean);
    if (validCandidates.length === 0) {
      return res.status(200).json({ error: 'No candidate images could be loaded' });
    }

    // Build message content: client photo + numbered candidate images
    const content = [
      {
        type: 'image',
        source: { type: 'base64', media_type: 'image/jpeg', data: clientImage },
      },
      {
        type: 'text',
        text: 'Image ci-dessus : photo prise par le client d\'une raquette de padel.\n\nVoici les images de référence numérotées :',
      },
    ];

    // Add each candidate image with its number and name
    validCandidates.forEach(c => {
      content.push({
        type: 'text',
        text: `\n--- Raquette ${c.index} : "${c.name}" ---`,
      });
      content.push({
        type: 'image',
        source: { type: 'base64', media_type: c.mediaType, data: c.base64 },
      });
    });

    // Final instruction
    content.push({
      type: 'text',
      text: `\nCompare visuellement la photo du client avec les ${validCandidates.length} raquettes de référence ci-dessus. Regarde les couleurs, motifs, forme, design du tamis, texte visible, logo, et tout élément distinctif.

Quelle raquette de référence correspond le mieux à la photo du client ?

Réponds UNIQUEMENT en JSON valide :
{"match":1,"confidence":90,"reason":"mêmes couleurs jaune/noir, même motif géométrique, même logo Head"}

Si aucune ne correspond, réponds :
{"match":0,"confidence":0,"reason":"aucune correspondance visuelle"}`,
    });

    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': API_KEY,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-5-20250929',
        max_tokens: 256,
        messages: [{ role: 'user', content }],
      }),
    });

    const data = await response.json();
    if (!response.ok) {
      return res.status(response.status).json({ error: data.error?.message || 'Vision API error' });
    }

    const text = (data.content || []).map(b => b.text || '').join('');
    let parsed;
    try {
      parsed = JSON.parse(text.trim());
    } catch {
      const m = text.match(/\{[\s\S]*\}/);
      if (m) parsed = JSON.parse(m[0]);
      else return res.status(200).json({ raw: text, error: 'Could not parse comparison response' });
    }

    // Map match index back to candidate ID
    const matchIdx = parsed.match;
    const matched = matchIdx > 0 ? validCandidates.find(c => c.index === matchIdx) : null;

    return res.status(200).json({
      matchedId: matched ? matched.id : null,
      matchedName: matched ? matched.name : null,
      confidence: parsed.confidence || 0,
      reason: parsed.reason || '',
      candidateCount: validCandidates.length,
    });
  } catch (error) {
    return res.status(500).json({ error: 'Compare error: ' + error.message });
  }
};
