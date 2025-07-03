// pages/profile.js

import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { color } from 'framer-motion';

export default function Profile() {
  const [user, setUser] = useState(null);           // User from session
  const [editMode, setEditMode] = useState(false);  // Toggle edit mode
  const [formData, setFormData] = useState({        // Form state
    userName: '',
    email: '',
  });

  const router = useRouter();

  useEffect(() => {
    const storedUser = sessionStorage.getItem('user');
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      setUser(parsedUser);
      setFormData({
        userName: parsedUser.userName,
        email: parsedUser.email,
      });
    } else {
      router.push('/login');
    }
  }, [router]);

  // Handle changes in form inputs
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Save changes (updates sessionStorage only for now)
  const handleSave = () => {
    const updatedUser = {
      ...user,
      user: {
        ...user.user,
        userName: formData.userName,
        email: formData.email,
      },
    };
    sessionStorage.setItem('user', JSON.stringify(updatedUser));
    setUser(updatedUser);
    setEditMode(false);
  };

  // Cancel edit and reset form
  const handleCancel = () => {
    setFormData({
      userName: user.userName,
      email: user.email,
    });
    setEditMode(false);
  };

  if (!user) return null;

  return (
    <div style={styles.container}>
      <h1 style={styles.heading}>👤 My Profile</h1>
      <div style={styles.card}>
        {editMode ? (
          <>
            <div style={styles.inputGroup}>
              <label>Username:</label>
              <input
                type="text"
                name="userName"
                value={formData.userName}
                onChange={handleChange}
                style={styles.input}
              />
            </div>
            <div style={styles.inputGroup}>
              <label>Email:</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                style={styles.input}
              />
            </div>
            <div style={styles.buttonGroup}>
              <button style={styles.saveBtn} onClick={handleSave}>Save</button>
              <button style={styles.cancelBtn} onClick={handleCancel}>Cancel</button>
            </div>
          </>
        ) : (
          <>
            <p><strong>Username:</strong> {user.userName}</p>
            <p><strong>Email:</strong> {user.email}</p>
            <p><strong>Role:</strong> Traveler</p>
            <button style={styles.editBtn} onClick={() => setEditMode(true)}>Edit Profile</button>
          </>
        )}
      </div>
    </div>
  );
}

// Inline styles
const styles = {
  container: {
    position: 'center' ,
    maxWidth: '600px',
    margin: '2rem auto',
    padding: '1.5rem',
    backgroundColor: '#f4f4f4',
    color: '#222', 
    borderRadius: '10px',
    boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
    fontFamily: 'Arial, sans-serif',
  },
  heading: {
    marginBottom: '1rem',
    color: '#0070f3',
    textAlign: 'center',
  },
  card: {
    backgroundColor: 'white',
    color: '#111',
    padding: '1.5rem',
    borderRadius: '8px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
    lineHeight: '1.8',
  },
  inputGroup: {
    marginBottom: '1rem',
  },
  input: {
    width: '100%',
    padding: '0.6rem',
    fontSize: '1rem',
    borderRadius: '4px',
    border: '1px solid #ccc',
  },
  buttonGroup: {
    display: 'flex',
    justifyContent: 'flex-end',
    gap: '1rem',
    marginTop: '1rem',
  },
  editBtn: {
    marginTop: '1rem',
    padding: '0.6rem 1.2rem',
    backgroundColor: '#0070f3',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
  },
  saveBtn: {
    backgroundColor: '#28a745',
    color: 'white',
    padding: '0.6rem 1.2rem',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
  },
  cancelBtn: {
    backgroundColor: '#ccc',
    color: '#333',
    padding: '0.6rem 1.2rem',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
  },
};
