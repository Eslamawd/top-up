import React, { useEffect, useState } from "react";
import { Label } from "../ui/Label";
import { Input } from "../ui/Input";
import { Button } from "../ui/button";
import { toast } from "sonner";
import { addDiscount, getDiscount } from "../../lib/asyncApi";
import { Separator } from "../ui/Separator";

function AdminDiscount() {
  const [discount, setDiscount] = useState({});
  const [formData, setFormData] = useState({
    price_percentage_user: 1,
    price_percentage_seals: 1,
    user_spend_threshold: 1,
    seals_spend_threshold: 1,
  });

  const [isLoading, setIsLoading] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.price_percentage_user || !formData.price_percentage_seals) {
      toast.error("Please Add Your Price Percentage User &  Seals ");
      return;
    }
    if (!formData.user_spend_threshold || !formData.seals_spend_threshold) {
      toast.error("Please Add Your Spend Threshold User & Seals  ");
      return;
    }

    setIsLoading(true);
    try {
      const res = await addDiscount(formData);
      if (res && res.message && res.discount) {
        setDiscount(res.discount);
        setFormData({
          price_percentage_user: res.discount.price_percentage_user || 1,
          price_percentage_seals: res.discount.price_percentage_seals || 1,
          user_spend_threshold: res.discount.user_spend_threshold || 1,
          seals_spend_threshold: res.discount.seals_spend_threshold || 1,
        });
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
        const discountRes = await getDiscount();

        if (discountRes && discountRes.discount) {
          setDiscount(discountRes.discount);
          setFormData({
            price_percentage_user:
              discountRes.discount.price_percentage_user || 1,
            price_percentage_seals:
              discountRes.discount.price_percentage_seals || 1,
            user_spend_threshold:
              discountRes.discount.user_spend_threshold || 1,
            seals_spend_threshold:
              discountRes.discount.seals_spend_threshold || 1,
          });
        } else {
          setDiscount({});
          toast.warning("No discount data found.");
        }
      } catch (err) {
        toast.error("Failed to load discount data.");
      }
    };

    fetchData();
    window.scrollTo(0, 0);
  }, []);

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
              <Label htmlFor="user_spend_threshold">User Spend Threshold</Label>
              <Input
                id="user_spend_threshold"
                name="user_spend_threshold"
                type="number"
                min="1"
                value={formData.user_spend_threshold}
                onChange={handleInputChange}
                placeholder="Example: 1 to 50000"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="seals_spend_threshold">
                Seals Spend Threshold
              </Label>
              <Input
                id="seals_spend_threshold"
                name="seals_spend_threshold"
                type="number"
                min="1"
                value={formData.seals_spend_threshold}
                onChange={handleInputChange}
                placeholder="Example: 1 to 5000"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="price_percentage_user">Percentage User</Label>
              <Input
                id="price_percentage_user"
                name="price_percentage_user"
                type="number"
                max="100"
                min="1"
                value={formData.price_percentage_user}
                onChange={handleInputChange}
                placeholder="Example: 1 to 100"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="price_percentage_seals">Percentage Seals</Label>
              <Input
                id="price_percentage_seals"
                name="price_percentage_seals"
                type="number"
                max="100"
                min="1"
                value={formData.price_percentage_seals}
                onChange={handleInputChange}
                placeholder="Example: 1 to 100"
                required
              />
            </div>
          </div>

          <Separator />

          <div className="flex justify-end space-x-2">
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Saving..." : " Discount"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default AdminDiscount;
