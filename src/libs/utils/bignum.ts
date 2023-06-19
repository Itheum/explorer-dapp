import BigNumber from 'bignumber.js';

export const DEFAULT_DECIMALS = 18;
export const BIG_NUMBER_ROUNDING_MODE = BigNumber.ROUND_FLOOR;

export const convertWeiToEsdt = (amount: BigNumber.Value | null, decimals?: number, precision?: number): BigNumber => {
  if (amount == null) {
    return new BigNumber(0);
  } else {
    return new BigNumber(amount)
      .decimalPlaces(0, BIG_NUMBER_ROUNDING_MODE)
      .shiftedBy(typeof decimals !== 'undefined' ? -decimals : -DEFAULT_DECIMALS)
      .decimalPlaces(typeof precision !== 'undefined' ? precision : 4, BIG_NUMBER_ROUNDING_MODE);
  }
};

export const convertEsdtToWei = (amount: BigNumber.Value, decimals?: number): BigNumber => {
  return new BigNumber(amount).shiftedBy(typeof decimals !== 'undefined' ? decimals : DEFAULT_DECIMALS).decimalPlaces(0, BIG_NUMBER_ROUNDING_MODE);
};

export const convertToLocalString = (value: BigNumber.Value, precision?: number): string => {
  return new BigNumber(value)
    .decimalPlaces(precision ? precision : 4, BigNumber.ROUND_FLOOR)
    .toNumber()
    .toLocaleString();
};
