'use client';

import { useCallback, useState } from 'react';
import { Upload } from 'lucide-react';

export default function UploadDropzone({
  onUpload,
  loading,
  progress,
}: {
  onUpload: (file: File) => void;
  loading?: boolean;
  progress?: number;
}) {
  const [dragOver, setDragOver] = useState(false);

  const handleFile = useCallback(
    (file: File) => {
      const ext = file.name.toLowerCase();
      if (!ext.endsWith('.pdf') && !ext.endsWith('.docx')) {
        alert('Only PDF and DOCX files are allowed');
        return;
      }
      onUpload(file);
    },
    [onUpload]
  );

  return (
    <div
      onDragOver={(e) => {
        e.preventDefault();
        setDragOver(true);
      }}
      onDragLeave={() => setDragOver(false)}
      onDrop={(e) => {
        e.preventDefault();
        setDragOver(false);
        const file = e.dataTransfer.files[0];
        if (file) handleFile(file);
      }}
      className={`flex flex-col items-center justify-center rounded-xl border-2 border-dashed p-12 transition ${
        dragOver ? 'border-primary-500 bg-primary-50' : 'border-slate-300 bg-white'
      }`}
    >
      <Upload className="mb-4 text-slate-400" size={48} />
      <p className="mb-2 text-lg font-medium text-slate-700">
        {loading ? `Processing resume with AI... ${progress || 0}%` : 'Drag & drop your resume here'}
      </p>
      {loading && (
        <div className="mb-4 w-full max-w-xs rounded-full bg-slate-200">
          <div
            className="h-2 rounded-full bg-primary-600 transition-all duration-300"
            style={{ width: `${progress || 0}%` }}
          ></div>
        </div>
      )}
      {!loading && <p className="mb-4 text-sm text-slate-500">PDF or DOCX, max 5MB</p>}
      <label className="cursor-pointer rounded-lg bg-primary-600 px-4 py-2 text-sm font-medium text-white hover:bg-primary-700">
        Browse Files
        <input
          type="file"
          accept=".pdf,.docx"
          className="hidden"
          disabled={loading}
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) handleFile(file);
          }}
        />
      </label>
    </div>
  );
}
