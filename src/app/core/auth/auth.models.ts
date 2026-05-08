export interface AuthCredentials {
  email: string;
  password: string;
  remember: boolean;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

export interface AuthUser {
  id: string;
  name: string;
  role: string;
  email: string;
}

export interface AuthState {
  user: AuthUser | null;
  tokens: AuthTokens | null;
}
