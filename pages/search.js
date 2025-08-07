import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import dynamic from "next/dynamic";
import SearchBar from "@/components/SearchBar/SearchBar";
import AttractionCard from "@/components/AttractionCard/AttractionCard";
import {
  addAttractionToItinerary,
  loadUserItineraries,
} from "@/controller/itineraryController";
import { saveAttraction } from "@/controller/attractionController";
import styles from "../styles/SearchPage.module.css";
import Reviews from "@/components/Reviews/Reviews";
import ReviewForm from "@/components/Reviews/ReviewForm";
import Suggestions from "@/components/Suggestion/Suggestions";
import { getToken } from "@/lib/authentication";
import { showSuccess, showError, showInfo } from "@/lib/toast";

const AttractionsMap = dynamic(
  () => import("@/components/AttractionMap/AttractionMap"),
  { ssr: false }
);

export default function SearchPage() {
  const [results, setResults] = useState({ match: [], nearby: [] });
  const [searchPerformed, setSearchPerformed] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [hoveredId, setHoveredId] = useState(null);
  const [query, setQuery] = useState("");
  const [location, setLocation] = useState(null);
  const [userLocation, setUserLocation] = useState(null);
  const [expandedAttraction, setExpandedAttraction] = useState(null);
  const [userItineraries, setUserItineraries] = useState([]);
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [category, setCategory] = useState("");
  const [radius, setRadius] = useState("5000");

  const router = useRouter();
  const itemsPerPage = 10;

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) =>
          setUserLocation({
            lat: pos.coords.latitude,
            lon: pos.coords.longitude,
          }),
        (err) => console.warn("Geolocation denied or unavailable.", err)
      );
    }
  }, []);

  useEffect(() => {
    const token = getToken();
    if (!token) {
      console.log("User not authenticated, skipping itinerary load.");
      return;
    }
    loadUserItineraries()
      .then(setUserItineraries)
      .catch((err) => console.error("Could not load itineraries:", err));
  }, []);

  const performSearch = () => {
    if (!query.trim() && !location && !userLocation) return;

    const params = new URLSearchParams({
      ...(query && { query }),
      ...(radius && { radius }),
      ...(userLocation && { lat: userLocation.lat, lon: userLocation.lon }),
      ...(location && {
        country: location.country,
        state: location.state,
        city: location.city,
      }),
      ...(category && { category }),
    });

    fetch(`/api/search?${params}`)
      .then((res) => res.json())
      .then((data) => {
        const match = data.filter((item) => item._priorityMatch === 1);
        const nearby = data.filter((item) => item._priorityMatch !== 1);
        setResults({ match, nearby });
        setSearchPerformed(true);
        setCurrentPage(1);
      })
      .catch(console.error);
  };

  const handleSaveToFavorites = async (item) => {
    const token = getToken();

        if (!token) {
        showError("Please log in to save attractions.");
        router.push("/login");
        return;
    }
        try {
        await saveAttraction(item);
        showSuccess(`Saved ${item.name} to your favorites!`);
    } catch (err) {
        console.error("Error saving favorite:", err);
        showError("An unexpected error occurred.");
    }
  };

  async function handleAddToItinerary(itineraryId, attraction) {
    const token = getToken();
        if (!token) {
        showError("Please log in to add to itinerary.");
        router.push("/login");
        return;
    }

        if (!attraction || typeof attraction !== "object") {
        console.error("🚨 Invalid attraction object:", attraction);
        showError("Could not add attraction — invalid data.");
        return;
    }

    const formatted = {
      id: attraction.id || attraction.xid || "",
      name: attraction.name || "Unnamed Attraction",
      image: attraction.image || "",
      description: attraction.description || "",
      address: attraction.address || "",
      lat: attraction.lat || (attraction.point?.lat ?? null),
      lon: attraction.lon || (attraction.point?.lon ?? null),
      url: attraction.url || "",
    };

        try {
        await addAttractionToItinerary(itineraryId, formatted);
        showSuccess(`Added "${formatted.name}" to your itinerary.`);
        setActiveDropdown(null);
    } catch (err) {
        console.error("❌ Failed to add attraction:", err);
        showError("Failed to add attraction to itinerary.");
    }
  }

  const totalPages = Math.ceil(results.nearby.length / itemsPerPage);
  const paginatedResults = results.nearby.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>Attraction Finder</h1>
        <p className={styles.subtitle}>
          Search for places of interest around you
        </p>
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

      {!searchPerformed && userLocation && (
  <Suggestions
    userLocation={userLocation}
    onSelect={(attraction) => setExpandedAttraction(attraction)}
  />
)}

      {searchPerformed &&
        (results.match.length > 0 || results.nearby.length > 0 ? (
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
                  onClick={() =>
                    setCurrentPage((prev) => Math.max(prev - 1, 1))
                  }
                >
                  Previous
                </button>

                {Array.from({ length: totalPages }).map((_, i) => (
                  <button
                    key={i}
                    className={`${styles.pageButton} ${
                      currentPage === i + 1 ? styles.activePage : ""
                    }`}
                    onClick={() => setCurrentPage(i + 1)}
                  >
                    {i + 1}
                  </button>
                ))}

                <button
                  className={styles.pageButton}
                  disabled={currentPage === totalPages}
                  onClick={() =>
                    setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                  }
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
        ))}

      {expandedAttraction && (
        <div
          className={styles.modalOverlay}
          onClick={() => setExpandedAttraction(null)}
        >
          <div
            className={styles.modalContent}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className={styles.closeModal}
              onClick={() => setExpandedAttraction(null)}
            >
              Close
            </button>
            <h2>{expandedAttraction.name || "Details"}</h2>

            {expandedAttraction.image && (
              <img
                src={expandedAttraction.image}
                alt="Preview"
                className={styles.cardImage}
              />
            )}

            <p>
              {expandedAttraction.description || "No description available."}
            </p>
            {expandedAttraction.address && (
              <p>
                <strong>Address:</strong> {expandedAttraction.address}
              </p>
            )}
            {expandedAttraction.url && (
              <div style={{ marginTop: "1rem" }}>
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
              <button
                className={styles.actionBtn}
                onClick={() => handleSaveToFavorites(expandedAttraction)}
              >
                ⭐ Save
              </button>

              <button
                className={styles.actionBtn}
                onClick={() => {
                  const token = getToken();
                  if (!token) {
                    alert("Please log in to add to an itinerary.");
                    router.push("/login");
                    return;
                  }
                  setActiveDropdown(expandedAttraction.id);
                }}
              >
                📅 Add to Itinerary
              </button>

              {activeDropdown === expandedAttraction.id && (
                <select
                  defaultValue=""
                  onChange={(e) => {
                    handleAddToItinerary(e.target.value, expandedAttraction);
                    setActiveDropdown(null);
                    setExpandedAttraction(null);
                  }}
                >
                  <option value="" disabled>
                    Select an itinerary
                  </option>
                  {userItineraries.map((itin) => (
                    <option key={itin._id} value={itin._id}>
                      {itin.name}
                    </option>
                  ))}
                </select>
              )}
            </div>
            <hr style={{ margin: "1rem 0" }} />
            <h3>Reviews</h3>
            <Reviews attractionId={expandedAttraction.id} token={getToken()} />
          </div>
        </div>
      )}
    </div>
  );
}
