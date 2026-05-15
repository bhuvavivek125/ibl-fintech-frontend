import { AdminUser } from 'api/admin-auth';
import { UserPermissionsResponse } from 'api/user-permissions';

export interface AdminInitialLoginContextProps {
  isLoggedIn: boolean;
  isInitialized?: boolean;
  user?: AdminUser | null;
  permissions?: UserPermissionsResponse | null;
}

export interface AdminContextType extends AdminInitialLoginContextProps {
  login: (username: string, password: string) => Promise<void>;
  logout: () => void;
  isLoading: boolean;
  error: string | null;
}
