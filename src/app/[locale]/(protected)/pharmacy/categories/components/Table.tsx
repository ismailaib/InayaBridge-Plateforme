'use client';

import React, { useEffect, useMemo, useState } from 'react';
import { Category, getCategoriesByTenant } from '@/api/pharmacie/categories';
import { Medicament, getMedicamentsByTenant } from '@/api/pharmacie/medicaments';
import {
  AlertCircle,
  Edit,
  LayoutGrid,
  Table as TableIcon,
  Trash2,
} from 'lucide-react';

import { Badge } from '@/components/Badge';
import { Button } from '@/components/Button';
import { Card } from '@/components/Card';
import { Divider } from '@/components/Divider';
import { Input } from '@/components/Input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/Select';
import { Table, TableBody, TableCell, TableHead, TableHeaderCell, TableRow } from '@/components/Table';
import EditCategoryDialog from './EditCategoryDialog';
import DeleteCategoryDialog from './DeleteCategoryDialog';

interface CategoryListProps {
  tenantId: string;
  refreshTrigger?: number;
  onRefetch?: () => void;
}

export default function CategoryList({ tenantId, refreshTrigger, onRefetch }: CategoryListProps) {
  const [categories, setCategories] = useState<Category[]>([]);
  const [medicaments, setMedicaments] = useState<Medicament[]>([]);
  const [filterName, setFilterName] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<'All' | 'ACTIVE' | 'INACTIVE'>('All');
  const [viewMode, setViewMode] = useState<'table' | 'cards'>('table');

  const fetchCategories = async () => {
    try {
      const { data } = await getCategoriesByTenant(tenantId);
      setCategories(data || []);
    } catch (error) {
      console.error('Failed to fetch categories:', error);
    }
  };

  const fetchMedicaments = async () => {
    try {
      const { data } = await getMedicamentsByTenant(tenantId);
      setMedicaments(data || []);
    } catch (error) {
      console.error('Failed to fetch medicaments:', error);
    }
  };

  const refetchData = () => {
    fetchCategories();
    fetchMedicaments();
    onRefetch?.();
  };

  useEffect(() => {
    if (!tenantId) return;
    fetchCategories();
    fetchMedicaments();
  }, [tenantId]);

  useEffect(() => {
    if (!tenantId || refreshTrigger === undefined) return;
    fetchCategories();
    fetchMedicaments();
  }, [tenantId, refreshTrigger]);

  const filteredData = categories.filter(cat => {
    const nameMatch = !filterName || cat.name.toLowerCase().includes(filterName.toLowerCase());
    const statusMatch = selectedStatus === 'All' || cat.status === selectedStatus;
    return nameMatch && statusMatch;
  });

  const usedCategoryIds = useMemo(() => new Set(medicaments.map(m => m.categoryId)), [medicaments]);

  return (
    <div className="space-y-6 pt-6">
      {/* Filters */}
      <Card>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {/* Search */}
          <Input
            type="search"
            placeholder="Search category..."
            value={filterName}
            onChange={(e) => setFilterName(e.target.value)}
          />

          {/* Status Filter */}
          <Select value={selectedStatus} onValueChange={(value: string) => setSelectedStatus(value as "All" | "ACTIVE" | "INACTIVE")}>
            <SelectTrigger>
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="All">All Status</SelectItem>
              <SelectItem value="ACTIVE">Active</SelectItem>
              <SelectItem value="INACTIVE">Inactive</SelectItem>
            </SelectContent>
          </Select>

          {/* View Toggle */}
          <div className="flex items-center justify-end col-span-2">
            <div className="flex gap-2">
              <Button
                variant={viewMode === 'table' ? 'light' : 'ghost'}
                onClick={() => setViewMode('table')}
                className="rounded-md px-3"
              >
                <TableIcon className="h-4 w-4 mr-2" /> Table
              </Button>
              <Button
                variant={viewMode === 'cards' ? 'light' : 'ghost'}
                onClick={() => setViewMode('cards')}
                className="rounded-md px-3"
              >
                <LayoutGrid className="h-4 w-4 mr-2" /> Cards
              </Button>
            </div>
          </div>
        </div>
      </Card>

      {/* Content */}
      {viewMode === 'table' ? (
        <Card>
          <Table>
            <TableHead>
              <TableRow>
                <TableHeaderCell>Name</TableHeaderCell>
                <TableHeaderCell>Status</TableHeaderCell>
                <TableHeaderCell>Created At</TableHeaderCell>
                <TableHeaderCell className="text-right">Actions</TableHeaderCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredData.length > 0 ? (
                filteredData.map(cat => {
                  const isInUse = usedCategoryIds.has(cat.id);
                  return (
                    <TableRow key={cat.id}>
                      <TableCell className="font-medium">{cat.name}</TableCell>
                      <TableCell>
                        <Badge variant={cat.status === 'ACTIVE' ? 'neutral' : 'error'}>
                          {cat.status}
                        </Badge>
                      </TableCell>
                      <TableCell>{new Date(cat.createdAt).toLocaleDateString()}</TableCell>
                      <TableCell className="text-right space-x-2">
                        <EditCategoryDialog
                          category={cat}
                          tenantId={tenantId}
                          onCategoryUpdated={refetchData}
                        />
                        {!isInUse && (
                          <DeleteCategoryDialog
                            category={cat}
                            tenantId={tenantId}
                            onCategoryDeleted={refetchData}
                          />
                        )}
                      </TableCell>
                    </TableRow>
                  );
                })
              ) : (
                <TableRow>
                  <TableCell colSpan={4} className="text-center py-10 text-gray-500">
                    <AlertCircle className="h-10 w-10 mx-auto mb-3 text-gray-300" />
                    No categories found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </Card>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredData.length > 0 ? (
            filteredData.map(cat => {
              const isInUse = usedCategoryIds.has(cat.id);
              return (
                <Card key={cat.id} className="p-4">
                  <div className="flex justify-between items-center">
                    <h2 className="font-medium text-lg">{cat.name}</h2>
                    <Badge variant={cat.status === 'ACTIVE' ? 'neutral' : 'error'}>
                      {cat.status}
                    </Badge>
                  </div>
                  <Divider className="my-4" />
                  <div className="flex justify-between gap-2">
                    <EditCategoryDialog
                      category={cat}
                      tenantId={tenantId}
                      onCategoryUpdated={refetchData}
                    />
                    {!isInUse && (
                      <DeleteCategoryDialog
                        category={cat}
                        tenantId={tenantId}
                        onCategoryDeleted={refetchData}
                      />
                    )}
                  </div>
                </Card>
              );
            })
          ) : (
            <div className="col-span-full text-center py-20">
              <AlertCircle className="h-16 w-16 mx-auto text-gray-300 mb-4" />
              <p className="text-lg text-gray-500">No categories found.</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}