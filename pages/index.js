import { useState } from "react";
import { motion } from "framer-motion";   //for animation
import SearchBar from "@/components/SearchBar";
import styles from "../styles/Home.module.css";

export default function Home() {
  const [results, setResults] = useState([]);   //State to store search results

  return (
    // Animate the whole homepage when it loads
    <motion.div
      className={styles.wrapper}
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7 }}
    >
      <div className={styles.hero}>
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
            <button 
              className={styles.secondaryButton}
              onClick ={() => window.location.href = './about'}
            >
                Learn More
            </button>
          </div>
        </div>

        {/* Add floating effect to image  */}
        <motion.div
          className={styles.imageSection}
          initial={{ scale: 0.95 }}
          animate={{ scale: 1 }}
          transition={{ duration: 1 }}
        >
          <img
            src="/travel-hero.svg"
            alt="Traveler illustration"
            className={styles.heroImage}
          />

          
        </motion.div>
      </div>

      {/*SVG Wave Background at Bottom */}
      <svg
        viewBox="0 0 1440 320"
        className={styles.wave}
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          fill="#ffffff"
          fillOpacity="1"
          d="M0,224L80,218.7C160,213,320,203,480,197.3C640,192,800,192,960,181.3C1120,171,1280,149,1360,138.7L1440,128L1440,320L1360,320C1280,320,1120,320,960,320C800,320,640,320,480,320C320,320,160,320,80,320L0,320Z"
        />
      </svg>
    </motion.div>
  );
}
