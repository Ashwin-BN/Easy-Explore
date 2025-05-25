// pages/register.js

import { Form, Card, Button } from "react-bootstrap";
import { useState } from "react";
import { useRouter } from "next/router";
import { registerUser } from "@/lib/authentication";
import styles from "../styles/Register.module.css";

/**
 * Default export component for handling user registration
 * @param {Object} props - Component properties
 * @returns {JSX.Element} Rendered registration form
 */
export default function Login(props) {
  // Form state management
  const [userName, setUserName] = useState("");           // Username input field
  const [email, setEmail] = useState("");                 // Email input field
  const [password, setPassword] = useState("");           // Password input field
  const [password2, setPassword2] = useState("");         // Password confirmation
  const [warning, setWarning] = useState("");             // Error message display
  
  // Router instance for navigation
  const router = useRouter();

  /**
   * Handles form submission and registration process
   * @param {Event} e - Form submission event
   */
  async function handleSubmit(e) {
    // Prevent default form submission behavior
    e.preventDefault();
    
    // Clear any existing warnings
    setWarning("");
    
    try {
      // Attempt user registration with provided credentials
      await registerUser(userName, email, password, password2);
      
      // Redirect to login page upon successful registration
      router.push("/login");
    } catch (err) {
      // Display error message if registration fails
      setWarning(err.message);
    }
  }

  return (
    <div className={styles.formContainer}>
      {/* Registration card container */}
      <Card className={styles.authCard}>
        <Card.Body>
          {/* Header section */}
          <div className={styles.header}>
            <h2>Register</h2>
            <p className="text-secondary">Register for an account:</p>
          </div>

          {/* Error display component */}
          {warning && (
            <Card className={styles.warningCard}>
              <Card.Body>
                <strong>Error:</strong> {warning}
              </Card.Body>
            </Card>
          )}

          {/* Registration form */}
          <Form onSubmit={handleSubmit} className={styles.form}>
            {/* Username input field */}
            <Form.Group className={styles.formGroup}>
              <Form.Label>User Name:</Form.Label>
              <Form.Control
                type="text"
                name="text"
                value={userName}
                required
                onChange={(e) => setUserName(e.target.value)}
              />
            </Form.Group>

            {/* Email input field */}
            <Form.Group className={styles.formGroup}>
              <Form.Label>Email:</Form.Label>
              <Form.Control
                type="email"
                name="email"
                value={email}
                required
                onChange={(e) => setEmail(e.target.value)}
              />
            </Form.Group>

            {/* Password input field */}
            <Form.Group className={styles.formGroup}>
              <Form.Label>Password:</Form.Label>
              <Form.Control
                type="password"
                name="password"
                value={password}
                required
                onChange={(e) => setPassword(e.target.value)}
              />
            </Form.Group>

            {/* Confirm password input field */}
            <Form.Group className={styles.formGroup}>
              <Form.Label>Confirm Password:</Form.Label>
              <Form.Control
                type="password"
                name="password2"
                value={password2}
                required
                onChange={(e) => setPassword2(e.target.value)}
              />
            </Form.Group>

            {/* Submit button */}
            <Button 
              type="submit" 
              variant="primary" 
              className={styles.submitButton}
            >
              Register
            </Button>
          </Form>
        </Card.Body>
      </Card>
    </div>
  );
}