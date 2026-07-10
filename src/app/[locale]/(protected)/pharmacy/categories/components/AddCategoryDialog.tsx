'use client';

import { useState } from 'react';
import { RiCloseLine, RiFolderAddFill } from '@remixicon/react';
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
import { FolderPlus } from 'lucide-react';
import { createCategory } from '@/api/pharmacie/categories'; // Adjust path if needed
import { Card } from '@/components/Card';

interface AddCategoryDialogProps {
  tenantId: string;
  onCategoryAdded?: () => void; 
}

export default function AddCategoryDialog({ 
  tenantId, 
  onCategoryAdded 
}: AddCategoryDialogProps) {
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    status: 'ACTIVE' as 'ACTIVE' | 'INACTIVE',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (field: keyof typeof formData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) return;

    setIsSubmitting(true);
    try {
      await createCategory({
        tenantId,
        name: formData.name.trim(),
        status: formData.status,
      });

      // Success feedback
      setOpen(false);
      onCategoryAdded?.();

      // Reset form
      setFormData({ name: '', status: 'ACTIVE' });
    } catch (error) {
      console.error('Failed to create category:', error);
      // You can add toast notification here
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleOpenChange = (isOpen: boolean) => {
    setOpen(isOpen);
    if (!isOpen) {
      setFormData({ name: '', status: 'ACTIVE' });
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button variant="secondary">
          <FolderPlus className="mr-2 h-4 w-4" />
          Add Category
        </Button>
      </DialogTrigger>

      <DialogContent className="p-0 sm:max-w-4xl flex flex-col">
        <DialogClose asChild>
          <Button
            className="absolute right-3 top-3 p-2 !text-gray-400 hover:text-gray-500 dark:!text-gray-600 hover:dark:text-gray-500"
            variant="ghost"
          >
            <RiCloseLine className="size-5" />
          </Button>
        </DialogClose>

        <DialogHeader className="border-b border-gray-200 px-6 py-4 dark:border-gray-900">
          <DialogTitle className="text-lg font-semibold flex items-center gap-3">
            Add New Category
          </DialogTitle>
        </DialogHeader>

        <div className="flex flex-1 flex-col-reverse md:flex-row overflow-hidden">
          {/* Left Sidebar - Info */}
          <div className="md:w-80 border-gray-200 dark:border-gray-900 md:border-r">
            <div className="flex-1 overflow-y-auto p-6">
              <div className="flex items-center space-x-3 mb-6">
                <div className="inline-flex shrink-0 items-center justify-center rounded-lg bg-gray-100 p-3 dark:bg-gray-800">
                  <RiFolderAddFill widths={22} className=" text-gray-700 dark:text-gray-300" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-50">
                    Organize Your Inventory
                  </h3>
                  <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                    Create categories to better manage medicaments
                  </p>
                </div>
              </div>

              <Divider className="my-6" />

              <div className="space-y-4 text-sm text-gray-600 dark:text-gray-400">
                <p>
                  Categories help you group similar medications together, making it easier to:
                </p>
                <ul className="space-y-2 ml-5 list-disc">
                  <li>Filter and search medicaments quickly</li>
                  <li>Generate reports by category</li>
                  <li>Manage stock levels per group</li>
                  <li>Improve pharmacy organization</li>
                </ul>

                <Card className="mt-6 p-4">
                  <p className=" font-medium">
                    Tip: Use clear, specific names
                  </p>
                  <p className="text-sm mt-1">
                    e.g., Antibiotics, Pain Relief, Vitamins & Supplements
                  </p>
                </Card>
              </div>
            </div>

            <div className="border-t border-gray-200 dark:border-gray-900 p-4 flex justify-end gap-3">
              <DialogClose asChild>
                <Button variant="secondary" disabled={isSubmitting}>
                  Cancel
                </Button>
              </DialogClose>
              <Button 
                type="submit" 
                form="add-category-form"
                disabled={isSubmitting || !formData.name.trim()}
                isLoading={isSubmitting}
              >
                Create Category
              </Button>
            </div>
          </div>

          {/* Right Form Area */}
          <form
            id="add-category-form"
            onSubmit={handleSubmit}
            className="flex-1 p-6 overflow-y-auto"
          >
            <div className="space-y-8">
              {/* Category Name */}
              <div className="space-y-2">
                <Label htmlFor="category-name" className="text-base font-medium">
                  Category Name <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="category-name"
                  placeholder="e.g., Antibiotics, Cardiovascular, Dermatology..."
                  value={formData.name}
                  onChange={(e) => handleChange('name', e.target.value)}
                  className="text-base"
                  autoFocus
                  required
                  minLength={2}
                  maxLength={50}
                />
                <p className="text-sm text-gray-500">
                  Choose a clear and descriptive name for the category
                </p>
              </div>

              {/* Status */}
              <div className="space-y-2">
                <Label htmlFor="status" className="text-base font-medium">
                  Status
                </Label>
                <Select
                  value={formData.status}
                  onValueChange={(val) => handleChange('status', val)}
                >
                  <SelectTrigger id="status">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ACTIVE">
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-green-500 rounded-full" />
                        Active
                      </div>
                    </SelectItem>
                    <SelectItem value="INACTIVE">
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-gray-400 rounded-full" />
                        Inactive
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
                <p className="text-sm text-gray-500">
                  Inactive categories won t appear in medicament forms
                </p>
              </div>

              {/* Preview */}
              <div className="mt-8 p-6 bg-gray-50 dark:bg-gray-900 border-2 border-dashed border-gray-200 dark:border-gray-800 rounded-xl">
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-3">
                  Preview:
                </p>
                <div className="flex items-center gap-3">
                  <div className="p-3 bg-blue-100 dark:bg-blue-900 rounded-lg">
                    <RiFolderAddFill className="size-6 text-blue-600 dark:text-blue-300" />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900 dark:text-gray-50">
                      {formData.name.trim() || 'New Category'}
                    </p>
                    <p className="text-sm text-gray-500">
                      Status:{' '}
                      <span className={formData.status === 'ACTIVE' ? 'text-green-600' : 'text-gray-500'}>
                        {formData.status}
                      </span>
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
}