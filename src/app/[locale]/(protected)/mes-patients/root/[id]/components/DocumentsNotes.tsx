"use client";

import { useState, useEffect } from "react";
import { Loader2 } from "lucide-react";
import {
  getAllFolders,
  getDocumentsByPatient,
  Folder,
  PatientDocument
} from "@/api/medic/FolderFiles";
import FoldersSection from "./medical-history/folders/FoldersSection";
import FilesSection from "./medical-history/folders/FilesSection";


export default function DocumentsNotes({ patientId }: { patientId: string }) {
  const [folders, setFolders] = useState<Folder[]>([]);
  const [documents, setDocuments] = useState<PatientDocument[]>([]);
  const [selectedFolderId, setSelectedFolderId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  // Load initial data
  useEffect(() => {
    loadData();
  }, [patientId]);

  const loadData = async () => {
    try {
      setLoading(true);
      const stored = localStorage.getItem("user");
      const parsed = stored ? JSON.parse(stored) : null;
      const tenantId = parsed?.doctorProfile?.tenantId;
      if (!tenantId) return;
      const [foldersData, documentsData] = await Promise.all([
        getAllFolders(tenantId),
        getDocumentsByPatient(patientId)
      ]);
      setFolders(foldersData);
      setDocuments(documentsData);
    } catch (error) {
      console.error("Error loading data:", error);
    } finally {
      setLoading(false);
    }
  };

  const selectedFolder = folders.find(f => f.id === selectedFolderId) || null;

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <FoldersSection
        folders={folders}
        documents={documents}
        selectedFolderId={selectedFolderId}
        onSelectFolder={setSelectedFolderId}
        onDataChange={loadData}
      />

      {selectedFolder && (
        <FilesSection
          folder={selectedFolder}
          documents={documents.filter(d => d.folderId === selectedFolderId)}
          patientId={patientId}
          onDataChange={loadData}
        />
      )}
    </div>
  );
}