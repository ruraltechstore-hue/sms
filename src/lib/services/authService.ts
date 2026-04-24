import { supabase } from "@/integrations/supabase/client";
import type { User, UserRole } from "@/lib/types";

/**
 * Auth service backed by Lovable Cloud (Supabase Auth + user_roles table).
 * The role is looked up from the public.user_roles table after sign-in.
 */
export const authService = {
  /**
   * Sign in with email/password and return a unified User object
   * (with the primary role pulled from user_roles).
   */
  login: async (email: string, password: string): Promise<User | null> => {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error || !data.user) return null;
    return await authService.buildUser(data.user.id, data.user.email ?? email, data.user.user_metadata);
  },

  /**
   * Sign up a new user. The chosen role is stored in user_roles after signup.
   * Note: when email confirmation is OFF, signUp returns a session immediately.
   */
  signup: async (
    email: string,
    password: string,
    name: string,
    role: UserRole
  ): Promise<User | null> => {
    const redirectUrl = `${window.location.origin}/`;
    // Pass `role` and `name` in user metadata so the `handle_new_user`
    // database trigger can create the user_roles row with elevated
    // privileges (SECURITY DEFINER) — this works whether or not a session
    // is returned synchronously (i.e. regardless of email-confirmation mode).
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: redirectUrl,
        data: { name, role },
      },
    });
    if (error || !data.user) return null;

    return await authService.buildUser(data.user.id, data.user.email ?? email, { name });
  },

  logout: async (): Promise<boolean> => {
    const { error } = await supabase.auth.signOut();
    return !error;
  },

  getCurrentUser: async (): Promise<User | null> => {
    const { data } = await supabase.auth.getSession();
    const sessionUser = data.session?.user;
    if (!sessionUser) return null;
    return await authService.buildUser(sessionUser.id, sessionUser.email ?? "", sessionUser.user_metadata);
  },

  requestPasswordReset: async (email: string): Promise<boolean> => {
    const redirectTo = `${window.location.origin}/reset-password`;
    const { error } = await supabase.auth.resetPasswordForEmail(email, { redirectTo });
    return !error;
  },

  resetPassword: async (_token: string, newPassword: string): Promise<boolean> => {
    // The recovery session is established automatically by Supabase when the user
    // arrives via the reset link, so we just call updateUser.
    const { error } = await supabase.auth.updateUser({ password: newPassword });
    return !error;
  },

  /**
   * Internal helper: assemble a User object by reading the primary role
   * from user_roles. Falls back to "student" if no role is assigned yet.
   */
  buildUser: async (
    id: string,
    email: string,
    metadata?: Record<string, unknown> | null
  ): Promise<User> => {
    const { data: roles } = await supabase
      .from("user_roles")
      .select("role")
      .eq("user_id", id)
      .limit(1);

    const role = (roles?.[0]?.role ?? "student") as UserRole;
    const name =
      (metadata?.name as string | undefined) ??
      (metadata?.full_name as string | undefined) ??
      email.split("@")[0];

    return { id, email, name, role };
  },
};
