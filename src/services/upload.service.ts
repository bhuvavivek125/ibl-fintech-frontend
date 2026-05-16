import axios from 'utils/axios';
import { API_ENDPOINTS } from 'constants/apiEndpoints';

const uploadService = {
  uploadProfileImage: async (file: File) => {
    const formData = new FormData();
    formData.append('profileImage', file);
    const response = await axios.post(API_ENDPOINTS.UPLOAD.PROFILE_IMAGE, formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
    return response.data;
  },

  uploadDocument: async (file: File) => {
    const formData = new FormData();
    formData.append('document', file);
    const response = await axios.post(API_ENDPOINTS.UPLOAD.DOCUMENT, formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
    return response.data;
  },

  uploadMultipleDocuments: async (files: File[]) => {
    const formData = new FormData();
    files.forEach((file) => {
      formData.append('documents', file);
    });
    const response = await axios.post(API_ENDPOINTS.UPLOAD.DOCUMENTS, formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
    return response.data;
  }
};

export default uploadService;
