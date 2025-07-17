import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';

export default function SharedItineraryPage() {
  const router = useRouter();
  const { itineraryId } = router.query;
  const [itinerary, setItinerary] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!itineraryId) return;

    const fetchItinerary = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/itineraries/shared/${itineraryId}`);
        if (!res.ok) throw new Error("Failed to fetch shared itinerary");
        const data = await res.json();
        setItinerary(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchItinerary();
  }, [itineraryId]);

  if (loading) return <p>Loading itinerary...</p>;
  if (error) return <p style={{ color: 'red' }}>{error}</p>;
  if (!itinerary) return <p>Itinerary not found.</p>;

  return (
    <div style={{ padding: "2rem" }}>
      <h1>{itinerary.name}</h1>
      <p><strong>From:</strong> {new Date(itinerary.from).toLocaleDateString()}</p>
      <p><strong>To:</strong> {new Date(itinerary.to).toLocaleDateString()}</p>

      <h2>Attractions:</h2>
      {itinerary.attractions?.length > 0 ? (
        <ul>
          {itinerary.attractions.map((attr, i) => (
            <li key={i}>
              <strong>{attr.name}</strong> — {attr.address || attr.description}
            </li>
          ))}
        </ul>
      ) : (
        <p>No attractions in this itinerary.</p>
      )}
    </div>
  );
}
