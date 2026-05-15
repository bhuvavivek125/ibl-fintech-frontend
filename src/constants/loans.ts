export enum LOAN_STATUS {
  PROGRESS = 1,
  ACTIVE = 2,
  CLOSED = 3,
  REJECTED = 4
}

export enum LOAN_SUB_STATUS {
  // >>>>>> PROGRESS sub-status
  EMAIL_VERIFICATION = 101,
  PAN_VERIFICATION = 102,
  ADDITIONAL_INFO = 103,
  EMPLOYMENT_DETAIL = 104,
  SANCTIONED = 105,
  AADHAAR_VERIFICATION = 106,
  REFERENCE_DETAIL = 107,
  SELFIE_VERIFICATION = 108,
  BANK_VERIFICATION = 109,
  AGREEMENT = 110,
  PRE_DISBURSEMENT = 111,
  DISBURSEMENT_IN_PROGRESS = 112,
  DISBURSEMENT_SUCCESS = 113,
  APPLICATION_COMPLETE = 114,
  // MANUAL_REVIEW sub-status (Part of PROGRESS status)
  AADHAAR_SINGLE_WORD_NAME = 501,
  AADHAAR_PAN_NAME_NOT_MATCHED = 502,
  AADHAAR_PAN_DOB_NOT_MATCHED = 503,
  AADHAAR_ADDRESS_INSUFFICIENT_UNIQUE_WORDS = 504,
  MANUAL_REVIEW_BANK = 505,
  MULTIPLE_LOANS_FROM_SAME_IP = 506,

  // >>>>>>> ACTIVE sub-status
  DISBURSED = 201,
  SETTLED = 202,
  WRITEOFF = 203,
  POST_WRITEOFF_SETTLED = 204,

  // >>>>> CLOSED sub-status
  NORMAL_CLOSE = 301, // Whenever loan get closed
  PRE_CLOSE = 302, // If loan get close before maturity date

  // REJECTED sub-status
  BRE_REJECTED = 401,
  SANCTION_EXPIRED = 402,
  AADHAAR_MISMATCH = 403,
  ALT_CONTACT_ACTIVE_LOAN = 404,
  BANK_VERIFICATION_FAILED = 405
}

export const LOAN_STATUS_LABEL: Record<LOAN_STATUS, string> = {
  [LOAN_STATUS.PROGRESS]: 'In Progress',
  [LOAN_STATUS.ACTIVE]: 'Active',
  [LOAN_STATUS.CLOSED]: 'Closed',
  [LOAN_STATUS.REJECTED]: 'Rejected'
};

