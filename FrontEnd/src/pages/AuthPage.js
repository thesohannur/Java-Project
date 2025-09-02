import React, { useState } from "react";

const roles = [
  { id: "donor", title: "Donor", description: "Donate resources to those in need." },
  { id: "receiver", title: "Receiver", description: "Request resources for yourself or others." },
  { id: "ngo", title: "NGO", description: "Manage and distribute donated resources." },
];

const focusAreasList = [
  "Food", "Clothing", "Education", "Healthcare",
  "Shelter", "Job Training", "Transportation", "Legal Aid"
];

const AuthPage = ({ onBackToLanding }) => {
  const [selectedRole, setSelectedRole] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    focusAreas: [],
    additionalInfo: ""
  });

  const toggleFocusArea = (area) => {
    setFormData(prev => {
      const updated = prev.focusAreas.includes(area)
        ? prev.focusAreas.filter(f => f !== area)
        : [...prev.focusAreas, area];
      return { ...prev, focusAreas: updated };
    });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    alert(`Submitting as ${selectedRole}:\n` + JSON.stringify(formData, null, 2));
    // Handle auth logic here
  };

  if (!selectedRole) {
    // Role selection UI
    return (
      <div className="auth-page">
        <div className="role-selector">
          <h2>Select Your Role</h2>
          <p>Please select your role to continue:</p>
          <div className="role-cards">
            {roles.map(role => (
              <div
                key={role.id}
                className={`role-card ${selectedRole === role.id ? "selected" : ""}`}
                onClick={() => setSelectedRole(role.id)}
              >
                <h4>{role.title}</h4>
                <p>{role.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="auth-page">
      <div className="auth-container">
        <button className="back-button" onClick={() => setSelectedRole(null)}>
          &larr; Back to Role Selection
        </button>

        <h2>{selectedRole.charAt(0).toUpperCase() + selectedRole.slice(1)} Registration</h2>

        <form onSubmit={handleSubmit}>
          <input
            type="text"
            name="name"
            placeholder="Full Name"
            value={formData.name}
            onChange={handleInputChange}
            required
          />

          <input
            type="email"
            name="email"
            placeholder="Email Address"
            value={formData.email}
            onChange={handleInputChange}
            required
          />

          <input
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleInputChange}
            required
          />

          <div className="focus-areas">
            <label>Focus Areas</label>
            <div className="focus-checkboxes">
              {focusAreasList.map(area => (
                <label key={area} className="checkbox-label">
                  <input
                    type="checkbox"
                    checked={formData.focusAreas.includes(area)}
                    onChange={() => toggleFocusArea(area)}
                  />
                  {area}
                </label>
              ))}
            </div>
          </div>

          <textarea
            name="additionalInfo"
            placeholder="Additional Information"
            value={formData.additionalInfo}
            onChange={handleInputChange}
          />

          <button type="submit">Register</button>
        </form>
      </div>
    </div>
  );
};

export default AuthPage;
