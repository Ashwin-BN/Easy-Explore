import { useState } from 'react';
import styles from './CollaboratorManager.module.css';
import { getToken, getCurrentUser } from '@/lib/authentication';

export default function CollaboratorManager({ itinerary, onCollaboratorsUpdated }) {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [removingId, setRemovingId] = useState(null);

  const currentUser = getCurrentUser();

  // Safely compare as strings since IDs could be strings or ObjectIds
  const isOwner = currentUser && itinerary?.userId && String(itinerary.userId) === String(currentUser._id);

  // Debug logs - you can remove these after confirming behavior
  console.log('Owner ID:', itinerary?.userId, typeof itinerary?.userId);
  console.log('Current user ID:', currentUser?._id, typeof currentUser?._id);

  const handleAdd = async () => {
    if (!email) return;

    const token = getToken();
    if (!token) {
      setError('User not authenticated');
      return;
    }

    try {
      setLoading(true);
      setError('');
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/itineraries/${itinerary._id}/collaborators`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `jwt ${token}`,
        },
        body: JSON.stringify({ collaboratorEmail: email }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Failed to add collaborator');

      onCollaboratorsUpdated();
      setEmail('');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleRemove = async (userId) => {
    const token = getToken();
    if (!token) {
      setError('User not authenticated');
      return;
    }

    try {
      setRemovingId(userId);
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/itineraries/${itinerary._id}/collaborators/${userId}`,
        {
          method: 'DELETE',
          headers: {
            Authorization: `jwt ${token}`,
          },
        }
      );

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Failed to remove collaborator');

      onCollaboratorsUpdated();
    } catch (err) {
      setError(err.message);
    } finally {
      setRemovingId(null);
    }
  };

  return (
    <div className={styles.manager}>
      <h3>Collaborators</h3>
      {error && <p className={styles.error}>{error}</p>}

      <ul className={styles.collabList}>
        {itinerary.collaborators?.map((user) => (
          <li key={user._id}>
            <span>{user.userName || user.email || 'Unknown user'}</span>
            {isOwner && (
              <button onClick={() => handleRemove(user._id)} disabled={removingId === user._id}>
                Remove
              </button>
            )}
          </li>
        ))}
      </ul>

      {isOwner && (
        <div className={styles.addForm}>
          <input
            type="email"
            value={email}
            placeholder="Enter email"
            onChange={(e) => setEmail(e.target.value)}
          />
          <button onClick={handleAdd} disabled={loading}>
            Add
          </button>
        </div>
      )}
    </div>
  );
}
