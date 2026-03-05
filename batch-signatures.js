module.exports = async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const API_KEY = process.env.ANTHROPIC_API_KEY;
  if (!API_KEY) return res.status(500).json({ error: 'API key not configured' });

  try {
    const { rackets } = req.body;
    if (!rackets || !Array.isArray(rackets) || rackets.length === 0) {
      return res.status(400).json({ error: 'Missing rackets array' });
    }
    if (rackets.length > 10) {
      return res.status(400).json({ error: 'Max 10 rackets per batch' });
    }

    const results = [];

    for (const racket of rackets) {
      if (!racket.imageUrl || !racket.id) {
        results.push({ id: racket.id, error: 'Missing imageUrl or id', visualSignature: null });
        continue;
      }

      try {
        // Fetch image from Supabase and convert to base64
        const imgResp = await fetch(racket.imageUrl);
        if (!imgResp.ok) {
          results.push({ id: racket.id, error: `Image fetch failed: ${imgResp.status}`, visualSignature: null });
          continue;
        }
        const imgBuffer = await imgResp.arrayBuffer();
        const base64 = Buffer.from(imgBuffer).toString('base64');
        const contentType = imgResp.headers.get('content-type') || 'image/png';

        // Call Vision to extract visual signature
        const response = await fetch('https://api.anthropic.com/v1/messages', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'x-api-key': API_KEY,
            'anthropic-version': '2023-06-01',
          },
          body: JSON.stringify({
            model: 'claude-sonnet-4-5-20250929',
            max_tokens: 512,
            messages: [{
              role: 'user',
              content: [
                {
                  type: 'image',
                  source: { type: 'base64', media_type: contentType, data: base64 },
                },
                {
                  type: 'text',
                  text: `Cette image est la raquette de padel "${racket.name}" (${racket.brand}, ${racket.year}).

Décris TOUS les éléments visuels distinctifs de cette raquette pour pouvoir la reconnaître et la différencier d'autres modèles ou années de la même gamme.

Extrais en JSON :
- texts : tableau de TOUS les textes visibles sur la raquette (marque, modèle, technologies, inscriptions, signatures, même petits)
- colors : couleurs dominantes et secondaires, dans l'ordre d'importance
- tech : technologies ou innovations visibles inscrites sur la raquette (ex: "Auxetic 2", "Carbon Frame", "Power Foam", etc.)
- design : éléments de design distinctifs (motifs, formes géométriques, finitions, style du logo, texture)
- yearClues : tout indice visuel qui permettrait de distinguer cette version (année ${racket.year}) d'une autre année du même modèle

Réponds UNIQUEMENT en JSON valide :
{"texts":["HEAD","EXTREME","AUXETIC 2"],"colors":["noir","jaune fluo"],"tech":["Auxetic 2","Graphene 360+"],"design":["logo Head centré","motif géométrique angulaire"],"yearClues":"Auxetic 2 et coloris jaune = génération 2026"}`,
                },
              ],
            }],
          }),
        });

        const data = await response.json();
        if (!response.ok) {
          results.push({ id: racket.id, error: data.error?.message || 'Vision API error', visualSignature: null });
          continue;
        }

        const text = (data.content || []).map(b => b.text || '').join('');
        let parsed;
        try {
          parsed = JSON.parse(text.trim());
        } catch {
          const match = text.match(/\{[\s\S]*\}/);
          if (match) {
            parsed = JSON.parse(match[0]);
          } else {
            results.push({ id: racket.id, error: 'Could not parse Vision response', raw: text, visualSignature: null });
            continue;
          }
        }

        results.push({ id: racket.id, visualSignature: parsed });

      } catch (e) {
        results.push({ id: racket.id, error: e.message, visualSignature: null });
      }
    }

    return res.status(200).json({ results, processed: results.length });
  } catch (error) {
    return res.status(500).json({ error: 'Batch error: ' + error.message });
  }
};
