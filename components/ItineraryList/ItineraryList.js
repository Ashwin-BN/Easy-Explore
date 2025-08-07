import { FaEdit, FaTrash, FaEllipsisV, FaShareAlt, FaCalendarCheck } from 'react-icons/fa';
import { useState } from 'react';
import styles from './ItineraryList.module.css';
import { syncItineraryToCalendar } from '@/controller/itineraryController';
import { showSuccess, showError } from '@/lib/toast';

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

    const handleSync = async (id, type) => {
        try {
            const result = await syncItineraryToCalendar(id, type);

            if (type === 'google' && result.authUrl) {
                window.open(result.authUrl, '_blank');
            } else if (type === 'ical') {
                const blob = new Blob([result], { type: 'text/calendar' });
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = 'itinerary.ics';
                a.click();
                URL.revokeObjectURL(url);
            } else {
                alert("Itinerary synced!");
            }
        } catch (error) {
            alert("❌ Failed to sync itinerary: " + (error.message || error));
        }
    };

    if (items.length === 0) {
        return <p className={styles.empty}>No itineraries yet...</p>;
    }

    return (
        <ul className={styles.list}>
            {items.map((item) => {
                const hasCollaborators = Array.isArray(item.collaborators) && item.collaborators.length > 0;
                const sharedText = hasCollaborators ? 'With collaborators' : '';

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
                            {/* Calendar Sync Buttons */}
                            <button
                                className={styles.syncButton}
                                onClick={(e) => {
                                    e.stopPropagation();
                                    handleSync(item._id, 'google');
                                }}
                                title="Sync to Google Calendar"
                            >
                                <FaCalendarCheck /> Google
                            </button>

                            <button
                                className={styles.syncButton}
                                onClick={(e) => {
                                    e.stopPropagation();
                                    handleSync(item._id, 'ical');
                                }}
                                title="Download iCal"
                            >
                                <FaCalendarCheck /> iCal
                            </button>

                            {/* Edit Button */}
                            <button onClick={() => onEdit(item)} title="Edit">
                                <FaEdit />
                            </button>

                            {/* Delete Button */}
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

                            {/* Share Button */}
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    onShare(item);
                                }}
                                title="Share"
                            >
                                <FaShareAlt />
                            </button>

                            {/* Ellipsis menu for visibility toggle */}
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