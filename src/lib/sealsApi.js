import api from "../api/axiosClient";

export async function loadAllSupCount() {
  const response = await api().get("api/seals/sup/count");
  if (response.status !== 200) {
    throw new Error("Failed to fetch sup count");
  }
  // نفترض أنّ الـ response.data هو مصفوفة الخدمات
  return response.data;
}


export async function getRevnueSealsCount() {
  const response = await api().get("api/seals/revnue/count")
   if (response.status !== 200) {
    throw new Error("Failed to Revnue Seal");
  }
  return response.data;
}

export async function getAllOrdersSealsCount() {
  const response = await api().get("api/seals/order/count")
  if (response.status !== 200) {
    throw new Error("Failed to fetch order count");
  }
  return response.data;
}
