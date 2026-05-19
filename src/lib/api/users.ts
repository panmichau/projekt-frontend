import { apiFetch } from './api';
import type {
  PagedModelUserSummaryDTO,
  UserSaveRequest,
  UserSummaryDTO
} from './types';

export async function getUsers(page = 0, size = 10) {
  return apiFetch<PagedModelUserSummaryDTO>('/user/list', {
    method: 'GET',
    auth: true,
    query: {
      page,
      size
    }
  });
}

export async function getUser(userId: number) {
  return apiFetch<UserSummaryDTO>('/user', {
    method: 'GET',
    auth: true,
    query: {
      userId
    }
  });
}

export async function updateUser(data: UserSaveRequest) {
  return apiFetch<UserSummaryDTO>('/user', {
    method: 'PUT',
    auth: true,
    body: data
  });
}