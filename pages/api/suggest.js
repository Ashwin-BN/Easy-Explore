export default async function handler(req, res) {
    const { query, lat, lon } = req.query;
  
    if (!query || !lat || !lon) {
      return res.status(400).json({ error: 'Missing query or coordinates' });
    }
  
    const url = `https://api.opentripmap.com/0.1/en/places/autosuggest?name=${encodeURIComponent(query)}&lat=${lat}&lon=${lon}&format=json&apikey=${process.env.OPENTRIPMAP_API_KEY}`;
  
    try {
      const response = await fetch(url);
      const data = await response.json();
  
      // Check that features exist and are an array
      if (!Array.isArray(data.features)) {
        return res.status(200).json([]); // no suggestions, return empty array
      }
  
      const suggestions = data.features
        .filter((item) => item.properties?.name)
        .map((item) => ({
          id: item.properties.xid,
          name: item.properties.name,
          kinds: item.properties.kinds?.split(',') || [],
        }));
  
      res.status(200).json(suggestions);
    } catch (err) {
      console.error('Suggest API Error:', err);
      res.status(500).json({ error: 'Failed to fetch suggestions' });
    }
  }
  