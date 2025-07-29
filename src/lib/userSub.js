import api from "../api/axiosClient";

export async function newUserSub(formData) {
  const response = await api().post("api/seals/user/sub", formData);

  return response.data;
}
export async function newSub(id, formData) {
  const response = await api().post(`api/seals/new/sub/${id}`, formData);

  return response.data;
}

export async function getUserSub(page) {
  const response = await api().get(`api/seals/user/sub?page=${page || 1}`);
  if (response.status !== 200) {
    throw new Error("Failed to fetch sup count");
  }
  // نفترض أنّ الـ response.data هو مصفوفة الخدمات
  return response.data;
}
export async function getAllUserSub() {
  const response = await api().get(`api/seals/all/user/sub`);
  if (response.status !== 200) {
    throw new Error("Failed to fetch sup count");
  }
  // نفترض أنّ الـ response.data هو مصفوفة الخدمات
  return response.data;
}
