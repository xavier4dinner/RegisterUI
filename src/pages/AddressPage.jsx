import React, { useState } from "react";

const validation = {
  contactNumber: { required: true, pattern: /^[0-9]{7,15}$/ },
  city: { required: true },
  state: { required: true },
  country: { required: true },
  zipCode: { required: true, pattern: /^[0-9a-zA-Z\- ]{3,10}$/ },
};

function validateField(field, value) {
  const rules = validation[field];
  if (rules.required && !value) return "This field is required";
  if (rules.minLength && value.length < rules.minLength)
    return `Minimum ${rules.minLength} characters`;
  if (rules.pattern && !rules.pattern.test(value))
    return "Invalid format";
  return "";
}

export default function AddressPage() {
  const [fields, setFields] = useState({
    contactNumber: "",
    city: "",
    state: "",
    country: "",
    zipCode: "",
  });
  const [errors, setErrors] = useState({});
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFields((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({
      ...prev,
      [name]: validateField(name, value),
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const newErrors = {};
    Object.keys(fields).forEach((field) => {
      newErrors[field] = validateField(field, fields[field]);
    });
    setErrors(newErrors);

    if (Object.values(newErrors).every((err) => !err)) {
      setSubmitted(true);
      // You can handle the form data here (e.g., send to API)
    }
  };

  if (submitted) {
    return (
      <div className="form-success">
        <h2>Address Details Submitted!</h2>
        <pre>{JSON.stringify(fields, null, 2)}</pre>
      </div>
    );
  }

  return (
    <div className="address-page">
      <h2>Enter Address Details</h2>
      <form className="form" onSubmit={handleSubmit} noValidate>
        <div className="form-group">
          <label htmlFor="contactNumber" className="label">Contact Number</label>
          <input
            type="tel"
            inputMode="numeric"
            pattern="[0-9]*"
            id="contactNumber"
            name="contactNumber"
            className={`input${errors.contactNumber ? " error" : ""}`}
            value={fields.contactNumber}
            onChange={handleChange}
            required
            maxLength={15}
            minLength={7}
            autoComplete="tel"
            onKeyPress={(e) => {
              if (!/[0-9]/.test(e.key)) e.preventDefault();
            }}
          />
          <div className="error-message">{errors.contactNumber}</div>
        </div>
        <div className="form-group">
          <label htmlFor="city" className="label">City</label>
          <input
            type="text"
            id="city"
            name="city"
            className={`input${errors.city ? " error" : ""}`}
            value={fields.city}
            onChange={handleChange}
            required
          />
          <div className="error-message">{errors.city}</div>
        </div>
        <div className="form-group">
          <label htmlFor="state" className="label">State</label>
          <input
            type="text"
            id="state"
            name="state"
            className={`input${errors.state ? " error" : ""}`}
            value={fields.state}
            onChange={handleChange}
            required
          />
          <div className="error-message">{errors.state}</div>
        </div>
        <div className="form-group">
          <label htmlFor="country" className="label">Country</label>
          <input
            type="text"
            id="country"
            name="country"
            className={`input${errors.country ? " error" : ""}`}
            value={fields.country}
            onChange={handleChange}
            required
          />
          <div className="error-message">{errors.country}</div>
        </div>
        <div className="form-group">
          <label htmlFor="zipCode" className="label">Zip Code</label>
          <input
            type="text"
            id="zipCode"
            name="zipCode"
            className={`input${errors.zipCode ? " error" : ""}`}
            value={fields.zipCode}
            onChange={handleChange}
            required
          />
          <div className="error-message">{errors.zipCode}</div>
        </div>
        <button type="submit" className="signup-button">Submit</button>
      </form>
    </div>
  );
}