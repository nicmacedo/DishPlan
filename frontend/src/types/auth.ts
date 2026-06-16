export interface User {
  id: number;
  email: string;
  nome: string;
  data_nascimento: string | null;
}

export interface AuthTokens {
  access: string;
  refresh: string;
}

export interface RegisterPayload {
  email: string;
  nome: string;
  password: string;
  data_nascimento: string;
}

export interface GoogleLoginResponse extends AuthTokens {
  user: User;
}
