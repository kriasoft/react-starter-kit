export function haveAccess(user, id) {
  if (!user) return false;
  if (user.isAdmin) return true;
  if (!id) return true;
  const ids = Array.isArray(id) ? id : [id];
  return ids.includes(user.id);
}

export function haveRootAccess(user) {
  if (!user) return false;
  if (user.isAdmin) return true;
  return false;
}
