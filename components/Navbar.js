// components/Navbar.js

import styles from './Navbar.module.css';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';

/**
 * Main Navbar component that renders the site's navigation menu
 * @returns {JSX.Element} Navigation bar with conditional rendering based on auth status
 */
export default function Navbar() {
  /**
   * State management for authenticated user
   * @type {[null|Object, Function]} user - Stored user data from session storage
   */
  const [user, setUser] = useState(null);

  /**
   * Next.js Router instance for programmatic navigation
   * @type {NextRouter} router - Used for handling redirects
   */
  const router = useRouter();

  /**
   * Effect hook to initialize user state from session storage
   * Runs once on component mount to restore user session
   */
  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedUser = sessionStorage.getItem("user");
      if (storedUser) {
        setUser(JSON.parse(storedUser));
      }
    }
  }, []);

  /**
   * Handles user logout functionality
   * Removes user from session storage and redirects to login page
   */
  const handleLogout = () => {
    sessionStorage.removeItem("user");
    setUser(null);
    router.push("/login");
  };

  return (
    <nav className={styles.navbar}>
      {/* Site branding */}
      <div className={styles.logo}>Easy Explore</div>

      {/* Navigation links container */}
      <ul className={styles.navLinks}>
        {/* Core navigation links */}
        <li><Link href="/">Home</Link></li>
        <li><Link href="/search">Search</Link></li>
        <li><Link href="/about">About Us</Link></li>

        {/* Authentication-dependent links */}
        {!user ? (
          <>
            <li><Link href="/login">Login</Link></li>
            <li><Link href="/register">Sign Up</Link></li>
          </>
        ) : (
          <>
            <li className={styles.username}>{user.user.userName}</li>
            <li>
              <button 
                onClick={handleLogout} 
                className={styles.logoutBtn}
              >
                Logout
              </button>
            </li>
          </>
        )}
      </ul>
    </nav>
  );
}