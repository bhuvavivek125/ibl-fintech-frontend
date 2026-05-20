import axios from 'utils/axios';
import { API_ENDPOINTS } from 'constants/apiEndpoints';

const uploadService = {
  uploadProfileImage: async (file: File, onUploadProgress?: (progressEvent: any) => void) => {
    const formData = new FormData();
    formData.append('profileImage', file);
    const response = await axios.post(API_ENDPOINTS.UPLOAD.PROFILE_IMAGE, formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      },
      onUploadProgress
    });

    return response.data;
  },

  uploadDocument: async (file: File, onUploadProgress?: (progressEvent: any) => void) => {
    const formData = new FormData();
    formData.append('document', file);
    const response = await axios.post(API_ENDPOINTS.UPLOAD.DOCUMENT, formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      },
      onUploadProgress
    });
    return response.data;
  },

  uploadMultipleDocuments: async (files: File[], onUploadProgress?: (progressEvent: any) => void) => {
    const formData = new FormData();
    files.forEach((file) => {
      formData.append('documents', file);
    });
    const response = await axios.post(API_ENDPOINTS.UPLOAD.DOCUMENTS, formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      },
      onUploadProgress
    });
    return response.data;
  },

  getMyFiles: async () => {
    // Assuming API_ENDPOINTS.UPLOAD.MY_FILES is defined, or just hardcode if it's not.
    const response = await axios.get('/upload/my-files');
    return response.data;
  },

  deleteFile: async (id: string) => {
    const response = await axios.delete(`/upload/${id}`);
    return response.data;
  },

  updateFile: async (id: string, file?: File, originalName?: string) => {
    const formData = new FormData();
    if (originalName) formData.append('originalName', originalName);
    if (file) formData.append('file', file);

    const response = await axios.put(`/upload/${id}`, formData);
    return response.data;
  }
};

export default uploadService;
