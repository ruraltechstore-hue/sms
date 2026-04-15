import type { User } from "@/lib/types";

// TODO: Replace with actual API calls
export const authService = {
  login: async (email: string, password: string): Promise<User | null> => {
    // TODO: POST to auth API
    return null;
  },
  logout: async (): Promise<boolean> => {
    // TODO: POST to auth API
    return true;
  },
  getCurrentUser: async (): Promise<User | null> => {
    // TODO: GET from auth API
    return null;
  },
};
