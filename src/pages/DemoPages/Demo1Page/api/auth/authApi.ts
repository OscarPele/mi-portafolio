import { request } from '../client';
import type { LoginRequest, LoginResponse, RegisterRequest } from './authTypes';

export function login(body: LoginRequest): Promise<LoginResponse> {
  return request<LoginResponse>('/auth/login', {
    method: 'POST',
    body: JSON.stringify(body),
  });
}

export function register(body: RegisterRequest): Promise<void> {
  return request<void>('/auth/register', {
    method: 'POST',
    body: JSON.stringify(body),
  });
}
