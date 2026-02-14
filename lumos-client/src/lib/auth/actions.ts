'use server';

import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4001/api';

interface AuthResponse {
  accessToken: string;
  refreshToken: string;
  user: {
    id: string;
    email: string;
    emailVerified: boolean;
    createdAt: string;
    updatedAt: string;
  };
}

interface UserResponse {
  id: string;
  email: string;
  emailVerified: boolean;
  createdAt: string;
  updatedAt: string;
}

export async function signup(email: string, password: string) {
  try {
    const response = await fetch(`${API_URL}/auth/signup`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    });

    if (!response.ok) {
      const error = await response.json();
      return { success: false, error: error.message || 'Signup failed' };
    }

    const data: AuthResponse = await response.json();

    // Store tokens in httpOnly cookies
    const cookieStore = await cookies();
    cookieStore.set('accessToken', data.accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 15 * 60, // 15 minutes
      path: '/',
    });

    cookieStore.set('refreshToken', data.refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60, // 7 days
      path: '/',
    });

    return { success: true, user: data.user };
  } catch (error) {
    console.error('Signup error:', error);
    return { success: false, error: 'An unexpected error occurred' };
  }
}

export async function signin(email: string, password: string) {
  try {
    const response = await fetch(`${API_URL}/auth/signin`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    });

    if (!response.ok) {
      const error = await response.json();
      return { success: false, error: error.message || 'Signin failed' };
    }

    const data: AuthResponse = await response.json();

    // Store tokens in httpOnly cookies
    const cookieStore = await cookies();
    cookieStore.set('accessToken', data.accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 15 * 60, // 15 minutes
      path: '/',
    });

    cookieStore.set('refreshToken', data.refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60, // 7 days
      path: '/',
    });

    return { success: true, user: data.user };
  } catch (error) {
    console.error('Signin error:', error);
    return { success: false, error: 'An unexpected error occurred' };
  }
}

export async function logout() {
  try {
    const cookieStore = await cookies();
    const refreshToken = cookieStore.get('refreshToken')?.value;

    if (refreshToken) {
      // Call logout endpoint to invalidate refresh token
      await fetch(`${API_URL}/auth/logout`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ refreshToken }),
      });
    }

    // Clear cookies
    cookieStore.delete('accessToken');
    cookieStore.delete('refreshToken');

    return { success: true };
  } catch (error) {
    console.error('Logout error:', error);
    return { success: false, error: 'Logout failed' };
  }
}

export async function refreshAccessToken() {
  try {
    const cookieStore = await cookies();
    const refreshToken = cookieStore.get('refreshToken')?.value;

    if (!refreshToken) {
      return { success: false, error: 'No refresh token' };
    }

    const response = await fetch(`${API_URL}/auth/refresh`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ refreshToken }),
    });

    if (!response.ok) {
      return { success: false, error: 'Token refresh failed' };
    }

    const data: { accessToken: string; refreshToken: string } =
      await response.json();

    // Update cookies with new tokens
    cookieStore.set('accessToken', data.accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 15 * 60, // 15 minutes
      path: '/',
    });

    cookieStore.set('refreshToken', data.refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60, // 7 days
      path: '/',
    });

    return { success: true };
  } catch (error) {
    console.error('Token refresh error:', error);
    return { success: false, error: 'An unexpected error occurred' };
  }
}

export async function getCurrentUser(): Promise<UserResponse | null> {
  try {
    const cookieStore = await cookies();
    let accessToken = cookieStore.get('accessToken')?.value;

    if (!accessToken) {
      // Try to refresh
      const refreshResult = await refreshAccessToken();
      if (!refreshResult.success) {
        return null;
      }
      accessToken = cookieStore.get('accessToken')?.value;
    }

    const response = await fetch(`${API_URL}/auth/me`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
      cache: 'no-store',
    });

    if (!response.ok) {
      // If unauthorized, try refreshing token once
      if (response.status === 401) {
        const refreshResult = await refreshAccessToken();
        if (refreshResult.success) {
          // Retry with new token
          accessToken = cookieStore.get('accessToken')?.value;
          const retryResponse = await fetch(`${API_URL}/auth/me`, {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
            cache: 'no-store',
          });

          if (retryResponse.ok) {
            return await retryResponse.json();
          }
        }
      }
      return null;
    }

    return await response.json();
  } catch (error) {
    console.error('Get current user error:', error);
    return null;
  }
}

export async function getEmailFromExpiredToken(): Promise<string | null> {
  try {
    const cookieStore = await cookies();
    const accessToken = cookieStore.get('accessToken')?.value;
    if (!accessToken) {
      return null;
    }

    // Decode JWT without verification (just to extract email)
    const payload = JSON.parse(
      Buffer.from(accessToken.split('.')[1], 'base64').toString()
    );

    return payload.email || null;
  } catch (error) {
    console.error('Error extracting email from token:', error);
    return null;
  }
}
