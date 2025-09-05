import api from './api';

/* ────────────  PROFILE  ──────────── */
export const getProfile   = () => api.get('/ngo/profile');
export const updateProfile = (payload) => api.put('/ngo/profile', payload);     // ← PUT, not PATCH

/* ────────────  DASHBOARD DATA  ──────────── */
export const getMyCampaigns            = () => api.get('/ngo/campaigns');
export const getMyVolunteerOpportunities = () => api.get('/ngo/volunteer-opportunities');
export const getVolunteerApplications  = () => api.get('/ngo/volunteers');
export const getMyDonations            = () => api.get('/ngo/donations');

/* ────────────  CAMPAIGNS  ──────────── */
export const createCampaign = (payload)               => api.post('/ngo/campaigns', payload);
export const updateCampaign = (id, payload)           => api.put(`/ngo/campaigns/${id}`, payload);
export const deleteCampaign = (id)                    => api.delete(`/ngo/campaigns/${id}`);

/* ────────────  VOLUNTEER OPPORTUNITIES  ──────────── */
export const createVolunteerOpportunity = (payload)   => api.post('/ngo/volunteer-opportunities', payload);
export const closeVolunteerOpportunity  = (id)        => api.put(`/ngo/volunteer-opportunities/${id}/close`);

/* ────────────  VOLUNTEER MANAGEMENT  ──────────── */
export const approveVolunteer  = (id)                 => api.put(`/ngo/volunteers/${id}/approve`);
export const completeVolunteer = (id, hoursDone)      => api.put(`/ngo/volunteers/${id}/complete`, { hoursDone });
