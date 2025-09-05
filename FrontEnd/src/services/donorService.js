import api from './api';

export const getProfile = () => api.get('/donor/profile');
export const updateProfile = (payload) => api.put('/donor/profile', payload);
export const deleteProfile = () => api.delete('/donor/profile');

export const getAllNGOs = (search = '') => {
  const params = search ? `?search=${encodeURIComponent(search)}` : '';
  console.log('Fetching NGOs with URL:', `/public/ngos${params}`);
  return api.get(`/public/ngos${params}`);
};

export const getAllApprovedCampaigns = (filter = 'all') => {
  let endpoint = '/public/campaigns/active'; // Changed from /campaigns/approved
  if (filter === 'money') endpoint += '/money';
  else if (filter === 'volunteer') endpoint += '/volunteer';
  console.log('Fetching campaigns with URL:', endpoint);
  return api.get(endpoint);
};

export const getAllVolunteerOpportunities = () => {
  console.log('Fetching opportunities with URL:', '/public/volunteer-opportunities'); // Changed from /active
  return api.get('/public/volunteer-opportunities');
};

export const getStatistics = () => {
  console.log('Fetching statistics with URL:', '/public/statistics');
  return api.get('/public/statistics');
};

export const donate = (payload) => {
  console.log('Posting donation:', payload);
  return api.post('/donor/donations', payload);
};

export const applyForVolunteer = (payload) => {
  console.log('Posting volunteer application:', payload);
  return api.post('/donor/volunteer-applications', payload);
};

export const getMyDonations = () => {
  console.log('Fetching donations with URL:', '/donor/donations');
  return api.get('/donor/donations');
};

export const getMyVolunteerApplications = () => {
  console.log('Fetching applications with URL:', '/donor/volunteer-applications');
  return api.get('/donor/volunteer-applications');
};