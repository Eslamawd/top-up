// src/components/admin/customization/UpdateServiceForm.jsx

import React, { useState, useEffect } from "react";
import { Button } from "../../ui/button";
import { Input } from "../../ui/Input";
import { Textarea } from "../../ui/textarea";
import { Label } from "../../ui/Label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../ui/tabs";
import { Separator } from "../../ui/Separator";
import { ImageIcon } from "lucide-react";
import { toast } from "sonner";
import { updateService } from "../../../lib/serviceApi.js";
import { getAllCat } from "../../../lib/categoryApi.js";
export default function UpdateServiceForm({ service, onSuccess, onCancel }) {
  // هنا نهيئ الحالة بقيم 'product' عند فتح المكوّن
  const [formData, setFormData] = useState({
    name: service?.name_ar || "",
    price: service?.price || 0,
    imageFile: null,
    description: service?.description || "",
    price_wholesale: service?.price_wholesale || 0,
    quantity: service?.quantity || 0,
    subscription: service?.subscription || false,
    imageUrl: service?.image || "",
    categoryId: service?.category.id || "",

  });
  
  const [categories, setCategories] = useState([]);
    
  const [selectedParent, setSelectedParent] = useState(null);
  const [selectedCategoryId, setSelectedCategoryId] = useState("");

  const [activeTab, setActiveTab] = useState("basic");
  const [isLoading, setIsLoading] = useState(false);
  const DEFAULT_IMAGE = "/images/default-image.png";

 
  useEffect(() => {
    const loadCategories = async () => {
      try {
        const data = await getAllCat();
        setCategories(data.categories || []);
      } catch (err) {
        console.error("Failed to load categories", err);
        toast.error("Failed to load categories");
      }
    };
    loadCategories();
  }, []);

  
  useEffect(() => {
    setFormData((prev) => ({
      ...prev,
      categoryId: selectedCategoryId,
    }));
  }, [selectedCategoryId]);
  
  
  const handleParentChange = (e) => {
    const parentId = e.target.value;
    setSelectedParent(parentId);
    setSelectedCategoryId(""); // reset subcategory selection
  };
  
  const getChildrenOf = (parentId) => {
    const parent = categories.find((cat) => cat.id == parentId);
    return parent?.children || [];
  };
  
  
  
  // 2) تغييرات الحقول النصية والأرقام
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };
  const handleNumberChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: parseFloat(value) || 0 }));
  };


  // 3) رفع الصورة (لو رغب المستخدم في تغييرها)
  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      setFormData((prev) => ({
        ...prev,
        imageFile: file,
        imageUrl: reader.result,
      }));
    };
    reader.readAsDataURL(file);
  };

  // 4) عند الضغط على "Update Service"
