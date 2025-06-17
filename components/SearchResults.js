import { useState } from 'react';
import Image from 'next/image';
import styles from '../styles/SearchPage.module.css';

export default function SearchResults({ results }) {
  const [expanded, setExpanded] = useState(null);

  const closeModal = () => setExpanded(null);

  //Filter to ensure results are valid objects and contain at least name, image, or description
  const filteredResults = Array.isArray(results)
    ? results.filter((place) =>
        place &&
        typeof place === 'object' &&
        (typeof place.name === 'string' ||
         typeof place.description === 'string' ||
         typeof place.image === 'string')
      )
    : [];

    const handleSave = async (attraction) => {
      const token = localStorage.getItem("access_token");
    
      if (!token) {
        alert("You must be logged in to save attractions.");
        return;
      }
    
      try {
        const res = await fetch("/api/saved-attractions", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(attraction),
        });
    
        const result = await res.json();
        if (res.ok) {
          alert("Attraction saved!");
        } else {
          alert(result.message || "Save failed.");
        }
      } catch (err) {
        console.error("Save error:", err);
        alert("Something went wrong.");
      }
    };
    
  return (
    <>
      <ul className={styles.resultList}>
        {filteredResults.map((place) => (
          <li key={place.id || Math.random()} className={styles.resultItem}>
            <div className={styles.resultCard}>
              {typeof place.image === 'string' && (
                <Image
                  src={place.image}
                  alt={typeof place.name === 'string' ? place.name : 'Attraction image'}
                  className={styles.cardImage}
                />
              )}
              <h3>{typeof place.name === 'string' ? place.name : 'Unnamed Place'}</h3>
              <p>
                {typeof place.description === 'string'
                  ? place.description.length > 100
                    ? place.description.slice(0, 100) + '...'
                    : place.description
                  : 'No description available.'}
              </p>
              <button
                className={styles.showMoreBtn}
                onClick={() => setExpanded(place)}
              >
                Show More
              </button>
            </div>
          </li>
        ))}
      </ul>

      {expanded && (
        <div className={styles.modalOverlay} onClick={closeModal}>
          <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
            <button className={styles.closeModal} onClick={closeModal}>
              Close
            </button>
            <h2>{typeof expanded.name === 'string' ? expanded.name : 'Details'}</h2>
            {typeof expanded.image === 'string' && (
              <Image
                src={expanded.image}
                alt="Preview"
                className={styles.cardImage}
              />
            )}
            <p>
              {typeof expanded.description === 'string'
                ? expanded.description
                : 'No description available.'}
            </p>
            {typeof expanded.address === 'string' && (
              <p>
                <strong>Address:</strong> {expanded.address}
              </p>
            )}
            {typeof expanded.url === 'string' && (
              <p>
                <a href={expanded.url} target="_blank" rel="noopener noreferrer">
                  More Info
                </a>
              </p>
            )}
            <div className={styles.actions}>
              <button className={styles.actionBtn} onClick={() => handleSave(expanded)}>
                ⭐ Save
              </button>
              <button className={styles.actionBtn}>📅 Add to Itinerary</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
