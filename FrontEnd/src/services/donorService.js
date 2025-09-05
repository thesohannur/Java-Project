// src/services/donorService.js
import api from './api';

/* ────────────  PROFILE  ──────────── */
export const getProfile = () => api.get('/donor/profile');
export const updateProfile = (payload) => api.put('/donor/profile', payload);
export const deleteProfile = () => api.delete('/donor/profile');

/* ────────────  PUBLIC DATA  ──────────── */
export const getAllNGOs = (search = '') => {
  const params = search ? `?search=${encodeURIComponent(search)}` : '';
  return api.get(`/public/ngos${params}`);
};
export const getAllApprovedCampaigns = (filter = 'all') => {
  let endpoint = '/public/campaigns/approved';
  if (filter === 'money') endpoint += '/money';
  else if (filter === 'volunteer') endpoint += '/volunteer';
  return api.get(endpoint);
};
export const getAllVolunteerOpportunities = () => api.get('/public/volunteer-opportunities/active');
export const getStatistics = () => api.get('/public/statistics');

/* ────────────  DONOR ACTIONS  ──────────── */
export const donate = (payload) => api.post('/donor/donations', payload);
export const applyForVolunteer = (payload) => api.post('/donor/volunteer-applications', payload);
export const getMyDonations = () => api.get('/donor/donations');
export const getMyVolunteerApplications = () => api.get('/donor/volunteer-applications');