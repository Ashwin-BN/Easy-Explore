export default async function handler(req, res) {
    const { country, state, city, radius = 5000, poiType = 'tourism.attraction' } = req.query;
    if (!country || !state || !city) {
        return res.status(400).json({ error: 'Country, state, city required' });
    }

    // 1. Get coordinates via Geocoding API
    const geoRes = await fetch(
        `https://api.geoapify.com/v1/geocode/search?` +
        `city=${encodeURIComponent(city)}` +
        `&state=${encodeURIComponent(state)}` +
        `&country=${encodeURIComponent(country)}` +
        `&limit=1&apiKey=${process.env.GEOAPIFY_KEY}`
    );
    const geoJson = await geoRes.json();
    const feat = geoJson.features?.[0];
    if (!feat) return res.status(404).json({ error: 'Location not found' });
    const { lat, lon } = feat.properties;

    // 2. Get base POIs
    const placesRes = await fetch(
        `https://api.geoapify.com/v2/places?` +
        `categories=${poiType}` +
        `&filter=circle:${lon},${lat},${radius}` +
        `&limit=20&apiKey=${process.env.GEOAPIFY_KEY}`
    );
    const placesJson = await placesRes.json();
    const basePlaces = placesJson.features || [];

    // 3. Enrich each place with details including wiki image etc.
    const detailed = await Promise.all(basePlaces.map(async f => {
        const pid = f.properties.place_id;
        const detRes = await fetch(
            `https://api.geoapify.com/v2/place-details?` +
            `id=${pid}` +
            `&features=details&apiKey=${process.env.GEOAPIFY_KEY}`
        );
        const detJson = await detRes.json();
        const detailFeat = detJson.features?.find(ft => ft.properties?.wiki_and_media);
        const p = detailFeat?.properties ?? {};

        return {
            id: pid,
            name: f.properties.name || null,
            lat: f.geometry.coordinates[1],
            lon: f.geometry.coordinates[0],
            address: f.properties.formatted || null,
            kinds: f.properties.categories || [],
            rating: f.properties.rate ?? null,
            image: p?.wiki_and_media?.image || null,
            description: p.description || null,
            url: p.website || p.url || null,
            phone: p.phone || null,
            opening_hours: p.opening_hours || null,
        };
    }));

    return res.status(200).json(detailed);
}