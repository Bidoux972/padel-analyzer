module.exports = async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const API_KEY = process.env.ANTHROPIC_API_KEY;
  if (!API_KEY) return res.status(500).json({ error: 'API key not configured' });

  try {
    const { image, mediaType } = req.body;
    if (!image) return res.status(400).json({ error: 'Missing image data' });

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
              source: {
                type: 'base64',
                media_type: mediaType || 'image/jpeg',
                data: image,
              },
            },
            {
              type: 'text',
              text: `Tu vois une image d'une raquette de padel. Ne cherche PAS à identifier la marque ou le modèle. Fais uniquement un travail d'OCR et de description visuelle.

Extrais :
- visible_text : TOUS les mots et inscriptions lisibles sur l'objet, séparés par des espaces. Lis chaque mot tel quel, même déformé ou stylisé.
- colors : les couleurs visibles, dans l'ordre d'importance
- shape : forme générale parmi "Ronde", "Diamant", "Goutte d'eau", "Hybride"
- design_elements : description courte des motifs, logos, textures visibles

Réponds UNIQUEMENT en JSON valide :
{"visible_text":"HEAD EXTREME MOTION AUXETIC 2","colors":["noir","jaune","gris"],"shape":"Diamant","design_elements":"logo tête de raquette centré, motif géométrique angulaire jaune"}`,
            },
          ],
        }],
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      return res.status(response.status).json({ error: data.error?.message || 'Vision API error' });
    }

    // Extract JSON from Claude's response
    const text = (data.content || []).map(b => b.text || '').join('');
    let parsed;
    try {
      // Try direct parse first
      parsed = JSON.parse(text.trim());
    } catch {
      // Try to extract JSON from markdown code block
      const match = text.match(/\{[\s\S]*\}/);
      if (match) {
        parsed = JSON.parse(match[0]);
      } else {
        return res.status(200).json({ raw: text, error: 'Could not parse Vision response as JSON' });
      }
    }

    return res.status(200).json(parsed);
  } catch (error) {
    return res.status(500).json({ error: 'Scan proxy error: ' + error.message });
  }
};
