import apiClient, { ENDPOINTS } from "./apiClient";

/* ================================
   GET ALL ROLES
================================ */
export const getRoles = async () => {
  const response = await apiClient.get(ENDPOINTS.GET_ROLES);
  return response.data;
};

/* ================================
   GET DELETED ROLES
================================ */
export const getDeletedRoles = async () => {
  const response = await apiClient.get(ENDPOINTS.GET_DELETED_ROLES);
  return response.data;
};

/* ================================
   CREATE ROLE
================================ */
export const createRole = async (data: any) => {
  const response = await apiClient.post(
    ENDPOINTS.CREATE_ROLE,
    data
  );
  return response.data;
};

/* ================================
   UPDATE ROLE
================================ */
export const updateRole = async (id: string, data: any) => {
  const response = await apiClient.patch(
    `${ENDPOINTS.UPDATE_ROLE}/${id}`,
    data
  );
  return response.data;
};

/* ================================
   SOFT DELETE ROLE
================================ */
export const deleteRole = async (id: string) => {
  const response = await apiClient.delete(
    `${ENDPOINTS.DELETE_ROLE}/${id}`
  );
  return response.data;
};

/* ================================
   RESTORE ROLE
================================ */
export const restoreRole = async (id: string) => {
  const response = await apiClient.post(
    `${ENDPOINTS.RESTORE_ROLE}/${id}`
  );
  return response.data;
};

/* ================================
   FORCE DELETE ROLE
================================ */
export const forceDeleteRole = async (id: string) => {
  const response = await apiClient.delete(
    `${ENDPOINTS.FORCE_DELETE_ROLE}/${id}`
  );
  return response.data;
};