"use client";

import { useState } from "react";
import { Card } from "@/components/Card";
import { Button } from "@/components/Button";
import { Input } from "@/components/Input";
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogClose } from "@/components/Dialog";
import { Table, TableBody, TableCell, TableHead, TableHeaderCell, TableRoot, TableRow } from "@/components/Table";
import { FileText, Upload, Loader2, Edit, Trash2, Eye, Download } from "lucide-react";
import {
    createDocument,
    updateDocument,
    deleteDocument,
    Folder,
    PatientDocument
} from "@/api/medic/FolderFiles";
import Image from "next/image"

interface FilesSectionProps {
    folder: Folder;
    documents: PatientDocument[];
    patientId: string;
    onDataChange: () => void;
}

export default function FilesSection({
    folder,
    documents,
    patientId,
    onDataChange
}: FilesSectionProps) {
    const [fileDialogOpen, setFileDialogOpen] = useState(false);
    const [viewDialogOpen, setViewDialogOpen] = useState(false);
    const [viewingFile, setViewingFile] = useState<PatientDocument | null>(null);
    const [editingFile, setEditingFile] = useState<{ id?: string; fileName: string; folderId?: string }>({ fileName: "" });
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [uploading, setUploading] = useState(false);

    const handleSaveFile = async () => {
        if (!editingFile.fileName.trim()) {
            alert("Please enter a file name");
            return;
        }

        try {
            setUploading(true);

            if (editingFile.id) {
                // Update existing document
                await updateDocument(
                    editingFile.id,
                    {
                        fileName: editingFile.fileName,
                        folderId: editingFile.folderId
                    },
                    selectedFile || undefined
                );
            } else {
                // Create new document
                if (!selectedFile) {
                    alert("Please select a file to upload");
                    return;
                }
                await createDocument(
                    {
                        patientProfileId: patientId,
                        fileName: editingFile.fileName,
                        folderId: editingFile.folderId
                    },
                    selectedFile
                );
            }

            await onDataChange();
            setFileDialogOpen(false);
            setEditingFile({ fileName: "" });
            setSelectedFile(null);
        } catch (error) {
            console.error("Error saving file:", error);
            alert("Failed to save file");
        } finally {
            setUploading(false);
        }
    };

    const handleDeleteFile = async (doc: PatientDocument) => {
        if (!confirm("Delete this file?")) return;

        try {
            await deleteDocument(doc.id);
            await onDataChange();
        } catch (error) {
            console.error("Error deleting file:", error);
            alert("Failed to delete file");
        }
    };

    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setSelectedFile(file);
            if (!editingFile.fileName) {
                setEditingFile({ ...editingFile, fileName: file.name });
            }
        }
    };

    const formatFileSize = (bytes: number) => {
        if (bytes < 1024) return bytes + " B";
        if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB";
        return (bytes / (1024 * 1024)).toFixed(1) + " MB";
    };

    const isViewableFile = (fileType: string) => {
        const viewableTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'image/svg+xml', 'application/pdf'];
        return viewableTypes.includes(fileType.toLowerCase());
    };

    const handleViewFile = (doc: PatientDocument) => {
        setViewingFile(doc);
        setViewDialogOpen(true);
    };

    const handleDownloadFile = (doc: PatientDocument) => {
        const link = document.createElement('a');
        link.href = doc.fileUrl;
        link.download = doc.fileName;
        link.target = '_blank';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    return (
        <Card>
            <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold flex items-center gap-2">
                    <FileText className="h-5 w-5" /> Files in {folder.title}
                </h2>
                <Dialog open={fileDialogOpen} onOpenChange={setFileDialogOpen}>
                    <DialogTrigger asChild>
                        <Button onClick={() => setEditingFile({ fileName: "", folderId: folder.id })}>
                            <Upload className="h-4 w-4 mr-2" />
                            Upload File
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-md">
                        <DialogHeader>
                            <DialogTitle>{editingFile.id ? "Edit File" : "Upload File"}</DialogTitle>
                            <DialogDescription>File details</DialogDescription>
                        </DialogHeader>
                        <div className="space-y-3">
                            <div>
                                <label className="block text-sm font-medium mb-1">File</label>
                                <Input
                                    id="file"
                                    name="file"
                                    type="file"
                                    onChange={handleFileSelect}
                                    className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                                />
                            </div>
                            <Input
                                placeholder="File name"
                                value={editingFile.fileName}
                                onChange={e => setEditingFile({ ...editingFile, fileName: e.target.value })}
                            />
                        </div>
                        <DialogFooter className="mt-4 flex justify-end gap-2">
                            <DialogClose asChild><Button variant="secondary">Cancel</Button></DialogClose>
                            <Button onClick={handleSaveFile} disabled={uploading}>
                                {uploading ? (
                                    <>
                                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                        Uploading...
                                    </>
                                ) : "Save"}
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            </div>

            <TableRoot>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableHeaderCell>Name</TableHeaderCell>
                            <TableHeaderCell>Type</TableHeaderCell>
                            <TableHeaderCell>Size</TableHeaderCell>
                            <TableHeaderCell>Date</TableHeaderCell>
                            <TableHeaderCell className="text-right">Actions</TableHeaderCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {documents.map((doc) => (
                            <TableRow key={doc.id}>
                                <TableCell className="font-medium">{doc.fileName}</TableCell>
                                <TableCell className="uppercase text-xs">{doc.fileType}</TableCell>
                                <TableCell>{formatFileSize(doc.fileSize)}</TableCell>
                                <TableCell>{new Date(doc.createdAt).toLocaleDateString()}</TableCell>
                                <TableCell className="text-right flex justify-end gap-2">
                                    {isViewableFile(doc.fileType) && (
                                        <Button
                                            variant="ghost"
                                            onClick={() => handleViewFile(doc)}
                                            title="View file"
                                        >
                                            <Eye className="h-4 w-4" />
                                        </Button>
                                    )}
                                    <Button
                                        variant="ghost"
                                        onClick={() => handleDownloadFile(doc)}
                                        title="Download file"
                                    >
                                        <Download className="h-4 w-4" />
                                    </Button>
                                    <Button
                                        variant="ghost"
                                        onClick={() => {
                                            setEditingFile({
                                                id: doc.id,
                                                fileName: doc.fileName,
                                                folderId: doc.folderId
                                            });
                                            setFileDialogOpen(true);
                                        }}
                                        title="Edit file"
                                    >
                                        <Edit className="h-4 w-4" />
                                    </Button>
                                    <Button
                                        variant="ghost"
                                        onClick={() => handleDeleteFile(doc)}
                                        title="Delete file"
                                    >
                                        <Trash2 className="h-4 w-4 text-red-500" />
                                    </Button>
                                </TableCell>
                            </TableRow>
                        ))}
                        {documents.length === 0 && (
                            <TableRow>
                                <TableCell colSpan={5} className="text-center text-gray-500 py-8">
                                    No files in this folder. Upload one to get started.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </TableRoot>

            {/* View File Dialog */}
            <Dialog open={viewDialogOpen} onOpenChange={setViewDialogOpen}>
                <DialogContent className="sm:max-w-4xl max-h-[90vh]">
                    <DialogHeader>
                        <DialogTitle>{viewingFile?.fileName}</DialogTitle>
                        <DialogDescription>
                            {viewingFile?.fileType} • {viewingFile && formatFileSize(viewingFile.fileSize)}
                        </DialogDescription>
                    </DialogHeader>
                    <div className="mt-4 overflow-auto max-h-[70vh]">
                        {viewingFile && (
                            <>
                                {viewingFile.fileType.startsWith('image/') ? (
                                    <Image
                                        src={viewingFile.fileUrl}
                                        alt={viewingFile.fileName}
                                        className="w-full h-auto rounded-lg"
                                        width={100}
                                        height={100}
                                    />
                                ) : viewingFile.fileType === 'application/pdf' ? (
                                    <iframe
                                        src={viewingFile.fileUrl}
                                        className="w-full h-[60vh] rounded-lg border"
                                        title={viewingFile.fileName}
                                    />
                                ) : null}
                            </>
                        )}
                    </div>
                    <DialogFooter className="mt-4 flex justify-between items-center">
                        <Button
                            variant="secondary"
                            onClick={() => viewingFile && handleDownloadFile(viewingFile)}
                        >
                            <Download className="h-4 w-4 mr-2" />
                            Download
                        </Button>
                        <DialogClose asChild>
                            <Button variant="secondary">Close</Button>
                        </DialogClose>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </Card>
    );
}