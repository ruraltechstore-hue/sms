import type { FeeStructure, FeePayment, MonthlyCollection, ClassWiseDue } from "@/lib/types";

// TODO: Replace with actual API calls
export const feeService = {
  getAll: async (): Promise<FeePayment[]> => {
    // TODO: fetch from API
    return [];
  },
  getById: async (id: string): Promise<FeePayment | null> => {
    // TODO: fetch from API
    return null;
  },
  create: async (data: Partial<FeePayment>): Promise<FeePayment | null> => {
    // TODO: POST to API
    return null;
  },
  update: async (id: string, data: Partial<FeePayment>): Promise<FeePayment | null> => {
    // TODO: PUT to API
    return null;
  },
  delete: async (id: string): Promise<boolean> => {
    // TODO: DELETE from API
    return false;
  },
  getStructures: async (): Promise<FeeStructure[]> => {
    // TODO: fetch from API
    return [];
  },
  getMonthlyCollections: async (): Promise<MonthlyCollection[]> => {
    // TODO: fetch from API
    return [];
  },
  getClassWiseDues: async (): Promise<ClassWiseDue[]> => {
    // TODO: fetch from API
    return [];
  },
};
