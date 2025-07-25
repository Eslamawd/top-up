import api from "../api/axiosClient";

export async function newAccSub(accSub) {
  // لا حاجة لتمرير الـ id، Laravel سيولّد id تلقائيًا (بما أننا استخدمنا auto-increment)
  const response = await api().post("api/admin/account", accSub);
  return response.data;
}


export async function deleteAccSub(id) {
  // لا حاجة لتمرير الـ id، Laravel سيولّد id تلقائيًا (بما أننا استخدمنا auto-increment)
  const response = await api().delete(`api/admin/account/${id}`);
  return response.data;
}
export async function updateAccSub(id, formData) {
  // لا حاجة لتمرير الـ id، Laravel سيولّد id تلقائيًا (بما أننا استخدمنا auto-increment)
  const response = await api().put(`api/admin/account/${id}`, formData);
  return response.data;
}


