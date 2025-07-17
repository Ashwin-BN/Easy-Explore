import { useEffect, useState, useRef } from 'react';
import Image from "next/image";
import styles from '../styles/Profile.module.css';
import VisitedPlaces from '@/components/VisitedPlacesPicker/VisitedPlaces';
import { loadUserItineraries } from '@/controller/itineraryController';
import { loadUserProfile, updateUserField } from '@/controller/profileController';
import ProfileEditModal from "@/components/ProfileEditModal/ProfileEditModal";
import ItineraryModal from "@/components/ItineraryModal/ItineraryModal";

export default function Profile() {
  const [user, setUser] = useState(null);
  const [itineraries, setItineraries] = useState([]);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedItinerary, setSelectedItinerary] = useState(null);
  const [formData, setFormData] = useState({
    userName: '',
    profilePicture: '',
    currentLocation: { city: '', country: '' },
    visitedCities: [],
  });

  const fileInputRef = useRef(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const profile = await loadUserProfile();
        if (!profile) {
          console.warn("No profile returned. Skipping...");
          return;
        }

        setUser(profile);
        setFormData({
          userName: profile.userName || '',
          profilePicture: profile.profilePicture || '',
          currentLocation: profile.currentLocation || { city: '', country: '' },
          visitedCities: profile.visitedCities || [],
        });

        const itinerariesData = await loadUserItineraries();
        setItineraries(itinerariesData.filter(it => it.public));
      } catch (err) {
        console.error("⚠️ Failed to load profile:", err.message);
      }
    };

    fetchData();
  }, []);

  const handleProfilePictureUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = async () => {
        const base64String = reader.result;
        await updateField('profilePicture', base64String);
      };
      reader.readAsDataURL(file);
    }
  };

  const updateField = async (key, value) => {
    try {
      await updateUserField(key, value);
      setFormData((prev) => ({ ...prev, [key]: value }));
    } catch (err) {
      console.error("Failed to update field:", err);
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

  if (!user) {
    return (
        <div className={styles.container}>
          <h1 className={styles.heading}>Loading profile...</h1>
        </div>
    );
  }

  return (
      <div className={styles.container}>
        <h1 className={styles.heading}>My Profile</h1>
        <hr className={styles.divider} />

        <div className={styles.profileHeader}>
          <div className={styles.pfpWrapper}>
            <Image
                src={formData.profilePicture || '/default-pfp.jpg'}
                alt="Profile"
                className={styles.profileImage}
            />
            <div className={styles.overlay} onClick={() => fileInputRef.current.click()}>
              <span className={styles.editIcon}>✎</span>
            </div>
            <input
                type="file"
                accept="image/*"
                ref={fileInputRef}
                style={{ display: 'none' }}
                onChange={handleProfilePictureUpload}
            />
          </div>

          <div className={styles.userHeader}>
            <h2 className={styles.displayName}>{user.email.split('@')[0]}</h2>
            <p className={styles.username}>
              @{formData.userName} {" | "}
              <span className={styles.locationText}>
              {formData.currentLocation.city && formData.currentLocation.country
                  ? `${formData.currentLocation.city}, ${formData.currentLocation.country}`
                  : 'Location not set'}
            </span>
            </p>
          </div>
        </div>

        <div className={styles.infoSection}>
            <button
                className={styles.editProfileButton}
                onClick={() => setShowEditModal(true)}
            >
              Edit Profile
            </button>

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

          <VisitedPlaces
              visited={formData.visitedCities}
              onUpdate={(newVisited) => updateField('visitedCities', newVisited)}
          />

        {showEditModal && (
            <ProfileEditModal
                initialData={formData}
                onClose={() => setShowEditModal(false)}
                onSuccess={(updatedFields) => {
                  setFormData((prev) => ({ ...prev, ...updatedFields }));
                }}
            />
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