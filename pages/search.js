import { useState } from 'react';
import SearchBar from '@/components/SearchBar';
import SearchResults from '@/components/SearchResults';
import styles from '../styles/SearchPage.module.css';

export default function SearchPage() {
  const [results, setResults] = useState([]);
  const [searchPerformed, setSearchPerformed] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  const itemsPerPage = 10;

  const handleResults = (data) => {
    setResults(data);
    setSearchPerformed(true);
    setCurrentPage(1);
  };

  const totalPages = Math.ceil(results.length / itemsPerPage);
  const startIdx = (currentPage - 1) * itemsPerPage;const safeResults = Array.isArray(results) ? results : [];
  const paginatedResults = safeResults.slice(startIdx, startIdx + itemsPerPage);  

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
              <SearchResults results={paginatedResults} />
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
