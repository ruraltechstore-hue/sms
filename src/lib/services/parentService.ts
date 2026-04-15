import type { ChildProfile, ParentMessage } from "@/lib/types";

// TODO: Replace with actual API calls
export const parentService = {
  getChildren: async (): Promise<ChildProfile[]> => {
    // TODO: fetch from API
    return [];
  },
  getChildById: async (id: string): Promise<ChildProfile | null> => {
    // TODO: fetch from API
    return null;
  },
  getMessages: async (): Promise<ParentMessage[]> => {
    // TODO: fetch from API
    return [];
  },
  sendMessage: async (data: Partial<ParentMessage>): Promise<boolean> => {
    // TODO: POST to API
    return false;
  },
};
