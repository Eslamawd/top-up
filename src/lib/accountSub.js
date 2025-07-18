import api from "../api/axiosClient";

export async function newAccSub(accSub) {
  // لا حاجة لتمرير الـ id، Laravel سيولّد id تلقائيًا (بما أننا استخدمنا auto-increment)


  const response = await api().post("api/admin/account", accSub);
  return response.data;
}


