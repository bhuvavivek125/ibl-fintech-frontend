export const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

export const ALLOWED_FILE_TYPES = [
  'image/jpeg',
  'image/png',
  'image/jpg',
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
];

export const ALLOWED_IMAGE_TYPES = [
  'image/jpeg',
  'image/png',
  'image/jpg'
];

export const validateFile = (file: File, isImageOnly: boolean = false): { isValid: boolean; error?: string } => {
  if (file.size > MAX_FILE_SIZE) {
    return { isValid: false, error: `File ${file.name} is too large. Max size is 5MB.` };
  }

  const allowedTypes = isImageOnly ? ALLOWED_IMAGE_TYPES : ALLOWED_FILE_TYPES;
  
  if (!allowedTypes.includes(file.type)) {
    return { 
      isValid: false, 
      error: `File ${file.name} has an invalid type. Allowed types are: ${isImageOnly ? 'JPG, PNG' : 'JPG, PNG, PDF, DOC, DOCX'}` 
    };
  }

  return { isValid: true };
};

export const validateFiles = (files: File[], isImageOnly: boolean = false): { isValid: boolean; error?: string } => {
  for (const file of files) {
    const validation = validateFile(file, isImageOnly);
    if (!validation.isValid) {
      return validation;
    }
  }
  return { isValid: true };
};
