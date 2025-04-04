
export interface User {
  _id: string;
  name: string;
  email: string;
}

export interface QRCode {
  _id: string;
  userId: string;
  content: string;
  type: 'url' | 'text';
  createdAt: string;
  title?: string;
}

export interface AuthResponse {
  token: string;
  user: User;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
}
