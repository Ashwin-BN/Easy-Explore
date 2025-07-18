// components/Navbar.js

import styles from './Navbar.module.css';
import Link from 'next/link';
import { useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/router';
import { loadUserProfile } from '@/controller/profileController';
import { removeToken } from '@/lib/authentication';

/**
 * Main Navbar component that renders the site's navigation menu
 * Handles login state, profile dropdown, and logout functionality
 */
export default function Navbar() {
  const [user, setUser] = useState(null);         // Stores logged-in user info
  const [showMenu, setShowMenu] = useState(false); // Controls dropdown visibility
  const dropdownRef =useRef(null);
  const router = useRouter();

  useEffect(() => {
  // On initial mount, check if user is already logged in
  const fetchUser = async () => {
    try {
      const profile = await loadUserProfile();
      setUser(profile);
    } catch (err) {
      setUser(null);
    }
  };

  fetchUser();
}, []);

  // Runs when route changes to update user info from sessionStorage
  useEffect(() => {
    const handleRouteChange = async () => {
      try {
        const profile = await loadUserProfile();
        setUser(profile);
      } catch (err) {
        setUser(null);
      }
    };

    router.events.on("routeChangeComplete", handleRouteChange);
    return () => router.events.off("routeChangeComplete", handleRouteChange);
  }, [router]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowMenu(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);


  // Logs the user out and redirects to login
  const handleLogout = () => {
    sessionStorage.removeItem("user");
    removeToken();
    setUser(null);
    router.push("/login");
  };

  return (
      <nav className={styles.navbar}>
        {/* App name */}
        <div className={styles.logo}>Easy Explore</div>

        {/* Main navigation */}
        <ul className={styles.navLinks}>
          <li><Link href="/">Home</Link></li>
          <li><Link href="/search">Search</Link></li>
          <li><Link href="/about">About Us</Link></li>

          {/* Auth-based options */}
          {!user ? (
              <>
                <li><Link href="/login">Login</Link></li>
                <li><Link href="/register">Sign Up</Link></li>
              </>
          ) : (
              <li className={styles.dropdownContainer}>
                <button
                    className={styles.usernameDropdown}
                    onClick={() => setShowMenu(!showMenu)}
                >
                  👤 {user.userName} ▾
                </button>

                {/* Dropdown menu */}
                {showMenu && (
                    <ul className={styles.dropdownMenu}>
                      <li>
                        <Link href="/profile" onClick={() => setShowMenu(false)}>
                          <span className={styles.menuItem}>My Profile</span>
                        </Link>
                      </li>

                      <li>
                        <Link href="/savedAttractions" onClick={() => setShowMenu(false)}>
                          <span className={styles.menuItem}>Saved Attractions</span>
                        </Link>
                      </li>
                      <li>
                        <Link href="/itinerary"onClick={() => setShowMenu(false)}>
                          <span className={styles.menuItem}>My Itineraries</span>
                        </Link>
                      </li>
                      <li>
                        <button onClick={handleLogout} className={styles.logoutBtn}>
                          Logout
                        </button>
                      </li>
                    </ul>
                )}
              </li>
          )}
        </ul>
      </nav>
  );
}