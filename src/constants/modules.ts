export const MODULES = {
  // Serviceable Area & Locations
  SERVICEABLE_AREA_PINCODE: {
    id: 'serviceable-area-pincode',
    name: 'Serviceable Area Pincode Management'
  },

  // Loan Management
  LOAN_APPLICATIONS: {
    id: 'loan-applications',
    name: 'Loan Applications'
  },
  LOAN_APPLICANTS: {
    id: 'loan-applicants',
    name: 'Loan Applicants'
  },
  LOAN_CATEGORY: {
    id: 'loan-category',
    name: 'Loan Category'
  },
  LOAN_SUBCATEGORY: {
    id: 'loan-subcategory',
    name: 'Loan Subcategory'
  },
  LOAN_LEDGER: {
    id: 'loan-ledger',
    name: 'Loan Ledger'
  },
  LOAN_MONITORING: {
    id: 'loan-monitoring',
    name: 'Loan Monitoring'
  },

  // Account Management
  ACCOUNT_CLASSIFICATION: {
    id: 'account-classification',
    name: 'Account Classification'
  },
  ACCOUNT_LEDGER: {
    id: 'account-ledger',
    name: 'Account Ledger'
  },

  // User & Admin Management
  USERS: {
    id: 'users',
    name: 'Users'
  },
  USER_PERMISSIONS: {
    id: 'user-permissions',
    name: 'User Permissions'
  },
  ADMIN_AUTH: {
    id: 'admin-auth',
    name: 'Admin Authentication'
  },

  // Master Data
  DESIGNATION_MASTER: {
    id: 'designation-master',
    name: 'Designation Master'
  },
  MENU_MASTER: {
    id: 'menu-master',
    name: 'Menu Master'
  },
  BUCKET_MASTER: {
    id: 'bucket-master',
    name: 'Bucket Master'
  },
  PINCODES: {
    id: 'pincodes',
    name: 'Pincodes'
  },

  // Settings & Configuration
  PRODUCTS: {
    id: 'products',
    name: 'Products'
  },
  PAYOUT_SETTINGS: {
    id: 'payout-setting',
    name: 'Payout Settings'
  },
  TAX_CONFIGURATION: {
    id: 'tax-configuration',
    name: 'Tax Configuration'
  },
  APP_VERSION_CONTROL: {
    id: 'app-version-control',
    name: 'App Version Control'
  },
  PAYMENT_METHODS: {
    id: 'payment-methods',
    name: 'Payment Methods'
  },
  SMS_MASTER: {
    id: 'sms-master',
    name: 'SMS Master'
  },

  // Communication Templates
  MAIL_TEMPLATE: {
    id: 'mail-template-list',
    name: 'Mail Templates'
  },

  // Manual Review & Grievance
  REVIEW_QUEUE: {
    id: 'review-queue',
    name: 'Review Queue'
  },
  AGREEMENT_GRIEVANCE: {
    id: 'agreement-grievance',
    name: 'Agreement Grievance'
  },

  // Disbursement & Finance
  DISBURSEMENT: {
    id: 'disbursement',
    name: 'Disbursement'
  },
  UPLOAD_HISTORY: {
    id: 'upload-history',
    name: 'Upload History'
  },

  // BRE Rules
  BRE_RULES_LIST: {
    id: 'bre-rules-list',
    name: 'BRE Rules'
  },

  BRE_TEMPLATES: {
    id: 'bre-master-templates',
    name: 'BRE Templates'
  },

  // System
  LANGUAGE: {
    id: 'language-master',
    name: 'Language'
  }
} as const;

export const getModuleConfig = (moduleId: string) => {
  return Object.values(MODULES).find((module) => module.id === moduleId);
};

export const getModuleByKey = (key: keyof typeof MODULES) => {
  return MODULES[key];
};
