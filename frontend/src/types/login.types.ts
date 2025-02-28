export interface LoginFormDataI {
  email: string;
  password: string;
}

export interface LoginResponseI {
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
