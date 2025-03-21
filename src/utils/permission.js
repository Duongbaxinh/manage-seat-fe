export const ROLES = {
  SUPERUSER: "SUPERUSER",
  LANDLORD: "LANDLORD",
  USER: "USER",
};

export const ROLE_PERMISSIONS = {
  SUPERUSER: ["all"],
  LANDLORD: ["delete:seat", "update:seat", "add:seat", "view:seat"],
  USER: ["view:seat"],
};

export const permission = (user, hasRole, owner = null) => {
  const permissions = ROLE_PERMISSIONS[user.role] || [];
  if (permissions.includes("all")) return true;
  console.log("owner", owner?.id, "user", user.id);
  console.log("owner", owner?.id === user?.id);
  if (owner) {
    return user.id === owner.id;
  }

  return permissions.includes(hasRole);
};
