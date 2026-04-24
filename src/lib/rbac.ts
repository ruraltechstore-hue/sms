import type { UserRole } from "@/lib/types";

/**
 * RBAC route permissions — single source of truth for which roles
 * can access each protected route. Mirrors the sidebar nav and
 * the database RLS policies so the three layers stay aligned.
 *
 * Strict per-role scoping (no shared "admin bundle") — each role only
 * sees the modules it actually needs to do its job.
 *
 * If a route is not listed here, it is treated as "any authenticated user".
 */

const ALL_ADMINS: UserRole[] = ["principal", "sms_admin"];
const ALL_TEACHING: UserRole[] = ["teacher", "class_teacher"];

export const ROUTE_PERMISSIONS: Record<string, UserRole[]> = {
  // Dedicated dashboards — one per role
  "/dashboard/principal":         ["principal"],
  "/dashboard/admin":             ["sms_admin"],
  "/dashboard/front-desk":        ["front_desk"],
  "/dashboard/teacher":           ["teacher"],
  "/dashboard/class-teacher":     ["class_teacher"],
  "/dashboard/exam-coordinator":  ["exam_coordinator"],
  "/dashboard/transport":         ["transport_manager"],
  "/dashboard/librarian":         ["librarian"],
  "/dashboard/hostel":            ["hostel_warden"],
  "/dashboard/student":           ["student"],
  "/dashboard/parent":            ["parent"],

  // Modules — strictly scoped per real-world responsibility
  "/admissions":   [...ALL_ADMINS, "front_desk", "class_teacher"],
  "/attendance":   [...ALL_ADMINS, ...ALL_TEACHING, "student"],
  "/exams":        [...ALL_ADMINS, ...ALL_TEACHING, "exam_coordinator", "student"],
  "/fees":         [...ALL_ADMINS, "student", "parent"],
  "/staff":        [...ALL_ADMINS],
  "/messaging":    [
    ...ALL_ADMINS,
    "front_desk",
    ...ALL_TEACHING,
    "exam_coordinator",
    "parent",
  ],
  "/parent-portal":[...ALL_ADMINS, "parent"],
  "/transport":    [...ALL_ADMINS, "transport_manager"],
  "/library":      [...ALL_ADMINS, "librarian"],
  "/hostel":       [...ALL_ADMINS, "hostel_warden"],
  "/settings":     [...ALL_ADMINS],
};

/**
 * Read-only roles: cannot create / update / delete anything.
 */
export const READ_ONLY_ROLES: ReadonlySet<UserRole> = new Set(["student", "parent"]);

export function isReadOnlyRole(role: UserRole): boolean {
  return READ_ONLY_ROLES.has(role);
}

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
