import { useState } from 'react';
import ItineraryList from '../components/ItineraryList/ItineraryList';
import ItineraryForm from '../components/ItineraryForm/ItineraryForm';
import styles from '../styles/Itinerary.module.css';

export default function ItinerariesPage() {
    const [itineraries, setItineraries] = useState([]);
    const [editing, setEditing] = useState(null);
    const [showForm, setShowForm] = useState(false);

    const handleSave = (data) => {
        if (data.id) {
            setItineraries((prev) =>
                prev.map((item) => (item.id === data.id ? data : item))
            );
        } else {
            const newItem = {
                ...data,
                id: Date.now().toString(), // Or UUID
            };
            setItineraries((prev) => [...prev, newItem]);
        }

        setShowForm(false);
        setEditing(null);
    };

    const handleDelete = (id) => {
        setItineraries((prev) => prev.filter((item) => item.id !== id));
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
        </div>
    );
}