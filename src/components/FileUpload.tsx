'use client';

import { Card } from '@/components/Card';
import { ProgressBar } from '@/components/ProgressBar';
import {
  RiCloseCircleLine,
  RiDeleteBin7Line,
  RiFileLine,
} from '@remixicon/react';
import { useRef, useState, useEffect, useCallback } from 'react';

type FileStatus = 'uploading' | 'completed';

interface UploadedFile {
  id: string;
  name: string;
  size: number;
  type: string;
  progress: number;           // 0-100
  status: FileStatus;
  cancelToken?: AbortController;
}

const MAX_SIZE = 100 * 1024 * 1024; // 100 MB

export default function FileUpload() {
  const [files, setFiles] = useState<UploadedFile[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);

  // ------------------------------------------------------------------ //
  //  Helpers
  // ------------------------------------------------------------------ //
  const formatBytes = (bytes: number) => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return `${parseFloat((bytes / Math.pow(k, i)).toFixed(1))} ${sizes[i]}`;
  };

  const getFileIcon = () => {
    return <RiFileLine className="size-7 shrink-0 text-gray-500 dark:text-gray-500" />;
  };

  // ------------------------------------------------------------------ //
  //  Upload simulation (replace with real API call)
  // ------------------------------------------------------------------ //
  const simulateUpload = async (file: UploadedFile) => {
    const controller = new AbortController();
    const updated = { ...file, cancelToken: controller };
    setFiles((prev) => prev.map((f) => (f.id === file.id ? updated : f)));

    const chunk = 5; // % per interval
    const interval = 80; // ms

    const timer = setInterval(() => {
      setFiles((prev) => {
        const target = prev.find((f) => f.id === file.id);
        if (!target) return prev;

        if (target.progress >= 100) {
          clearInterval(timer);
          return prev.map((f) =>
            f.id === file.id ? { ...f, progress: 100, status: 'completed' as const } : f
          );
        }

        const newProgress = Math.min(target.progress + chunk, 100);
        return prev.map((f) =>
          f.id === file.id ? { ...f, progress: newProgress } : f
        );
      });
    }, interval);

    controller.signal.addEventListener('abort', () => {
      clearInterval(timer);
      setFiles((prev) => prev.filter((f) => f.id !== file.id));
    });
  };

  // ------------------------------------------------------------------ //
  //  File validation + start upload
  // ------------------------------------------------------------------ //
  const startUpload = (rawFile: File) => {
    if (rawFile.size > MAX_SIZE) {
      alert(`${rawFile.name} dépasse la limite de 100 Mo`);
      return;
    }

    const newFile: UploadedFile = {
      id: `${Date.now()}-${rawFile.name}`,
      name: rawFile.name,
      size: rawFile.size,
      type: rawFile.type,
      progress: 0,
      status: 'uploading',
    };

    setFiles((prev) => [...prev, newFile]);
    simulateUpload(newFile);
  };

  // ------------------------------------------------------------------ //
  //  Drag & Drop handlers
  // ------------------------------------------------------------------ //
  const handleDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const dropped = Array.from(e.dataTransfer.files);
    dropped.forEach(startUpload);
  }, []);

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  const handleChooseFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      Array.from(e.target.files).forEach(startUpload);
    }
    e.target.value = '';
  };

  // ------------------------------------------------------------------ //
  //  Cancel / Remove
  // ------------------------------------------------------------------ //
  const cancelUpload = (id: string) => {
    setFiles((prev) => {
      const file = prev.find((f) => f.id === id);
      file?.cancelToken?.abort();
      return prev.filter((f) => f.id !== id);
    });
  };

  const removeCompleted = (id: string) => {
    setFiles((prev) => prev.filter((f) => f.id !== id));
  };

  // ------------------------------------------------------------------ //
  //  Split lists
  // ------------------------------------------------------------------ //
  const inProgress = files.filter((f) => f.status === 'uploading');
  const completed = files.filter((f) => f.status === 'completed');

  // ------------------------------------------------------------------ //
  //  Render
  // ------------------------------------------------------------------ //
  return (
    <div className="mt-6">
      <div className="w-full">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-50">
          Ajouter des fichiers de patients
        </h3>

        {/* ---------- Drop zone ---------- */}
        <div
          className="mt-4 flex justify-center rounded-lg dark:bg-gray-[#030712] border border-dashed border-gray-300 px-6 py-16 dark:border-gray-800"
          onDrop={handleDrop}
          onDragOver={handleDragOver}
        >
          <div className='dark:bg-gray-[#030712] '>
            <RiFileLine
              className="mx-auto size-12 text-gray-400 dark:text-gray-500"
              aria-hidden
            />
            <div className="mt-4 flex text-sm/6 text-gray-700 dark:text-gray-300">
              <p>Glissez et déposez ou</p>
              <label
                htmlFor="file-upload-dynamic"
                className="relative cursor-pointer rounded-md pl-1 font-medium text-blue-500 hover:underline hover:underline-offset-4 dark:text-blue-500"
              >
                <span>choisir un fichier</span>
                <input
                  ref={inputRef}
                  id="file-upload-dynamic"
                  name="file-upload-dynamic"
                  type="file"
                  multiple
                  className="sr-only"
                  onChange={handleChooseFile}
                />
              </label>
              <p className="pl-1">pour télécharger</p>
            </div>
            <p className="text-center text-xs/5 text-gray-500 dark:text-gray-500">
              Tous types de fichiers jusqu&apos;à 100 Mo
            </p>
          </div>
        </div>

        {/* ---------- In Progress ---------- */}
        {inProgress.length > 0 && (
          <>
            <h4 className="mt-6 text-sm text-gray-500 dark:text-gray-500">
              En cours
            </h4>
            <ul
              role="list"
              className="mt-2 divide-y divide-gray-200 text-sm dark:divide-gray-800"
            >
              {inProgress.map((file) => (
                <li key={file.id} className="py-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2.5">
                      {getFileIcon()}
                      <div>
                        <p className="text-xs font-medium text-gray-900 dark:text-gray-50">
                          {file.name}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-500">
                          {formatBytes(file.size)}
                        </p>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => cancelUpload(file.id)}
                      className="text-gray-400 hover:text-gray-500 dark:text-gray-600 hover:dark:text-gray-500"
                      aria-label="Annuler"
                    >
                      <RiCloseCircleLine className="size-5 shrink-0" aria-hidden />
                    </button>
                  </div>
                  <div className="mt-2 flex items-center space-x-3">
                    <ProgressBar value={file.progress} className="[&>*]:h-1.5" />
                    <span className="text-xs text-gray-500 dark:text-gray-500">
                      {file.progress}%
                    </span>
                  </div>
                </li>
              ))}
            </ul>
          </>
        )}

        {/* ---------- Completed Uploads ---------- */}
        {completed.length > 0 && (
          <>
            <h4 className="mt-6 text-sm text-gray-500 dark:text-gray-500">
              Fichiers téléchargés
            </h4>
            <ul
              role="list"
              className="mt-2 divide-y divide-gray-200 dark:divide-gray-800"
            >
              {completed.map((file) => (
                <li key={file.id} className="flex items-center justify-between py-4">
                  <div className="flex items-center space-x-2.5">
                    {getFileIcon()}
                    <div>
                      <p className="text-xs font-medium text-gray-900 dark:text-gray-50">
                        {file.name}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-500">
                        {formatBytes(file.size)}
                      </p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => removeCompleted(file.id)}
                    className="text-red-500 hover:text-red-600 dark:text-red-500 hover:dark:text-red-400"
                    aria-label="Supprimer"
                  >
                    <RiDeleteBin7Line className="size-5 shrink-0" aria-hidden />
                  </button>
                </li>
              ))}
            </ul>
          </>
        )}
      </div>
    </div>
  );
}
