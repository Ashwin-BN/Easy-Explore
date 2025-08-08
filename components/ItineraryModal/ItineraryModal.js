import styles from './ItineraryModal.module.css';
import { FaTrash } from 'react-icons/fa';
import { removeAttractionFromItinerary } from '@/controller/itineraryController';
import CollaboratorManager from '@/components/CollaboratorManager/CollaboratorManager';
import { getToken } from '@/lib/authentication';
import {useEffect, useState} from 'react';
import { useRouter } from 'next/router';
import {loadProfileByUsername} from "@/controller/profileController";
import AttractionCard from '@/components/AttractionCard/AttractionCard';

export default function ItineraryModal({ itinerary, onClose, onAttractionRemoved }) {
    const [localItinerary, setLocalItinerary] = useState(itinerary);
    const [loadingId, setLoadingId] = useState(null);
    const router = useRouter();

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

    const handleCollaboratorClick = async (username) => {
        try {
            const user = await loadProfileByUsername(username);
            if (user) {
                router.push(`/profile/${username}`);
            }
        } catch (err) {
            console.error("Could not load collaborator profile:", err.message);
        }
    };

    return (
        <div className={styles.modalOverlay} onClick={onClose}>
            <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
                <button className={styles.closeModal} onClick={onClose}>Close</button>
                <h2>{localItinerary.name}</h2>
                {localItinerary.attractions?.length > 0 ? (
                    <div className={styles.attractionsGrid}>
                        {localItinerary.attractions.map((a) => (
                            <AttractionCard
                                key={a.id}
                                attraction={a}
                                actions={
                                    <button
                                        className={styles.removeBtn}
                                        onClick={() => handleRemove(a.id)}
                                        disabled={loadingId === a.id}
                                        title="Remove attraction"
                                    >
                                        <FaTrash />
                                    </button>
                                }
                            />
                        ))}
                    </div>
                ) : (
                    <p>No attractions saved to this itinerary.</p>
                )}
                <CollaboratorManager
    itinerary={localItinerary}
    onCollaboratorsUpdated={async () => {
        const token = getToken();
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/itineraries/${localItinerary._id}`, {
            headers: {
                Authorization: `jwt ${token}`
            }
        });
        const data = await res.json();
        setLocalItinerary(data);
    }}
/>

            </div>
        </div>
    );
}