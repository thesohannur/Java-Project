import api from './api';

export const login = (credentials) => {
  return api.post('/auth/login', credentials);
};

export const registerDonor = (donorData) => {
  return api.post('/auth/register/donor', donorData);
};

export const registerNGO = (ngoData) => {
  return api.post('/auth/register/ngo', ngoData);
};

export const registerAdmin = (adminData) => {
  return api.post('/auth/register/admin', adminData);
};
