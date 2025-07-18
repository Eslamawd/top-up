import api from "../api/axiosClient";

export async function addNewPay(formData) {
  
  
  const response = await api().post(`api/payment/`, formData);
  return response.data;
}




export async function loadPaymentByUser() {
  const response = await api().get(`api/payment`);
  // نفترض أنّ الـ response.data هو مصفوفة الخدمات
  return response.data;
}




export async function loadPayments(page) {
  const response = await api().get(`api/admin/payment?page=${page || 1}`);
  // نفترض أنّ الـ response.data هو مصفوفة الخدمات
  return response.data;
}


export async function addPaymentBalance(id) {
  const response = await api().post(`api/admin/payment/${id}`);
  // نفترض أنّ الـ response.data هو مصفوفة الخدمات
  return response.data;
}
