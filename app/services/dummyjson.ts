import axios from 'axios';
import { UsersResponse } from '../types/users-response';
import { ProductsResponse } from '../types/product-response';

const API_BASE = 'https://dummyjson.com';

export const dummyApi = axios.create({
  baseURL: API_BASE,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true, // handles cookies automatically
});

export interface LoginResponse {
  id: number;
  username: string;
  token: string; // JWT token
}

// login with any user credentials
export const loginUser = async (
  username: string,
  password: string
): Promise<LoginResponse> => {
  const res = await dummyApi.post<LoginResponse>('/auth/login', {
    username,
    password,
  });

  // token is automatically set in cookie if `withCredentials` works
  return res.data;
};

// fetch users (requires authentication)
export const getUsers = async (
  limit = 10,
  skip = 0
): Promise<UsersResponse> => {
  const res = await dummyApi.get<UsersResponse>('/users', {
    params: { limit, skip },
  });

  return res.data;
};




export const loginRequest = (data: {
  username: string;
  password: string;
}) => {
  return axios.post("/api/auth/login", data);
};

export const getProducts = async (
  limit = 10,
  skip = 0
): Promise<ProductsResponse> => {
  const { data } = await dummyApi.get<ProductsResponse>('/products', {
    params: { limit, skip },
  });
  return data;
};
