import type { Student } from "@/lib/types";

// TODO: Replace with actual API calls
export const studentService = {
  getAll: async (): Promise<Student[]> => {
    // TODO: fetch from API
    return [];
  },
  getById: async (id: string): Promise<Student | null> => {
    // TODO: fetch from API
    return null;
  },
  create: async (data: Partial<Student>): Promise<Student | null> => {
    // TODO: POST to API
    return null;
  },
  update: async (id: string, data: Partial<Student>): Promise<Student | null> => {
    // TODO: PUT to API
    return null;
  },
  delete: async (id: string): Promise<boolean> => {
    // TODO: DELETE from API
    return false;
  },
};
