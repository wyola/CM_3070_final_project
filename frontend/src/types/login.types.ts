export interface LoginFormData {
  email: string;
  password: string;
}

export interface LoginResponse {
  message: string;
  data: {
    accessToken: string;
    refreshToken: string;
    user: {
      id: number;
      email: string;
    };
  };
}
