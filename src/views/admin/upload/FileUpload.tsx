import React, { useState } from 'react';
import { Box, Typography, Stack, Paper, IconButton, LinearProgress, List, ListItem, ListItemText, ListItemIcon, Grid, Card, Tab, Tabs } from '@mui/material';
import { 
  CloudUpload as CloudUploadIcon, 
  InsertDriveFile as FileIcon, 
  Delete as DeleteIcon, 
  CheckCircle as CheckCircleIcon,
  AccountCircle as AccountCircleIcon,
  Assignment as AssignmentIcon,
  FolderSpecial as FolderIcon
} from '@mui/icons-material';
import Button from 'components/Button';
import uploadService from 'services/upload.service';
import { useSnackbar } from 'notistack';

const FileUpload: React.FC = () => {
  const { enqueueSnackbar } = useSnackbar();
  const [tabValue, setTabValue] = useState(0);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [uploadedFiles, setUploadedFiles] = useState<any[]>([]);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
    setSelectedFiles([]);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setSelectedFiles(Array.from(e.target.files));
    }
  };

  const handleUpload = async () => {
    if (selectedFiles.length === 0) return;

    setUploading(true);
    setProgress(30);

    try {
      let response;
      if (tabValue === 0) {
        response = await uploadService.uploadProfileImage(selectedFiles[0]);
      } else if (tabValue === 1) {
        response = await uploadService.uploadDocument(selectedFiles[0]);
      } else {
        response = await uploadService.uploadMultipleDocuments(selectedFiles);
      }

      if (response.success) {
        setProgress(100);
        const newFiles = Array.isArray(response.data) ? response.data : [response.data];
        setUploadedFiles([...newFiles, ...uploadedFiles]);
        setSelectedFiles([]);
        enqueueSnackbar('Asset synchronized successfully!', { variant: 'success' });
      }
    } catch (error: any) {
      console.error('Upload failed:', error);
      enqueueSnackbar(error.message || 'Transmission failed. Verify connectivity.', { variant: 'error' });
    } finally {
      setUploading(false);
      setTimeout(() => setProgress(0), 1000);
    }
  };

  const removeSelectedFile = (index: number) => {
    const newFiles = [...selectedFiles];
    newFiles.splice(index, 1);
    setSelectedFiles(newFiles);
  };

  return (
    <Box p={4}>
      <Stack direction="row" justifyContent="space-between" alignItems="center" mb={5}>
        <Box>
          <Typography variant="h2" fontWeight={800} className="gradient-text">Digital Asset Vault</Typography>
          <Typography variant="h6" color="text.secondary" fontWeight={500}>Securely manage and provision system documents and identity assets</Typography>
        </Box>
      </Stack>

      <Card className="glass" sx={{ borderRadius: '24px', border: 'none', mb: 4, overflow: 'hidden' }}>
        <Box sx={{ borderBottom: 1, borderColor: 'divider', px: 3, pt: 2 }}>
          <Tabs value={tabValue} onChange={handleTabChange} sx={{ '& .MuiTab-root': { fontWeight: 700, minWidth: 160 } }}>
            <Tab icon={<AccountCircleIcon sx={{ mr: 1 }} />} iconPosition="start" label="Identity Image" />
            <Tab icon={<AssignmentIcon sx={{ mr: 1 }} />} iconPosition="start" label="Credential Document" />
            <Tab icon={<FolderIcon sx={{ mr: 1 }} />} iconPosition="start" label="Bulk Repository" />
          </Tabs>
        </Box>

        <Box p={4}>
          <Grid container spacing={4}>
            <Grid item xs={12} md={7}>
              <Box 
                sx={{ 
                  p: 6, 
                  textAlign: 'center', 
                  border: '2px dashed',
                  borderColor: 'primary.light',
                  borderRadius: '24px', 
                  bgcolor: 'rgba(99, 102, 241, 0.02)',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    bgcolor: 'rgba(99, 102, 241, 0.05)',
                    borderColor: 'primary.main'
                  }
                }}
              >
                <input
                  type="file"
                  multiple={tabValue === 2}
                  accept={tabValue === 0 ? "image/*" : ".pdf,.jpg,.jpeg,.png"}
                  onChange={handleFileChange}
                  style={{ display: 'none' }}
                  id="file-upload-input"
                />
                <label htmlFor="file-upload-input">
                  <IconButton component="span" sx={{ mb: 3, bgcolor: 'primary.light', color: 'primary.main', p: 3, borderRadius: '18px' }}>
                    <CloudUploadIcon sx={{ fontSize: 40 }} />
                  </IconButton>
                </label>
                <Typography variant="h4" fontWeight={700} mb={1}>Deploy Digital Assets</Typography>
                <Typography variant="body1" color="text.secondary" mb={4}>
                  {tabValue === 0 ? 'Upload professional identity headshot' : tabValue === 1 ? 'Upload official verification document' : 'Batch upload multiple repository assets'}
                </Typography>
                
                {selectedFiles.length > 0 && (
                  <Box mb={4} textAlign="left">
                    <Typography variant="subtitle2" fontWeight={800} mb={2}>Selected for Provisioning ({selectedFiles.length})</Typography>
                    <List sx={{ bgcolor: 'background.paper', borderRadius: '16px', border: '1px solid', borderColor: 'divider' }}>
                      {selectedFiles.map((file, index) => (
                        <ListItem key={index} secondaryAction={
                          <IconButton edge="end" onClick={() => removeSelectedFile(index)} size="small" color="error">
                            <DeleteIcon fontSize="small" />
                          </IconButton>
                        }>
                          <ListItemIcon><FileIcon color="primary" /></ListItemIcon>
                          <ListItemText primary={file.name} secondary={`${(file.size / 1024).toFixed(1)} KB`} />
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
                  sx={{ borderRadius: '16px', py: 2, fontSize: '1rem', fontWeight: 700 }}
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

            <Grid item xs={12} md={5}>
              <Typography variant="h5" fontWeight={800} mb={3}>Deployment Log</Typography>
              <Box sx={{ maxHeight: 500, overflowY: 'auto', pr: 1 }}>
                {uploadedFiles.length > 0 ? (
                  <Stack spacing={2}>
                    {uploadedFiles.map((file, index) => (
                      <Card key={index} variant="outlined" sx={{ p: 2, borderRadius: '16px', '&:hover': { borderColor: 'primary.main', bgcolor: 'rgba(99, 102, 241, 0.02)' } }}>
                        <Stack direction="row" spacing={2} alignItems="center">
                          <CheckCircleIcon color="success" />
                          <Box sx={{ flexGrow: 1 }}>
                            <Typography variant="subtitle2" fontWeight={700} noWrap>{file.originalName}</Typography>
                            <Typography variant="caption" color="text.secondary">Provisioned {new Date().toLocaleDateString()}</Typography>
                          </Box>
                          <Button size="small" variant="text" href={file.fileUrl || file.url} target="_blank" sx={{ minWidth: 'auto', fontWeight: 800 }}>View</Button>
                        </Stack>
                      </Card>
                    ))}
                  </Stack>
                ) : (
                  <Box p={8} textAlign="center" sx={{ border: '2px dashed', borderColor: 'divider', borderRadius: '24px' }}>
                    <Typography color="text.secondary" fontWeight={500}>Vault history is currently empty</Typography>
                  </Box>
                )}
              </Box>
            </Grid>
          </Grid>
        </Box>
      </Card>
    </Box>
  );
};

export default FileUpload;

