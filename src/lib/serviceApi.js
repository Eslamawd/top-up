// src/lib/serviceApi.js

import api from "../api/axiosClient";

/**
 * جلب كل الخدمات
 * GET /api/services
 */
export async function loadServices(page) {
  const response = await api().get(`api/product?page=${page || 1}`);
  // نفترض أنّ الـ response.data هو مصفوفة الخدمات
  return response.data;
}
export async function getServie(id) {
  const response = await api().get(`api/product/${id}`);
  // نفترض أنّ الـ response.data هو مصفوفة الخدمات
  return response.data;
}

/**
 * إنشاء خدمة جديدة
 * POST /api/services
 * @param serviceData: جسم الطلب بصيغة Service (object)
 */
export async function addProduct(serviceData) {
  // لا حاجة لتمرير الـ id، Laravel سيولّد id تلقائيًا (بما أننا استخدمنا auto-increment)


  const response = await api().post("api/admin/product", serviceData, {
    headers: {
      "Content-Type": "multipart/form-data", // إذا كنت تستخدم FormData
    },
  });
  return response.data;
}

/**
 * تحديث خدمة قائمة
 * PUT /api/services/{id}
 * @param serviceData: كائن الخدمة يحتوي على id وحقول أخرى محدثة
 */
export async function updateService(id, payload) {

  const response = await api().post(`api/admin/product/${id}`, payload, {
    headers: {
      "Content-Type": "multipart/form-data",
     },
  });
  return response.data;
}

/**
 * حذف خدمة
 * DELETE /api/services/{id}
 */
export async function deleteService(id) {
  const response = await api().delete(`api/admin/product/${id}`);
  return response.data;
}



export const getServicesByCategory = async (category) => {
  const response = await api().get(`/services?category=${category}`);
  return response.data.data;
};

// ✅ الحصول على الخدمات حسب الاسم
export const getServiceByName = async (name) => {
  const response = await api().get(`/services?search=${name}`);
  return response.data.data;
};