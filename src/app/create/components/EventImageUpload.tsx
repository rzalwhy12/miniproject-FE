'use client';
import React from 'react';
import { Button } from '@/components/ui/button';
import { Upload, Zap } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '@/lib/redux/hook';
import { createEventForm } from '@/lib/redux/features/createEvenSlice';
import { toast } from 'sonner';


interface EventImageUploadProps {
  image: File | null;
  setImage: (file: File | null) => void;
}

const EventImageUpload: React.FC<EventImageUploadProps> = ({ image, setImage }) => {
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 10 * 1024 * 1024) {
      toast.warning('file size');
      return;
    }
    setImage(file);
  };

  return (
    <div className="h-72 bg-gradient-to-br from-purple-100/50 via-white/60 to-cyan-100/50 relative flex items-center justify-center group">
      <div className="absolute inset-0 bg-gradient-to-r from-purple-200/30 via-pink-200/30 to-cyan-200/30 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

      {image ? (
        <div className="relative w-full h-full group">
          <img
            src={URL.createObjectURL(image)}
            alt="Event preview"
            className="w-full h-full object-cover rounded-lg"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
          <div className="absolute bottom-4 left-4 text-white">
            <p className="text-sm font-medium">Image Preview</p>
            <p className="text-xs opacity-80">{image.name}</p>
            <p className="text-xs opacity-60">
              {(image.size / 1024 / 1024).toFixed(2)} MB
            </p>
          </div>
          <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
            <p className="text-white text-sm font-medium">
              Click to change image
            </p>
          </div>
        </div>
      ) : (
        <div className="text-center text-gray-700 relative z-10">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full mb-4 shadow-lg">
            <Upload className="w-10 h-10 text-white" />
          </div>
          <p className="text-xl font-semibold mb-2 bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
            Upload Event Visual
          </p>
          <p className="text-sm text-gray-600 mb-1">
            Drag & drop or click to upload
          </p>
          <p className="text-xs text-gray-500">
            JPG, PNG, WebP • Max 10MB • 1920×1080 recommended
          </p>
        </div>
      )}

      <input
        type="file"
        name="image"
        accept="image/jpeg,image/jpg,image/png,image/webp"
        onChange={handleImageChange}
        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-20"
      />

      <Button
        type="button"
        size="sm"
        className="absolute top-4 right-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:from-purple-600 hover:to-pink-600 border-0 shadow-lg z-30"
      >
        <Zap className="w-4 h-4" />
      </Button>
    </div>
  );
};

export default EventImageUpload;
