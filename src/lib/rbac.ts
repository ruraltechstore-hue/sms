import type { UserRole } from "@/lib/types";

/**
 * RBAC route permissions — single source of truth for which roles
 * can access each protected route. Mirrors the sidebar nav and
 * the database RLS policies so the three layers stay aligned.
 *
 * If a route is not listed here, it is treated as "any authenticated user".
 */

const ALL_ADMINS: UserRole[] = ["principal", "sms_admin"];
const ALL_TEACHING: UserRole[] = ["teacher", "class_teacher"];

export const ROUTE_PERMISSIONS: Record<string, UserRole[]> = {
  // Admin-style dashboard — accessible to every staff role that
  // gets routed there (Principal, SMS Admin, Front Desk, Exam Coord, etc.)
  "/dashboard/admin": [
    ...ALL_ADMINS,
    "front_desk",
    "exam_coordinator",
    "transport_manager",
    "librarian",
    "hostel_warden",
  ],
  "/dashboard/teacher": ALL_TEACHING,
  "/dashboard/student": ["student"],
  "/dashboard/parent": ["parent"],

  // Modules
  "/admissions": [...ALL_ADMINS, "front_desk", "class_teacher"],
  "/attendance": [...ALL_ADMINS, ...ALL_TEACHING, "student"],
  "/fees": [...ALL_ADMINS],
  "/messaging": [
    ...ALL_ADMINS,
    "front_desk",
    ...ALL_TEACHING,
    "exam_coordinator",
    "transport_manager",
    "librarian",
    "hostel_warden",
    "parent",
  ],
  "/exams": [...ALL_ADMINS, ...ALL_TEACHING, "exam_coordinator", "student"],
  "/staff": [...ALL_ADMINS],
  "/parent-portal": [...ALL_ADMINS, "parent"],
  "/settings": [
    ...ALL_ADMINS,
    "transport_manager",
    "librarian",
    "hostel_warden",
  ],
};

/**
 * Returns the list of roles allowed to view the given path,
 * or null if the path has no role restriction (any authed user).
 */
export function getAllowedRoles(path: string): UserRole[] | null {
  return ROUTE_PERMISSIONS[path] ?? null;
}

/**
 * True if the given role can access the given path.
 * Returns true for unrestricted authenticated routes.
 */
export function canAccessRoute(role: UserRole, path: string): boolean {
  const allowed = getAllowedRoles(path);
  if (!allowed) return true;
  return allowed.includes(role);
}
