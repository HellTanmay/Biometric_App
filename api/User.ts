// import apiClient, { ENDPOINTS } from "./apiClient";

// // GET USERS
// export async function getUsers() {
//   const response = await apiClient.get(ENDPOINTS.GET_USERS);
//   return response.data;
// }

// // CREATE USER
// export async function createUser(data: any) {
//   const response = await apiClient.post(ENDPOINTS.CREATE_USER, data);
//   return response.data;
// }

// // UPDATE USER
// export async function updateUser(id: string, data: any) {
//   const response = await apiClient.patch(`${ENDPOINTS.UPDATE_USER}/${id}`, data);
//   return response.data;
// }

// // DELETE USER (soft delete)
// export async function deleteUser(id: string) {
//   const response = await apiClient.delete(`${ENDPOINTS.DELETE_USER}/${id}`);
//   return response.data;
// }

// // RESTORE USER
// export async function restoreUser(id: string) {
//   const response = await apiClient.post(`${ENDPOINTS.RESTORE_USER}/${id}`);
//   return response.data;
// }

// // FORCE DELETE USER
// export async function forceDeleteUser(id: string) {
//   const response = await apiClient.delete(`${ENDPOINTS.FORCE_DELETE_USER}/${id}`);
//   return response.data;
// }


import apiClient, { ENDPOINTS } from "./apiClient";

// GET USERS
export async function getUsers() {
  const response = await apiClient.get(ENDPOINTS.GET_USERS);
  return response.data;
}

// CREATE USER
export async function createUser(data: any) {
  const response = await apiClient.post(ENDPOINTS.CREATE_USER, data);
  return response.data;
}

// UPDATE USER
export async function updateUser(id: string, data: any) {
  const response = await apiClient.patch(`${ENDPOINTS.UPDATE_USER}/${id}`, data);
  return response.data;
}

// DELETE USER
export async function deleteUser(id: string) {
  const response = await apiClient.delete(`${ENDPOINTS.DELETE_USER}/${id}`);
  return response.data;
}

// RESTORE USER
export async function restoreUser(id: string) {
  const response = await apiClient.post(`${ENDPOINTS.RESTORE_USER}/${id}`);
  return response.data;
}

// FORCE DELETE USER
export async function forceDeleteUser(id: string) {
  const response = await apiClient.delete(`${ENDPOINTS.FORCE_DELETE_USER}/${id}`);
  return response.data;
}
export async function getDeletedUsers() {
  const response = await apiClient.get(ENDPOINTS.GET_DELETED_USERS);
  return response.data;
}