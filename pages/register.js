// pages/register.js

import { Form, Card, Button } from "react-bootstrap";
import { useState } from "react";
import { useRouter } from "next/router";
import { registerUser } from "@/lib/authentication";
import styles from "../styles/Register.module.css";

// Helper functions for individual checks (for live feedback)
const checks = {
  minLength: (pw) => pw.length >= 8,
  uppercase: (pw) => /[A-Z]/.test(pw),
  lowercase: (pw) => /[a-z]/.test(pw),
  number: (pw) => /[0-9]/.test(pw),
  specialChar: (pw) => /[!@#$%^&*(),.?":{}|<>]/.test(pw),
};

function isStrongPassword(password) {
  return Object.values(checks).every((fn) => fn(password));
}

/**
 * Default export component for handling user registration
 * @param {Object} props - Component properties
 * @returns {JSX.Element} Rendered registration form
 */
export default function Login(props) {
  // Form state management
  const [userName, setUserName] = useState(""); // Username input field
  const [email, setEmail] = useState(""); // Email input field
  const [password, setPassword] = useState(""); // Password input field
  const [password2, setPassword2] = useState(""); // Password confirmation
  const [warning, setWarning] = useState(""); // Error message display

  // New state for showing/hiding passwords
  const [showPassword, setShowPassword] = useState(false);
  const [showPassword2, setShowPassword2] = useState(false);

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

    if (password !== password2) {
      setWarning("Passwords do not match.");
      return;
    }

    if (!isStrongPassword(password)) {
      setWarning(
        "Password must be at least 8 characters long and include uppercase letters, lowercase letters, numbers, and special characters."
      );
      return;
    }

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

            {/* Password input with show/hide toggle */}
            <Form.Group className={styles.formGroup}>
              <Form.Label>Password:</Form.Label>
              <Form.Control
                type={showPassword ? "text" : "password"}
                name="password"
                value={password}
                required
                onChange={(e) => setPassword(e.target.value)}
              />
              {/* Show Password Toggle */}
              <div className={styles.passwordToggle}>
                <Form.Check
                  type="checkbox"
                  checked={showPassword}
                  onChange={() => setShowPassword(!showPassword)}
                  label="Show Password"
                />
              </div>
              {/* Password Checklist */}
              {password && (
                <ul className={styles.passwordChecklist}>
                  <li style={{ color: password.length >= 8 ? "green" : "red" }}>
                    At least 8 characters
                  </li>
                  <li
                    style={{ color: /[A-Z]/.test(password) ? "green" : "red" }}
                  >
                    At least one uppercase letter
                  </li>
                  <li
                    style={{ color: /[a-z]/.test(password) ? "green" : "red" }}
                  >
                    At least one lowercase letter
                  </li>
                  <li
                    style={{ color: /[0-9]/.test(password) ? "green" : "red" }}
                  >
                    At least one number
                  </li>
                  <li
                    style={{
                      color: /[!@#$%^&*(),.?":{}|<>]/.test(password)
                        ? "green"
                        : "red",
                    }}
                  >
                    At least one special character (!@#$%^&*(),.?&quot;:{}
                    |&lt;&gt;)
                  </li>
                </ul>
              )}
            </Form.Group>

            {/* Confirm password input with show/hide toggle */}
            <Form.Group className={styles.formGroup}>
              <Form.Label>Confirm Password:</Form.Label>

              <Form.Control
                type={showPassword2 ? "text" : "password"}
                name="password2"
                value={password2}
                required
                onChange={(e) => setPassword2(e.target.value)}
              />
              <div className={styles.passwordToggle}>
                <Form.Check
                  type="checkbox"
                  checked={showPassword2}
                  onChange={() => setShowPassword2(!showPassword2)}
                  label="Show Password"
                />
              </div>
            </Form.Group>

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
