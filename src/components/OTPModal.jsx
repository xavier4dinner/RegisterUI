import React, { useState } from "react";

export default function OTPModal({ show, onSubmit, onClose, loading, error }) {
  const [otp, setOtp] = useState("");

  if (!show) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(otp);
  };

  return (
    <div className="otp-modal-backdrop">
      <div className="otp-modal">
        <h2>Enter OTP</h2>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            maxLength={6}
            autoFocus
            required
            placeholder="Enter 6-digit OTP"
            className="input"
          />
          {error && <div className="error-message">{error}</div>}
          <div style={{ marginTop: "1rem" }}>
            <button type="submit" className="signup-button" disabled={loading}>
              {loading ? "Verifying..." : "Verify"}
            </button>
            <button type="button" className="back-button" onClick={onClose} style={{marginLeft: "1rem"}} disabled={loading}>
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// Usage example (this part is not in the original file, just showing how the component is used)
<OTPModal
  show={showOtpModal}
  onSubmit={handleOtpSubmit}
  onClose={() => setShowOtpModal(false)}
  loading={otpLoading}
  error={otpError}
/>