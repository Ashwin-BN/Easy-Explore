export default async function handler(req, res) {
  const { query, lat, lon } = req.query;

  if (!query || !lat || !lon) {
    return res.status(400).json({ error: 'Missing query or coordinates' });
  }

  const radius = 10000; // 10km
  const apiKey = process.env.OPENTRIPMAP_API_KEY;
  const limit = 100;

  const listUrl = `https://api.opentripmap.com/0.1/en/places/radius?radius=${radius}&lon=${lon}&lat=${lat}&format=json&limit=${limit}&apikey=${apiKey}`;

  try {
    const listResponse = await fetch(listUrl);
    const places = await listResponse.json();

    // Filter only results that have xid
    const filtered = places.filter(p => p.xid && p.name);

    // Fetch detailed info for each place (parallel requests)
    const detailed = await Promise.all(
      filtered.map(async (place) => {
        try {
          const detailRes = await fetch(`https://api.opentripmap.com/0.1/en/places/xid/${place.xid}?apikey=${apiKey}`);
          const data = await detailRes.json();
          return {
            id: data.xid,
            name: data.name || '',
            description: data.wikipedia_extracts?.text || '',
            image: data.preview?.source || '',
          };
        } catch {
          return null;
        }
      })
    );

    // Clean nulls and sort
    const valid = detailed.filter(item => item !== null);

    // Sort: first with image and description
    valid.sort((a, b) => {
      const score = (obj) => (obj.image ? 1 : 0) + (obj.description ? 1 : 0);
      return score(b) - score(a);
    });

    res.status(200).json(valid);
  } catch (err) {
    console.error('Suggest API Error:', err);
    res.status(500).json({ error: 'Failed to fetch suggestions' });
  }
}
