import React, { useState, useCallback, useEffect, useRef } from 'react';
import { Box, Typography, Stack, Paper, IconButton, LinearProgress, List, ListItem, ListItemText, ListItemIcon, Grid, Card, Tab, Tabs } from '@mui/material';
import {
  CloudUpload as CloudUploadIcon,
  InsertDriveFile as FileIcon,
  CheckCircle as CheckCircleIcon,
  AccountCircle as AccountCircleIcon,
  Assignment as AssignmentIcon,
  FolderSpecial as FolderIcon
} from '@mui/icons-material';
import DeleteTwoToneIcon from '@mui/icons-material/DeleteTwoTone';
import EditTwoToneIcon from '@mui/icons-material/EditTwoTone';
import VisibilityTwoToneIcon from '@mui/icons-material/VisibilityTwoTone';
import Button from 'components/Button';
import uploadService from 'services/upload.service';
import { useSnackbar } from 'notistack';
import { validateFiles } from 'utils/fileValidation';

const getFullFileUrl = (path?: string) => {
  if (!path) return '#';
  if (path.startsWith('http://') || path.startsWith('https://')) return path;
  const apiUrl = import.meta.env.VITE_APP_API_URL || 'http://localhost:8080/api/v1/';
  const baseUrl = apiUrl.replace(/\/api\/v1\/?$/, '');
  const cleanPath = path.startsWith('/') ? path : `/${path}`;
  return `${baseUrl}${cleanPath}`;
};

