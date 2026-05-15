import { DISBURSEMENT_STATUS, DISBURSEMENT_STATUS_NAME, DISBURSEMENT_UTR } from 'api/disbursement';


export function getStatusName(status: DISBURSEMENT_STATUS): string { 
  switch (status) {
    case DISBURSEMENT_STATUS.PENDING:
      return DISBURSEMENT_STATUS_NAME.PENDING;
    case DISBURSEMENT_STATUS.INITIATED:
      return DISBURSEMENT_STATUS_NAME.INITIATED;
    case DISBURSEMENT_STATUS.IN_PROCESS:
    case DISBURSEMENT_STATUS.TANKED:
      return DISBURSEMENT_STATUS_NAME.IN_PROCESS;
    case DISBURSEMENT_STATUS.COMPLETED:
      return DISBURSEMENT_STATUS_NAME.COMPLETED;
    case DISBURSEMENT_STATUS.FAILED:
      return DISBURSEMENT_STATUS_NAME.FAILED;
    default:
      return 'Unknown';
  }
}

export function getDisbursementFailReason(status: DISBURSEMENT_STATUS, failureReason: string): string {
  if (status === DISBURSEMENT_STATUS.FAILED) {
    return failureReason || '-'
  }
  return 'N/A';
}

export function getUTR(utr: DISBURSEMENT_UTR, ): string {
  return DISBURSEMENT_UTR[utr]
}

export function getDisbursementInitiatedBy(isManualDisbursement: boolean): string {
  return isManualDisbursement ? 'Manually' : 'Automatic'
}

