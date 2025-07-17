import { useState } from 'react';
import styles from './CollaboratorManager.module.css';
import { getToken, getCurrentUser } from '@/lib/authentication';

export default function CollaboratorManager({ itinerary, onCollaboratorsUpdated }) {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [removingId, setRemovingId] = useState(null);

  const currentUser = getCurrentUser();

  const isOwner = currentUser && itinerary?.userId && String(itinerary.userId) === String(currentUser._id);

  const handleAdd = async () => {
    if (!email.trim()) {
      setError('Please enter a valid email address.');
      return;
    }

    const token = getToken();
    if (!token) {
      setError('User not authenticated.');
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
        body: JSON.stringify({ collaboratorEmail: email.trim() }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Failed to add collaborator.');

      setEmail('');
      onCollaboratorsUpdated();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleRemove = async (userId) => {
    const token = getToken();
    if (!token) {
      setError('User not authenticated.');
      return;
    }

    try {
      setRemovingId(userId);
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/itineraries/${itinerary._id}/collaborators/${userId}`,
        {
          method: 'DELETE',
          headers: { Authorization: `jwt ${token}` },
        }
      );

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Failed to remove collaborator.');

      onCollaboratorsUpdated();
    } catch (err) {
      setError(err.message);
    } finally {
      setRemovingId(null);
    }
  };

  return (
    <section className={styles.manager} aria-label="Collaborator Manager">
      <h3 className={styles.title}>Collaborators</h3>

      {error && <p role="alert" className={styles.error}>{error}</p>}

      <ul className={styles.collabList}>
        {itinerary.collaborators?.map((user) => (
          <li key={user._id} className={styles.collabItem}>
            <span className={styles.collabName}>
              {user.userName || user.email || 'Unknown User'}
            </span>
            {isOwner && (
              <button
                type="button"
                className={styles.removeBtn}
                onClick={() => handleRemove(user._id)}
                disabled={removingId === user._id}
                aria-label={`Remove collaborator ${user.userName || user.email}`}
              >
                {removingId === user._id ? 'Removing...' : 'Remove'}
              </button>
            )}
          </li>
        ))}
      </ul>

      {isOwner && (
        <form
          className={styles.addForm}
          onSubmit={(e) => {
            e.preventDefault();
            handleAdd();
          }}
          noValidate
        >
          <input
            type="email"
            value={email}
            placeholder="Add collaborator by email"
            onChange={(e) => setEmail(e.target.value)}
            className={styles.input}
            aria-label="Collaborator email"
            required
            disabled={loading}
          />
          <button type="submit" className={styles.addBtn} disabled={loading}>
            {loading ? 'Adding...' : 'Add'}
          </button>
        </form>
      )}
    </section>
  );
}
