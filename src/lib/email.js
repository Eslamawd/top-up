import api from "../api/axiosClient";

export async function verificationEmail(id, hash, query) {
  // لا حاجة لتمرير الـ id، Laravel سيولّد id تلقائيًا (بما أننا استخدمنا auto-increment)
  const response = await api().get(`/api/email/verify/${id}/${hash}${query}`);
  return response.data;
}

export async function sendVerificationEmail() {
  const response = await api().post(`/api/email/verification-notification`);
  return response.data;
}


export async function forgetPassword(formData) {
  // لا حاجة لتمرير الـ id، Laravel سيولّد id تلقائيًا (بما أننا استخدمنا auto-increment)
  const response = await api().post(`/api/forgot-password`, formData);
  return response.data;
}
export async function resetPassword(formData) {
  // لا حاجة لتمرير الـ id، Laravel سيولّد id تلقائيًا (بما أننا استخدمنا auto-increment)
  const response = await api().post(`/api/reset-password`, formData);
  return response.data;
}
