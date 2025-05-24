// pages/search.js
// This is the Search page.
// It shows the title, a search bar, and search results from OpenTripMap API.
// The user lands here after clicking "Start Exploring" from the homepage.

import { useState } from 'react';
import SearchBar from '@/components/SearchBar';
import styles from '../styles/SearchPage.module.css';

export default function SearchPage() {
  const [results, setResults] = useState([]);
  const [searchPerformed, setSearchPerformed] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  const itemsPerPage = 10;



  const handleResults = (data) => {
    setResults(data);
    setSearchPerformed(true);
    setCurrentPage(1)
  };

  const totalPages = Math.ceil(results.length / itemsPerPage);
  const startIdx = (currentPage - 1) * itemsPerPage;
  const paginatedResults = results.slice(startIdx, startIdx + itemsPerPage);

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>Attraction Finder</h1>
        <p className={styles.subtitle}>Search for places of interest around you</p>
      </div>

      <div className={styles.searchBox}>
        <SearchBar onResults={handleResults} />
      </div>

      {searchPerformed && (
  <div className={styles.results}>
    {results.length === 0 ? (
      <p className={styles.noResults}>No results found.</p>
    ) : (
      <>
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
              className={`${styles.pageButton} ${currentPage === i + 1 ? styles.activePage : ''}`}
              onClick={() => setCurrentPage(i + 1)}
            >
              {i + 1}
            </button>
          ))}
        </div>
      </>
    )}
  </div>
)}
    </div>
  );
}