const FileUpload: React.FC = () => {
  const { enqueueSnackbar } = useSnackbar();
  const [tabValue, setTabValue] = useState(0);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [uploadedFiles, setUploadedFiles] = useState<any[]>([]);
  const [selectedLogIndex, setSelectedLogIndex] = useState<number | null>(null);

  const [editFile, setEditFile] = useState<any | null>(null);
  const hiddenFileInputRef = useRef<HTMLInputElement>(null);

  const [isDragging, setIsDragging] = useState(false);
  const [previews, setPreviews] = useState<string[]>([]);

  useEffect(() => {
    fetchMyFiles();
  }, []);

  const fetchMyFiles = async () => {
    try {
      const response = await uploadService.getMyFiles();
      if (response.success && response.data) {
        setUploadedFiles(response.data);
      }
    } catch (error) {
      console.error('Failed to fetch files', error);
    }
  };

  const handleEditClick = (e: React.MouseEvent, file: any) => {
    e.stopPropagation();
    setEditFile(file);
    if (hiddenFileInputRef.current) {
      hiddenFileInputRef.current.click();
    }
  };

  const handleDeleteClick = async (e: React.MouseEvent, file: any) => {
    e.stopPropagation();
    if (!window.confirm('Are you sure you want to delete this file?')) return;
    try {
      if (file._id) {
        await uploadService.deleteFile(file._id);
      }
      setUploadedFiles(prev => prev.filter(f => f._id !== file._id));
      enqueueSnackbar('File deleted successfully', { variant: 'success' });
    } catch (error: any) {
      enqueueSnackbar(error.response?.data?.message || 'Failed to delete file', { variant: 'error' });
    }
  };

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
    setSelectedFiles([]);
    setPreviews([]);
  };

  const generatePreviews = (files: File[]) => {
    const newPreviews = files.map(file => {
      if (file.type.startsWith('image/')) {
        return URL.createObjectURL(file);
      }
      return '';
    });
    setPreviews(newPreviews);
  };

  const handleFiles = (files: File[]) => {
    const isImageOnly = tabValue === 0;
    const validation = validateFiles(files, isImageOnly);
    
    if (!validation.isValid) {
      enqueueSnackbar(validation.error, { variant: 'error' });
      return;
    }

    if (tabValue !== 2 && files.length > 1) {
      files = [files[0]];
    }

    setSelectedFiles(files);
    generatePreviews(files);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      handleFiles(Array.from(e.target.files));
    }
  };

  const handleDragEnter = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFiles(Array.from(e.dataTransfer.files));
    }
  }, [tabValue]);

  const handleUpload = async () => {
    if (selectedFiles.length === 0) return;

    setUploading(true);
    setProgress(30);

    try {
      const onUploadProgress = (progressEvent: any) => {
        const percentCompleted = Math.round((progressEvent.loaded * 100) / (progressEvent.total || 1));
        setProgress(percentCompleted);
      };

      let response;
      if (tabValue === 0) {
        response = await uploadService.uploadProfileImage(selectedFiles[0], onUploadProgress);
      } else if (tabValue === 1) {
        response = await uploadService.uploadDocument(selectedFiles[0], onUploadProgress);
      } else {
        response = await uploadService.uploadMultipleDocuments(selectedFiles, onUploadProgress);
      }

      if (response.success) {
        setProgress(100);
        await fetchMyFiles(); // Refetch all files to ensure consistency
        setSelectedLogIndex(0); // Select newly uploaded file
        setSelectedFiles([]);
        setPreviews([]);
        enqueueSnackbar('Asset synchronized successfully!', { variant: 'success' });
      }
    } catch (error: any) {
      console.error('Upload failed:', error);
      enqueueSnackbar(error.response?.data?.message || error.message || 'Transmission failed. Verify connectivity.', { variant: 'error' });
    } finally {
      setUploading(false);
      setTimeout(() => setProgress(0), 1000);
    }
  };

  const removeSelectedFile = (index: number) => {
    const newFiles = [...selectedFiles];
    newFiles.splice(index, 1);
    setSelectedFiles(newFiles);
    
    const newPreviews = [...previews];
    newPreviews.splice(index, 1);
    setPreviews(newPreviews);
  };

  return (
    <Box p={{ xs: 2, sm: 4 }} sx={{ width: '100%', minWidth: 0, maxWidth: '100%', overflow: 'hidden' }}>
      <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} justifyContent="space-between" alignItems={{ xs: 'flex-start', sm: 'center' }} mb={{ xs: 3, sm: 5 }}>
        <Box>
          <Typography variant="h2" fontWeight={800} className="gradient-text">Digital Asset Vault</Typography>
          <Typography variant="h6" color="text.secondary" fontWeight={500}>Securely manage and provision system documents and identity assets</Typography>
        </Box>
      </Stack>

      <Card className="glass" sx={{ borderRadius: '24px', border: 'none', mb: 4, overflow: 'hidden', boxShadow: '0 12px 36px rgba(0,0,0,0.06)', maxWidth: '100%', minWidth: 0 }}>
        <Box sx={{ borderBottom: 1, borderColor: 'divider', px: 3, pt: 2 }}>
          <Tabs
            value={tabValue}
            onChange={handleTabChange}
            variant="scrollable"
            scrollButtons="auto"
            sx={{ '& .MuiTab-root': { fontWeight: 700, minWidth: { xs: 120, sm: 160 }, py: 2.5 } }}
          >
            <Tab icon={<AccountCircleIcon sx={{ mr: 1 }} />} iconPosition="start" label="Identity Image" />
            <Tab icon={<AssignmentIcon sx={{ mr: 1 }} />} iconPosition="start" label="Credential Document" />
            <Tab icon={<FolderIcon sx={{ mr: 1 }} />} iconPosition="start" label="Bulk Repository" />
          </Tabs>
        </Box>

        <Box p={{ xs: 2, sm: 4 }}>
          <Grid container spacing={{ xs: 2, md: 4 }}>
            <Grid size={{ xs: 12, md: 7 }}>
              <Box
                onDragEnter={handleDragEnter}
                onDragOver={(e) => e.preventDefault()}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                sx={{
                  p: { xs: 3, sm: 6 },
                  textAlign: 'center',
                  border: '2px dashed',
                  borderColor: isDragging ? 'primary.main' : 'rgba(33, 150, 243, 0.3)',
                  borderRadius: '24px',
                  bgcolor: isDragging ? 'rgba(33, 150, 243, 0.1)' : 'rgba(33, 150, 243, 0.02)',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    bgcolor: 'rgba(33, 150, 243, 0.05)',
                    borderColor: 'primary.main'
                  }
                }}
              >
                <input
                  type="file"
                  multiple={tabValue === 2}
                  accept={tabValue === 0 ? "image/jpeg,image/png,image/jpg" : ".pdf,.jpg,.jpeg,.png,.doc,.docx"}
                  onChange={handleFileChange}
                  style={{ display: 'none' }}
                  id="file-upload-input"
                />
                <label htmlFor="file-upload-input">
                  <IconButton component="span" sx={{ mb: 3, bgcolor: 'rgba(33, 150, 243, 0.1)', color: 'primary.main', p: 3.5, borderRadius: '22px', transition: 'transform 0.2s', '&:hover': { transform: 'scale(1.05)', bgcolor: 'rgba(33, 150, 243, 0.18)' } }}>
                    <CloudUploadIcon sx={{ fontSize: 42 }} />
                  </IconButton>
                </label>
                <Typography variant="h4" fontWeight={700} mb={1}>Deploy Digital Assets</Typography>
                <Typography variant="body1" color="text.secondary" mb={4}>
                  {tabValue === 0 ? 'Upload professional identity headshot (JPG, PNG)' : tabValue === 1 ? 'Upload official verification document (PDF, JPG, PNG, DOC)' : 'Batch upload multiple repository assets'}
                </Typography>

                {selectedFiles.length > 0 && (
                  <Box mb={4} textAlign="left">
                    <Typography variant="subtitle2" fontWeight={800} mb={2}>Selected for Provisioning ({selectedFiles.length})</Typography>
                    <List sx={{ bgcolor: 'background.paper', borderRadius: '16px', border: '1px solid', borderColor: 'divider', overflow: 'hidden' }}>
                      {selectedFiles.map((file, index) => (
                        <ListItem key={index} secondaryAction={
                          <IconButton edge="end" onClick={() => removeSelectedFile(index)} size="small" color="error">
                            <DeleteTwoToneIcon sx={{ fontSize: '1.3rem' }} />
                          </IconButton>
                        } sx={{ borderBottom: index < selectedFiles.length - 1 ? '1px solid' : 'none', borderColor: 'divider', py: 1.5 }}>
                          <ListItemIcon>
                            {previews[index] ? (
                              <Box component="img" src={previews[index]} alt={file.name} sx={{ width: 40, height: 40, borderRadius: 1, objectFit: 'cover' }} />
                            ) : (
                              <FileIcon color="primary" />
                            )}
                          </ListItemIcon>
                          <ListItemText
                            primary={file.name}
                            primaryTypographyProps={{ fontWeight: 600, variant: 'body2' }}
                            secondary={`${(file.size / 1024).toFixed(1)} KB`}
                          />
                        </ListItem>
                      ))}
                    </List>
                  </Box>
                )}

                <Button
                  variant="contained"
                  fullWidth
                  size="large"
                  disabled={selectedFiles.length === 0 || uploading}
                  onClick={handleUpload}
                  loading={uploading}
                  sx={{ borderRadius: '16px', py: 2, fontSize: '1rem', fontWeight: 700, textTransform: 'none', boxShadow: '0 8px 24px rgba(33, 150, 243, 0.25)' }}
                >
                  Execute Asset Provisioning
                </Button>

                {uploading && (
                  <Box mt={4}>
                    <Stack direction="row" justifyContent="space-between" mb={1}>
                      <Typography variant="caption" fontWeight={700}>Synchronizing with Cloud...</Typography>
                      <Typography variant="caption" fontWeight={700}>{progress}%</Typography>
                    </Stack>
                    <LinearProgress variant="determinate" value={progress} sx={{ height: 10, borderRadius: 5, bgcolor: 'primary.light' }} />
                  </Box>
                )}
              </Box>
            </Grid>

            <Grid size={{ xs: 12, md: 5 }}>
              <Typography variant="h5" fontWeight={800} mb={3}>Deployment Log</Typography>
              <Box
                sx={{
                  maxHeight: 500,
                  overflowY: 'auto',
                  pr: 1.5,
                  '&::-webkit-scrollbar': { width: '6px' },
                  '&::-webkit-scrollbar-track': { bgcolor: 'rgba(0,0,0,0.03)', borderRadius: '10px' },
                  '&::-webkit-scrollbar-thumb': { bgcolor: 'rgba(0,0,0,0.2)', borderRadius: '10px', '&:hover': { bgcolor: 'rgba(0,0,0,0.3)' } }
                }}
              >
                {uploadedFiles.length > 0 ? (
                  <Stack spacing={2}>
                    {uploadedFiles.map((file, index) => {
                      const isSelected = selectedLogIndex === index;
                      return (
                        <Card
                          key={index}
                          variant="outlined"
                          onClick={() => setSelectedLogIndex(index)}
                          sx={{
                            p: 2,
                            borderRadius: '16px',
                            cursor: 'pointer',
                            borderColor: isSelected ? 'primary.main' : 'divider',
                            bgcolor: isSelected ? 'rgba(33, 150, 243, 0.05)' : 'background.paper',
                            boxShadow: isSelected ? '0 4px 12px rgba(33, 150, 243, 0.15)' : 'none',
                            transition: 'all 0.2s ease-in-out',
                            '&:hover': {
                              borderColor: 'primary.main',
                              bgcolor: isSelected ? 'rgba(33, 150, 243, 0.08)' : 'rgba(33, 150, 243, 0.02)',
                              transform: 'translateY(-1px)'
                            }
                          }}
                        >
                          <Stack direction="row" spacing={2} alignItems="center">
                            <Box sx={{ flexGrow: 1, minWidth: 0, display: 'flex', alignItems: 'center' }}>
                              {(file.fileUrl || file.url) && (file.fileUrl?.match(/\.(jpeg|jpg|gif|png)$/i) || file.url?.match(/\.(jpeg|jpg|gif|png)$/i)) ? (
                                <Box 
                                  component="img" 
                                  src={getFullFileUrl(file.fileUrl || file.url)} 
                                  alt={file.originalName || file.fileName || 'asset'} 
                                  sx={{ maxHeight: 80, maxWidth: '100%', borderRadius: 2, objectFit: 'contain' }} 
                                  onError={(e: any) => { 
                                    e.target.style.display = 'none'; 
                                    if (e.target.nextSibling) e.target.nextSibling.style.display = 'flex'; 
                                  }} 
                                />
                              ) : null}
                              
                              <Box 
                                sx={{ 
                                  display: (file.fileUrl || file.url) && (file.fileUrl?.match(/\.(jpeg|jpg|gif|png)$/i) || file.url?.match(/\.(jpeg|jpg|gif|png)$/i)) ? 'none' : 'flex',
                                  alignItems: 'center',
                                  gap: 2
                                }}
                              >
                                <CheckCircleIcon color="success" />
                                <Box>
                                  <Typography variant="subtitle2" fontWeight={700} noWrap>{file.originalName || file.fileName || file.name || `Asset-${index + 1}`}</Typography>
                                  <Typography variant="caption" color="text.secondary" display="block">Provisioned {new Date(file.uploadedAt || Date.now()).toLocaleDateString()}</Typography>
                                </Box>
                              </Box>
                            </Box>
                            
                            <Stack direction="row" spacing={1} alignItems="center">
                              <IconButton size="small" onClick={(e) => handleEditClick(e, file)} sx={{ color: 'primary.main', bgcolor: 'rgba(33, 150, 243, 0.1)', '&:hover': { bgcolor: 'rgba(33, 150, 243, 0.2)' } }}>
                                <EditTwoToneIcon fontSize="small" />
                              </IconButton>
                              
                              <IconButton size="small" onClick={(e) => handleDeleteClick(e, file)} sx={{ color: 'error.main', bgcolor: 'rgba(244, 67, 54, 0.1)', '&:hover': { bgcolor: 'rgba(244, 67, 54, 0.2)' } }}>
                                <DeleteTwoToneIcon fontSize="small" />
                              </IconButton>

                              <IconButton 
                                size="small" 
                                onClick={(e) => {
                                  e.stopPropagation();
                                  window.open(getFullFileUrl(file.fileUrl || file.url), '_blank');
                                }} 
                                sx={{ color: 'info.main', bgcolor: 'rgba(2, 136, 209, 0.1)', '&:hover': { bgcolor: 'rgba(2, 136, 209, 0.2)' } }}
                              >
                                <VisibilityTwoToneIcon fontSize="small" />
                              </IconButton>
                            </Stack>
                          </Stack>
                        </Card>
                      );
                    })}
                  </Stack>
                ) : (
                  <Box p={8} textAlign="center" sx={{ border: '2px dashed', borderColor: 'divider', borderRadius: '24px', bgcolor: 'rgba(0,0,0,0.01)' }}>
                    <Typography color="text.secondary" fontWeight={500}>Vault history is currently empty</Typography>
                  </Box>
                )}
              </Box>
            </Grid>
          </Grid>
        </Box>
      </Card>

      <input
        type="file"
        ref={hiddenFileInputRef}
        style={{ display: 'none' }}
        onChange={async (e) => {
          if (e.target.files && e.target.files.length > 0 && editFile) {
            const newFile = e.target.files[0];
            try {
              const response = await uploadService.updateFile(editFile._id, newFile, newFile.name);
              if (response.success) {
                await fetchMyFiles();
                enqueueSnackbar('Asset updated successfully', { variant: 'success' });
              }
            } catch (error: any) {
              const errorMsg = error.message || (typeof error === 'string' ? error : JSON.stringify(error));
              enqueueSnackbar(errorMsg || 'Failed to update asset', { variant: 'error' });
            } finally {
              setEditFile(null);
              if (hiddenFileInputRef.current) hiddenFileInputRef.current.value = '';
            }
          }
        }}
      />
    </Box>
  );
};

export default FileUpload;

