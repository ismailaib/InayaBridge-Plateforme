'use client';

import { Category, getCategoriesByTenant } from '@/api/pharmacie/categories';
import { createMedicament } from '@/api/pharmacie/medicaments';
import { Button } from '@/components/Button';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/Dialog';
import { Divider } from '@/components/Divider';
import { Input } from '@/components/Input';
import { Label } from '@/components/Label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/Select';
import { RiCapsuleFill, RiCloseLine } from '@remixicon/react';
import { BriefcaseMedical } from 'lucide-react';
import { useEffect, useState } from 'react';

interface AddMedicamentFormProps {
  tenantId: string;
  onSuccess?: () => void;
}

export default function AddMedicamentForm({
  tenantId,
  onSuccess,
}: AddMedicamentFormProps) {
  const [open, setOpen] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    dosage: '',
    form: '',
    manufacturer: '',
    categoryId: '',
    price: '',
    stockQuantity: '',
    minimumStock: '',
    status: 'ACTIVE',
  });

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const { data } = await getCategoriesByTenant(tenantId);
        setCategories(data || []);
      } catch (error) {
        console.error('Failed to fetch categories:', error);
      }
    };

    fetchCategories();
  }, [tenantId]);

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const newMedicament = {
      tenantId,
      name: formData.name,
      description: formData.description || undefined,
      dosage: formData.dosage || undefined,
      form: formData.form || undefined,
      manufacturer: formData.manufacturer || undefined,
      categoryId: formData.categoryId,
      price: parseFloat(formData.price),
      stockQuantity: parseInt(formData.stockQuantity),
      minimumStock: parseInt(formData.minimumStock),
      status: formData.status,
    };

    try {
      const res = await createMedicament(newMedicament);
      console.log('Medicament created:', res);
      setOpen(false);
      if (onSuccess) onSuccess();

    } catch (error) {
      console.error('Failed to create medicament:', error);
    }

    // Reset form
    setFormData({
      name: '',
      description: '',
      dosage: '',
      form: '',
      manufacturer: '',
      categoryId: '',
      price: '',
      stockQuantity: '',
      minimumStock: '',
      status: 'ACTIVE',
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="secondary">
          <BriefcaseMedical width={18} className='mr-2' />
          Add Medicament
        </Button>
      </DialogTrigger>
      <DialogContent className="p-0 sm:max-w-5xl h-[90vh] flex flex-col">
        <DialogClose asChild>
          <Button
            className="absolute right-3 top-3 p-2 !text-gray-400 hover:text-gray-500 dark:!text-gray-600 hover:dark:text-gray-500"
            variant="ghost"
          >
            <RiCloseLine className="size-5 shrink-0" />
          </Button>
        </DialogClose>
        <DialogHeader className="border-b border-gray-200 px-6 py-4 dark:border-gray-900">
          <DialogTitle className="text-base">Add Medicament</DialogTitle>
        </DialogHeader>

        <div className="flex flex-1 flex-col-reverse md:flex-row overflow-hidden">
          {/* Left Sidebar */}
          <div className="flex flex-col justify-between border-gray-200 dark:border-gray-900 md:w-80 md:border-r">
            <div className="flex-1 grow overflow-y-auto">
              <div className="border-t border-gray-200 p-6 dark:border-gray-900 md:border-none">
                <div className="flex items-center space-x-3">
                  <div className="inline-flex shrink-0 items-center justify-center rounded bg-gray-100 p-3 dark:bg-gray-800">
                    <RiCapsuleFill
                      className="size-5 text-gray-700 dark:text-gray-300"
                      aria-hidden={true}
                    />
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-900 dark:text-gray-50">
                      Medicament Information
                    </h3>
                    <p className="mt-0.5 text-sm text-gray-700 dark:text-gray-300">
                      Add new medication to inventory
                    </p>
                  </div>
                </div>
                <Divider />
                <h4 className="text-sm font-medium text-gray-900 dark:text-gray-50">
                  Description:
                </h4>
                <p className="mt-1 text-sm/6 text-gray-600 dark:text-gray-400">
                  Fill in all required fields to add a new medicament to your pharmacy inventory.
                  This will help track stock levels and pricing.
                </p>
                <h4 className="mt-6 text-sm font-medium text-gray-900 dark:text-gray-50">
                  Required Fields:
                </h4>
                <p className="mt-1 text-sm/6 text-gray-600 dark:text-gray-400">
                  Name, category, price, stock quantity, and minimum stock level are required
                  to create a medicament record.
                </p>
              </div>
            </div>
            <div className="flex justify-between border-t border-gray-200 p-6 dark:border-gray-900">
              <DialogClose asChild>
                <Button variant="secondary">Cancel</Button>
              </DialogClose>
              <Button type="submit" form="medicament-form">Add Medicament</Button>
            </div>
          </div>

          {/* Right Form Area */}
          <form
            id="medicament-form"
            onSubmit={handleSubmit}
            className="flex-1 space-y-6 p-6 md:px-6 md:pb-20 md:pt-6  overflow-y-auto"
          >
            {/* Step 1: Basic Information */}
            <div>
              <div className="flex items-center space-x-3">
                <div className="inline-flex size-6 items-center justify-center rounded-md bg-gray-100 text-sm text-gray-900 dark:bg-gray-800 dark:text-gray-50">
                  1
                </div>
                <Label htmlFor="name" className="font-medium">
                  Basic Information
                </Label>
              </div>
              <div className="mt-4 space-y-4">
                <div>
                  <Label htmlFor="name" className="text-sm">
                    Medicament Name *
                  </Label>
                  <Input
                    id="name"
                    name="name"
                    placeholder="Enter medicament name"
                    value={formData.name}
                    onChange={(e) => handleChange('name', e.target.value)}
                    className="mt-2"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="description" className="text-sm">
                    Description
                  </Label>
                  <Input
                    id="description"
                    name="description"
                    placeholder="Enter description (optional)"
                    value={formData.description}
                    onChange={(e) => handleChange('description', e.target.value)}
                    className="mt-2"
                  />
                </div>
              </div>
            </div>

            {/* Step 2: Medication Details */}
            <div>
              <div className="flex items-center space-x-3">
                <div className="inline-flex size-6 items-center justify-center rounded-md bg-gray-100 text-sm text-gray-900 dark:bg-gray-800 dark:text-gray-50">
                  2
                </div>
                <Label className="font-medium">
                  Medication Details
                </Label>
              </div>
              <div className="mt-4 space-y-4">
                <div>
                  <Label htmlFor="dosage" className="text-sm">
                    Dosage
                  </Label>
                  <Input
                    id="dosage"
                    name="dosage"
                    placeholder="e.g., 500mg, 10ml"
                    value={formData.dosage}
                    onChange={(e) => handleChange('dosage', e.target.value)}
                    className="mt-2"
                  />
                </div>
                <div>
                  <Label htmlFor="form" className="text-sm">
                    Form
                  </Label>
                  <Select
                    value={formData.form}
                    onValueChange={(val) => handleChange('form', val)}
                  >
                    <SelectTrigger id="form" name="form" className="mt-2">
                      <SelectValue placeholder="Select form" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="tablet">Tablet</SelectItem>
                      <SelectItem value="capsule">Capsule</SelectItem>
                      <SelectItem value="syrup">Syrup</SelectItem>
                      <SelectItem value="injection">Injection</SelectItem>
                      <SelectItem value="cream">Cream</SelectItem>
                      <SelectItem value="drops">Drops</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="manufacturer" className="text-sm">
                    Manufacturer
                  </Label>
                  <Input
                    id="manufacturer"
                    name="manufacturer"
                    placeholder="Enter manufacturer name"
                    value={formData.manufacturer}
                    onChange={(e) => handleChange('manufacturer', e.target.value)}
                    className="mt-2"
                  />
                </div>
              </div>
            </div>

            {/* Step 3: Category & Status */}
            <div>
              <div className="flex items-center space-x-3">
                <div className="inline-flex size-6 items-center justify-center rounded-md bg-gray-100 text-sm text-gray-900 dark:bg-gray-800 dark:text-gray-50">
                  3
                </div>
                <Label className="font-medium">
                  Category & Status
                </Label>
              </div>
              <div className="mt-4 space-y-4">
                <div>
                  <Label htmlFor="categoryId" className="text-sm">
                    Category *
                  </Label>
                  <Select
                    value={formData.categoryId}
                    onValueChange={(val) => handleChange('categoryId', val)}
                    required
                  >
                    <SelectTrigger id="categoryId" name="categoryId" className="mt-2">
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((cat) => (
                        <SelectItem key={cat.id} value={cat.id}>
                          {cat.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="status" className="text-sm">
                    Status
                  </Label>
                  <Select
                    value={formData.status}
                    onValueChange={(val) => handleChange('status', val)}
                  >
                    <SelectTrigger id="status" name="status" className="mt-2">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="ACTIVE">Active</SelectItem>
                      <SelectItem value="INACTIVE">Inactive</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            {/* Step 4: Pricing & Inventory */}
            <div>
              <div className="flex items-center space-x-3">
                <div className="inline-flex size-6 items-center justify-center rounded-md bg-gray-100 text-sm text-gray-900 dark:bg-gray-800 dark:text-gray-50">
                  4
                </div>
                <Label className="font-medium">
                  Pricing & Inventory
                </Label>
              </div>
              <p className="mt-1 text-xs text-gray-600 dark:text-gray-400">
                Set the price and stock levels for inventory management
              </p>
              <div className="mt-4 space-y-4">
                <div>
                  <Label htmlFor="price" className="text-sm">
                    Price *
                  </Label>
                  <Input
                    id="price"
                    name="price"
                    type="number"
                    step="0.01"
                    min="0"
                    placeholder="0.00"
                    value={formData.price}
                    onChange={(e) => handleChange('price', e.target.value)}
                    className="mt-2"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="stockQuantity" className="text-sm">
                    Stock Quantity *
                  </Label>
                  <Input
                    id="stockQuantity"
                    name="stockQuantity"
                    type="number"
                    min="0"
                    placeholder="0"
                    value={formData.stockQuantity}
                    onChange={(e) => handleChange('stockQuantity', e.target.value)}
                    className="mt-2"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="minimumStock" className="text-sm">
                    Minimum Stock Level *
                  </Label>
                  <Input
                    id="minimumStock"
                    name="minimumStock"
                    type="number"
                    min="0"
                    placeholder="0"
                    value={formData.minimumStock}
                    onChange={(e) => handleChange('minimumStock', e.target.value)}
                    className="mt-2"
                    required
                  />
                </div>
              </div>
            </div>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
}