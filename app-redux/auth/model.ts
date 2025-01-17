import { SCOPE } from '@/utils/config/base';

/**
 * @interface OAuthToken
 */
export interface OAuthToken {
  access_token: string;
  expires_in: number;
}

/**
 * @interface AuthState
 */
export interface AuthState {
  loading: boolean;
  error?: string | null;
  token: OAuthToken | null;
  scope: SCOPE | null;
}
