import api from "../api/axiosClient";

export async function getBalanceUser() {
  const response = await api().get('api/wallet/balance')
   if (response.status !== 200) {
    throw new Error("Failed to delete user");
  }
  return response.data;
}


export async function getBalanceAdmin() {
  const response = await api().get('api/admin/zddk/balance')
   if (response.status !== 200) {
    throw new Error("Failed to delete user");
  }
  return response.data;
}

export async function depositBalance(id, amount, balanceAction) {

  const response = await api().post(`api/admin/wallet/${balanceAction}/${id}`, amount)
   if (response.status !== 200) {
    throw new Error("Failed to delete user");
  }
  return response.data;
}