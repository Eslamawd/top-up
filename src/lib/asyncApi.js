import api from "../api/axiosClient";

export async function syncProductsApi(formData) {
  // لا حاجة لتمرير الـ id، Laravel سيولّد id تلقائيًا (بما أننا استخدمنا auto-increment)

  const response = await api().post("api/admin/sync-products", formData);
  return response.data;
}
