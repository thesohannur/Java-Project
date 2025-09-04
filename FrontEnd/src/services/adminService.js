import api from './api';

// Profile Management
export const getProfile = () => {
  return api.get('/admin/profile');
};

// Campaign Management
export const getAllUnapprovedCampaigns = () => {
  return api.get('/admin/allUnApproved');
};

export const approveCampaign = (campaignId) => {
  return api.put(`/admin/approve-campaign/${campaignId}`);
};

export const rejectCampaign = (campaignId, feedback) => {
  return api.put(`/admin/reject-campaign/${campaignId}`, feedback, {
    headers: {
      'Content-Type': 'text/plain'
    }
  });
};
