import { useState, useEffect } from 'react';
import { useRouter } from 'next/router'; 
import SearchBar from '@/components/SearchBar/SearchBar';
import AttractionCard from '@/components/AttractionCard/AttractionCard';
import styles from '../styles/SearchPage.module.css';
import AttractionMap from "@/components/AttractionMap/AttractionMap";

export default function SearchPage() {
  const [results, setResults] = useState([]);
  const [searchPerformed, setSearchPerformed] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [hoveredId, setHoveredId] = useState(null);
  const [query, setQuery] = useState('');
  const [location, setLocation] = useState(null);
  const [userLocation, setUserLocation] = useState(null);
  const [expandedAttraction, setExpandedAttraction] = useState(null);
  const [userItineraries, setUserItineraries] = useState([]);
  const [activeDropdown, setActiveDropdown] = useState(null);
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
          (pos) => {
            setUserLocation({
              lat: pos.coords.latitude,
              lon: pos.coords.longitude,
            });
          },
          (err) => {
            console.warn('Geolocation denied or unavailable.', err);
          }
      );
    }
  }, []);

  const handleResults = (data) => {
    setResults(data);
    setSearchPerformed(true);
    setCurrentPage(1);
  };

  const performSearch = () => {
    if (!query.trim() && !location && !userLocation) return;

    const params = new URLSearchParams({
      ...(query && { query }),
      radius: '5000',
      ...(userLocation && {
        lat: userLocation.lat,
        lon: userLocation.lon,
      }),
      ...(location && {
        country: location.country,
        state: location.state,
        city: location.city,
      }),
    });

    fetch(`/api/search?${params}`)
        .then((res) => res.json())
        .then(handleResults)
        .catch(console.error);
  };

  const totalPages = Math.ceil(results.length / itemsPerPage);
  const paginatedResults = results.slice(
      (currentPage - 1) * itemsPerPage,
      currentPage * itemsPerPage
  );

  
  const getUserIdFromSession = () => {
  const storedUser = sessionStorage.getItem('user');
  const userObj = storedUser ? JSON.parse(storedUser) : null;
  return userObj?.user?._id || null;
  };

  
  const handleSaveToFavorites = async (item) => {
  const userId = getUserIdFromSession();

  if (!userId) {
    router.push('/login');
    return;
  }

  try {
    const res = await fetch('/api/favorites', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        userId,
        name: item.name,
      }),
    });

    const data = await res.json();

    if (res.ok) {
      alert(`Saved ${item.name} to your favorites!`);
    } else {
      alert(data.message);
    }
  } catch (err) {
    console.error("Error saving favorite:", err);
    alert("An unexpected error occurred.");
    } 
  };

  
  const handleAddToItinerary = (item) => {
  const userId = getUserIdFromSession();
  if (!userId) {
    router.push('/login');
    return;
  }
  setActiveDropdown(activeDropdown === item.id ? null : item.id);
};

const handleItinerarySelect = async (itineraryId, attraction) => {
  const userId = getUserIdFromSession();
  console.log(itineraryId)
  console.log(attraction)

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



  return (
      <div className={styles.container}>
        <div className={styles.topLeftHeader}>Where are you travelling?</div>
        <div className={styles.searchBox}>
          <SearchBar
              value={query}
              onChange={setQuery}
              onSearch={performSearch}
              onLocationChange={setLocation}
          />
        </div>

        {searchPerformed && (
            results.length > 0 ? (
                <div className={styles.resultsContainer}>
                  <div className={styles.cardsColumn}>
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
                      {Array.from({ length: totalPages }).map((_, i) => (
                          <button
                              key={i}
                              className={`${styles.pageButton} ${
                                  currentPage === i + 1 ? styles.activePage : ''
                              }`}
                              onClick={() => setCurrentPage(i + 1)}
                          >
                            {i + 1}
                          </button>
                      ))}
                    </div>
                  </div>
                  <div className={styles.mapColumn}>
                    <div className={styles.mapWrapper}>
                      <AttractionMap results={results} hoveredId={hoveredId} />
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
                      <a
                          href={expandedAttraction.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className={styles.moreInfoLink}
                      >
                        More Info
                      </a>
                    </div>
                )}
                <div className={styles.actions}>
                  <button className={styles.actionBtn} onClick={() => handleSaveToFavorites(expandedAttraction)}>⭐ Save</button>
                  <button className={styles.actionBtn} onClick={() => handleAddToItinerary(expandedAttraction)}>📅 Add to Itinerary</button>
                  {activeDropdown === expandedAttraction.id && (
                    <select
                      className={styles.selectDropdown}
                      onChange={(e) => {
                        const selectedItinerary = e.target.value;
                        if (selectedItinerary) {
                          handleItinerarySelect(selectedItinerary, expandedAttraction);
                          setActiveDropdown(null); 
                        }
                      }}
                      defaultValue=""
                    >
                      <option value="" disabled>Select an itinerary</option>
                      {userItineraries.map((itinerary) => (
                        <option key={itinerary} value={itinerary}>
                          {itinerary}
                        </option>
                      ))}
                    </select>
                  )}
                </div>
              </div>
            </div>
        )}
      </div>
  );
}