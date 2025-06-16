import React, { useState } from "react";
import OTPModal from "./OTPModal";
import AddressPage from "../pages/AddressPage"; // Adjust path if needed
import "./../Register.css";

const validation = {
  firstName: {
    required: true,
    minLength: 2,
    pattern: /^[a-zA-Z\s]+$/,
  },
  lastName: {
    required: true,
    minLength: 2,
    pattern: /^[a-zA-Z\s]+$/,
  },
  email: {
    required: true,
    pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  },
  role: {
    required: true,
  },
  password: {
    required: true,
    minLength: 8,
    pattern: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/,
  },
  retypePassword: {
    required: true,
  },
};

function checkPasswordStrength(password) {
  return {
    hasLength: password.length >= 8,
    hasUppercase: /[A-Z]/.test(password),
    hasLowercase: /[a-z]/.test(password),
    hasNumber: /\d/.test(password),
  };
}

export default function RegisterForm() {
  // Registration fields and state
  const [fields, setFields] = useState({
    firstName: "",
    lastName: "",
    email: "",
    role: "",
    password: "",
    retypePassword: "",
  });
  const [errors, setErrors] = useState({});
  const [passwordStrength, setPasswordStrength] = useState({});
  const [loading, setLoading] = useState(false);

  // OTP modal state
  const [showOtpModal, setShowOtpModal] = useState(false);
  const [otpVerified, setOtpVerified] = useState(false);
  const [otpError, setOtpError] = useState("");
  const [otpLoading, setOtpLoading] = useState(false);
  const [pendingUser, setPendingUser] = useState(null);
  const [success, setSuccess] = useState(false);

  // Address fields and state
  const [addressFields, setAddressFields] = useState({
    address: "",
    contactNumber: "",
    city: "",
    state: "",
    country: "",
    zipCode: "",
  });
  const [addressErrors, setAddressErrors] = useState({});

  const validateField = (field, value) => {
    const rules = validation[field];
    let error = "";

    if (rules.required && (!value || value === "")) {
      error = "This field is required";
    } else if (rules.minLength && value.length < rules.minLength) {
      error = `Must be at least ${rules.minLength} characters`;
    } else if (rules.pattern && !rules.pattern.test(value)) {
      if (field === "firstName" || field === "lastName")
        error = "Only letters and spaces allowed";
      if (field === "email") error = "Invalid email address";
      if (field === "password")
        error =
          "Password must contain at least one uppercase letter, one lowercase letter, and one number";
    }
    return error;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFields((prev) => ({ ...prev, [name]: value }));

    if (name === "password") {
      setPasswordStrength(checkPasswordStrength(value));
    }

    setErrors((prev) => ({
      ...prev,
      [name]: validateField(name, value),
      ...(name === "retypePassword"
        ? {
            retypePassword:
              value !== fields.password ? "Passwords do not match" : "",
          }
        : {}),
      ...(name === "password"
        ? {
            retypePassword:
              fields.retypePassword && value !== fields.retypePassword
                ? "Passwords do not match"
                : "",
          }
        : {}),
    }));
  };

  // Address change handler
  const handleAddressChange = (name, value) => {
    setAddressFields((prev) => ({ ...prev, [name]: value }));
    // Optionally validate here and set errors
  };

  // Registration submit
  const handleRegisterSubmit = async (e) => {
    e.preventDefault();

    // Validate all fields
    const newErrors = {};
    Object.keys(fields).forEach((field) => {
      const error = validateField(field, fields[field]);
      if (error) newErrors[field] = error;
    });
    if (fields.password !== fields.retypePassword) {
      newErrors.retypePassword = "Passwords do not match";
    }

    setErrors(newErrors);

    // Validate address fields
    const addressValidation = {
      address: { required: true, minLength: 5 },
      contactNumber: { required: true, pattern: /^[0-9]{7,15}$/ }, // Only digits allowed
      city: { required: true },
      state: { required: true },
      country: { required: true },
      zipCode: { required: true, pattern: /^[0-9a-zA-Z\- ]{3,10}$/ },
    };
    const newAddressErrors = {};
    Object.keys(addressFields).forEach((field) => {
      const rules = addressValidation[field];
      let error = "";
      const value = addressFields[field];
      if (rules.required && !value) error = "This field is required";
      else if (rules.minLength && value.length < rules.minLength)
        error = `Minimum ${rules.minLength} characters`;
      else if (rules.pattern && !rules.pattern.test(value))
        error = "Invalid format";
      newAddressErrors[field] = error;
    });
    setAddressErrors(newAddressErrors);

    if (
      Object.values(newAddressErrors).some((err) => err) ||
      Object.values(errors).some((err) => err)
    ) {
      return;
    }

    setLoading(true);

    try {
      // Prepare form data
      const formData = {
        ...fields,
        ...addressFields,
      };

      // Send to backend
      const response = await fetch("http://localhost:3000/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Registration failed");
      }

      setPendingUser(formData);
      setShowOtpModal(true);
    } catch (error) {
      alert("Registration failed: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  // OTP submit handler
  const handleOtpSubmit = async (otp) => {
    setOtpLoading(true);
    setOtpError("");
    try {
      // Send OTP and user info to backend
      const response = await fetch("http://localhost:3000/verify-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...pendingUser, otp }),
      });
      if (!response.ok) throw new Error("OTP verification failed");
      setOtpVerified(true); // Show address page
      setShowOtpModal(false);
    } catch (error) {
      setOtpError("Invalid OTP. Please try again.");
    } finally {
      setOtpLoading(false);
    }
  };

  // Show address page after OTP is verified
  if (otpVerified) {
    return <AddressPage />;
  }

  return (
    <div className="form-container">
      <h1 className="title">Create your account</h1>
      {success && (
        <div className="success-message">
          Account created and verified successfully!
        </div>
      )}
      {!success && (
        <form className="form" onSubmit={handleRegisterSubmit} noValidate>
          <div className="form-group">
            <label htmlFor="firstName" className="label">
              First Name
            </label>
            <input
              type="text"
              id="firstName"
              name="firstName"
              className={`input${errors.firstName ? " error" : ""}`}
              value={fields.firstName}
              onChange={handleInputChange}
              required
            />
            <div className="error-message">{errors.firstName}</div>
          </div>

          <div className="form-group">
            <label htmlFor="lastName" className="label">
              Last Name
            </label>
            <input
              type="text"
              id="lastName"
              name="lastName"
              className={`input${errors.lastName ? " error" : ""}`}
              value={fields.lastName}
              onChange={handleInputChange}
              required
            />
            <div className="error-message">{errors.lastName}</div>
          </div>

          <div className="form-group">
            <label htmlFor="email" className="label">
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              className={`input${errors.email ? " error" : ""}`}
              value={fields.email}
              onChange={handleInputChange}
              required
            />
            <div className="error-message">{errors.email}</div>
          </div>

          <div className="form-group">
            <label htmlFor="role" className="label">
              Position/Role
            </label>
            <select
              id="role"
              name="role"
              className={`input${errors.role ? " error" : ""}`}
              value={fields.role}
              onChange={handleInputChange}
              required
            >
              <option value="">Select your role</option>
              <option value="Marketing Lead">Marketing Lead</option>
              <option value="Content Creator">Content Creator</option>
              <option value="Graphic Designer">Graphic Designer</option>
            </select>
            <div className="error-message">{errors.role}</div>
          </div>

          <div className="form-group">
            <label htmlFor="password" className="label">
              Password
            </label>
            <input
              type="password"
              id="password"
              name="password"
              className={`input${errors.password ? " error" : ""}`}
              value={fields.password}
              onChange={handleInputChange}
              required
            />
            <div className="password-requirements">
              <div
                className={`requirement ${
                  passwordStrength.hasLength ? "valid" : "invalid"
                }`}
              >
                <span>•</span> At least 8 characters
              </div>
              <div
                className={`requirement ${
                  passwordStrength.hasUppercase ? "valid" : "invalid"
                }`}
              >
                <span>•</span> One uppercase letter
              </div>
              <div
                className={`requirement ${
                  passwordStrength.hasLowercase ? "valid" : "invalid"
                }`}
              >
                <span>•</span> One lowercase letter
              </div>
              <div
                className={`requirement ${
                  passwordStrength.hasNumber ? "valid" : "invalid"
                }`}
              >
                <span>•</span> One number
              </div>
            </div>
            <div className="error-message">{errors.password}</div>
          </div>

          <div className="form-group">
            <label htmlFor="retypePassword" className="label">
              Retype Password
            </label>
            <input
              type="password"
              id="retypePassword"
              name="retypePassword"
              className={`input${errors.retypePassword ? " error" : ""}`}
              value={fields.retypePassword}
              onChange={handleInputChange}
              required
            />
            <div className="error-message">{errors.retypePassword}</div>
          </div>

          <button
            type="submit"
            className="signup-button"
            disabled={loading}
            id="submit-btn"
          >
            <span id="submit-text">Sign Up</span>
            {loading && <span className="loading" id="submit-loading"></span>}
          </button>
        </form>
      )}
      <OTPModal
        show={showOtpModal}
        onSubmit={handleOtpSubmit}
        onClose={() => setShowOtpModal(false)}
        loading={otpLoading}
        error={otpError}
      />
    </div>
  );
}
