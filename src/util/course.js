/* eslint-disable import/prefer-default-export */

export function getRole({ users } = { users: [] }, user) {
  return (users.find(u => u.id === user.id) || {}).role;
}
