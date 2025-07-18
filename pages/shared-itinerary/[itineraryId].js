import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import styles from '@/styles/SharedItineraryPage.module.css';

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

  function formatLocalDate(dateString) {
  if (!dateString) return '';
  const [year, month, day] = dateString.split('T')[0].split('-');
  return `${month}/${day}/${year}`;
}


  if (loading) return <p>Loading itinerary...</p>;
  if (error) return <p style={{ color: 'red' }}>{error}</p>;
  if (!itinerary) return <p>Itinerary not found.</p>;

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <h1 className={styles.header}>{itinerary.name}</h1>
        <p><strong>From:</strong> {formatLocalDate(itinerary.from)}</p>
        <p><strong>To:</strong> {formatLocalDate(itinerary.to)}</p>
      </div>

      <div className={styles.card}>
        <h2 className={`${styles.header} ${styles.headerNoMarginTop}`}>Attractions</h2>
        {itinerary.attractions?.length > 0 ? (
          <ul className={styles.list}>
            {itinerary.attractions.map((attr, i) => (
              <li key={i} className={styles.listItem}>
                <strong>{attr.name}</strong>
                <br />
                <small>{attr.address || attr.description}</small>
              </li>
            ))}
          </ul>
        ) : (
          <p>No attractions in this itinerary.</p>
        )}
      </div>
    </div>
  );
}
