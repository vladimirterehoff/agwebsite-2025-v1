export const WITHDRAWAL_RELATIONS = {
  PROVIDER: 'provider',
  PROVIDER_WALLET: 'provider.wallet',
  PROVIDER_USER: 'provider.user',
} as const;

export const WITHDRAWAL_RELATIONS_LIST = Object.values(WITHDRAWAL_RELATIONS); 