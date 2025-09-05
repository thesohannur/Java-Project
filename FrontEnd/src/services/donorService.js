import api from './api';

/* ────────────  PROFILE  ──────────── */
export const getProfile   = () => api.get('/donor/profile');
export const updateProfile = (payload) => api.put('/donor/profile', payload);   // ← PUT, not PATCH
export const deleteProfile = () => api.delete('/donor/profile');

/* ────────────  PUBLIC DATA  ──────────── */
export const getAllApprovedCampaigns = () =>
  api.get('/campaigns/approved');
export const getAllVolunteerOpportunities = () =>
  api.get('/volunteer/opportunities/active');

/* ────────────  DONOR ACTIONS  ──────────── */
export const donate              = (payload) => api.post('/donations', payload);
export const applyForVolunteer   = (payload) => api.post('/volunteer/apply', payload);
export const getMyVolunteerApplications = () => api.get('/volunteer/my-applications');
