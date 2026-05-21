export function useAuthToken() {
  const getToken = () => localStorage.getItem("token");
  const authHeader = () => ({ Authorization: `Bearer ${getToken()}` });
  return { getToken, authHeader };
}