export const LOAN_SUB_STATUS_LABEL: Record<LOAN_SUB_STATUS, string> = {
  // >>>>>> PROGRESS sub-status
  [LOAN_SUB_STATUS.EMAIL_VERIFICATION]: 'Email Verification',
  [LOAN_SUB_STATUS.PAN_VERIFICATION]: 'Pan Verification',
  [LOAN_SUB_STATUS.ADDITIONAL_INFO]: 'Additional Info',
  [LOAN_SUB_STATUS.EMPLOYMENT_DETAIL]: 'Employment Detail',
  [LOAN_SUB_STATUS.SANCTIONED]: 'Sanctioned',
  [LOAN_SUB_STATUS.AADHAAR_VERIFICATION]: 'Aadhaar Verification',
  [LOAN_SUB_STATUS.REFERENCE_DETAIL]: 'Reference Detail',
  [LOAN_SUB_STATUS.SELFIE_VERIFICATION]: 'Selfie Verification',
  [LOAN_SUB_STATUS.BANK_VERIFICATION]: 'Bank Verification',
  [LOAN_SUB_STATUS.AGREEMENT]: 'Agreement',
  [LOAN_SUB_STATUS.PRE_DISBURSEMENT]: 'Pre Disbursement',
  [LOAN_SUB_STATUS.DISBURSEMENT_IN_PROGRESS]: 'Disbursement In Progress',
  [LOAN_SUB_STATUS.DISBURSEMENT_SUCCESS]: 'Disbursement Success',
  [LOAN_SUB_STATUS.APPLICATION_COMPLETE]: 'Application Complete',

  // MANUAL_REVIEW sub-status (Part of PROGRESS status)
  [LOAN_SUB_STATUS.AADHAAR_SINGLE_WORD_NAME]: 'Aadhaar Single Word Name',
  [LOAN_SUB_STATUS.AADHAAR_PAN_NAME_NOT_MATCHED]: 'Aadhaar Pan Name Not Matched',
  [LOAN_SUB_STATUS.AADHAAR_PAN_DOB_NOT_MATCHED]: 'Aadhaar Pan Dob Not Matched',
  [LOAN_SUB_STATUS.AADHAAR_ADDRESS_INSUFFICIENT_UNIQUE_WORDS]: 'Aadhaar Address Insufficient Unique Words',
  [LOAN_SUB_STATUS.MANUAL_REVIEW_BANK]: 'Manual Review Bank',
  [LOAN_SUB_STATUS.MULTIPLE_LOANS_FROM_SAME_IP]: 'Multiple Loans From Same Ip',

  // >>>>>>> ACTIVE sub-status
  [LOAN_SUB_STATUS.DISBURSED]: 'Disbursed',
  [LOAN_SUB_STATUS.SETTLED]: 'Settled',
  [LOAN_SUB_STATUS.WRITEOFF]: 'Writeoff',
  [LOAN_SUB_STATUS.POST_WRITEOFF_SETTLED]: 'Post Writeoff Settled',

  // >>>>> CLOSED sub-status
  [LOAN_SUB_STATUS.NORMAL_CLOSE]: 'Normal Close',
  [LOAN_SUB_STATUS.PRE_CLOSE]: 'Pre Close',

  // REJECTED sub-status
  [LOAN_SUB_STATUS.BRE_REJECTED]: 'Bre Rejected',
  [LOAN_SUB_STATUS.SANCTION_EXPIRED]: 'Sanction Expired',
  [LOAN_SUB_STATUS.AADHAAR_MISMATCH]: 'Aadhaar Mismatch',
  [LOAN_SUB_STATUS.ALT_CONTACT_ACTIVE_LOAN]: 'Alt Contact Active Loan',
  [LOAN_SUB_STATUS.BANK_VERIFICATION_FAILED]: 'Bank Verification Failed'
};

export const LOAN_STATUS_STYLE: Record<LOAN_STATUS, { backgroundColor: string; color: string }> = {
  [LOAN_STATUS.PROGRESS]: { backgroundColor: '#fef3c7', color: '#92400e' },
  [LOAN_STATUS.ACTIVE]: { backgroundColor: '#dbeafe', color: '#1e40af' },
  [LOAN_STATUS.CLOSED]: { backgroundColor: '#f3f4f6', color: '#374151' },
  [LOAN_STATUS.REJECTED]: { backgroundColor: '#fee2e2', color: '#991b1b' }
};

