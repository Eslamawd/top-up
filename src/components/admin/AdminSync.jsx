import React, { useState } from "react";
import { Label } from "../ui/Label";
import { Input } from "../ui/Input";
import { Button } from "../ui/button";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { syncProductsApi } from "../../lib/asyncApi";
import { Separator } from "../ui/Separator";

function AdminSync() {
  const [formData, setFormData] = useState({
    percentage: 1,
    percentage_seals: 1,
  });
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.percentage.trim() || !formData.percentage_seals.trim()) {
      toast.error("Please Add Your Percentage & Percentage Seals ");
      return;
    }

    setIsLoading(true);
    try {
      const res = await syncProductsApi(formData);
      if (res && res.category) {
        toast.success(`${res.message}`);

        navigate("/admin/sync");
      }
    } catch (err) {
      console.error("Error creating category:", err);
      toast.error("error in server");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Sync Servecies 3beCard </h2>
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

export default AdminSync;
