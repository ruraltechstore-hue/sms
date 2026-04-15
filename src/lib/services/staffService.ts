import type { StaffMember, LeaveRecord, Department } from "@/lib/types";

// TODO: Replace with actual API calls
export const staffService = {
  getAll: async (): Promise<StaffMember[]> => {
    // TODO: fetch from API
    return [];
  },
  getById: async (id: string): Promise<StaffMember | null> => {
    // TODO: fetch from API
    return null;
  },
  create: async (data: Partial<StaffMember>): Promise<StaffMember | null> => {
    // TODO: POST to API
    return null;
  },
  update: async (id: string, data: Partial<StaffMember>): Promise<StaffMember | null> => {
    // TODO: PUT to API
    return null;
  },
  delete: async (id: string): Promise<boolean> => {
    // TODO: DELETE from API
    return false;
  },
  getDepartments: async (): Promise<Department[]> => {
    // TODO: fetch from API
    return [];
  },
  getLeaveRecords: async (): Promise<LeaveRecord[]> => {
    // TODO: fetch from API
    return [];
  },
  approveLeave: async (id: string): Promise<boolean> => {
    // TODO: PUT to API
    return false;
  },
  rejectLeave: async (id: string): Promise<boolean> => {
    // TODO: PUT to API
    return false;
  },
};
