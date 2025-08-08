import { useRouter } from 'next/router';
import { useEffect, useState, useRef } from 'react';
import Image from 'next/image';
import styles from '../../styles/Profile.module.css';
import VisitedPlaces from '@/components/VisitedPlacesPicker/VisitedPlaces';
import ItineraryModal from '@/components/ItineraryModal/ItineraryModal';
import { getUserProfileByUsername, loadPublicItinerariesByUsername } from '@/controller/profileController';

export default function PublicProfile() {
    const router = useRouter();
    const { username } = router.query;

    const [user, setUser] = useState(null);
    const [itineraries, setItineraries] = useState([]);
    const [selectedItinerary, setSelectedItinerary] = useState(null);

    const fileInputRef = useRef(null);

    useEffect(() => {
        if (!username) return;

        const fetchData = async () => {
            try {
                const profile = await getUserProfileByUsername(username);
                if (!profile) {
                    console.warn("No profile returned. Skipping...");
                    return;
                }

                setUser(profile);

                const itinerariesData = await loadPublicItinerariesByUsername(username);
                setItineraries(itinerariesData);
            } catch (err) {
                console.error("⚠️ Failed to load public profile:", err.message);
            }
        };

        fetchData();
    }, [username]);

    if (!user) {
        return (
            <div className={styles.container}>
                <h1 className={styles.heading}>Loading profile...</h1>
            </div>
        );
    }

    return (
        <div className={styles.container}>
            <h1 className={styles.heading}>@{user.userName}</h1>
            <hr className={styles.divider} />

            <div className={styles.profileHeader}>
                <div className={styles.pfpWrapper}>
                    <Image
                        src={user.profilePicture || '/default-pfp.jpg'}
                        alt="Profile"
                        className={styles.profileImage}
                        width={120}
                        height={120}
                    />
                </div>

                <div className={styles.userHeader}>
                    <h2 className={styles.displayName}>{user.email?.split('@')[0] || 'Unknown'}</h2>
                    <p className={styles.username}>
                        @{user.userName} {" | "}
                        <span className={styles.locationText}>
              {user.currentLocation?.city && user.currentLocation?.country
                  ? `${user.currentLocation.city}, ${user.currentLocation.country}`
                  : 'Location not set'}
            </span>
                    </p>
                </div>
            </div>

            <div className={styles.infoSection}>
                <h3 className={styles.infoTitle}>Public Itineraries</h3>
                <div className={styles.itineraryGrid}>
                    {itineraries.length > 0 ? (
                        itineraries.map((itin) => (
                            <div
                                key={itin._id}
                                className={styles.itineraryCard}
                                onClick={() => setSelectedItinerary(itin)}
                            >
                                {itin.name}
                            </div>
                        ))
                    ) : (
                        <p className={styles.placeholderText}>No itineraries yet.</p>
                    )}
                </div>
            </div>

            <VisitedPlaces visited={user.visitedCities || []} readOnly />

            {selectedItinerary && (
                <ItineraryModal
                    itinerary={selectedItinerary}
                    onClose={() => setSelectedItinerary(null)}
                />
            )}
        </div>
    );
}