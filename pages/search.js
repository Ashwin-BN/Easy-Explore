import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import dynamic from 'next/dynamic';
import SearchBar from '@/components/SearchBar/SearchBar';
import AttractionCard from '@/components/AttractionCard/AttractionCard';
import styles from '../styles/SearchPage.module.css';

const AttractionsMap = dynamic(() => import('@/components/AttractionMap/AttractionMap'), { ssr: false });

export default function SearchPage() {
  const [results, setResults] = useState({ match: [], nearby: [] });
  const [searchPerformed, setSearchPerformed] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [hoveredId, setHoveredId] = useState(null);
  const [query, setQuery] = useState('');
  const [location, setLocation] = useState(null);
  const [userLocation, setUserLocation] = useState(null);
  const [expandedAttraction, setExpandedAttraction] = useState(null);
  const [userItineraries, setUserItineraries] = useState([]);
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [category, setCategory] = useState('');
  const [radius, setRadius] = useState('5000');

  const router = useRouter();
  const itemsPerPage = 10;

  useEffect(() => {
    const storedUser = sessionStorage.getItem('user');
    const userObj = storedUser ? JSON.parse(storedUser) : null;
    const userId = userObj?.user?._id;
    if (userId) {
      const uItineraries = userObj?.user?.itineraries || [];
      setUserItineraries(uItineraries);
    }
  }, []);

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => setUserLocation({ lat: pos.coords.latitude, lon: pos.coords.longitude }),
        (err) => console.warn('Geolocation denied or unavailable.', err)
      );
    }
  }, []);

  const getUserIdFromSession = () => {
    const storedUser = sessionStorage.getItem('user');
    const userObj = storedUser ? JSON.parse(storedUser) : null;
    return userObj?.user?._id || null;
  };

  const performSearch = () => {
    if (!query.trim() && !location && !userLocation) return;

    const params = new URLSearchParams({
      ...(query && { query }),
      ...(radius && { radius }),
      ...(userLocation && { lat: userLocation.lat, lon: userLocation.lon }),
      ...(location && { country: location.country, state: location.state, city: location.city }),
      ...(category && { category }),
    });

    fetch(`/api/search?${params}`)
      .then((res) => res.json())
      .then((data) => {
        const match = data.filter(item => item._priorityMatch === 1);
        const nearby = data.filter(item => item._priorityMatch !== 1);
        setResults({ match, nearby });
        setSearchPerformed(true);
        setCurrentPage(1);
      })
      .catch(console.error);
  };

  const handleSaveToFavorites = async (item) => {
    const userId = getUserIdFromSession();
    if (!userId) return router.push('/login');

    try {
      const res = await fetch('/api/favorites', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, name: item.name }),
      });

      const data = await res.json();
      alert(res.ok ? `Saved ${item.name} to your favorites!` : data.message);
    } catch (err) {
      console.error("Error saving favorite:", err);
      alert("An unexpected error occurred.");
    }
  };

  const handleAddToItinerary = (item) => {
    const userId = getUserIdFromSession();
    if (!userId) return router.push('/login');
    setActiveDropdown(activeDropdown === item.id ? null : item.id);
  };

  const handleItinerarySelect = async (itineraryId, attraction) => {
    const userId = getUserIdFromSession();

    try {
      const res = await fetch('/api/add-to-itinerary', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, itineraryId, attraction }),
      });

      const data = await res.json();
      if (res.ok) {
        alert(`Added ${attraction.name} to your itinerary!`);
        setActiveDropdown(null);
      } else {
        alert(data.message);
      }
    } catch (err) {
      console.error("Error adding to itinerary:", err);
      alert("Unexpected error occurred.");
    }
  };

  const totalPages = Math.ceil(results.nearby.length / itemsPerPage);
  const paginatedResults = results.nearby.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>Attraction Finder</h1>
        <p className={styles.subtitle}>Search for places of interest around you</p>
      </div>

      <div className={styles.searchBox}>
        <SearchBar
          value={query}
          onChange={setQuery}
          onSearch={performSearch}
          onLocationChange={setLocation}
          onCategoryChange={setCategory}
          onRadiusChange={setRadius}
        />
      </div>

      {searchPerformed && (
        results.match.length > 0 || results.nearby.length > 0 ? (
          <div className={styles.resultsContainer}>
            <div className={styles.cardsColumn}>
              {results.match.length > 0 && (
                <>
                  {results.match.map((r) => (
                    <AttractionCard
                      key={r.id}
                      attraction={r}
                      onHover={() => setHoveredId(r.id)}
                      onLeave={() => setHoveredId(null)}
                      onExpand={() => setExpandedAttraction(r)}
                    />
                  ))}
                  <h3 style={{ marginTop: "1.5rem", fontWeight: 600 }}>
                    Popular Places Within {radius / 1000} km:
                  </h3>
                </>
              )}

              {paginatedResults.map((r) => (
                <AttractionCard
                  key={r.id}
                  attraction={r}
                  onHover={() => setHoveredId(r.id)}
                  onLeave={() => setHoveredId(null)}
                  onExpand={() => setExpandedAttraction(r)}
                />
              ))}

              <div className={styles.pagination}>
                <button
                  className={styles.pageButton}
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                >
                  Previous
                </button>

                {Array.from({ length: totalPages }).map((_, i) => (
                  <button
                    key={i}
                    className={`${styles.pageButton} ${currentPage === i + 1 ? styles.activePage : ''}`}
                    onClick={() => setCurrentPage(i + 1)}
                  >
                    {i + 1}
                  </button>
                ))}

                <button
                  className={styles.pageButton}
                  disabled={currentPage === totalPages}
                  onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                >
                  Next
                </button>
              </div>
            </div>

            <div className={styles.mapColumn}>
              <div className={styles.mapWrapper}>
                <AttractionsMap
                  results={[...results.match, ...results.nearby]}
                  hoveredId={hoveredId}
                  userLocation={userLocation}
                />
              </div>
            </div>
          </div>
        ) : (
          <p className={styles.noResults}>No results found.</p>
        )
      )}

      {expandedAttraction && (
        <div className={styles.modalOverlay} onClick={() => setExpandedAttraction(null)}>
          <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
            <button className={styles.closeModal} onClick={() => setExpandedAttraction(null)}>Close</button>
            <h2>{expandedAttraction.name || 'Details'}</h2>

            {expandedAttraction.image && (
              <img src={expandedAttraction.image} alt="Preview" className={styles.cardImage} />
            )}

            <p>{expandedAttraction.description || 'No description available.'}</p>
            {expandedAttraction.address && (
              <p><strong>Address:</strong> {expandedAttraction.address}</p>
            )}
            {expandedAttraction.url && (
              <div style={{ marginTop: '1rem' }}>
                <a href={expandedAttraction.url} target="_blank" rel="noopener noreferrer" className={styles.moreInfoLink}>
                  More Info
                </a>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
