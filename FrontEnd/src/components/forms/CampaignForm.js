import React, { useState } from 'react';

const CampaignForm = ({ onSubmit }) => {
  const [type, setType] = useState('MONEY');
  const [description, setDescription] = useState('');
  const [expirationTime, setExpirationTime] = useState('');
  const [volunteerTime, setVolunteerTime] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!description.trim()) {
      alert('Campaign description is required');
      return;
    }

    if (description.trim().length < 10) {
      alert('Description must be at least 10 characters long');
      return;
    }

    if ((type === 'TIME' || type === 'BOTH') && (!volunteerTime || Number(volunteerTime) <= 0)) {
      alert('Please enter positive volunteer hours for time-based campaigns');
      return;
    }

    setLoading(true);
    try {
      const campaignData = {
        description: description.trim(),
        expirationTime: expirationTime || null,
        volunteerTime: (type === 'TIME' || type === 'BOTH') ? Number(volunteerTime) : null,
        acceptsMoney: type === 'MONEY' || type === 'BOTH',
        acceptsTime: type === 'TIME' || type === 'BOTH'
      };

      await onSubmit(campaignData);

      // Reset form on success
      setDescription('');
      setExpirationTime('');
      setVolunteerTime('');
      setType('MONEY');
    } catch (error) {
      console.error('Campaign creation failed:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="create-campaign">
      <h3>Create New Campaign</h3>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Campaign Type</label>
          <div className="type-buttons">
            <button
              type="button"
              className={type === 'MONEY' ? 'type-btn active' : 'type-btn'}
              onClick={() => setType('MONEY')}
            >
              💰 Money Only
            </button>
            <button
              type="button"
              className={type === 'TIME' ? 'type-btn active' : 'type-btn'}
              onClick={() => setType('TIME')}
            >
              ⏰ Time Only
            </button>
            <button
              type="button"
              className={type === 'BOTH' ? 'type-btn active' : 'type-btn'}
              onClick={() => setType('BOTH')}
            >
              🤝 Both Money & Time
            </button>
          </div>
        </div>

        <div className="form-group">
          <label>Description (min 10 characters):</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Describe your campaign goals and impact..."
            rows="3"
            required
          />
          <small className="form-help">{description.length}/10 characters minimum</small>
        </div>

        {(type === 'TIME' || type === 'BOTH') && (
          <div className="form-group">
            <label>Volunteer Hours Needed:</label>
            <input
              type="number"
              min="1"
              value={volunteerTime}
              onChange={(e) => setVolunteerTime(e.target.value)}
              placeholder="e.g., 20"
              required
            />
            <small className="form-help">Total volunteer hours you need for this campaign</small>
          </div>
        )}

        <div className="form-group">
          <label>Campaign End Date (optional):</label>
          <input
            type="datetime-local"
            value={expirationTime}
            onChange={(e) => setExpirationTime(e.target.value)}
          />
          <small className="form-help">Leave blank for open-ended campaigns</small>
        </div>

        <button type="submit" className="submit-btn" disabled={loading}>
          {loading ? 'Creating Campaign...' : 'Create Campaign'}
        </button>
      </form>
    </div>
  );
};

export default CampaignForm;
