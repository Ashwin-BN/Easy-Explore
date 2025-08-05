// pages/api/search.js

export default async function handler(req, res) {
  const {
    country,
    state,
    city,
    radius = 5000,
    poiType = 'tourism.attraction',
    category,
    query,
    lat: queryLat,
    lon: queryLon,
  } = req.query;

  let lat, lon;

  if (queryLat && queryLon) {
    // Use lat/lon from query if provided (e.g. from userLocation)
    lat = parseFloat(queryLat);
    lon = parseFloat(queryLon);
  } else {
    // 1. Get geolocation based on query (like "CN Tower") or city fallback
    const geoLocationName =
      query || (city && state && country ? `${city}, ${state}, ${country}` : null);

    if (!geoLocationName) {
      return res.status(400).json({ error: 'No valid location provided' });
    }

    const geoRes = await fetch(
      `https://api.geoapify.com/v1/geocode/search?` +
        `text=${encodeURIComponent(geoLocationName)}` +
        `&limit=1&apiKey=${process.env.GEOAPIFY_KEY}`
    );
    const geoJson = await geoRes.json();
    const feat = geoJson.features?.[0];
    if (!feat) return res.status(404).json({ error: 'Location not found' });

    lat = feat.properties.lat;
    lon = feat.properties.lon;
  }

  // 2. Get base POIs
  const placesRes = await fetch(
    `https://api.geoapify.com/v2/places?` +
      `categories=${category || poiType}` +
      `&filter=circle:${lon},${lat},${radius}` +
      `&limit=20&apiKey=${process.env.GEOAPIFY_KEY}`
  );
  const placesJson = await placesRes.json();
  const basePlaces = placesJson.features || [];

  // 3. Enrich each place with details including wiki image etc.
  const detailed = await Promise.all(
    basePlaces.map(async (f) => {
      const pid = f.properties.place_id;
      const detRes = await fetch(
        `https://api.geoapify.com/v2/place-details?` +
          `id=${pid}` +
          `&features=details&apiKey=${process.env.GEOAPIFY_KEY}`
      );
      const detJson = await detRes.json();
      const detailFeat = detJson.features?.find(
        (ft) => ft.properties?.wiki_and_media
      );
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
    })
  );

  // 4. Optional: keyword highlighting logic
  const results = detailed.map((place) => {
    if (query) {
      const keyword = query.toLowerCase();
      const name = place.name?.toLowerCase() || '';
      const desc = place.description?.toLowerCase() || '';
      place._priorityMatch =
        name.includes(keyword) || desc.includes(keyword) ? 1 : 0;
    } else {
      place._priorityMatch = 0;
    }
    return place;
  });

  // 5. Optional: sort by relevance
  results.sort((a, b) => b._priorityMatch - a._priorityMatch);

  return res.status(200).json(results);
}
