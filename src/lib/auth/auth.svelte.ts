import type { UserSummaryDTO } from '$lib/api/types';
import { getMe, logout as apiLogout, refreshToken } from '$lib/api/auth';
import { clearAccessToken, getAccessToken } from '$lib/api/api';

class AuthState {
  user = $state<UserSummaryDTO | null>(null);
  loading = $state(false);
  initialized = $state(false);

  private initPromise: Promise<void> | null = null;

  get isLoggedIn() {
    return this.user !== null;
  }

  get roles() {
    return this.user?.roles ?? [];
  }

  hasRole(role: string) {
    return this.roles.includes(role as never);
  }

  hasAnyRole(roles: string[]) {
    return roles.some((role) => this.hasRole(role));
  }

  async init() {
    if (this.initialized) return;

    if (this.initPromise) {
      return this.initPromise;
    }

    this.initPromise = this.runInit();

    try {
      await this.initPromise;
    } finally {
      this.initPromise = null;
    }
  }

  private async runInit() {
    this.loading = true;

    try {
      if (!getAccessToken()) {
        await refreshToken();
      }

      this.user = await getMe();
    } catch (error) {
      console.error('Auth init error:', error);
      this.user = null;
      clearAccessToken();
    } finally {
      this.loading = false;
      this.initialized = true;
    }
  }

  async loadUser() {
    this.loading = true;

    try {
      this.user = await getMe();
    } catch {
      this.user = null;
      clearAccessToken();
      throw new Error('Nie udało się pobrać zalogowanego użytkownika');
    } finally {
      this.loading = false;
    }
  }

  async logout() {
    try {
      await apiLogout();
    } catch (error) {
      console.error("Logout failed:", error);
    
    } finally {
      this.user = null;
      this.initialized = false;
      clearAccessToken();
    }
  }
}

export const auth = new AuthState();