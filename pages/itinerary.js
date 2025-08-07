import { useState, useEffect } from 'react';
import ItineraryForm from '@/components/ItineraryForm/ItineraryForm';
import ItineraryList from '@/components/ItineraryList/ItineraryList';
import ItineraryModal from '@/components/ItineraryModal/ItineraryModal';
import styles from '../styles/Itinerary.module.css';
import {
    loadUserItineraries,
    saveItinerary,
    deleteItinerary,
    syncItineraryToCalendar,
    shareItinerary,
} from '@/controller/itineraryController';
import { showSuccess, showError, handleApiError } from '@/lib/toast';

export default function ItinerariesPage() {
    const [itineraries, setItineraries] = useState([]);
    const [editing, setEditing] = useState(null);
    const [showForm, setShowForm] = useState(false);
    const [selectedItinerary, setSelectedItinerary] = useState(null);
    const [syncing, setSyncing] = useState(null);

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
            showSuccess(data._id ? "Itinerary updated successfully!" : "Itinerary created successfully!");
            setShowForm(false);
            setEditing(null);
        } catch (err) {
            console.error("Save failed:", err.message);
            handleApiError(err, "Failed to save itinerary");
        }
    };

    const handleDelete = async (id) => {
        try {
            await deleteItinerary(id);
            setItineraries((prev) => prev.filter((item) => item._id !== id));
            showSuccess("Itinerary deleted successfully!");
        } catch (err) {
            console.error("Delete failed:", err.message);
            handleApiError(err, "Failed to delete itinerary");
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

    const handleToggleVisibility = async (id, makePublic) => {
        try {
            const updated = await saveItinerary({ _id: id, public: makePublic });
            setItineraries((prev) =>
                prev.map((item) => item._id === id ? updated : item)
            );
            showSuccess(`Itinerary ${makePublic ? 'made public' : 'made private'} successfully!`);
        } catch (err) {
            console.error("Visibility toggle failed:", err.message);
            handleApiError(err, "Failed to update itinerary visibility");
        }
    };

    const handleSync = async (id) => {
        setSyncing(id);
        try {
            const updated = await syncItineraryToCalendar(id);
            setItineraries((prev) =>
                prev.map((item) => item._id === id ? updated : item)
            );
            alert("Successfully synced to calendar");
        } catch (err) {
            console.error("Calendar sync failed:", err);
            alert("Sync failed: " + err.message);
        } finally {
            setSyncing(null);
        }
    };

    const handleShare = async (itinerary) => {
        try {
            await shareItinerary(itinerary._id);
            showSuccess('Link Copied to Clipboard');
        } catch (err) {
            console.error('Failed to share itinerary: ', err.message);
            showError('Failed to generate shareable link.');
        }
    };

    const upcoming = itineraries.filter(it => new Date(it.to) >= new Date());
    const past = itineraries.filter(it => new Date(it.to) < new Date());

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
                <h2 className={styles.subheading}>Upcoming Trips</h2>
                <ItineraryList
                    items={upcoming}
                    onEdit={(item) => {
                        setEditing(item);
                        setShowForm(true);
                    }}
                    onDelete={handleDelete}
                    onViewAttractions={setSelectedItinerary}
                    onToggleVisibility={handleToggleVisibility}
                    onShare={handleShare}
                    renderExtra={(item) => (
                        <button
                            className={styles.syncButton}
                            onClick={() => handleSync(item._id)}
                            disabled={syncing === item._id}
                        >
                            {item.isSynced ? 'Synced' : syncing === item._id ? 'Syncing...' : 'Sync with Calendar'}
                        </button>
                    )}
                />

                <hr className={styles.sectionDivider} />

                <h2 className={styles.subheading}>Previous Trips</h2>
                <ItineraryList
                    items={past}
                    onEdit={(item) => {
                        setEditing(item);
                        setShowForm(true);
                    }}
                    onDelete={handleDelete}
                    onViewAttractions={setSelectedItinerary}
                    onToggleVisibility={handleToggleVisibility}
                    onShare={handleShare}
                    renderExtra={(item) => (
                        <button
                            className={styles.syncButton}
                            onClick={() => handleSync(item._id)}
                            disabled={syncing === item._id}
                        >
                            {item.isSynced ? 'Synced' : syncing === item._id ? 'Syncing...' : 'Sync with Calendar'}
                        </button>
                    )}
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
