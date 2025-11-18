"use client";

import { useState } from "react";
import { Card } from "@/components/Card";
import { Button } from "@/components/Button";
import { Input } from "@/components/Input";
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogClose } from "@/components/Dialog";
import { Folder as FolderIcon, Edit, Trash2, FileText } from "lucide-react";
import {
    createFolder,
    updateFolder,
    deleteFolder,
    Folder,
    PatientDocument
} from "@/api/medic/FolderFiles";
import { Divider } from "@/components/Divider";

interface FoldersSectionProps {
    folders: Folder[];
    documents: PatientDocument[];
    selectedFolderId: string | null;
    onSelectFolder: (id: string | null) => void;
    onDataChange: () => void;
}

export default function FoldersSection({
    folders,
    documents,
    selectedFolderId,
    onSelectFolder,
    onDataChange
}: FoldersSectionProps) {
    const [folderDialogOpen, setFolderDialogOpen] = useState(false);
    const [editingFolder, setEditingFolder] = useState<{ id?: string; title: string }>({ title: "" });

    const handleSaveFolder = async () => {
        if (!editingFolder.title.trim()) return;

        try {
            const stored = localStorage.getItem("user");
            const parsed = stored ? JSON.parse(stored) : null;
            const tenantId = parsed?.doctorProfile?.tenantId;
            if (!tenantId) return;
            if (editingFolder.id) {
                await updateFolder(editingFolder.id, { title: editingFolder.title });
            } else {
                await createFolder({
                    title: editingFolder.title,
                    tenantId,
                });
            }
            await onDataChange();
            setFolderDialogOpen(false);
            setEditingFolder({ title: "" });
        } catch (error) {
            console.error("Error saving folder:", error);
            alert("Failed to save folder");
        }
    };

    const handleDeleteFolder = async (id: string) => {
        if (!confirm("Delete this folder? All files in it will be moved to 'No Folder'.")) return;

        try {
            await deleteFolder(id);
            await onDataChange();
            if (selectedFolderId === id) onSelectFolder(null);
        } catch (error) {
            console.error("Error deleting folder:", error);
            alert("Failed to delete folder");
        }
    };

    const getFolderFileCount = (folderId: string) => {
        return documents.filter(d => d.folderId === folderId).length;
    };

    return (
        <div>
            <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold flex items-center gap-2">
                    <FolderIcon className="h-6 w-6" /> Folders
                </h2>
                <Dialog open={folderDialogOpen} onOpenChange={setFolderDialogOpen}>
                    <DialogTrigger asChild>
                        <Button onClick={() => setEditingFolder({ title: "" })}>New Folder</Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-md">
                        <DialogHeader>
                            <DialogTitle>{editingFolder.id ? "Edit Folder" : "New Folder"}</DialogTitle>
                            <DialogDescription>Enter folder name</DialogDescription>
                        </DialogHeader>
                        <Input
                            value={editingFolder.title}
                            onChange={e => setEditingFolder({ ...editingFolder, title: e.target.value })}
                            placeholder="Folder name"
                        />
                        <DialogFooter className="mt-4 flex justify-end gap-2">
                            <DialogClose asChild><Button variant="secondary">Cancel</Button></DialogClose>
                            <Button onClick={handleSaveFolder}>Save</Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            </div>

            {folders.length === 0 ? (
                <Card>
                    <div className="text-center py-12 text-gray-500">
                        <FolderIcon className="h-12 w-12 mx-auto mb-3 opacity-50" />
                        <p className="text-lg font-medium mb-1">No folders yet</p>
                        <p className="text-sm">Create one to organize your documents</p>
                    </div>
                </Card>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {folders.map(folder => (
                        <Card
                            key={folder.id}
                            className={`cursor-pointer transition-all duration-300 hover:shadow-lg dark:bg-gray-900 hover:dark:bg-[#090E1A] ${selectedFolderId === folder.id
                                ? ' dark:bg-[#090E1A]'
                                : ''
                                }`}
                        >
                            <div
                                onClick={() => onSelectFolder(folder.id)}
                                className="mb-4 w-full"
                            >
                                <div className="flex items-start justify-between mb-3">
                                    <div className="flex items-center gap-3">
                                        <div className="p-3 bg-blue-100 dark:bg-gray-950 rounded-lg">
                                            <FolderIcon />
                                        </div>
                                        <div>
                                            <h3 className="font-semibold text-lg">{folder.title}</h3>
                                            <div className="flex items-center gap-1 text-sm text-gray-500 mt-1">
                                                <FileText className="h-4 w-4" />
                                                <span>{getFolderFileCount(folder.id)} files</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <Divider />

                            <div className="flex items-center gap-2 pt-3">
                                <Button
                                    variant="secondary"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        setEditingFolder({ id: folder.id, title: folder.title });
                                        setFolderDialogOpen(true);
                                    }}
                                    className="flex-1"
                                >
                                    <Edit className="h-4 w-4 mr-1" />
                                    Edit
                                </Button>
                                <Button
                                    variant="destructive"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        handleDeleteFolder(folder.id);
                                    }}
                                >
                                    <Trash2 className="h-4 w-4 mr-1" />
                                    Delete
                                </Button>
                            </div>
                        </Card>
                    ))}
                </div>
            )}
        </div>
    );
}