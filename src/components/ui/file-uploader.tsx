
import React, { useCallback, useState } from 'react';
import { cn } from '@/lib/utils';
import { Upload, X, Check, AlertCircle, Camera, FileText } from 'lucide-react';
import { GlassCard } from './glass-card';
import { Progress } from './progress';

interface FileWithPreview extends File {
  preview?: string;
  id: string;
  uploadProgress?: number;
  status?: 'uploading' | 'completed' | 'error';
}

interface FileUploaderProps {
  onFilesChange: (files: FileWithPreview[]) => void;
  accept?: string;
  multiple?: boolean;
  maxFiles?: number;
  maxSize?: number;
  title?: string;
  description?: string;
  className?: string;
  showPreview?: boolean;
}

export const FileUploader: React.FC<FileUploaderProps> = ({
  onFilesChange,
  accept = "image/*",
  multiple = true,
  maxFiles = 4,
  maxSize = 5 * 1024 * 1024, // 5MB
  title = "Upload Files",
  description = "Drag and drop files here or click to browse",
  className,
  showPreview = true
}) => {
  const [files, setFiles] = useState<FileWithPreview[]>([]);
  const [isDragActive, setIsDragActive] = useState(false);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const newFiles = acceptedFiles.slice(0, maxFiles - files.length).map((file) => {
      const fileWithPreview = Object.assign(file, {
        id: Math.random().toString(36),
        preview: file.type.startsWith('image/') ? URL.createObjectURL(file) : undefined,
        uploadProgress: 0,
        status: 'uploading' as const
      });

      // Simulate upload progress
      const interval = setInterval(() => {
        setFiles(currentFiles => 
          currentFiles.map(f => {
            if (f.id === fileWithPreview.id && f.uploadProgress! < 100) {
              const newProgress = Math.min(f.uploadProgress! + Math.random() * 30, 100);
              return {
                ...f,
                uploadProgress: newProgress,
                status: newProgress === 100 ? 'completed' : 'uploading'
              };
            }
            return f;
          })
        );
      }, 200);

      setTimeout(() => clearInterval(interval), 3000);

      return fileWithPreview;
    });

    setFiles(prev => {
      const updated = [...prev, ...newFiles];
      onFilesChange(updated);
      return updated;
    });
  }, [files.length, maxFiles, onFilesChange]);

  const removeFile = (id: string) => {
    setFiles(prev => {
      const updated = prev.filter(file => file.id !== id);
      onFilesChange(updated);
      return updated;
    });
  };

  const handleDragEnter = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragActive(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragActive(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragActive(false);
    const droppedFiles = Array.from(e.dataTransfer.files);
    onDrop(droppedFiles);
  };

  return (
    <div className={cn("space-y-4", className)}>
      <GlassCard
        className={cn(
          "relative border-2 border-dashed transition-all duration-200 cursor-pointer",
          isDragActive
            ? "border-petinsure-teal-400 bg-petinsure-teal-50/50"
            : "border-gray-300 hover:border-petinsure-teal-300"
        )}
        onDragEnter={handleDragEnter}
        onDragOver={(e) => e.preventDefault()}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => document.getElementById('file-input')?.click()}
      >
        <div className="p-8 text-center">
          <div className="w-16 h-16 mx-auto mb-4 bg-gradient-primary rounded-full flex items-center justify-center">
            <Upload size={24} className="text-white" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">{title}</h3>
          <p className="text-gray-600 mb-4">{description}</p>
          <p className="text-sm text-gray-500">
            Max {maxFiles} files, up to {Math.round(maxSize / 1024 / 1024)}MB each
          </p>
        </div>
        
        <input
          id="file-input"
          type="file"
          accept={accept}
          multiple={multiple}
          onChange={(e) => e.target.files && onDrop(Array.from(e.target.files))}
          className="hidden"
        />
      </GlassCard>

      {/* File Previews */}
      {showPreview && files.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {files.map((file) => (
            <GlassCard key={file.id} className="p-4">
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0">
                  {file.preview ? (
                    <img
                      src={file.preview}
                      alt={file.name}
                      className="w-12 h-12 object-cover rounded-lg"
                    />
                  ) : (
                    <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
                      <FileText size={20} className="text-gray-400" />
                    </div>
                  )}
                </div>
                
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">
                    {file.name}
                  </p>
                  <p className="text-xs text-gray-500">
                    {(file.size / 1024 / 1024).toFixed(2)} MB
                  </p>
                  
                  {file.status === 'uploading' && (
                    <div className="mt-2">
                      <Progress value={file.uploadProgress} className="h-1" />
                      <p className="text-xs text-gray-500 mt-1">
                        Uploading... {Math.round(file.uploadProgress || 0)}%
                      </p>
                    </div>
                  )}
                  
                  {file.status === 'completed' && (
                    <div className="flex items-center gap-1 mt-1">
                      <Check size={14} className="text-green-500" />
                      <span className="text-xs text-green-600">Uploaded</span>
                    </div>
                  )}
                </div>
                
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    removeFile(file.id);
                  }}
                  className="p-1 hover:bg-white/10 rounded-full transition-colors"
                >
                  <X size={16} className="text-gray-400" />
                </button>
              </div>
            </GlassCard>
          ))}
        </div>
      )}
    </div>
  );
};
