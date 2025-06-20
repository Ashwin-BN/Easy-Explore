import { useEffect, useState } from 'react';
import ItineraryList from '@/components/ItineraryList/ItineraryList';
import ItineraryForm from '@/components/ItineraryForm/ItineraryForm';
import ItineraryModal from "@/components/AttractionModal/ItineraryModal";
import styles from '../styles/Itinerary.module.css';
import {
    loadUserItineraries,
    saveItinerary,
    deleteItinerary,
} from '@/controller/itineraryController';

export default function ItinerariesPage() {
    const [itineraries, setItineraries] = useState([]);
    const [editing, setEditing] = useState(null);
    const [showForm, setShowForm] = useState(false);
    const [selectedItinerary, setSelectedItinerary] = useState(null);

    useEffect(() => {
        loadUserItineraries()
            .then(setItineraries)
            .catch((err) => console.error("Failed to load itineraries:", err.message));
    }, []);

    const handleSave = async (data) => {
        try {
            const saved = await saveItinerary(data);
            setItineraries((prev) =>
                data._id
                    ? prev.map((item) => (item._id === saved._id ? saved : item))
                    : [...prev, saved]
            );
            setShowForm(false);
            setEditing(null);
        } catch (err) {
            console.error("Save failed:", err.message);
        }
    };

    const handleDelete = async (id) => {
        try {
            await deleteItinerary(id);
            setItineraries((prev) => prev.filter((item) => item._id !== id));
        } catch (err) {
            console.error("Delete failed:", err.message);
        }
    };

    const handleAttractionRemoved = (itineraryId, attractionId) => {
        setItineraries(prev =>
            prev.map(itin =>
                itin._id === itineraryId
                    ? { ...itin, attractions: itin.attractions.filter(a => a.id !== attractionId) }
                    : itin
            )
        );
    };

    return (
        <div className={styles.wrapper}>
            <div className={styles.headerRow}>
                <h1 className={styles.title}>My Itineraries</h1>
                <button
                    className={styles.createButton}
                    onClick={() => {
                        setEditing(null);
                        setShowForm(true);
                    }}
                >
                    + Create Itinerary
                </button>
            </div>

            <div className={styles.pageContainer}>
                <ItineraryList
                    items={itineraries}
                    onEdit={(item) => {
                        setEditing(item);
                        setShowForm(true);
                    }}
                    onDelete={handleDelete}
                    onViewAttractions={setSelectedItinerary}
                />
            </div>

            {showForm && (
                <div className={styles.modalOverlay}>
                    <div className={styles.modalContent}>
                        <ItineraryForm
                            initialData={editing || {}}
                            onSave={handleSave}
                            onCancel={() => {
                                setShowForm(false);
                                setEditing(null);
                            }}
                        />
                    </div>
                </div>
            )}

            {selectedItinerary && (
                <ItineraryModal
                    itinerary={selectedItinerary}
                    onClose={() => setSelectedItinerary(null)}
                    onAttractionRemoved={handleAttractionRemoved}
                />
            )}
        </div>
    );
}