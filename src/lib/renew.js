import api from "../api/axiosClient";

export async function renewSubscription(payload) {
  // لا حاجة لتمرير الـ id، Laravel سيولّد id تلقائيًا (بما أننا استخدمنا auto-increment)

  const response = await api().post("api/renew", payload);
  return response.data;
}
export async function getRenewsByAdmin(page) {
  // لا حاجة لتمرير الـ id، Laravel سيولّد id تلقائيًا (بما أننا استخدمنا auto-increment)

  const response = await api().get(`api/admin/renew?page=${page || 1}`);
  return response.data;
}
