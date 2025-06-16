export default async function handler(req, res) {
  const { query } = req.query;
  const apiKey = process.env.OPENTRIPMAP_API_KEY;

  if (!query) {
    return res.status(400).json({ error: 'Missing search query' });
  }

  try {
    
    const geoRes = await fetch(
      `https://api.opentripmap.com/0.1/en/places/geoname?name=${encodeURIComponent(
        query
      )}&apikey=${apiKey}`
    );
    const geoData = await geoRes.json();

    const { lat, lon } = geoData;
    if (!lat || !lon) {
      return res.status(404).json({ error: 'Location not found' });
    }


    const radiusUrl = `https://api.opentripmap.com/0.1/en/places/radius?radius=10000&lon=${lon}&lat=${lat}&format=json&limit=50&apikey=${apiKey}`;
    const listRes = await fetch(radiusUrl);
    const listData = await listRes.json();
    console.log('listData:', listData);

    const attractions = await Promise.all(
      listData
        .filter((p) => p.xid)
        .map(async (item) => {
          try {
            const detailRes = await fetch(
              `https://api.opentripmap.com/0.1/en/places/xid/${item.xid}?apikey=${apiKey}`
            );
            const data = await detailRes.json();
            return {
              id: item.xid,
              name: data.name || '',
              image: data.preview?.source || '',
              description: data.wikipedia_extracts?.text || '',
              address: data.address?.road || '',
              url: data.url || '',
              lat: item.point.lat,
              lon: item.point.lon,
            };
          } catch {
            return null;
          }
        })
    );

    const filtered = attractions.filter((a) => a && a.name);
    res.status(200).json(filtered);
  } catch (err) {
    console.error('Global search error:', err);
    res.status(500).json({ error: 'Failed to fetch global attractions' });
  }
}
