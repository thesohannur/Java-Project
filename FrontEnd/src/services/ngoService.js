import api from './api';

// Profile management
export const getProfile = () => api.get('/ngo/profile');
export const updateProfile = (payload) => api.patch('/ngo/profile', payload);

// NGO dashboards
export const getMyCampaigns = () => api.get('/ngo/campaigns');
export const getMyVolunteerOpportunities = () => api.get('/ngo/volunteer-opportunities');
export const getVolunteerApplications = () => api.get('/ngo/volunteers');
export const getMyDonations = () => api.get('/ngo/donations');

// Campaign management
export const createCampaign = (payload) => api.post('/ngo/campaigns', payload);
export const updateCampaign = (campaignId, payload) => api.put(`/ngo/campaigns/${campaignId}`, payload);
export const deleteCampaign = (campaignId) => api.delete(`/ngo/campaigns/${campaignId}`);

// Volunteer opportunities
export const createVolunteerOpportunity = (payload) => api.post('/ngo/volunteer-opportunities', payload);
export const closeVolunteerOpportunity = (id) => api.put(`/ngo/volunteer-opportunities/${id}/close`);

// Volunteer management
export const approveVolunteer = (volunteerId) => api.put(`/ngo/volunteers/${volunteerId}/approve`);
export const completeVolunteer = (volunteerId, hoursCompleted) =>
  api.put(`/ngo/volunteers/${volunteerId}/complete`, { hoursDone: hoursCompleted });
