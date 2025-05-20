import { useState } from "react";
import SearchBar from "@/components/SearchBar";
import styles from "../styles/Home.module.css";

export default function Home() {
  const [results, setResults] = useState([]);

  return (
    <div className={styles.wrapper}>
      
      {/* ✅ Your Hero Section */}
      <div className={styles.hero}>
        {/* LEFT: Text Section */}
        <div className={styles.content}>
          <h1 className={styles.title}>Easy Explore</h1>
          <p className={styles.subtitle}>Plan your perfect trip effortlessly.</p>
          <p className={styles.description}>
            Discover top attractions, create your own travel itinerary, and explore based on your interests, budget, and location — all in one app.
          </p>
          <div className={styles.buttonGroup}>
            <button
              className={styles.primaryButton}
              onClick={() => window.location.href = '/search'}
            >
              Start Exploring
            </button>
            <button className={styles.secondaryButton}>
              Learn More
            </button>
          </div>
        </div>

        {/* RIGHT: Image */}
        <div className={styles.imageSection}>
          <img
            src="/travel-hero.svg"
            alt="Traveler illustration"
            className={styles.heroImage}
          />
        </div>
      </div>

    </div>
  );
}
