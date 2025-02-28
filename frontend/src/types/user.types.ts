export interface UserI {
  id: number;
  email: string;
}

export interface UserContextI {
  user: UserI | null;
  setUser: (user: UserI | null) => void;
  isAuthenticated: boolean;
}
