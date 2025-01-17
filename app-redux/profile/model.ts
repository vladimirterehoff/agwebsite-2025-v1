import { User } from '../users/model';

/**
 * @interface ProfileState
 */
export interface ProfileState {
  loading: boolean;
  error?: string | null;
  profile: User | null;
  permissions: string[];
  email_verified_at: boolean;
}