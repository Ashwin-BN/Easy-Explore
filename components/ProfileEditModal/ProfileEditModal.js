import { useState } from 'react';
import styles from './ProfileEditModal.module.css';
import { updateUserField } from '@/controller/profileController';
import { showSuccess, showError } from '@/lib/toast';

export default function ProfileEditModal({ initialData, onClose, onSuccess }) {
    const [userName, setUserName] = useState(initialData.userName || '');
    const [city, setCity] = useState(initialData.currentLocation?.city || '');
    const [country, setCountry] = useState(initialData.currentLocation?.country || '');
    const [error, setError] = useState('');

    const handleSave = async () => {
        try {
            await updateUserField({
                userName,
                currentLocation: { city, country },
            });
            onSuccess({
                userName,
                currentLocation: { city, country },
            });
            onClose();
        } catch (err) {
            setError(err.message);
        }
    };

    return (
        <div className={styles.modalBackdrop}>
            <div className={styles.modal}>
                <h2>Edit Profile</h2>

                <label>Username</label>
                <input value={userName} onChange={(e) => setUserName(e.target.value)} />

                <label>City</label>
                <input value={city} onChange={(e) => setCity(e.target.value)} />

                <label>Country</label>
                <input value={country} onChange={(e) => setCountry(e.target.value)} />

                {error && <p className={styles.error}>{error}</p>}

                <div className={styles.actions}>
                    <button onClick={onClose}>Cancel</button>
                    <button onClick={handleSave}>Save</button>
                </div>
            </div>
        </div>
    );
}