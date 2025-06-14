// pages/search.js
// This is the Search page.
// It shows the title, a search bar, and search results from OpenTripMap API.
// The user lands here after clicking "Start Exploring" from the homepage.

import { useState } from 'react';
import SearchBar from '@/components/SearchBar/SearchBar';
import AttractionCard from '@/components/AttractionCard/AttractionCard';
import AttractionMap from '@/components/AttractionMap/AttractionMap';
import styles from '../styles/SearchPage.module.css';

export default function SearchPage() {
  const [results, setResults] = useState([]);
  const [searchPerformed, setSearchPerformed] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [hoveredId, setHoveredId] = useState(null);
  const [query, setQuery] = useState('');
  const [location, setLocation] = useState(null);
  const itemsPerPage = 10;

  const handleResults = (data) => {
    setResults(data);
    setSearchPerformed(true);
    setCurrentPage(1);
  };

  const performSearch = () => {
    if (!query.trim() && !location) return;

    const params = new URLSearchParams({
      ...(query && { query }),
      radius: '5000',
      ...(location && {
        country: location.country,
        state: location.state,
        city: location.city,
      }),
    });

    fetch(`/api/search?${params}`)
        .then(res => res.json())
        .then(handleResults)
        .catch(console.error);
  };

  const totalPages = Math.ceil(results.length / itemsPerPage);
  const paginatedResults = results.slice(
      (currentPage - 1) * itemsPerPage,
      currentPage * itemsPerPage
  );

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
                    {paginatedResults.map(r => (
                        <AttractionCard
                            key={r.id}
                            attraction={r}
                            onHover={() => setHoveredId(r.id)}
                            onLeave={() => setHoveredId(null)}
                        />
                    ))}
                    <div className={styles.pagination}>
                      {Array.from({ length: totalPages }).map((_, i) => (
                          <button
                              key={i}
                              className={`${styles.pageButton} ${currentPage === i + 1 ? styles.activePage : ''}`}
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
      </div>
  );
}