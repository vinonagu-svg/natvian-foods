export const hasPermission = (user, permission) => {
  // Not logged in
  if (!user) {
    return false;
  }

  // Owner and Superadmin have full access
  if (
    user.role === "owner" ||
    user.role === "superadmin"
  ) {
    return true;
  }

  // No permission requested
  if (!permission) {
    return true;
  }

  // User permissions
  const permissions = user.permissions || [];

  return permissions.includes(permission);
};