// pages/api/search.js
export default async function handler(req, res) {
    const { query, lat, lon, radius = 5000 } = req.query;
  
    if (!query || !lat || !lon) {
      return res.status(400).json({ error: 'Missing query or coordinates' });
    }
  
    const kinds = 'museums,interesting_places,art_galleries,historic,cultural';
    const url = `https://api.opentripmap.com/0.1/en/places/radius?lat=${lat}&lon=${lon}&radius=${radius}&name=${encodeURIComponent(query)}&kinds=${kinds}&format=json&apikey=${process.env.OPENTRIPMAP_API_KEY}`;
  
    try {
      const response = await fetch(url);
      const rawData = await response.json();
      if (!Array.isArray(rawData)) {
        console.error("Unexpected response:", rawData);
        return res.status(500).json({ error: 'Unexpected data format from API' });
      }
      const formatted = rawData
        .filter(item => item.name)
        .map(item => ({
          id: item.xid,
          name: item.name,
          lat: item.point.lat,
          lon: item.point.lon,
          distance: Math.round(item.dist),
          kinds: item.kinds?.split(',') || [],
          rating: item.rate || null,
        }));
  
      res.status(200).json(formatted);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Failed to fetch attractions' });
    }
  }
  