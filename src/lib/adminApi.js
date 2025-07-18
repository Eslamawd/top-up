// src/lib/serviceApi.js

import api from "../api/axiosClient";


export async function loadAllUsersCount() {
  const response = await api().get("api/admin/user/count");
  if (response.status !== 200) {
    throw new Error("Failed to fetch users count");
  }
  // نفترض أنّ الـ response.data هو مصفوفة الخدمات
  return response.data;
}


export async function loadAllUsers() {
  const response = await api().get("api/admin/users");
  if (response.status !== 200) {
    throw new Error("Failed to fetch users");
  }
  // نفترض أنّ الـ response.data هو مصفوفة الخدمات
  return response.data;
}

export async function getAllOrdersCount() {
  const response = await api().get("api/admin/order/count")
  if (response.status !== 200) {
    throw new Error("Failed to fetch order count");
  }
  return response.data;
}

export async function getAllOrders(page) {
  const response = await api().get(`api/admin/all-order?page=${page}`);
   if (response.status !== 200) {
    throw new Error("Failed to delete user");
  }
  return response.data;
}
export async function getRevnueCount() {
  const response = await api().get("api/admin/revnue/count")
   if (response.status !== 200) {
    throw new Error("Failed to delete user");
  }
  return response.data;
}
export async function deleteUser(id) {
  const response = await api().delete(`api/admin/users/${id}`);
  if (response.status !== 200) {
    throw new Error("Failed to delete user");
  }
  return response.data;
}

export async function changeRole(id, role) {
  await api().get('/sanctum/csrf-cookie');
  const response = await api().post(`api/admin/users/${id}/change-role`, role);
  if (response.status !== 200) {
    throw new Error("Failed to update user");
  }
  return response.data;
}

export async function updateUser (id, user) {

    const response = await api().put(`api/admin/users/${id}`, user);
  if (response.status !== 200) {
    throw new Error("Failed to update user");
  }
  return response.data;

}

