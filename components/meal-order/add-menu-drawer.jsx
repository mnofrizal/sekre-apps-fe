import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";

export function AddMenuDrawer({
  isEdit = false,
  initialData = null,
  onSave,
  children,
}) {
  const [name, setName] = useState("");
  const [category, setCategory] = useState("");
  const [isAvailable, setIsAvailable] = useState(true);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (initialData) {
      setName(initialData.name);
      setCategory(initialData.category);
      setIsAvailable(initialData.isAvailable);
    }
  }, [initialData]);

  const handleSubmit = (event) => {
    event.preventDefault();
    const menuItem = { id: initialData?.id, name, category, isAvailable };
    onSave(menuItem);
    setIsOpen(false);
    if (!isEdit) {
      // Reset form fields only for new items
      setName("");
      setCategory("");
      setIsAvailable(true);
    }
  };

  return (
    <Drawer open={isOpen} onOpenChange={setIsOpen}>
      <DrawerTrigger asChild>
        {isEdit ? (
          <div className="h-full w-full cursor-pointer">{children}</div>
        ) : (
          <Button
            className="h-12 w-full rounded-xl bg-[#0f172a] text-white hover:bg-[#1e293b]"
            size="lg"
          >
            Add Menu
          </Button>
        )}
      </DrawerTrigger>
      <DrawerContent>
        <div className="mx-auto w-full max-w-sm">
          <DrawerHeader>
            <DrawerTitle>
              {isEdit ? "Edit Menu Item" : "Add New Menu Item"}
            </DrawerTitle>
            <DrawerDescription>
              {isEdit
                ? "Update the details of the menu item."
                : "Fill in the details for the new menu item."}
            </DrawerDescription>
          </DrawerHeader>
          <form onSubmit={handleSubmit} className="p-4 pb-0">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  placeholder="Enter menu item name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="category">Category</Label>
                <Select value={category} onValueChange={setCategory} required>
                  <SelectTrigger id="category">
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Makan Berat">Makan Berat</SelectItem>
                    <SelectItem value="Snack">Snack</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex items-center space-x-2">
                <Switch
                  id="isAvailable"
                  checked={isAvailable}
                  onCheckedChange={setIsAvailable}
                />
                <Label htmlFor="isAvailable">Available</Label>
              </div>
            </div>
          </form>
          <DrawerFooter>
            <Button type="submit" onClick={handleSubmit}>
              {isEdit ? "Update Item" : "Add Item"}
            </Button>
            <DrawerClose asChild>
              <Button variant="outline">Cancel</Button>
            </DrawerClose>
          </DrawerFooter>
        </div>
      </DrawerContent>
    </Drawer>
  );
}
