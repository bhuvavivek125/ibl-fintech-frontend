export const API_ENDPOINTS = {
  AUTH: {
    REGISTER: '/auth/register',
    LOGIN: '/auth/login',
    LOGOUT: '/auth/logout',
    ME: '/auth/me'
  },
  ADMIN: {
    DASHBOARD: '/admin/admin-dashboard',
    SETTINGS: '/admin/super-admin-settings'
  },
  DASHBOARD: {
    OVERVIEW: '/dashboard/overview',
    ACTIVITIES: '/dashboard/activities',
    CHARTS: '/dashboard/charts',
    USER_GROWTH: '/dashboard/user-growth'
  },
  USERS: {
    BASE: '/users',
    DETAIL: (id: string) => `/users/${id}`,
    ACTIVATE: (id: string) => `/users/${id}/activate`,
    DEACTIVATE: (id: string) => `/users/${id}/deactivate`
  },
  ROLES: {
    BASE: '/roles',
    DETAIL: (id: string) => `/roles/${id}`,
    MENU: '/roles/menu'
  },
  PERMISSIONS: {
    BASE: '/permissions'
  },
  SETTINGS: {
    BASE: '/settings'
  },
  UPLOAD: {
    PROFILE_IMAGE: '/upload/profile-image',
    DOCUMENT: '/upload/document',
    DOCUMENTS: '/upload/documents'
  },
  // Legacy or other existing endpoints (keeping for compatibility)
  SERVICEABLE_PINCODE: {
    BASE: '/serviceable-area-pincode',
    UPLOAD: '/serviceable-area-pincode/upload',
    UPLOAD_EXCEL: '/serviceable-area-pincode/upload/excel',
    STATUS: (id: string) => `/serviceable-area-pincode/${id}/status`,
    BULK_STATUS: '/serviceable-area-pincode/status'
  },
  STATE: {
    LIST: '/state'
  },
  UPLOAD_HISTORY: {
    LIST: '/upload-history'
  },
  LOAN_CATEGORY: {
    LIST: '/loan-category',
    UPDATE: (id: string) => `/loan-category/${id}`
  },
  LOAN_SUBCATEGORY: {
    BASE: '/loan-subcategory',
    UPDATE: (id: string) => `/loan-subcategory/${id}`,
    DELETE: (id: string) => `/loan-subcategory/${id}`
  },
  LANGUAGE: {
    BASE: '/language',
    UPDATE: (id: string) => `/language/${id}`,
    DELETE: (id: string) => `/language/${id}`
  },
  AGREEMENT_GRIEVANCE: {
    LIST: '/agreement-grievance',
    UPDATE: (id: string) => `/agreement-grievance/${id}`
  },
  BUCKET_MASTER: {
    BASE: '/bucket-master',
    LIST: '/bucket-master',
    CREATE: '/bucket-master',
    UPDATE: (id: string) => `/bucket-master/${id}`,
    DELETE: (id: string) => `/bucket-master/${id}`
  },
  ACCOUNT_CLASSIFICATION: {
    BASE: '/account-classification',
    LIST: '/account-classification',
    CREATE: '/account-classification',
    UPDATE: (id: string) => `/account-classification/${id}`,
    DELETE: (id: string) => `/account-classification/${id}`
  },
  TAX_CONFIGURATION: {
    BASE: '/tax',
    UPDATE: (id: string) => `/tax/${id}`
  },
  ADMIN_MENU: {
    BASE: '/admin-settings/menu'
  },
  DESIGNATION_MASTER: {
    BASE: '/admin-settings/designations',
    CREATE: '/admin-settings/designations',
    UPDATE: (id: string) => `/admin-settings/designations/${id}`,
    DELETE: (id: string) => `/admin-settings/designations/${id}`
  },
  ADMIN_USERS: {
    BASE: '/admin-settings/users',
    DETAIL: (id: string) => `/admin-settings/users/${id}`,
    CREATE: '/admin-settings/users',
    LOGIN: '/admin-settings/login',
    LOGOUT: '/admin-settings/logout',
    UPDATE: (id: string) => `/admin-settings/users/${id}`,
    TOGGLE_STATUS: (id: string) => `/admin-settings/users/${id}/status`,
    DELETE: (id: string) => `/admin-settings/users/${id}`,
    PERMISSIONS: (userId: string) => `/admin-settings/users/${userId}/permissions`
  },
  LOAN_APPLICANTS: {
    BASE: '/loan-applicants',
    BLOCK: (customerId: string) => `/loan-applicants/block/${customerId}`
  },
  LOAN_APPLICATION: {
    BASE: '/admin-loan-list',
    LOAN_NUMBER_LIST: `/admin-loan-list/loan-numbers`
  },
  PAYOUT_SETTINGS: {
    BASE: '/payout-settings',
    CREATE: '/payout-settings/channel',
    UPDATE: (channelId: string) => `/payout-settings/channel/${channelId}`
  },
  DISBURSEMENT: {
    BASE: '/admin/disbursements',
    AUTO_TOGGLE: '/admin/disbursements/auto-toggle',
    GET_ELIGIBLE_PROVIDERS: '/admin/disbursements/providers/eligible',
    MANUAL_DISBURSEMENT: '/admin/disbursements/initiate/manual-disbursement',
    SUMMARY: '/admin/disbursements/summary'
  },
  APP_VERSION_CONTROL: {
    BASE: '/app-version-control',
    UPDATE: (platform: string) => `/app-version-control/${platform}`
  },
  MANUAL_REVIEW: {
    BASE: '/admin/manual-review',
    QUEUE_LIST: '/admin/manual-review',
    APPLICANT_DETAIL: (applicantId: string) => `/admin/manual-review/kyc/applicant-details/${applicantId}`,
    UPDATE_AADHAAR_NAME: (applicantId: string) => `/admin/manual-review/kyc/update-aadhaar-name-correction/${applicantId}`,
    BANK_VERIFICATION_DETAIL: (applicantId: string) => `/admin/manual-review/bank-verification/details/${applicantId}`
  },
  LOAN_LEDGER: {
    LIST: '/admin/loan-ledgers'
  },
  ACCOUNT_LEDGER: {
    LIST: '/admin/account-ledgers'
  },
  PAYMENT_METHODS: {
    BASE: '/payment-methods',
    ADMIN_LIST: '/payment-methods/admin/list',
    UPLOAD_ICON: '/payment-methods/upload-icon'
  },
  SMS_MASTER: {
    BASE: '/admin-sms-master',
    BY_ID: (id: string) => `/admin-sms-master/${id}`
  },
  MAIL_TEMPLATES: {
    LIST: '/mail-templates',
    DETAIL: (id: string) => `/mail-templates/${id}`,
    CREATE: '/mail-templates',
    UPDATE: (id: string) => `/mail-templates/${id}`,
    SEND_MAIL: '/mail-templates/send'
  },
  MAIL_SETTINGS: {
    GET: '/mail-settings',
    SAVE: '/mail-settings'
  },
  BRE_RULES: {
    LIST: '/bre-rules',
    DETAIL: (id: string) => `/bre-rules/${id}`,
    VARIABLE: (id: string) => `/bre-rules/${id}/variable`,
    STATUS: (id: string) => `/bre-rules/${id}/status`,
    ACTIVE_BY_MODULE: '/bre-rules/active/by-module',
    LOAN_EXPOSURE_CYCLE: '/bre-rules/loan-exposure/cycle',
    LOAN_EXPOSURE_CYCLE_BY_NUMBER: (cycleNumber: number) => `/bre-rules/loan-exposure/cycle/${cycleNumber}`,
    REPEAT_LOAN_DPD_BRACKETS: '/bre-rules/repeat-loan/dpd-brackets',
    DELETE_LOAN_EXPOSURE_CYCLE: `/bre-rules/loan-exposure/cycle`,
    EMI_MISSED_PENALTY_BRACKETS: '/bre-rules/emi-missed-penalty/brackets'
  },
  BRE_TEMPLATES: {
    LIST: '/bre-templates',
    CREATE: '/bre-templates',
    UPDATE: (id: string) => `/bre-templates/${id}`,
    DELETE: (templateId: string) => `/bre-templates/${templateId}`,
    DUPLICATE_BRE_TEMPLATE: (templateId: string) => `/bre-templates/${templateId}/duplicate`,
    ADD_RULE: (templateId: string) => `/bre-template-rules/${templateId}/rules`,
    UPDATE_RULE: (templateId: string, ruleId: string) => `/bre-template-rules/${templateId}/rules/${ruleId}`,
    GET_TEMPLATE_RULES: (templateId: string) => `/bre-template-rules/${templateId}/rules`
  }
};
