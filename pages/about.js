// pages/about.js

import { motion } from "framer-motion"; // Import motion for animation
import styles from "../styles/About.module.css";

export default function About() {
  return (
    <motion.div
      className={styles.container}
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <h1 className={styles.title}>About Easy Explore</h1>

      <p className={styles.description}>
      Easy Explore is a travel planning app/website for tourists and locals. It consolidates key details like pricing, reviews, and proximity, offering personalized recommendations based on user preferences such as budget, interests, and transportation. Key features include filters and an optimized schedule planner to streamline trip planning.
      </p>

      <p className={styles.description}>
        With Easy Explore, users can search for nearby attractions like museums, parks, or landmarks, view detailed information, and plan where to go. This app is built as a final-semester project by a group of students at Seneca College. Our goal is to make trip planning easy, interactive, and fun.
      </p>

      

      <h2 className={styles.subtitle}>Meet the Team</h2>
      {/* <div className={styles.teamGrid}>
        <div className={styles.teamCard}>
          <h3>Suraj Sapkota</h3>
          <p>🎨 UI/UX Designer & Frontend Developer</p>
        </div>
        <div className={styles.teamCard}>
          <h3>Harsh</h3>
          <p>🧠 Backend Developer (API, Search)</p>
        </div>
        <div className={styles.teamCard}>
          <h3>Ruslan</h3>
          <p>💾 MongoDB & Data Integration</p>
        </div>
        <div className={styles.teamCard}>
          <h3>Alex</h3>
          <p>🧩 Frontend Setup & Route Management</p>
        </div>
        <div className={styles.teamCard}>
          <h3>Ashwin</h3>
          <p>🗂️ Project Repo Setup & Folder Structure</p>
        </div>
      </div> */}
    </motion.div>
  );
}
