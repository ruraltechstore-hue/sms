import type { User, UserRole } from "@/lib/types";

// TODO: Replace with actual API calls
export const authService = {
  login: async (email: string, password: string): Promise<User | null> => {
    // Placeholder: simulate async API call
    // In production, this would POST to your auth API
    await new Promise((resolve) => setTimeout(resolve, 500));

    // Return null — no hardcoded users. 
    // When backend is connected, validate credentials and return user.
    return null;
  },
  logout: async (): Promise<boolean> => {
    // TODO: POST to auth API to invalidate session
    return true;
  },
  getCurrentUser: async (): Promise<User | null> => {
    // TODO: GET from auth API (check session/token)
    return null;
  },
};
