export const API_ENDPOINTS = {
  SERVICEABLE_PINCODE: {
    BASE: '/api/v1/serviceable-area-pincode',
    UPLOAD: '/api/v1/serviceable-area-pincode/upload',
    UPLOAD_EXCEL: '/api/v1/serviceable-area-pincode/upload/excel',
    STATUS: (id: string) => `/api/v1/serviceable-area-pincode/${id}/status`,
    BULK_STATUS: '/api/v1/serviceable-area-pincode/status'
  },
  STATE: {
    LIST: '/api/v1/state'
  },
  UPLOAD_HISTORY: {
    LIST: '/api/v1/upload-history'
  },
  LOAN_CATEGORY: {
    LIST: '/api/v1/loan-category',
    UPDATE: (id: string) => `/api/v1/loan-category/${id}`
  },
  LOAN_SUBCATEGORY: {
    BASE: '/api/v1/loan-subcategory',
    UPDATE: (id: string) => `/api/v1/loan-subcategory/${id}`,
    DELETE: (id: string) => `/api/v1/loan-subcategory/${id}`
  },
  LANGUAGE: {
    BASE: '/api/v1/language',
    UPDATE: (id: string) => `/api/v1/language/${id}`,
    DELETE: (id: string) => `/api/v1/language/${id}`
  },
  AGREEMENT_GRIEVANCE: {
    LIST: '/api/v1/agreement-grievance',
    UPDATE: (id: string) => `/api/v1/agreement-grievance/${id}`
  },
  BUCKET_MASTER: {
    BASE: '/api/v1/bucket-master',
    LIST: '/api/v1/bucket-master',
    CREATE: '/api/v1/bucket-master',
    UPDATE: (id: string) => `/api/v1/bucket-master/${id}`,
    DELETE: (id: string) => `/api/v1/bucket-master/${id}`
  },
  ACCOUNT_CLASSIFICATION: {
    BASE: '/api/v1/account-classification',
    LIST: '/api/v1/account-classification',
    CREATE: '/api/v1/account-classification',
    UPDATE: (id: string) => `/api/v1/account-classification/${id}`,
    DELETE: (id: string) => `/api/v1/account-classification/${id}`
  },
  TAX_CONFIGURATION: {
    BASE: '/api/v1/tax',
    UPDATE: (id: string) => `/api/v1/tax/${id}`
  },
  ADMIN_MENU: {
    BASE: '/api/v1/admin-settings/menu'
  },
  DESIGNATION_MASTER: {
    BASE: '/api/v1/admin-settings/designations',
    CREATE: '/api/v1/admin-settings/designations',
    UPDATE: (id: string) => `/api/v1/admin-settings/designations/${id}`,
    DELETE: (id: string) => `/api/v1/admin-settings/designations/${id}`
  },
  ADMIN_USERS: {
    BASE: '/api/v1/admin-settings/users',
    DETAIL: (id: string) => `/api/v1/admin-settings/users/${id}`,
    CREATE: '/api/v1/admin-settings/users',
    LOGIN: '/api/v1/admin-settings/login',
    LOGOUT: '/api/v1/admin-settings/logout',
    UPDATE: (id: string) => `/api/v1/admin-settings/users/${id}`,
    TOGGLE_STATUS: (id: string) => `/api/v1/admin-settings/users/${id}/status`,
    DELETE: (id: string) => `/api/v1/admin-settings/users/${id}`,
    PERMISSIONS: (userId: string) => `/api/v1/admin-settings/users/${userId}/permissions`
  },
  LOAN_APPLICANTS: {
    BASE: '/api/v1/loan-applicants',
    BLOCK: (customerId: string) => `/api/v1/loan-applicants/block/${customerId}`
  },
  LOAN_APPLICATION: {
    BASE: '/api/v1/admin-loan-list',
    LOAN_NUMBER_LIST: `/api/v1/admin-loan-list/loan-numbers`
  },
  PAYOUT_SETTINGS: {
    BASE: '/api/v1/payout-settings',
    CREATE: '/api/v1/payout-settings/channel',
    UPDATE: (channelId: string) => `/api/v1/payout-settings/channel/${channelId}`
  },
  DISBURSEMENT: {
    BASE: '/api/v1/admin/disbursements',
    AUTO_TOGGLE: '/api/v1/admin/disbursements/auto-toggle',
    GET_ELIGIBLE_PROVIDERS: '/api/v1/admin/disbursements/providers/eligible',
    MANUAL_DISBURSEMENT: '/api/v1/admin/disbursements/initiate/manual-disbursement',

    SUMMARY: '/api/v1/admin/disbursements/summary',
  },
  APP_VERSION_CONTROL: {
    BASE: '/api/v1/app-version-control',
    UPDATE: (platform: string) => `/api/v1/app-version-control/${platform}`
  },
  MANUAL_REVIEW: {
    BASE: '/api/v1/admin/manual-review',
    QUEUE_LIST: '/api/v1/admin/manual-review',
    APPLICANT_DETAIL: (applicantId: string) => `/api/v1/admin/manual-review/kyc/applicant-details/${applicantId}`,
    UPDATE_AADHAAR_NAME: (applicantId: string) => `/api/v1/admin/manual-review/kyc/update-aadhaar-name-correction/${applicantId}`,
    BANK_VERIFICATION_DETAIL: (applicantId: string) => `/api/v1/admin/manual-review/bank-verification/details/${applicantId}`
  },
  LOAN_LEDGER: {
    LIST: '/api/v1/admin/loan-ledgers'
  },
  ACCOUNT_LEDGER: {
    LIST: '/api/v1/admin/account-ledgers'
  },
  PAYMENT_METHODS: {
    BASE: '/api/v1/payment-methods',
    ADMIN_LIST: '/api/v1/payment-methods/admin/list',
    UPLOAD_ICON: '/api/v1/payment-methods/upload-icon'
  },
  SMS_MASTER: {
    BASE: '/api/v1/admin-sms-master',
    BY_ID: (id: string) => `/api/v1/admin-sms-master/${id}`
  },
  MAIL_TEMPLATES: {
    LIST: '/api/v1/mail-templates',
    DETAIL: (id: string) => `/api/v1/mail-templates/${id}`,
    CREATE: '/api/v1/mail-templates',
    UPDATE: (id: string) => `/api/v1/mail-templates/${id}`,
    SEND_MAIL: '/api/v1/mail-templates/send'
  },
  MAIL_SETTINGS: {
    GET: '/api/v1/mail-settings',
    SAVE: '/api/v1/mail-settings'
  },
  BRE_RULES: {
    LIST: '/api/v1/bre-rules',
    DETAIL: (id: string) => `/api/v1/bre-rules/${id}`,
    VARIABLE: (id: string) => `/api/v1/bre-rules/${id}/variable`,
    STATUS: (id: string) => `/api/v1/bre-rules/${id}/status`,
    ACTIVE_BY_MODULE: '/api/v1/bre-rules/active/by-module',
    LOAN_EXPOSURE_CYCLE: '/api/v1/bre-rules/loan-exposure/cycle',
    LOAN_EXPOSURE_CYCLE_BY_NUMBER: (cycleNumber: number) => `/api/v1/bre-rules/loan-exposure/cycle/${cycleNumber}`,
    REPEAT_LOAN_DPD_BRACKETS: '/api/v1/bre-rules/repeat-loan/dpd-brackets',
    DELETE_LOAN_EXPOSURE_CYCLE: `/api/v1/bre-rules/loan-exposure/cycle`,
    EMI_MISSED_PENALTY_BRACKETS: '/api/v1/bre-rules/emi-missed-penalty/brackets'
  },
  BRE_TEMPLATES: {
    LIST: '/api/v1/bre-templates',
    CREATE: '/api/v1/bre-templates',
    UPDATE: (id: string) => `/api/v1/bre-templates/${id}`,
    DELETE: (templateId: string) => `/api/v1/bre-templates/${templateId}`,
    DUPLICATE_BRE_TEMPLATE: (templateId: string) => `/api/v1/bre-templates/${templateId}/duplicate`,
    ADD_RULE: (templateId: string) => `/api/v1/bre-template-rules/${templateId}/rules`,
    UPDATE_RULE: (templateId: string, ruleId: string) => `/api/v1/bre-template-rules/${templateId}/rules/${ruleId}`,
    GET_TEMPLATE_RULES: (templateId: string) => `/api/v1/bre-template-rules/${templateId}/rules`
  }
};