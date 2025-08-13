import React, { useEffect, useState } from "react";
import { Label } from "../ui/Label";
import { Input } from "../ui/Input";
import { Button } from "../ui/button";
import { toast } from "sonner";
import { syncPercentageApi } from "../../lib/asyncApi";
import { Separator } from "../ui/Separator";
import { getAllChildren } from "../../lib/categoryApi";

function AdminPercentage() {
  const [formData, setFormData] = useState({
    percentage: 1,
    percentage_seals: 1,
    category_id: "",
  });

  const [category, setCategory] = useState([]);

  const [isLoading, setIsLoading] = useState(false);
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      !formData.percentage ||
      !formData.percentage_seals ||
      !formData.category_id
    ) {
      toast.error("Please Add Your Percentage & Percentage Seals & Category ");
      return;
    }

    setIsLoading(true);
    try {
      const res = await syncPercentageApi(formData);
      if (res && res.message) {
        toast.success(`${res.message}`);
      }
    } catch (err) {
      console.error("Error creating category:", err);
      toast.error("error in server");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [categoriesRes] = await Promise.all([getAllChildren()]);

        if (categoriesRes && Array.isArray(categoriesRes.categories)) {
          setCategory(categoriesRes.categories);
        } else {
          // Handle case where servicesData.services is not an array
          setCategory([]);
          toast.warning("No services found from the API.");
        }
      } catch (err) {
        toast.error("Failed to load services.");
      }
    };

    fetchData();
    window.scrollTo(0, 0);
  }, []); // Empty dependency array means this runs once on mount

  const renderCategoryOptions = (categories, prefix = "") => {
    return categories.map((cat) => (
      <React.Fragment key={cat.id}>
        <option value={cat.id}>
          {prefix} {cat.name_en}
        </option>
        {cat.children_recursive?.length > 0 &&
          renderCategoryOptions(cat.children_recursive, prefix + "--")}
      </React.Fragment>
    ));
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold"> Percentage By Category </h2>
      </div>

      <div className="relative flex-grow mb-4">
        <form
          onSubmit={handleSubmit}
          className="space-y-6 p-6  rounded-lg shadow "
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="percentage">Percentage</Label>
              <Input
                id="percentage"
                name="percentage"
                type="number"
                max="100"
                min="1"
                value={formData.percentage}
                onChange={handleInputChange}
                placeholder="Example: 1 to 100"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="percentage_seals">Percentage_seals</Label>
              <Input
                id="percentage_seals"
                name="percentage_seals"
                type="number"
                max="100"
                min="1"
                value={formData.percentage_seals}
                onChange={handleInputChange}
                placeholder="Example: 1 to 100"
                required
              />
            </div>

            <div className="space-y-2">
              <Label>Category</Label>
              <select
                name="category_id"
                className="w-full border rounded p-2"
                value={formData.category_id}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    category_id: e.target.value,
                  }))
                }
              >
                <option value=""> Category</option>
                {renderCategoryOptions(category)}
              </select>
            </div>
          </div>

          <Separator />

          <div className="flex justify-end space-x-2">
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Saving..." : "Sync Product"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default AdminPercentage;
