import React from 'react';
import '../../styles/Auth.css';

const RoleSelector = ({ onSelectRole, selectedRole }) => {
  const roles = [
    {
      id: 'donor',
      title: 'Donor',
      description: 'Make donations and support causes you care about',
      icon: '💝'
    },
    {
      id: 'ngo',
      title: 'NGO',
      description: 'Create campaigns and manage donation requests',
      icon: '🏢'
    },
    {
      id: 'admin',
      title: 'Admin',
      description: 'Manage platform users and oversee operations',
      icon: '⚙️'
    }
  ];

  return (
    <div className="role-selector">
      <h2>Choose Your Role</h2>
      <p>Select how you'd like to participate in our platform:</p>

      <div className="role-cards">
        {roles.map((role) => (
          <div
            key={role.id}
            className={`role-card ${selectedRole === role.id ? 'selected' : ''}`}
            onClick={() => onSelectRole(role.title.toUpperCase())}
          >
            <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>
              {role.icon}
            </div>
            <h4>{role.title}</h4>
            <p>{role.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RoleSelector;