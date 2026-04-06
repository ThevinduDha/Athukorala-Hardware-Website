import React, { useEffect, useState } from 'react';
import { Upload, X, Loader2, RefreshCw, Trash2, Image as ImageIcon } from 'lucide-react';

const ImageUpload = ({
  onUploadSuccess,
  initialImage = '',
  label = 'Upload Asset Photo'
}) => {
  const [preview, setPreview] = useState(initialImage || null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setPreview(initialImage || null);
  }, [initialImage]);

  const handleUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setLoading(true);
    const localPreview = URL.createObjectURL(file);
    setPreview(localPreview);

    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', 'inventory');

    try {
      const res = await fetch(
        'https://api.cloudinary.com/v1_1/dg9exlyvz/image/upload',
        {
          method: 'POST',
          body: formData
        }
      );

      const data = await res.json();

      if (data.secure_url) {
        setPreview(data.secure_url);
        onUploadSuccess(data.secure_url);
      } else {
        setPreview(initialImage || null);
      }
    } catch (err) {
      console.error('Upload failed');
      setPreview(initialImage || null);
    } finally {
      setLoading(false);
    }
  };

  const removeImage = (e) => {
    e.preventDefault();
    setPreview(null);
    onUploadSuccess('');
  };

  return (
    <div className="relative w-full">
      <div className="group relative w-full h-56 rounded-[24px] border border-white/10 bg-white/[0.02] overflow-hidden">
        {preview ? (
          <>
            <img
              src={preview}
              alt="Preview"
              className="w-full h-full object-cover"
            />

            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />

            <div className="absolute top-4 right-4 flex items-center gap-2 z-20">
              <label className="cursor-pointer w-11 h-11 rounded-full border border-white/10 bg-black/60 backdrop-blur-sm text-white hover:border-[#D4AF37]/40 hover:text-[#D4AF37] transition-all flex items-center justify-center">
                <RefreshCw size={16} />
                <input type="file" className="hidden" onChange={handleUpload} />
              </label>

              <button
                onClick={removeImage}
                className="w-11 h-11 rounded-full border border-white/10 bg-black/60 backdrop-blur-sm text-white hover:border-red-500/40 hover:text-red-400 transition-all flex items-center justify-center"
              >
                <Trash2 size={16} />
              </button>
            </div>

            <div className="absolute bottom-4 left-4 right-4 z-20">
              <div className="rounded-2xl border border-white/10 bg-black/40 backdrop-blur-xl px-4 py-3">
                <p className="text-[11px] uppercase tracking-[0.18em] text-[#D4AF37] font-semibold mb-1">
                  Promotion Image Ready
                </p>
                <p className="text-sm text-white/80">
                  You can keep this image, replace it, or remove it.
                </p>
              </div>
            </div>

            {loading && (
              <div className="absolute inset-0 flex items-center justify-center bg-black/50 z-30">
                <Loader2 className="text-[#D4AF37] animate-spin" size={34} />
              </div>
            )}
          </>
        ) : (
          <label className="cursor-pointer flex flex-col items-center justify-center w-full h-full text-center px-6">
            <div className="w-16 h-16 rounded-2xl border border-white/10 bg-white/[0.03] flex items-center justify-center text-[#D4AF37] mb-4 group-hover:scale-105 transition-transform">
              <Upload size={28} />
            </div>

            <p className="text-sm font-semibold text-white mb-1">{label}</p>
            <p className="text-xs text-gray-500">
              Upload image for landing page and customer dashboard preview
            </p>

            <input type="file" className="hidden" onChange={handleUpload} />

            {loading && (
              <div className="absolute inset-0 flex items-center justify-center bg-black/50 z-30">
                <Loader2 className="text-[#D4AF37] animate-spin" size={34} />
              </div>
            )}
          </label>
        )}
      </div>
    </div>
  );
};

export default ImageUpload;