// pages/login.js

import { Form, Card, Alert, Button } from "react-bootstrap";
import { useState } from "react";
import { useRouter } from "next/router";
import { authenticateUser } from "@/lib/authentication";
import styles from "../styles/Login.module.css";

/**
 * Main login component managing authentication state and submission
 * @param {Object} props - Component props (currently unused)
 * @returns {JSX.Element} Rendered login form interface
 */
export default function Login(props) {
  // State management for form inputs and error handling
  const [email, setEmail] = useState(""); // Email input field state
  const [password, setPassword] = useState(""); // Password input field state
  const [warning, setWarning] = useState(""); // Error message display state
  const [showPassword, setShowPassword] = useState(false);

  const router = useRouter();

  /**
   * Handles form submission and authentication process
   * @param {Event} e - Form submission event
   * @async
   */
  async function handleSubmit(e) {
    // Prevent default form submission behavior
    e.preventDefault();

    try {
      // Attempt user authentication with provided credentials
      await authenticateUser(email, password);

      // On successful authentication, redirect to search page
      router.push("/search");
    } catch (err) {
      // Display authentication error message
      setWarning(err.message);
    }
  }

  return (
    <div className={styles.formContainer}>
      {/* Header section with login title and description */}
      <div className={styles.header}>
        <h2>Login</h2>
        <p className="text-secondary">Enter your login credentials:</p>
      </div>

      {/* Conditional rendering of error alert */}
      {warning && (
        <Card className={styles.warningCard}>
          <Card.Body>
            <strong>Error:</strong> {warning}
          </Card.Body>
        </Card>
      )}

      {/* Login form with email and password fields */}
      <Form onSubmit={handleSubmit} className={styles.form}>
        <Form.Group className={styles.formGroup}>
          <Form.Label>Email:</Form.Label>
          <Form.Control
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </Form.Group>

        <Form.Group className={styles.formGroup}>
          <Form.Label>Password:</Form.Label>
          <Form.Control
            type={showPassword ? "text" : "password"}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <div className={styles.passwordToggle}>
            <Form.Check
              type="checkbox"
              checked={showPassword}
              onChange={() => setShowPassword(!showPassword)}
              label="Show Password"
            />
          </div>
        </Form.Group>

        {/* Submit button for form */}
        <Button type="submit" variant="primary" className={styles.submitButton}>
          Login
        </Button>
      </Form>
    </div>
  );
}
