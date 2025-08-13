import api from "../api/axiosClient";

export async function syncProductsApi(formData) {
  const response = await api().post("api/admin/sync-products", formData);
  return response.data;
}
export async function syncPercentageApi(formData) {
  const response = await api().post("api/admin/sync-percentage", formData);
  return response.data;
}
export async function addDiscount(formData) {
  const response = await api().post("api/admin/discount", formData);
  return response.data;
}
export async function getDiscount() {
  const response = await api().get("api/admin/discount");
  return response.data;
}
