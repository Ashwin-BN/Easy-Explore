// pages/search.js
// This is the Search page.
// It shows the title, a search bar, and search results from OpenTripMap API.
// The user lands here after clicking "Start Exploring" from the homepage.

import { useState } from 'react';
import SearchBar from '@/components/SearchBar';
import styles from '../styles/SearchPage.module.css';

export default function SearchPage() {
  const [results, setResults] = useState([]);

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>Attraction Finder</h1>
        <p className={styles.subtitle}>Search for places of interest around you</p>
      </div>

      <div className={styles.searchBox}>
        <SearchBar onResults={setResults} />
      </div>

      {Array.isArray(results) && results.length > 0 && (
        <div className={styles.results}>
          <h3>Search Results:</h3>
          <ul>
            {results.map((r) => (
              <li key={r.id}>
                <strong>{r.name}</strong> — {r.distance}m away
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
