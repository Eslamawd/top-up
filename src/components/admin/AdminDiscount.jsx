import React, { useEffect, useState } from "react";
import { Label } from "../ui/Label";
import { Input } from "../ui/Input";
import { Button } from "../ui/button";
import { toast } from "sonner";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "../ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "../ui/Dialog";

import { getAllChildren } from "../../lib/categoryApi";
import { addDiscount, getDiscount } from "../../lib/asyncApi";
import { Separator } from "../ui/Separator";

function AdminDiscount() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [formData, setFormData] = useState({
    price_percentage_user: 0,
    price_percentage_seals: 0,
    category_id: "",
    user_spend_threshold: 0,
    seals_spend_threshold: 0,
  });

  const [category, setCategory] = useState([]);
  const [discounts, setDiscounts] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [lastPage, setLastPage] = useState(1);
  const [total, setTotal] = useState(0);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.price_percentage_user || !formData.price_percentage_seals) {
      toast.error("Please Add Your Price Percentage User &  Retailers ");
      return;
    }
    if (!formData.user_spend_threshold || !formData.seals_spend_threshold) {
      toast.error("Please Add Your Spend Threshold User & Retailers  ");
      return;
    }

    setIsLoading(true);
    try {
      const res = await addDiscount(formData);
      if (res && res.message && res.discount) {
        discounts.find((d) => d.id === res.discount.id)
          ? setDiscounts((prev) =>
              prev.map((d) => (d.id === res.discount.id ? res.discount : d))
            )
          : setDiscounts((prev) => [...prev, res.discount]);
        toast.success(`${res.message}`);
        setIsDialogOpen(false);
        setFormData({
          price_percentage_user: 0,
          price_percentage_seals: 0,
          category_id: "",
          user_spend_threshold: 0,
          seals_spend_threshold: 0,
        });
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
        const [categoriesRes, discountsRes] = await Promise.all([
          getAllChildren(),
          getDiscount(),
        ]);

        if (categoriesRes && Array.isArray(categoriesRes.categories)) {
          setCategory(categoriesRes.categories);
        } else {
          // Handle case where servicesData.services is not an array
          setCategory([]);
          toast.warning("No services found from the API.");
        }
        if (discountsRes && discountsRes.discount.data) {
          setDiscounts(discountsRes.discount.data);
          setCurrentPage(discountsRes.discount.current_page);
          setLastPage(discountsRes.discount.last_page);
          setTotal(discountsRes.discount.total);
        } else {
          setDiscounts([]);
          toast.warning("No discounts found from the API.");
        }
      } catch (err) {
        toast.error("Failed to load services.");
      }
    };

    fetchData();
    window.scrollTo(0, 0);
  }, [currentPage]);

  const handleEdit = (discount) => {
    setFormData({
      id: discount.id,
      price_percentage_user: discount.price_percentage_user,
      price_percentage_seals: discount.price_percentage_seals,
      category_id: discount.category.id,
      user_spend_threshold: discount.user_spend_threshold,
      seals_spend_threshold: discount.seals_spend_threshold,
    });
    setIsDialogOpen(true);
  };

  const renderCategoryOptions = (categories, prefix = "") => {
    return categories.map((cat) => (
      <React.Fragment key={cat.id}>
        <option value={cat.id}>
          {prefix} {cat.name_en}
        </option>
        {cat.children_recursive?.length > 0 &&
          renderCategoryOptions(cat.children_recursive, prefix + "-----")}
      </React.Fragment>
    ));
  };

  return (
    <>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold">
            Discount Any Category User Or Retailers{" "}
          </h2>
        </div>
        <Button onClick={() => setIsDialogOpen(true)}>Add Discount</Button>
        <div className="grid grid-cols-1   gap-4">
          <Table className="w-full">
            <TableHeader>
              <TableRow>
                <TableHead>Percentage User</TableHead>
                <TableHead>Percentage Retailers</TableHead>
                <TableHead>Spend Threshold User</TableHead>
                <TableHead>Spend Threshold Retailers</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {discounts.map((desc) => (
                <TableRow key={desc.id}>
                  <TableCell>{desc.price_percentage_user}%</TableCell>
                  <TableCell>{desc.price_percentage_seals}%</TableCell>
                  <TableCell>{desc.user_spend_threshold}</TableCell>
                  <TableCell>{desc.seals_spend_threshold}</TableCell>
                  <TableCell>{desc.category.name_en}</TableCell>
                  <TableCell>
                    <Button onClick={() => handleEdit(desc)}>Edit</Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          <div className="flex justify-center items-center gap-4 mt-6">
            <Button
              disabled={currentPage === 1}
              onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
            >
              Previous
            </Button>
            <span className="text-sm text-muted-foreground">
              Page {currentPage} of {lastPage} — Total: {total} renews
            </span>
            <Button
              disabled={currentPage === lastPage}
              onClick={() =>
                setCurrentPage((prev) => Math.min(lastPage, prev + 1))
              }
            >
              Next
            </Button>
          </div>
        </div>
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="bg-white">
          <DialogHeader>
            <DialogTitle>
              {formData.id ? "Update Category" : "Create Category"}
            </DialogTitle>
          </DialogHeader>

          <form
            onSubmit={handleSubmit}
            className="space-y-6 p-6 rounded-lg shadow "
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="user_spend_threshold">
                  User Spend Threshold
                </Label>
                <Input
                  id="user_spend_threshold"
                  name="user_spend_threshold"
                  min="1"
                  value={formData.user_spend_threshold}
                  onChange={handleInputChange}
                  placeholder="Example: 1 to 50000"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="seals_spend_threshold">
                  Retailers Spend Threshold
                </Label>
                <Input
                  id="seals_spend_threshold"
                  name="seals_spend_threshold"
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
                  max="100"
                  min="1"
                  value={formData.price_percentage_user}
                  onChange={handleInputChange}
                  placeholder="Example: 1 to 100"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="price_percentage_seals">
                  Percentage Retailers
                </Label>
                <Input
                  id="price_percentage_seals"
                  name="price_percentage_seals"
                  max="100"
                  min="1"
                  value={formData.price_percentage_seals}
                  onChange={handleInputChange}
                  placeholder="Example: 1 to 100"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label>Category</Label>
                <select
                  name="category_id"
                  className="w-full border t rounded p-2"
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
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsDialogOpen(false)}
                disabled={isLoading}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading
                  ? "Saving..."
                  : formData.id
                  ? "Update Discount"
                  : "Create Discount"}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}

export default AdminDiscount;
