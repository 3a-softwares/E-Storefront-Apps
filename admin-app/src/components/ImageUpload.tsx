import React, { useState, useRef } from 'react';
import { Button, Spinner } from '@3asoftwares/ui';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUpload, faImage, faTimes, faLink } from '@fortawesome/free-solid-svg-icons';

interface ImageUploadProps {
  currentImage?: string;
  onImageUpload: (imageUrl: string) => void;
  onRemove?: () => void;
}

export const ImageUpload: React.FC<ImageUploadProps> = ({
  currentImage,
  onImageUpload,
  onRemove,
}) => {
  const [uploading, setUploading] = useState(false);
  const [preview, setPreview] = useState<string | null>(currentImage || null);
  const [error, setError] = useState<string | null>(null);
  const [useUrlInput, setUseUrlInput] = useState(false);
  const [urlInput, setUrlInput] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const CLOUDINARY_CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
  const CLOUDINARY_UPLOAD_PRESET = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;

  const isCloudinaryConfigured = CLOUDINARY_CLOUD_NAME && CLOUDINARY_UPLOAD_PRESET && 
    CLOUDINARY_CLOUD_NAME !== 'your-cloud-name' && CLOUDINARY_UPLOAD_PRESET !== 'your-upload-preset';

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setError('Please select an image file');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setError('Image size should be less than 5MB');
      return;
    }

    setError(null);

    if (!isCloudinaryConfigured) {
      const localUrl = URL.createObjectURL(file);
      setPreview(localUrl);
      const placeholderUrl = `https://placehold.co/400x400/e2e8f0/64748b?text=${encodeURIComponent(file.name.substring(0, 10))}`;
      onImageUpload(placeholderUrl);
      setError('Cloudinary not configured. Using placeholder image.');
      return;
    }

    setUploading(true);

    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('upload_preset', CLOUDINARY_UPLOAD_PRESET);
      formData.append('cloud_name', CLOUDINARY_CLOUD_NAME);

      const response = await fetch(
        `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`,
        {
          method: 'POST',
          body: formData,
        }
      );

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error?.message || 'Upload failed');
      }

      const data = await response.json();
      const imageUrl = data.secure_url;

      setPreview(imageUrl);
      onImageUpload(imageUrl);
    } catch (err: any) {
      setError(err.message || 'Failed to upload image. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  const handleUrlSubmit = () => {
    if (!urlInput.trim()) {
      setError('Please enter a valid URL');
      return;
    }
    
    // Basic URL validation
    try {
      new URL(urlInput);
      setPreview(urlInput);
      onImageUpload(urlInput);
      setError(null);
      setUseUrlInput(false);
      setUrlInput('');
    } catch {
      setError('Please enter a valid URL');
    }
  };

  const handleRemove = () => {
    setPreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    if (onRemove) {
      onRemove();
    }
  };

  return (
    <div className="space-y-3">
      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
        Product Image
      </label>

      {preview ? (
        <div className="relative inline-block">
          <img
            src={preview}
            alt="Product preview"
            className="w-full max-w-xs h-48 object-cover rounded-lg border-2 border-gray-300 dark:border-gray-600"
          />
          <Button variant="ghost" onClick={handleRemove}>
            <FontAwesomeIcon icon={faTimes} />
          </Button>
        </div>
      ) : useUrlInput ? (
        <div className="space-y-3">
          <div className="flex gap-2">
            <input
              type="url"
              value={urlInput}
              onChange={(e) => setUrlInput(e.target.value)}
              placeholder="Enter image URL..."
              className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-blue-500"
            />
            <Button type="button" variant="primary" size="sm" onClick={handleUrlSubmit}>
              Add
            </Button>
          </div>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => setUseUrlInput(false)}
            className="!w-auto"
          >
            ← Back to upload
          </Button>
        </div>
      ) : (
        <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-8 text-center hover:border-blue-500 dark:hover:border-blue-400 transition-colors">
          <FontAwesomeIcon
            icon={faImage}
            className="text-4xl text-gray-400 dark:text-gray-500 mb-3"
          />
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
            Click to upload or drag and drop
          </p>
          <p className="text-xs text-gray-500 dark:text-gray-500 mb-4">PNG, JPG, GIF up to 5MB</p>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileSelect}
            className="hidden"
            id="image-upload"
          />
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => fileInputRef.current?.click()}
            disabled={uploading}
          >
            {uploading ? (
              <>
                <Spinner size="sm" className="mr-2" />
                Uploading...
              </>
            ) : (
              <>
                <FontAwesomeIcon icon={faUpload} className="mr-2" />
                Select Image
              </>
            )}
          </Button>
          <div className="mt-3">
            <button
              type="button"
              onClick={() => setUseUrlInput(true)}
              className="text-sm text-blue-600 dark:text-blue-400 hover:underline"
            >
              <FontAwesomeIcon icon={faLink} className="mr-1" />
              Or use image URL
            </button>
          </div>
        </div>
      )}

      {error && <p className="text-sm text-red-600 dark:text-red-400">{error}</p>}

      {uploading && (
        <div className="flex items-center gap-2 text-sm text-blue-600 dark:text-blue-400">
          <Spinner size="sm" />
          <span>Uploading image...</span>
        </div>
      )}
    </div>
  );
};
