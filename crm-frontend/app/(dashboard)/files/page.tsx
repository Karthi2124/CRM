"use client";

import { useState, useRef } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Upload, Download, Trash2, FileText, Image, Archive } from "lucide-react";
import { filesApi } from "@/lib/api";
import { UploadedFile } from "@/types";
import { PageHeader } from "@/components/layout/PageHeader";
import { DataTable } from "@/components/ui/DataTable";
import { Button } from "@/components/ui/Button";
import { useToast } from "@/lib/providers";
import { format } from "date-fns";
import { AxiosError } from "axios";

function fileIcon(mime: string) {
  if (mime.startsWith("image/")) return <Image size={15} color="var(--accent-cyan)" />;
  if (mime === "application/pdf") return <FileText size={15} color="var(--accent-red)" />;
  return <Archive size={15} color="var(--accent-amber)" />;
}

function formatBytes(bytes: number) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export default function FilesPage() {
  const qc = useQueryClient();
  const { success, error: toastError } = useToast();
  const [page, setPage] = useState(1);
  const [uploading, setUploading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const { data, isLoading } = useQuery({
    queryKey: ["files", page],
    queryFn: () => filesApi.list({ page, limit: 20 }),
  });

  const rows = (data?.data?.data ?? []) as UploadedFile[];
  const pagination = data?.data?.pagination;

  const deleteMutation = useMutation({
    mutationFn: (id: string) => filesApi.delete(id),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["files"] }); success("File deleted"); },
    onError: () => toastError("Failed to delete file"),
  });

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const fd = new FormData();
      fd.append("file", file);
      await filesApi.upload(fd);
      qc.invalidateQueries({ queryKey: ["files"] });
      success("File uploaded", file.name);
    } catch (err) {
      const e = err as AxiosError;
      console.error(e);
      toastError("Upload failed", "Check file type and size limits.");
    } finally {
      setUploading(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  };

  const handleDownload = async (uuid: string, name: string) => {
    try {
      const res = await filesApi.download(uuid);
      const url = URL.createObjectURL(new Blob([res.data as BlobPart]));
      const a = document.createElement("a");
      a.href = url;
      a.download = name;
      a.click();
      URL.revokeObjectURL(url);
    } catch {
      toastError("Download failed");
    }
  };

  const columns = [
    { key: "original_name", label: "File", render: (r: UploadedFile) => (
      <div className="flex-gap-2">
        {fileIcon(r.mimetype)}
        <span className="cell-primary">{r.original_name}</span>
      </div>
    )},
    { key: "mimetype", label: "Type", render: (r: UploadedFile) => <span className="text-xs text-muted">{r.mimetype}</span> },
    { key: "size", label: "Size", render: (r: UploadedFile) => formatBytes(r.size) },
    { key: "uploader", label: "Uploaded By", render: (r: UploadedFile) => r.uploader ? `${r.uploader.first_name} ${r.uploader.last_name}` : <span className="text-muted">—</span> },
    { key: "created_at", label: "Uploaded At", render: (r: UploadedFile) => format(new Date(r.created_at), "dd MMM yyyy, HH:mm") },
    { key: "actions", label: "", width: "80px", render: (r: UploadedFile) => (
      <div className="flex-gap-2">
        <button className="btn btn-ghost btn-icon btn-sm" onClick={() => handleDownload(r.uuid, r.original_name)} title="Download"><Download size={14} /></button>
        <button className="btn btn-danger btn-icon btn-sm" onClick={() => deleteMutation.mutate(r.id)} title="Delete"><Trash2 size={14} /></button>
      </div>
    )},
  ];

  return (
    <div>
      <PageHeader
        title="Files"
        subtitle="Manage uploaded documents and files"
        action={
          <>
            <input ref={inputRef} type="file" style={{ display: "none" }} onChange={handleUpload} />
            <Button loading={uploading} onClick={() => inputRef.current?.click()}>
              <Upload size={15} /> Upload File
            </Button>
          </>
        }
      />
      <DataTable
        columns={columns}
        data={rows as unknown as Record<string, unknown>[]}
        loading={isLoading}
        pagination={pagination ? { ...pagination, onPageChange: setPage } : undefined}
      />
    </div>
  );
}
