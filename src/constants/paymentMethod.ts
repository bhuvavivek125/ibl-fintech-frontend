import { AddPaymentMethodRequest, PaymentMethodChargeType, PaymentMethodSourcePlatform } from 'api/payment-methods';

export const CHARGE_TYPE_OPTIONS: { value: PaymentMethodChargeType; label: string }[] = [
  { value: 'percentage', label: 'Percentage (%)' },
  { value: 'fix', label: 'Fixed Amount (₹)' }
];

export const SOURCE_PLATFORM_OPTIONS: { value: PaymentMethodSourcePlatform; label: string }[] = [
  { value: 'both', label: 'Both' },
  { value: 'web', label: 'Web' },
  { value: 'mobile', label: 'Mobile' }
];

export const EMPTY_FORM: AddPaymentMethodRequest = {
  name: '',
  pg: '',
  sourcePlatform: 'both',
  icon: '',
  chargeType: 'percentage',
  chargeValue: 0,
  gstPercentage: 0,
  minCharge: 0,
  maxCharge: 0
};

