// components/Navbar.js

import styles from './Navbar.module.css';
import Link from 'next/link';
import { useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/router';
import { loadUserProfile } from '@/controller/profileController';
import { removeToken } from '@/lib/authentication';
import { useTheme } from '@/context/ThemeContext';
import DarkModeToggle from '../DarkModeToggle';

export default function Navbar() {
  const [user, setUser] = useState(null);
  const [showMenu, setShowMenu] = useState(false);
  const dropdownRef = useRef(null);
  const router = useRouter();
  const { darkMode, toggleTheme } = useTheme();

  useEffect(() => {
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

  const handleLogout = () => {
    sessionStorage.removeItem("user");
    removeToken();
    setUser(null);
    router.push("/login");
  };
  return (
    <nav className={styles.navbar}>
      {/* Left side: Logo */}
      <div className={styles.left}>
        <div className={styles.logo}>Easy Explore</div>
      </div>

      {/* Center: Navigation links */}
      <div className={styles.right}>
      <ul className={styles.navLinks}>
        <li><Link href="/">Home</Link></li>
        <li><Link href="/search">Search</Link></li>
        <li><Link href="/about">About Us</Link></li>

        {!user ? (
          <>
            <li><Link href="/login">Login</Link></li>
            <li><Link href="/register">Sign Up</Link></li>
          </>
        ) : (
          <li className={styles.dropdownContainer} ref={dropdownRef}>
            <button
              className={styles.usernameDropdown}
              onClick={() => setShowMenu(!showMenu)}
            >
              👤 {user.userName} ▾
            </button>
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
                  <Link href="/itinerary" onClick={() => setShowMenu(false)}>
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
      </div>

      {/* Right side: Dark mode toggle */}
      <div className={styles.themeToggleWrapper}>
        <DarkModeToggle />
      </div>
    </nav>
  );
}
