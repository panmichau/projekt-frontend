import { apiFetch } from './api';

import type { PositionDTO } from './types';

export async function getPositions() {
  return apiFetch<PositionDTO[]>('/position/list', {
    method: 'GET',
    auth: true
  });
}

export async function createPosition(position: string) {
  return apiFetch<PositionDTO>('/position', {
    method: 'POST',
    auth: true,
    query: {
      position
    }
  });
}

export async function deletePosition(positionId: number) {
  return apiFetch<void>('/position', {
    method: 'DELETE',
    auth: true,
    query: {
      positionId
    }
  });
}