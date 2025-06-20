import { useEffect, useState } from 'react';
import { FaTrash } from 'react-icons/fa';
import styles from '../styles/Search.module.css';
import { fetchSavedAttractions, removeSavedAttraction } from '../controllers/attractionController';

export default function SavedAttractions() {
    const [savedAttractions, setSavedAttractions] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadSavedAttractions();
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
            setSavedAttractions(prev => prev.filter(attraction => attraction.id !== attractionId));
        } catch (err) {
            console.error(err.message);
        }
    }

    return (
        <div className={styles.container}>
            <header className={styles.header}>
                <h1 className={styles.title}>Your Saved Attractions</h1>
                <p className={styles.subtitle}>Explore what you've bookmarked</p>
            </header>

            {loading ? (
                <p>Loading...</p>
            ) : savedAttractions.length === 0 ? (
                <p>No attractions saved yet.</p>
            ) : (
                <div className={styles.resultsContainer}>
                    <div className={styles.cardsColumn}>
                        {savedAttractions.map(attraction => (
                            <div key={attraction.id} className={styles.card}>
                                {attraction.image && (
                                    <img
                                        src={attraction.image}
                                        alt={attraction.name}
                                        className={styles.cardImage}
                                    />
                                )}
                                <h2>{attraction.name}</h2>
                                <p>{attraction.address}</p>
                                <p>{attraction.description}</p>
                                <div className={styles.actions}>
                                    <button className={styles.actionBtn} onClick={() => handleRemove(attraction.id)}>
                                        <FaTrash /> Remove
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}