import { FaEdit, FaTrash } from 'react-icons/fa';
import styles from './ItineraryList.module.css';

export default function ItineraryList({ items, onEdit, onDelete, onViewAttractions }) {
    const formatDate = (dateStr) => {
        if (!dateStr) return '';
        const date = new Date(dateStr);
        const year = date.getUTCFullYear();
        const month = date.toLocaleString('en-US', { month: 'long', timeZone: 'UTC' });
        const day = date.getUTCDate();
        return `${month} ${day}, ${year}`;
    };

    const sharedText = "Placeholder"

    if (items.length === 0) {
        return <p className={styles.empty}>No itineraries yet...</p>;
    }

    return (
        <ul className={styles.list}>
            {items.map((item) => (

                <li key={item._id} className={styles.item}>
                    <div
                        className={styles.clickableCard}
                        onClick={() => onViewAttractions(item)}
                    >
                        <div className={styles.details}>
                            <h3>{item.name}</h3>
                            <p className={styles.meta}>
                                {`${formatDate(item.from)} - ${formatDate(item.to)} | ${item.attractions?.length || 0} attraction${item.attractions?.length === 1 ? '' : 's'} | ${sharedText}`}
                            </p>
                        </div>
                    </div>
                    <div className={styles.actions}>
                        <button onClick={() => onEdit(item)} title="Edit">
                            <FaEdit />
                        </button>
                        <button
                            onClick={(e) => {
                                e.stopPropagation(); // prevent modal from opening
                                if (window.confirm('Are you sure you want to delete this itinerary?')) {
                                    onDelete(item._id);
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