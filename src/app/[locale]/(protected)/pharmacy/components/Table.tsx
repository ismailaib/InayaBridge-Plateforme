'use client';

import { Category, getCategoriesByTenant } from '@/api/pharmacie/categories';
import { deleteMedicament, Medicament } from '@/api/pharmacie/medicaments';
import { useEffect, useState } from 'react';

import {
    AlertCircle,
    DollarSign,
    LayoutGrid,
    Package,
    Pill,
    PillBottle,
    Table as TableIcon,
    Trash2,
    Warehouse
} from 'lucide-react';

import { Badge } from '@/components/Badge';
import { Button } from '@/components/Button';
import { Card } from '@/components/Card';
import { Divider } from '@/components/Divider';
import { Input } from '@/components/Input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/Select';
import { Table, TableBody, TableCell, TableHead, TableHeaderCell, TableRow } from '@/components/Table';
import EditMedicamentForm from './EditMedicamentForm';

interface MedicamentListProps {
    tenantId: string;
    data: Medicament[];
    loading: boolean;
    onRefresh: () => void;
}

export default function MedicamentList({ tenantId, data, loading, onRefresh }: MedicamentListProps) {
    const [categories, setCategories] = useState<Category[]>([]);
    const [filterName, setFilterName] = useState('');
    const [selectedStatus, setSelectedStatus] = useState('All');
    const [selectedCategory, setSelectedCategory] = useState('All');
    const [viewMode, setViewMode] = useState<'table' | 'cards'>('cards');
    const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);

    useEffect(() => {
        if (!tenantId) return;

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

    const categoryIdToNameMap = new Map(categories.map(cat => [cat.id, cat.name]));

    const categoryIds = Array.from(new Set(data.map((m) => m.categoryId).filter(cat => cat && cat.trim() !== '')));

    const filteredData = data.filter((med) => {
        const nameMatch =
            !filterName ||
            med.name.toLowerCase().includes(filterName.toLowerCase()) ||
            (med.description?.toLowerCase().includes(filterName.toLowerCase()));

        const statusMatch = selectedStatus === 'All' || med.status === selectedStatus;
        const categoryMatch = selectedCategory === 'All' || med.categoryId === selectedCategory;

        return nameMatch && statusMatch && categoryMatch;
    });

    const handleDelete = async (id: string) => {
        try {
            await deleteMedicament(id);
            onRefresh();
        } catch (error) {
            console.error('Failed to delete medicament:', error);
        } finally {
            setConfirmDeleteId(null);
        }
    };

    return (
        <div className="space-y-6 pt-6">
            <Card >
                <div>
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        <div className="relative">
                            <Input
                                type='search'
                                placeholder="Search name or description..."
                                value={filterName}
                                onChange={(e) => setFilterName(e.target.value)}
                            />
                        </div>

                        <div>
                            <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Status" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="All">All Status</SelectItem>
                                    <SelectItem value="ACTIVE">Active</SelectItem>
                                    <SelectItem value="INACTIVE">Inactive</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        <div>
                            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Category" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="All">All Categories</SelectItem>
                                    {categoryIds.map((categoryId) => {
                                        const categoryName = categoryIdToNameMap.get(categoryId) || categoryId;
                                        return (
                                            <SelectItem key={categoryId} value={categoryId}>
                                                {categoryName}
                                            </SelectItem>
                                        );
                                    })}
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="flex items-center justify-end">
                            <div className='flex flex-row items-center gap-2'>
                                <Button
                                    variant={viewMode === 'table' ? 'light' : 'ghost'}
                                    onClick={() => setViewMode('table')}
                                    className="rounded-md px-3"
                                >
                                    <TableIcon className="h-4 w-4 mr-2" />
                                    Table
                                </Button>
                                <Button
                                    variant={viewMode === 'cards' ? 'light' : 'ghost'}
                                    onClick={() => setViewMode('cards')}
                                    className="rounded-md px-3"
                                >
                                    <LayoutGrid className="h-4 w-4 mr-2" />
                                    Cards
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            </Card>

            {viewMode === 'table' ? (
                <Card>
                    <div className="p-0 overflow-x-auto">
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableHeaderCell>Name</TableHeaderCell>
                                    <TableHeaderCell>Description</TableHeaderCell>
                                    <TableHeaderCell>Dosage</TableHeaderCell>
                                    <TableHeaderCell>Form</TableHeaderCell>
                                    <TableHeaderCell>Price</TableHeaderCell>
                                    <TableHeaderCell>Stock</TableHeaderCell>
                                    <TableHeaderCell>Status</TableHeaderCell>
                                    <TableHeaderCell className="text-right">Actions</TableHeaderCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {loading ? (
                                    <TableRow>
                                        <TableCell colSpan={8} className="text-center py-10 text-gray-500">
                                            Loading medicaments...
                                        </TableCell>
                                    </TableRow>
                                )
                                    :
                                    filteredData.length > 0 ? (
                                        filteredData.map((med) => (
                                            <TableRow key={med.id}>
                                                <TableCell className="font-medium">{med.name}</TableCell>
                                                <TableCell className="text-gray-600 dark:text-gray-400">
                                                    {med.description || '-'}
                                                </TableCell>
                                                <TableCell>{med.dosage}</TableCell>
                                                <TableCell>{med.form}</TableCell>
                                                <TableCell className="font-semibold">{med.price.toFixed(2)}</TableCell>
                                                <TableCell>
                                                    <span className={med.stockQuantity < 10 ? 'text-red-600 font-medium' : ''}>
                                                        {med.stockQuantity}
                                                    </span>
                                                </TableCell>
                                                <TableCell>
                                                    <Badge variant='neutral'>
                                                        {med.status}
                                                    </Badge>
                                                </TableCell>
                                                <TableCell className="text-right space-x-2">
                                                    <EditMedicamentForm tenantId={tenantId} medicament={med} onSuccess={onRefresh} />
                                                    <Button
                                                        variant="destructive"
                                                        onClick={() => {
                                                            if (confirmDeleteId === med.id) {
                                                                handleDelete(med.id);
                                                            } else {
                                                                setConfirmDeleteId(med.id);
                                                            }
                                                        }}
                                                    >
                                                        {confirmDeleteId === med.id ? (
                                                            <>
                                                                <Trash2 className="h-4 w-4 mr-2" />
                                                                Confirm
                                                            </>
                                                        ) : (
                                                            <Trash2 className="h-4 w-4" />
                                                        )}
                                                    </Button>
                                                </TableCell>
                                            </TableRow>
                                        ))
                                    ) : (
                                        <TableRow>
                                            <TableCell colSpan={8} className="text-center py-10 text-gray-500">
                                                <AlertCircle className="h-10 w-10 mx-auto mb-3 text-gray-300" />
                                                No medicaments found.
                                            </TableCell>
                                        </TableRow>
                                    )}
                            </TableBody>
                        </Table>
                    </div>
                </Card>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {loading ? <div className="col-span-full text-center py-20 text-lg text-gray-500">Loading medicaments...</div> : filteredData.length > 0 ? (
                        filteredData.map((med) => (
                            <Card key={med.id} className='p-4'>
                                <div>
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center justify-between gap-3">
                                            <Card className="p-3 bg-blue-100 dark:bg-gray-950 w-fit">
                                                <PillBottle width={22} />
                                            </Card>
                                            <div>
                                                <h2 className="text-lg line-clamp-2">{med.name}</h2>
                                                {med.description && (
                                                    <p className="line-clamp-2 text-gray-700 dark:text-gray-300 text-sm">
                                                        {med.description}
                                                    </p>
                                                )}
                                            </div>

                                        </div>
                                        <Badge variant='neutral'>
                                            {med.status}
                                        </Badge>
                                    </div>
                                </div>
                                <Divider />
                                <div className="space-y-4">
                                    <div className="grid grid-cols-2 gap-4 text-gray-600 dark:text-gray-400 text-sm">
                                        <div className="flex items-center gap-2">
                                            <Package className="h-4 w-4" />
                                            <span>Dosage: <strong>{med.dosage}</strong></span>
                                        </div>

                                        <div className="flex items-center gap-2">
                                            <Pill className="h-4 w-4" />
                                            <span>Form: <strong>{med.form}</strong></span>
                                        </div>

                                        <div className="flex items-center gap-2">
                                            <DollarSign className="h-4 w-4" />
                                            <span>{med.price.toFixed(2)}</span>
                                        </div>

                                        <div className="flex items-center gap-2">
                                            <Warehouse className="h-4 w-4" />
                                            <span>
                                                Stock: <strong className={med.stockQuantity < 10 ? 'text-red-600' : ''}>{med.stockQuantity}</strong>
                                            </span>
                                        </div>
                                    </div>

                                    <div className="flex gap-2 pt-4 border-t border-gray-100 dark:border-gray-800">
                                        <EditMedicamentForm tenantId={tenantId} medicament={med} onSuccess={onRefresh} />
                                        <Button
                                            variant="destructive"
                                            onClick={() => {
                                                if (confirmDeleteId === med.id) {
                                                    handleDelete(med.id);
                                                } else {
                                                    setConfirmDeleteId(med.id);
                                                }
                                            }}
                                        >
                                            <Trash2 className="h-4 w-4 mr-2" />
                                            {confirmDeleteId === med.id ? 'Confirm Delete' : 'Delete'}
                                        </Button>
                                    </div>
                                </div>
                            </Card>
                        ))
                    ) : (
                        <div className="col-span-full text-center py-20">
                            <AlertCircle className="h-16 w-16 mx-auto text-gray-300 mb-4" />
                            <p className="text-lg text-gray-500">No medicaments found.</p>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}