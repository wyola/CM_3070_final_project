export interface UserI {
  id: number;
  email: string;
  organizationId: number;
}

export interface UserContextI {
  user: UserI | null;
  setUser: (user: UserI | null) => void;
  isAuthenticated: boolean;
  logout: () => void;
}
