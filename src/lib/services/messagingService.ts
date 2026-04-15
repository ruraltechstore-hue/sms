import type { Announcement, GroupChat, Notification } from "@/lib/types";

// TODO: Replace with actual API calls
export const messagingService = {
  getAnnouncements: async (): Promise<Announcement[]> => {
    // TODO: fetch from API
    return [];
  },
  createAnnouncement: async (data: Partial<Announcement>): Promise<Announcement | null> => {
    // TODO: POST to API
    return null;
  },
  getGroupChats: async (): Promise<GroupChat[]> => {
    // TODO: fetch from API
    return [];
  },
  sendMessage: async (chatId: string, text: string): Promise<boolean> => {
    // TODO: POST to API
    return false;
  },
  getNotifications: async (): Promise<Notification[]> => {
    // TODO: fetch from API
    return [];
  },
  markAsRead: async (id: string): Promise<boolean> => {
    // TODO: PUT to API
    return false;
  },
  markAllRead: async (): Promise<boolean> => {
    // TODO: PUT to API
    return false;
  },
  deleteNotification: async (id: string): Promise<boolean> => {
    // TODO: DELETE from API
    return false;
  },
};
