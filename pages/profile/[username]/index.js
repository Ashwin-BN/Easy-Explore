import { useRouter } from "next/router";
import { useEffect, useState, useRef } from "react";
import { FaArrowLeft } from "react-icons/fa";
import Image from "next/image";
import styles from "../../../styles/Profile.module.css";
import VisitedPlaces from "@/components/VisitedPlacesPicker/VisitedPlaces";
import ItineraryModal from "@/components/ItineraryModal/ItineraryModal";
import ReviewStrip from "@/components/ReviewStrip/ReviewStrip";
import {
  getPublicProfileBundle,
} from "@/controller/profileController";

export default function PublicProfile() {
  const router = useRouter();
  const { username } = router.query;

  const [user, setUser] = useState(null);
  const [itineraries, setItineraries] = useState([]);
  const [recentReviews, setRecentReviews] = useState([]);
  const [selectedItinerary, setSelectedItinerary] = useState(null);

  const fileInputRef = useRef(null);

  useEffect(() => {
    if (!username) return;

    const fetchData = async () => {
      try {
        const bundle = await getPublicProfileBundle(username);
        // bundle -> { user, itineraries, recentReviews }
        if (!bundle?.user) {
          console.warn("No profile returned. Skipping...");
          return;
        }

        setUser(bundle.user);
        setItineraries(bundle.itineraries || []);
        setRecentReviews(bundle.recentReviews || []);
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
        <div className={styles.backWrapper}>
          <button className={styles.backButton} onClick={() => router.back()}>
            <FaArrowLeft className={styles.backIcon} />
            <span className={styles.backText}>Back</span>
          </button>
        </div>

        <h1 className={styles.heading}>@{user.userName}</h1>
        <hr className={styles.divider} />

        <div className={styles.profileHeader}>
          <div className={styles.pfpWrapper}>
            <Image
                src={user.profilePicture || "/default-pfp.jpg"}
                alt="Profile"
                className={styles.profileImage}
                width={120}
                height={120}
            />
          </div>

          <div className={styles.userHeader}>
            <h2 className={styles.displayName}>{user.userName || "Unknown"}</h2>
            <p className={styles.username}>
              @{user.userName} {" | "}
              <span className={styles.locationText}>
              {user.currentLocation?.city && user.currentLocation?.country
                  ? `${user.currentLocation.city}, ${user.currentLocation.country}`
                  : "Location not set"}
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

        {/* Recent Reviews */}
        <ReviewStrip
            reviews={recentReviews}
            onSeeAll={() =>
                router.push(`/profile/${encodeURIComponent(username)}/userReviews`)
            }
        />

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