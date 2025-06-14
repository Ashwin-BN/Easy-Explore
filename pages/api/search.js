export default async function handler(req, res) {
    const { country, state, city, radius = 5000, poiType = 'tourism.attraction' } = req.query;
    if (!country || !state || !city) {
        return res.status(400).json({ error: 'Country, state, and city required' });
    }

    // 1. Geocode the selected location
    const geoRes = await fetch(
        `https://api.geoapify.com/v1/geocode/search?` +
        `city=${encodeURIComponent(city)}&state=${encodeURIComponent(state)}` +
        `&country=${encodeURIComponent(country)}&limit=1&apiKey=${process.env.GEOAPIFY_KEY}`
    );
    const geoJson = await geoRes.json();
    const feat = geoJson.features?.[0];
    if (!feat) return res.status(404).json({ error: 'Location not found' });
    const { lat, lon } = feat.properties;

    // 2. Search for POIs with the requested category
    const placesRes = await fetch(
        `https://api.geoapify.com/v2/places?` +
        `categories=${poiType}&filter=circle:${lon},${lat},${radius}` +
        `&limit=50&apiKey=${process.env.GEOAPIFY_KEY}`
    );
    const placesJson = await placesRes.json();

    const formatted = (placesJson.features || []).map(f => ({
        id: f.properties.place_id,
        name: f.properties.name,
        lat: f.geometry.coordinates[1],
        lon: f.geometry.coordinates[0],
        address: f.properties.formatted,
        kinds: f.properties.categories,
        rating: f.properties.rate || null,
        image: f.properties.icon || null,
    }));

    console.log('Fetched attractions:', formatted);

    res.status(200).json(formatted);
}