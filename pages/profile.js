import { useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/router';
import styles from '../styles/Profile.module.css';
import VisitedPlaces from "@/components/VisitedPlacesPicker/VisitedPlaces";

export default function Profile() {
  const [user, setUser] = useState(null);
  const [formData, setFormData] = useState({
    userName: '',
    email: '',
    profilePicture: '',
    currentLocation: {
      city: '',
      country: '',
    },
    visitedCities: [],
  });

  const router = useRouter();

  const fileInputRef = useRef(null);

  const handleProfilePictureUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result;
        setFormData(prev => ({ ...prev, profilePicture: base64String }));

        const updatedUser = {
          ...user,
          profilePicture: base64String,
        };
        sessionStorage.setItem('user', JSON.stringify(updatedUser));
        setUser(updatedUser);
      };
      reader.readAsDataURL(file);
    }
  };

  useEffect(() => {
    const storedUser = sessionStorage.getItem('user');
    if (storedUser) {
      const parsed = JSON.parse(storedUser);
      setUser(parsed);
      setFormData({
        userName: parsed.userName || '',
        email: parsed.email || '',
        profilePicture: parsed.profilePicture || '',
        currentLocation: parsed.currentLocation || { city: '', country: '' },
        visitedCities: parsed.visitedCities || [],
      });
    } else {
      router.push('/login');
    }
  }, [router]);

  if (!user) return null;

  return (
      <div className={styles.container}>
        <h1 className={styles.heading}>My Profile</h1>
        <hr className={styles.divider} />

        <div className={styles.profileHeader}>
          <div className={styles.pfpWrapper}>
            <img
                src={formData.profilePicture || '/easy_explore/public/default-pfp.jpg'}
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
              @{formData.userName}
              {" | "}
              <span className={styles.locationText}>
                {formData.currentLocation?.city && formData.currentLocation?.country
                    ? `${formData.currentLocation.city}, ${formData.currentLocation.country}`
                    : 'Location not set'}
              </span>
            </p>
          </div>
        </div>

        <div className={styles.infoSection}>

          <h3 className={styles.infoTitle}>Visited Places</h3>
          <VisitedPlaces
              visited={formData.visitedCities}
              onUpdate={(newVisited) =>
                  setFormData((prev) => ({ ...prev, visitedCities: newVisited }))
              }
          />

          {/* Public Itineraries */}
          <h3 className={styles.infoTitle}>Public Itineraries</h3>
          <div className={styles.itineraryGrid}>
            {/* Replace this with dynamic data later */}
            <div className={styles.itineraryCard}>Tokyo Adventure 🇯🇵</div>
            <div className={styles.itineraryCard}>Roadtrip USA 🇺🇸</div>
            {/* if empty, render this instead: */}
            {/* <p className={styles.placeholderText}>No public itineraries yet.</p> */}
          </div>
        </div>
      </div>
  );
}