const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name.trim()) {
        toast.error("اسم الخدمة مطلوب");
        return;
    }
   

    setIsLoading(true);
    try {
        const payload = new FormData();
        payload.append("name_ar", formData.name);
        payload.append("price", formData.price);
        payload.append("description", formData.description);
        payload.append("price_wholesale", formData.price_wholesale);
        payload.append("quantity", formData.quantity);
        payload.append("subscription", formData.subscription ? "1" : "0");
        payload.append("category_id", formData.categoryId);
        payload.append("_method", "PATCH"); // Laravel expects this for updates
      if (formData.imageFile) {
            payload.append("image", formData.imageFile);
        }


        const res = await updateService(service.id, payload);
        
         if (res.product.name_ar && res.product.price) {
              toast.success("Created service successfully!");
              onSuccess && onSuccess(res.product);
             } else {
             // Handle cases where res.service might not be present but no error was thrown
            toast.warning("Service updated, but response was unexpected.");
        }
    } catch (err) {
        console.error("Error updating service:", err);
        // Improved error message for the user
        toast.error(`فشل في تحديث الخدمة: ${err.response?.data?.message || 'خطأ غير معروف'}`);
        // If it's a validation error, you might want to show specific messages
        if (err.response && err.response.status === 422) {
            Object.values(err.response.data.errors).forEach(messages => {
                messages.forEach(message => toast.error(message));
            });
        }
    } finally {
        setIsLoading(false);
    }
};

  return (
   <form onSubmit={handleSubmit} className="space-y-6 p-6 rounded-lg shadow">
         <Tabs value={activeTab} onValueChange={setActiveTab}>
           <TabsList className="grid grid-cols-2">
             <TabsTrigger value="basic">Basic Info</TabsTrigger>
             <TabsTrigger value="pricing">Pricing</TabsTrigger>
           </TabsList>
   
           <TabsContent value="basic" className="pt-4 space-y-4">
             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
               <div className="space-y-2">
                 <Label htmlFor="name">Product Name</Label>
                 <Input
                   id="name"
                   name="name"
                   type="text"
                   value={formData.name}
                   onChange={handleInputChange}
                   placeholder="Enter product name"
                   required
                 />
                  </div>
   
                                 {/* Parent Dropdown */}
                       <div className="space-y-2">
                         <Label>Selctet Or</Label>
                         <select
                           name="parent"
                           className="w-full border rounded p-2"
                           value={selectedParent || ""}
                           onChange={handleParentChange}
                         >
                           <option value="">{service.category.name_ar}</option>
                           {categories.map((cat) => (
                             <option key={cat.id} value={cat.id}>
                               {cat.name_ar}
                             </option>
                           ))}
                         </select>
                         </div>
   
                       {/* Children Dropdown */}
                       {selectedParent && getChildrenOf(selectedParent).length > 0 && (
                         <div className="space-y- 2">
                           <Label>Subcategory</Label>
                           <select
                             name="category_id"
                             className="w-full border rounded p-2 "
                             value={selectedCategoryId}
                             onChange={(e) => setSelectedCategoryId(e.target.value)}
                           >
                             <option value="">اختر تصنيف فرعي</option>
                             {getChildrenOf(selectedParent).map((child) => (
                               <option key={child.id} value={child.id}>
                                 {child.name_ar}
                               </option>
                             ))}
                           </select>
                         </div>
                       )}
   
                     </div>
   
                     <div className="space-y-2">
               <Label htmlFor="description">Description</Label>
               <Textarea
                 id="description"
                 name="description"
                 value={formData.description}
                 onChange={handleInputChange}
                 placeholder="Enter description"
               />
             </div>
                   <div className="flex items-center space-x-2">
                 <input
                   type="checkbox"
                   id="subescription"
                   name="subescription"
                   checked={formData.subscription}
                   onChange={(e) =>
                     setFormData((prev) => ({
                       ...prev,
                       subscription: e.target.checked,
                     }))
                   }
                 />
                 <Label htmlFor="subescription"> Can Add Subscription </Label>
   </div>
   
   
             <div className="space-y-2">
               <Label htmlFor="image">
                 <ImageIcon className="inline-block mr-1 h-5 w-5" />
                 Upload Image
               </Label>
               <input
                 id="image"
                 name="image"
                 type="file"
                 accept="image/*"
                 onChange={handleImageUpload}
               />
               {formData.imageUrl && (
                 <img
                   src={formData.imageUrl}
                   alt="Preview"
                   className="mt-2 w-24 h-24 object-cover border rounded"
                 />
               )}
             </div>
           </TabsContent>
   
           <TabsContent value="pricing" className="pt-4 space-y-4">
             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
               <div className="space-y-2">
                 <Label htmlFor="price">Price ($)</Label>
                 <Input
                   id="price"
                   name="price"
                   type="number"
                   value={formData.price}
                   onChange={handleNumberChange}
                   placeholder="0.00"
                 />
               </div>
               <div className="space-y-2">
                 <Label htmlFor="price">Price Wholesale ($)</Label>
                 <Input
                   id="price_wholesale"
                   name="price_wholesale"
                   type="number"
                   value={formData.price_wholesale}
                   onChange={handleNumberChange}
                   placeholder="0.00"
                 />
               </div>
   
               <div className="space-y-2">
                 <Label htmlFor="quantity">Quantity</Label>
                 <Input
                   id="quantity"
                   name="quantity"
                   type="number"
                   value={formData.quantity}
                   onChange={handleNumberChange}
                   placeholder="Enter quantity"
                 />
               </div>
             </div>
           </TabsContent>
         </Tabs>
   
         <Separator />
   
         <div className="flex justify-end space-x-2">
           <Button type="button" variant="outline" onClick={onCancel} disabled={isLoading}>
             Cancel
           </Button>
           <Button type="submit" disabled={isLoading}>
             {isLoading ? "Saving..." : "Update Product"}
           </Button>
         </div>
       </form>
  );
}
