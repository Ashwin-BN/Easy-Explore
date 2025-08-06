import { useEffect, useState } from 'react';
import Image from "next/image";
import { FaTrash } from 'react-icons/fa';
import styles from '../styles/SavedAttractions.module.css';
import {
    fetchSavedAttractions,
    removeSavedAttraction,
} from '@/controller/attractionController';
import { addAttractionToItinerary, loadUserItineraries } from '@/controller/itineraryController';
import AttractionCard from '@/components/AttractionCard/AttractionCard';

export default function SavedAttractions() {
    const [savedAttractions, setSavedAttractions] = useState([]);
    const [userItineraries, setUserItineraries] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeDropdown, setActiveDropdown] = useState(null);

    useEffect(() => {
        loadSavedAttractions();
        loadUserItineraries()
            .then(setUserItineraries)
            .catch((err) => console.error('Could not load itineraries:', err));
    }, []);

    async function loadSavedAttractions() {
        try {
            const data = await fetchSavedAttractions();
            setSavedAttractions(data);
        } catch (err) {
            console.error(err.message);
        } finally {
            setLoading(false);
        }
    }

    async function handleRemove(attractionId) {
        try {
            await removeSavedAttraction(attractionId);
            setSavedAttractions((prev) => prev.filter((a) => a.id !== attractionId));
        } catch (err) {
            console.error(err.message);
        }
    }

    async function handleAddToItinerary(itineraryId, attraction) {
        try {
            await addAttractionToItinerary(itineraryId, attraction);
            alert(`Added "${attraction.name}" to your itinerary.`);
            setActiveDropdown(null);
        } catch (err) {
            console.error('Failed to add attraction:', err);
            alert('Failed to add attraction to itinerary.');
        }
    }

    return (
        <div className={styles.container}>
            <header className={styles.header}>
                <h1 className={styles.title}>Your Saved Attractions</h1>
                <p className={styles.subtitle}>Explore what you&apos;ve bookmarked</p>
            </header>

            {loading ? (
                <p>Loading...</p>
            ) : savedAttractions.length === 0 ? (
                <p>No attractions saved yet.</p>
            ) : (
                <div className={styles.resultsContainer}>
                    <div className={styles.cardsColumn}>
                        {savedAttractions.map((attraction) => (
                            <AttractionCard
                                key={attraction.id}
                                attraction={attraction}
                                actions={
                                    <>
                                        <button
                                            className={`${styles.actionBtn} ${styles.addBtn}`}
                                            onClick={() =>
                                                setActiveDropdown(activeDropdown === attraction.id ? null : attraction.id)
                                            }
                                        >
                                            Add to Itinerary
                                        </button>

                                        <button
                                            className={`${styles.actionBtn} ${styles.removeBtn}`}
                                            onClick={() => handleRemove(attraction.id)}
                                        >
                                            <FaTrash /> Remove
                                        </button>
                                        {activeDropdown === attraction.id && (
                                            <select
                                                className={styles.selectDropdown}
                                                defaultValue=""
                                                onChange={(e) =>
                                                    handleAddToItinerary(e.target.value, attraction)
                                                }
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
                                    </>
                                }
                            />
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}
