// pages/search.js
// This is the Search page.
// It shows the title, a search bar, and search results from OpenTripMap API.
// The user lands here after clicking "Start Exploring" from the homepage.

import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import SearchBar from '@/components/SearchBar/SearchBar';
import SearchResults from '@/components/SearchResults';
import styles from '../styles/SearchPage.module.css';

const AttractionsMap = dynamic(() => import('@/components/AttractionMap/AttractionMap'), { ssr: false });

export default function SearchPage() {
  const [results, setResults] = useState([]);
  const [searchPerformed, setSearchPerformed] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [userLocation, setUserLocation] = useState(null);
  
  const itemsPerPage = 10;

  useEffect(() => {
    // Ask for user geolocation on component mount
    if (typeof window !== 'undefined' && navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setUserLocation([pos.coords.latitude, pos.coords.longitude]);
        },
        (err) => {
          console.warn('Geolocation permission denied or unavailable.', err);
          setUserLocation(null);
        }
      );
    }
  }, []);


  const handleResults = (data) => {
    setResults(data);
    setSearchPerformed(true);
    setCurrentPage(1);
  };

  const totalPages = Math.ceil(results.length / itemsPerPage);
  const startIdx = (currentPage - 1) * itemsPerPage;
  const safeResults = Array.isArray(results) ? results : [];
  const paginatedResults = safeResults.slice(startIdx, startIdx + itemsPerPage);  

  return (
  <div className={styles.container}>
    <div className={styles.header}>
      <h1 className={styles.title}>Attraction Finder</h1>
      <p className={styles.subtitle}>Search for places of interest around you</p>
    </div>

    {/* Floating Search Bar BELOW the mapWrapper */}
    <div>
      <SearchBar onResults={handleResults} />
    </div>
    
    <div className={styles.mapWrapper}>
      <AttractionsMap results={results} userLocation={userLocation} />
    </div>

    {searchPerformed && (
      <>
        {results.length === 0 ? (
          <p className={styles.noResults}>No results found.</p>
        ) : (
          <div className={styles.results}>
            <ul>
              {paginatedResults.map((r) => (
                <li key={r.id} className={styles.resultItem}>
                  {r.name}
                </li>
              ))}
            </ul>

            <div className={styles.pagination}>
              {Array.from({ length: totalPages }, (_, i) => (
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
        )}
      </>
    )}
  </div>
);
}
