import styles from './ItineraryModal.module.css';
import { FaTrash } from 'react-icons/fa';
import { removeAttractionFromItinerary } from '@/controller/itineraryController';
import {useEffect, useState} from 'react';

export default function ItineraryModal({ itinerary, onClose, onAttractionRemoved }) {
    const [localItinerary, setLocalItinerary] = useState(itinerary);
    const [loadingId, setLoadingId] = useState(null);

    useEffect(() => {
        setLocalItinerary(itinerary);
    }, [itinerary]);

    const handleRemove = async (attractionId) => {
        try {
            setLoadingId(attractionId);
            await removeAttractionFromItinerary(localItinerary._id, attractionId);
            setLocalItinerary(prev => ({
                ...prev,
                attractions: prev.attractions.filter(a => a.id !== attractionId),
            }));
            onAttractionRemoved(localItinerary._id, attractionId);
        } catch (err) {
            console.error("Failed to remove attraction:", err.message);
        } finally {
            setLoadingId(null);
        }
    };

    return (
        <div className={styles.modalOverlay} onClick={onClose}>
            <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
                <button className={styles.closeModal} onClick={onClose}>Close</button>
                <h2>{localItinerary.name}</h2>
                {localItinerary.attractions?.length > 0 ? (
                    <ul className={styles.attractionList}>
                        {localItinerary.attractions.map((a, i) => (
                            <li key={i} className={styles.attractionItem}>
                                <div>
                                    <strong>{a.name}</strong>
                                    {a.address && <p>{a.address}</p>}
                                    {a.url && (
                                        <a href={a.url} target="_blank" rel="noopener noreferrer">
                                            More Info
                                        </a>
                                    )}
                                </div>
                                <button
                                    className={styles.removeBtn}
                                    onClick={() => handleRemove(a.id)}
                                    disabled={loadingId === a.id}
                                    title="Remove attraction"
                                >
                                    <FaTrash />
                                </button>
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p>No attractions saved to this itinerary.</p>
                )}
            </div>
        </div>
    );
}