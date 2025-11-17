"use client";

import { useState } from "react";
import { Card } from "@/components/Card";
import { Button } from "@/components/Button";
import { Input } from "@/components/Input";
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogClose } from "@/components/Dialog";
import { Table, TableBody, TableCell, TableHead, TableHeaderCell, TableRoot, TableRow } from "@/components/Table";
import { Trash2, Edit, Folder, FileText } from "lucide-react";

interface FileItem {
  name: string;
  type: string;
  date: string;
}

interface FolderItem {
  id: string;
  name: string;
  files: FileItem[];
}

export default function DocumentsNotes({ patientId }: { patientId: string }) {
  const [folders, setFolders] = useState<FolderItem[]>([
    { id: "1", name: "Lab Reports", files: [{ name: "Rapport de laboratoire.pdf", date: "2023-05-10", type: "PDF" }] },
    { id: "2", name: "Doctor Notes", files: [{ name: "Note du médecin.txt", date: "2023-04-02", type: "TXT" }] },
  ]);

  const [selectedFolderId, setSelectedFolderId] = useState<string | null>(null);
  const [folderDialogOpen, setFolderDialogOpen] = useState(false);
  const [fileDialogOpen, setFileDialogOpen] = useState(false);
  const [editingFolder, setEditingFolder] = useState<{ id?: string; name: string }>({ name: "" });
  const [editingFile, setEditingFile] = useState<{ name: string; type: string }>({ name: "", type: "" });

  const selectedFolder = folders.find(f => f.id === selectedFolderId) || null;

  // Folder CRUD
  const handleSaveFolder = () => {
    if (!editingFolder.name.trim()) return;

    if (editingFolder.id) {
      setFolders(folders.map(f => f.id === editingFolder.id ? { ...f, name: editingFolder.name } : f));
    } else {
      const newFolder: FolderItem = { id: Date.now().toString(), name: editingFolder.name, files: [] };
      setFolders([...folders, newFolder]);
    }
    setFolderDialogOpen(false);
    setEditingFolder({ name: "" });
  };

  const handleDeleteFolder = (id: string) => {
    if (confirm("Delete this folder?")) {
      setFolders(folders.filter(f => f.id !== id));
      if (selectedFolderId === id) setSelectedFolderId(null);
    }
  };

  // File CRUD
  const handleSaveFile = () => {
    if (!editingFile.name.trim()) return;
    if (!selectedFolder) return;

    const updatedFolders = folders.map(f => {
      if (f.id === selectedFolder.id && editingFile.name.trim()) {
        return { ...f, files: [...f.files.filter(file => file.name !== editingFile.name || file.type !== editingFile.type), { ...editingFile, date: new Date().toISOString().split('T')[0] }] };
      }
      return f;
    });
    setFolders(updatedFolders);
    setFileDialogOpen(false);
    setEditingFile({ name: "", type: "" });
  };

  const handleDeleteFile = (file: FileItem) => {
    if (!selectedFolder) return;
    if (confirm("Delete this file?")) {
      setFolders(folders.map(f => f.id === selectedFolder.id ? { ...f, files: f.files.filter(fi => fi !== file) } : f));
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold flex items-center gap-2"><Folder /> Folders</h2>
          <Dialog open={folderDialogOpen} onOpenChange={setFolderDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={() => setEditingFolder({ name: "" })}>New Folder</Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>{editingFolder.id ? "Edit Folder" : "New Folder"}</DialogTitle>
                <DialogDescription>Folder name</DialogDescription>
              </DialogHeader>
              <Input value={editingFolder.name} onChange={e => setEditingFolder({ ...editingFolder, name: e.target.value })} />
              <DialogFooter className="mt-4 flex justify-end gap-2">
                <DialogClose asChild><Button variant="secondary">Cancel</Button></DialogClose>
                <Button onClick={handleSaveFolder}>Save</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        <TableRoot>
          <Table>
            <TableHead>
              <TableRow>
                <TableHeaderCell>Name</TableHeaderCell>
                <TableHeaderCell className="text-right">Actions</TableHeaderCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {folders.map(folder => (
                <TableRow key={folder.id}>
                  <TableCell>
                    <Button variant="ghost" onClick={() => setSelectedFolderId(folder.id)}>{folder.name}</Button>
                  </TableCell>
                  <TableCell className="text-right flex justify-end gap-2">
                    <Button variant="ghost" onClick={() => { setEditingFolder(folder); setFolderDialogOpen(true); }}>
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" onClick={() => handleDeleteFolder(folder.id)}>
                      <Trash2 className="h-4 w-4 text-red-500" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
              {folders.length === 0 && (
                <TableRow>
                  <TableCell colSpan={2} className="text-center text-gray-500">No folders</TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableRoot>
      </Card>

      {selectedFolder && (
        <Card>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold flex items-center gap-2"><FileText /> Files in {selectedFolder.name}</h2>
            <Dialog open={fileDialogOpen} onOpenChange={setFileDialogOpen}>
              <DialogTrigger asChild>
                <Button onClick={() => setEditingFile({ name: "", type: "" })}>Add File</Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-md">
                <DialogHeader>
                  <DialogTitle>{editingFile.name ? "Edit File" : "Add File"}</DialogTitle>
                  <DialogDescription>File details</DialogDescription>
                </DialogHeader>
                <Input placeholder="File name" value={editingFile.name} onChange={e => setEditingFile({ ...editingFile, name: e.target.value })} className="mb-2" />
                <Input placeholder="Type (PDF, TXT, etc.)" value={editingFile.type} onChange={e => setEditingFile({ ...editingFile, type: e.target.value })} />
                <DialogFooter className="mt-4 flex justify-end gap-2">
                  <DialogClose asChild><Button variant="secondary">Cancel</Button></DialogClose>
                  <Button onClick={handleSaveFile}>Save</Button>
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
                  <TableHeaderCell>Date</TableHeaderCell>
                  <TableHeaderCell className="text-right">Actions</TableHeaderCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {selectedFolder.files.map((file, index) => (
                  <TableRow key={index}>
                    <TableCell>{file.name}</TableCell>
                    <TableCell>{file.type}</TableCell>
                    <TableCell>{file.date}</TableCell>
                    <TableCell className="text-right flex justify-end gap-2">
                      <Button variant="ghost" onClick={() => { setEditingFile(file); setFileDialogOpen(true); }}>
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" onClick={() => handleDeleteFile(file)}>
                        <Trash2 className="h-4 w-4 text-red-500" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
                {selectedFolder.files.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={4} className="text-center text-gray-500">No files</TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableRoot>
        </Card>
      )}
    </div>
  );
}
