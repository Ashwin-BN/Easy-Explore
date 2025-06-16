import { FaEdit, FaTrash } from 'react-icons/fa';
import styles from './ItineraryList.module.css';

export default function ItineraryList({ items, onEdit, onDelete }) {
    const formatDate = (dateStr) => {
        if (!dateStr) return '';
        return new Date(dateStr).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
        });
    };

    if (items.length === 0) {
        return <p className={styles.empty}>No itineraries yet...</p>;
    }

    return (
        <ul className={styles.list}>
            {items.map((item) => (
                <li key={item.id} className={styles.item}>
                    <div className={styles.details}>
                        <h3>{item.name}</h3>
                        <p><strong>From:</strong> {formatDate(item.from)}</p>
                        <p><strong>To:</strong> {formatDate(item.to)}</p>
                    </div>
                    <div className={styles.actions}>
                        <button onClick={() => onEdit(item)} title="Edit">
                            <FaEdit />
                        </button>
                        <button
                            onClick={() => {
                                if (window.confirm('Are you sure you want to delete this itinerary?')) {
                                    onDelete(item.id);
                                }
                            }}
                            title="Delete"
                        >
                            <FaTrash />
                        </button>
                    </div>
                </li>
            ))}
        </ul>
    );
}