export const LOAN_SUB_STATUS_STYLE: Record<LOAN_SUB_STATUS, { backgroundColor: string; color: string }> = {
  // Progress — application funnel
  [LOAN_SUB_STATUS.EMAIL_VERIFICATION]: { backgroundColor: '#fef9c3', color: '#854d0e' },
  [LOAN_SUB_STATUS.PAN_VERIFICATION]: { backgroundColor: '#fef9c3', color: '#854d0e' },
  [LOAN_SUB_STATUS.ADDITIONAL_INFO]: { backgroundColor: '#fef9c3', color: '#854d0e' },
  [LOAN_SUB_STATUS.EMPLOYMENT_DETAIL]: { backgroundColor: '#fef9c3', color: '#854d0e' },
  [LOAN_SUB_STATUS.SANCTIONED]: { backgroundColor: '#f3e8ff', color: '#6b21a8' },
  [LOAN_SUB_STATUS.AADHAAR_VERIFICATION]: { backgroundColor: '#fef9c3', color: '#854d0e' },
  [LOAN_SUB_STATUS.REFERENCE_DETAIL]: { backgroundColor: '#fef9c3', color: '#854d0e' },
  [LOAN_SUB_STATUS.SELFIE_VERIFICATION]: { backgroundColor: '#fef9c3', color: '#854d0e' },
  [LOAN_SUB_STATUS.BANK_VERIFICATION]: { backgroundColor: '#fef9c3', color: '#854d0e' },
  [LOAN_SUB_STATUS.AGREEMENT]: { backgroundColor: '#fef9c3', color: '#854d0e' },
  [LOAN_SUB_STATUS.PRE_DISBURSEMENT]: { backgroundColor: '#fef9c3', color: '#854d0e' },
  [LOAN_SUB_STATUS.DISBURSEMENT_IN_PROGRESS]: { backgroundColor: '#e0f2fe', color: '#0c4a6e' },
  [LOAN_SUB_STATUS.DISBURSEMENT_SUCCESS]: { backgroundColor: '#dcfce7', color: '#14532d' },
  [LOAN_SUB_STATUS.APPLICATION_COMPLETE]: { backgroundColor: '#dcfce7', color: '#14532d' },

  // Progress — manual review
  [LOAN_SUB_STATUS.AADHAAR_SINGLE_WORD_NAME]: { backgroundColor: '#fff7ed', color: '#9a3412' },
  [LOAN_SUB_STATUS.AADHAAR_PAN_NAME_NOT_MATCHED]: { backgroundColor: '#fff7ed', color: '#9a3412' },
  [LOAN_SUB_STATUS.AADHAAR_PAN_DOB_NOT_MATCHED]: { backgroundColor: '#fff7ed', color: '#9a3412' },
  [LOAN_SUB_STATUS.AADHAAR_ADDRESS_INSUFFICIENT_UNIQUE_WORDS]: { backgroundColor: '#fff7ed', color: '#9a3412' },
  [LOAN_SUB_STATUS.MANUAL_REVIEW_BANK]: { backgroundColor: '#fff7ed', color: '#9a3412' },
  [LOAN_SUB_STATUS.MULTIPLE_LOANS_FROM_SAME_IP]: { backgroundColor: '#fff7ed', color: '#9a3412' },

  // Active
  [LOAN_SUB_STATUS.DISBURSED]: { backgroundColor: '#d1fae5', color: '#065f46' },
  [LOAN_SUB_STATUS.SETTLED]: { backgroundColor: '#e0f2fe', color: '#0369a1' },
  [LOAN_SUB_STATUS.WRITEOFF]: { backgroundColor: '#fef2f2', color: '#991b1b' },
  [LOAN_SUB_STATUS.POST_WRITEOFF_SETTLED]: { backgroundColor: '#f0fdf4', color: '#166534' },

  // Closed
  [LOAN_SUB_STATUS.NORMAL_CLOSE]: { backgroundColor: '#f3f4f6', color: '#374151' },
  [LOAN_SUB_STATUS.PRE_CLOSE]: { backgroundColor: '#f3f4f6', color: '#374151' },

  // Rejected
  [LOAN_SUB_STATUS.BRE_REJECTED]: { backgroundColor: '#fee2e2', color: '#991b1b' },
  [LOAN_SUB_STATUS.SANCTION_EXPIRED]: { backgroundColor: '#fee2e2', color: '#991b1b' },
  [LOAN_SUB_STATUS.AADHAAR_MISMATCH]: { backgroundColor: '#fee2e2', color: '#991b1b' },
  [LOAN_SUB_STATUS.ALT_CONTACT_ACTIVE_LOAN]: { backgroundColor: '#fee2e2', color: '#991b1b' },
  [LOAN_SUB_STATUS.BANK_VERIFICATION_FAILED]: { backgroundColor: '#fee2e2', color: '#991b1b' }
};

export const getLoanStatusStyle = (status: LOAN_STATUS) => LOAN_STATUS_STYLE[status] ?? { backgroundColor: '#f3f4f6', color: '#374151' };

export const getLoanSubStatusStyle = (subStatus: LOAN_SUB_STATUS) =>
  LOAN_SUB_STATUS_STYLE[subStatus] ?? { backgroundColor: '#f3f4f6', color: '#374151' };
