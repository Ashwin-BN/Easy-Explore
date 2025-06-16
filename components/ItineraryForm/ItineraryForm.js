import { useState, useEffect } from 'react';
import styles from './ItineraryForm.module.css';

export default function ItineraryForm({ initialData = {}, onSave, onCancel }) {
    const [name, setName] = useState('');
    const [from, setFrom] = useState('');
    const [to, setTo] = useState('');

    useEffect(() => {
        setName(initialData.name || '');
        setFrom(initialData.from || '');
        setTo(initialData.to || '');
    }, [initialData]);

    const handleSubmit = (e) => {
        e.preventDefault();

        if (!name || !from || !to) {
            alert('Please fill in all fields.');
            return;
        }

        if (new Date(to) < new Date(from)) {
            alert('"To" date must be after the "From" date.');
            return;
        }

        onSave({ ...initialData, name, from, to });
    };

    return (
        <form className={styles.itineraryForm} onSubmit={handleSubmit}>
            <label>
                Itinerary Name:
                <input
                    type="text"
                    placeholder="My Trip to Ecuador"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                />
            </label>

            <div className={styles.dateRange}>
                <label>
                    From:
                    <input type="date" value={from} onChange={(e) => setFrom(e.target.value)} />
                </label>
                <label>
                    To:
                    <input type="date" value={to} onChange={(e) => setTo(e.target.value)} />
                </label>
            </div>

            <p>(Attraction selector coming soon...)</p>

            <div className={styles.formActions}>
                <button type="button" onClick={onCancel}>Cancel</button>
                <button type="submit">Save</button>
            </div>
        </form>
    );
}