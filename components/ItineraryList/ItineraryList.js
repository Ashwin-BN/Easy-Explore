import { FaEdit, FaTrash, FaEllipsisV, FaShareAlt } from 'react-icons/fa';
import { useState } from 'react';
import styles from './ItineraryList.module.css';

export default function ItineraryList({ items, onEdit, onDelete, onViewAttractions, onToggleVisibility, onShare }) {
    const [openMenuId, setOpenMenuId] = useState(null);

    const formatDate = (dateStr) => {
        if (!dateStr) return '';
        const date = new Date(dateStr);
        const year = date.getUTCFullYear();
        const month = date.toLocaleString('en-US', { month: 'long', timeZone: 'UTC' });
        const day = date.getUTCDate();
        return `${month} ${day}, ${year}`;
    };

    if (items.length === 0) {
        return <p className={styles.empty}>No itineraries yet...</p>;
    }

    return (
        <ul className={styles.list}>
            {items.map((item) => {
                const sharedText = Array.isArray(item.collaborators) && item.collaborators.length > 0
                    ? 'Shared Itinerary'
                    : '';

                return (
                    <li key={item._id} className={styles.item}>
                        <div
                            className={styles.clickableCard}
                            onClick={() => onViewAttractions(item)}
                        >
                            <div className={styles.details}>
                                <h3>{item.name}</h3>
                                <p className={styles.meta}>
                                    {`${formatDate(item.from)} - ${formatDate(item.to)} | ${item.attractions?.length || 0} attraction${item.attractions?.length === 1 ? '' : 's'}${sharedText ? ' | ' + sharedText : ''}`}
                                </p>
                            </div>
                        </div>

                        <div className={styles.actions}>
                            <button onClick={() => onEdit(item)} title="Edit">
                                <FaEdit />
                            </button>
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    if (window.confirm('Are you sure you want to delete this itinerary?')) {
                                        onDelete(item._id);
                                    }
                                }}
                                title="Delete"
                            >
                                <FaTrash />
                            </button>
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    onShare(item);
                                }}
                                title="Share"
                            >
                                <FaShareAlt />
                            </button>

                            <div className={styles.menuWrapper}>
                                <FaEllipsisV
                                    className={styles.menuIcon}
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        setOpenMenuId(openMenuId === item._id ? null : item._id);
                                    }}
                                />
                                {openMenuId === item._id && (
                                    <div
                                        className={styles.dropdownMenu}
                                        onClick={(e) => e.stopPropagation()}
                                    >
                                        <button onClick={() => {
                                            onToggleVisibility(item._id, !item.public);
                                            setOpenMenuId(null);
                                        }}>
                                            {item.public ? 'Hide from Profile' : 'Show on Profile'}
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>
                    </li>
                );
            })}
        </ul>
    );
}