// components/Suggestion/Suggestions.js
import { useState, useEffect } from "react";
import AttractionCard from "@/components/AttractionCard/AttractionCard";
import { loadUserItineraries } from "@/controller/itineraryController";
import { fetchSavedAttractions } from "@/controller/attractionController";
import styles from "./Suggestions.module.css";

export default function Suggestions({ userLocation, onSelect }) {
  const [nearby, setNearby] = useState([]);
  const [suggested, setSuggested] = useState([]);
  const [loading, setLoading] = useState(true);

  async function fetchNearbyAttractions(lat, lon) {
    try {
      const res = await fetch(`/api/search?lat=${lat}&lon=${lon}&radius=5000`);
      if (!res.ok) throw new Error("Failed to fetch nearby attractions");
      return await res.json();
    } catch (err) {
      console.error(err);
      return [];
    }
  }

  async function fetchSimilarAttractionsByName(names = [], excludeIds = new Set()) {
    if (names.length === 0) return [];

    // For demo, just use the first name to query for similar
    const query = encodeURIComponent(names[0]);

    try {
      const res = await fetch(`/api/search?query=${query}&radius=5000`);
      if (!res.ok) throw new Error("Failed to fetch similar attractions");
      const data = await res.json();
      return data.filter((a) => !excludeIds.has(a.id));
    } catch (err) {
      console.error(err);
      return [];
    }
  }

  useEffect(() => {
    if (!userLocation) return;

    async function loadSuggestions() {
      setLoading(true);

      let savedAttractions = [];
      let itineraryAttractions = [];
      let isAuthenticated = true;

      try {
        const itineraries = await loadUserItineraries();
        savedAttractions = (await fetchSavedAttractions()) || [];

        if (Array.isArray(itineraries)) {
          itineraryAttractions = itineraries.flatMap((itin) => itin.attractions || []);
        }
      } catch (err) {
        console.warn("User not authenticated or failed to load user data:", err.message);
        isAuthenticated = false;
      }

      const savedIds = new Set(savedAttractions.map((a) => a.id));
      const itineraryIds = new Set(itineraryAttractions.map((a) => a.id));
      const excludeIds = new Set([...savedIds, ...itineraryIds]);

      const allNearby = await fetchNearbyAttractions(userLocation.lat, userLocation.lon);
      const filteredNearby = allNearby.filter((a) => !excludeIds.has(a.id));

      if (isAuthenticated) {
        // Extract names from saved and itinerary attractions for suggestions
        const savedNames = savedAttractions.map((a) => a.name).filter(Boolean);
        const itineraryNames = itineraryAttractions.map((a) => a.name).filter(Boolean);
        const uniqueNames = Array.from(new Set([...savedNames, ...itineraryNames]));

        const similarAttractions = await fetchSimilarAttractionsByName(uniqueNames, excludeIds);

        setSuggested(similarAttractions.slice(0, 6));
        setNearby(filteredNearby.slice(0, 6));
      } else {
        // If not authenticated, just show nearby attractions, no suggestions
        setSuggested([]);
        setNearby(filteredNearby.slice(0, 6));
      }

      setLoading(false);
    }

    loadSuggestions();
  }, [userLocation]);

  if (loading) return <p className={styles.loading}>Loading suggestions...</p>;

  if (!nearby.length && !suggested.length) {
    return (
      <p className={styles.noSuggestions}>
        No suggestions available near you at the moment.
      </p>
    );
  }

  return (
  <section className={styles.container} aria-label="Attraction suggestions">
    {suggested.length > 0 && (
      <>
        <h2 className={styles.title}>Suggested for You</h2>
        <div className={styles.grid} role="list">
          {suggested.map((attr) => (
            <AttractionCard
              key={attr.id}
              attraction={attr}
              onExpand={() => onSelect(attr)}
              role="listitem"
            />
          ))}
        </div>
      </>
    )}

    {nearby.length > 0 && (
      <>
        <h2 className={styles.title}>Nearby Attractions</h2>
        <div className={styles.grid} role="list">
          {nearby.map((attr) => (
            <AttractionCard
              key={attr.id}
              attraction={attr}
              onExpand={() => onSelect(attr)}
              role="listitem"
            />
          ))}
        </div>
      </>
    )}
  </section>
);
}
