'use client';

import { useState, useEffect } from 'react';
import { RiCloseLine, RiFolderAddFill, RiFolderFill } from '@remixicon/react';
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
import { Edit3, PencilRuler } from 'lucide-react';
import { updateCategory, Category } from '@/api/pharmacie/categories';

interface EditCategoryDialogProps {
  category: Category;
  tenantId: string;
  onCategoryUpdated?: () => void;
}

export default function EditCategoryDialog({ 
  category, 
  tenantId, 
  onCategoryUpdated 
}: EditCategoryDialogProps) {
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: category.name,
    status: category.status as 'ACTIVE' | 'INACTIVE',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Sync form when category prop changes
  useEffect(() => {
    setFormData({
      name: category.name,
      status: category.status as 'ACTIVE' | 'INACTIVE',
    });
  }, [category]);

  const handleChange = (field: keyof typeof formData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) return;

    setIsSubmitting(true);
    try {
      await updateCategory(category.id, {
        name: formData.name.trim(),
        status: formData.status,
      });

      setOpen(false);
      onCategoryUpdated?.();
    } catch (error) {
      console.error('Failed to update category:', error);
      // Add toast notification here if you have one
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleOpenChange = (isOpen: boolean) => {
    setOpen(isOpen);
    if (isOpen) {
      // Reset to current category values when opening
      setFormData({
        name: category.name,
        status: category.status as 'ACTIVE' | 'INACTIVE',
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button variant="secondary">
          <PencilRuler className="h-4 w-4" />
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
            Edit Category
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
                    Update Category Details
                  </h3>
                  <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                    Modify name or status as needed
                  </p>
                </div>
              </div>

              <Divider className="my-6" />

              <div className="space-y-4 text-sm text-gray-600 dark:text-gray-400">
                <p>
                  You can:
                </p>
                <ul className="space-y-2 ml-5 list-disc">
                  <li>Rename the category</li>
                  <li>Deactivate it temporarily (won&apos;t delete medicaments)</li>
                  <li>Reactivate when needed</li>
                </ul>

                <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
                  <p className="text-blue-800 dark:text-blue-300 font-medium">
                    Note:
                  </p>
                  <p className="text-sm mt-1">
                    Changing the name will update all medicaments in this category automatically.
                  </p>
                </div>
              </div>
            </div>

            <div className="border-t border-gray-200 dark:border-gray-900 p-3 flex justify-end gap-3">
              <DialogClose asChild>
                <Button variant="secondary" disabled={isSubmitting}>
                  Cancel
                </Button>
              </DialogClose>
              <Button
                type="submit"
                form="edit-category-form"
                disabled={isSubmitting || formData.name.trim() === category.name && formData.status === category.status}
                isLoading={isSubmitting}
              >
                Save Changes
              </Button>
            </div>
          </div>

          {/* Right Form Area */}
          <form
            id="edit-category-form"
            onSubmit={handleSubmit}
            className="flex-1 p-4 overflow-y-auto"
          >
            <div className="pace-y-8">
              {/* Category Name */}
              <div className="space-y-2">
                <Label htmlFor="edit-category-name" className="text-base font-medium">
                  Category Name <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="edit-category-name"
                  placeholder="e.g., Antibiotics"
                  value={formData.name}
                  onChange={(e) => handleChange('name', e.target.value)}
                  className="text-base"
                  autoFocus
                  required
                  minLength={2}
                  maxLength={50}
                />
                <p className="text-sm text-gray-500">
                  Current name: <span className="font-medium">{category.name}</span>
                </p>
              </div>

              {/* Status */}
              <div className="space-y-2">
                <Label htmlFor="edit-status" className="text-base font-medium">
                  Status
                </Label>
                <Select
                  value={formData.status}
                  onValueChange={(val) => handleChange('status', val)}
                >
                  <SelectTrigger id="edit-status">
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
                  Inactive categories will be hidden from new medicament forms
                </p>
              </div>

              {/* Live Preview */}
              <div className="mt-8 p-6 bg-gray-50 dark:bg-gray-900 border-2 border-dashed border-gray-200 dark:border-gray-800 rounded-xl">
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-3">
                  Live Preview:
                </p>
                <div className="flex items-center gap-3">
                  <div className="p-3 rounded-lg bg-gray-100 dark:bg-gray-800">
                    <RiFolderFill className={"size-6"} />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900 dark:text-gray-50">
                      {formData.name.trim() || 'Category Name'}
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