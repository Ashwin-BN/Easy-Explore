// pages/about.js

import { motion } from "framer-motion";
import Image from "next/image";
import styles from "../styles/About.module.css";
import { FaLinkedin } from "react-icons/fa";

const teamMembers = [
  {
    name: "Suraj Sapkota",
    role: "Full-Stack Developer",
    image: "/team/suraj.jpeg",
    linkedin: "https://www.linkedin.com/in/suraj-sapkota/",
  },
  {
    name: "Juan Moncayo",
    role: "Backend Developer",
    image: "/team/Juan.jpeg",
    linkedin: "https://www.linkedin.com/in/juan-moncayo-379a6820b/",
  },

  {
    name: "Ashwin",
    role: "Backend Developer",
    image: "/team/Ashwin.jpeg",
    linkedin: "https://www.linkedin.com/in/ashwin-b-n/",
  },
  
  {
    name: "Alex",
    role: "MongoDB & Data Integration",
    image: "/team/Alex.jpeg",
    linkedin: "https://www.linkedin.com/in/ruslan-profile",
  },
  {
    name: "JeelKumar Patel",
    role: "Backend Developer",
    image: "/team/Jeelkumar Patel.jpeg",
    linkedin: "https://www.linkedin.com/in/jeelkumar-patel-8bb3b9259/",
  },
];

export default function About() {
  return (
    <motion.div
      className={styles.container}
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <h1 className={styles.title}>About Easy Explore</h1>
      <p className={styles.description}>
        Easy Explore is a smart travel planning app built by students at Seneca College to help tourists and locals explore attractions effortlessly with recommendations based on interests, budget, and location.
      </p>

      <h2 className={styles.subtitle}>Meet the Team</h2>

      <div className={styles.teamGrid}>
        {teamMembers.map((member, index) => (
          <motion.div key={index} className={styles.card} whileHover={{ scale: 1.03 }}>
            <Image src={member.image} alt={member.name} width={200} height={200} className={styles.squareImage} />
            <h3 className={styles.name}>{member.name}</h3>
            <p className={styles.role}>{member.role}</p>
            <a
              href={member.linkedin}
              className={styles.linkedinButton}
              target="_blank"
              rel="noopener noreferrer"
            >
              <FaLinkedin className={styles.icon} />
              LinkedIn
            </a>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}
