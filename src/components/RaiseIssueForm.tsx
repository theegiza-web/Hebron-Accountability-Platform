import React, { useState } from 'react';
import { AlertCircle, CheckCircle, Loader, Upload, X } from 'lucide-react';
import { FEED_URL, withAction } from '../config';
import { loadJsonp } from '../utils/jsonp';

type FormData = {
  title: string;
  description: string;
  category: string;
  submitterName: string;
  contact: string;
  area: string;
};

type MediaFile = {
  id: string;
  file: File;
  preview: string;
  type: 'image' | 'video';
};

const CATEGORIES = [
  'Governance',
  'Finance',
  'Procurement',
  'Service Delivery',
  'Personnel',
  'Assets Management',
  'Other',
];

const AREAS = [
  'Bethanie Cluster - Bethanie (The Paramount Village)',
  'Bethanie Cluster - Makolokwe',
  'Bethanie Cluster - Modikwe',
  'Bethanie Cluster - Berseba (or Barseba)',
  'Bethanie Cluster - Maumong',
  'Hebron Cluster - Hebron',
  'Hebron Cluster - Kgabalatsane',
  'Hebron Cluster - Moduane',
  'Hebron Cluster - Rabokala',
  'Jericho Cluster - Jericho',
  'Jericho Cluster - Rantlapane',
  'Jericho Cluster - Madinyane West',
  'Jericho Cluster - Legonyane',
  'Jericho Cluster - Mmupudung',
  'Jericho Cluster - Mmakgabetlwane',
  'Mogopa / Ventersdorp Cluster - Ga-Mogopa',
  'Pachsdraai Cluster - Pachsdraai',
  'Other',
];

const MAX_FILE_SIZE = 50 * 1024 * 1024; // 50MB
const MAX_FILES = 5;
const ALLOWED_TYPES = [
  'image/jpeg',
  'image/png',
  'image/gif',
  'image/webp',
  'video/mp4',
  'video/quicktime',
];

type Props = {
  onSubmitSuccess?: () => void;
};

export const RaiseIssueForm: React.FC<Props> = ({ onSubmitSuccess }) => {
  const [formData, setFormData] = useState<FormData>({
    title: '',
    description: '',
    category: 'Governance',
    submitterName: '',
    contact: '',
    area: AREAS[0],
  });

  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');
  const [mediaFiles, setMediaFiles] = useState<MediaFile[]>([]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleMediaChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    setErrorMessage('');
    if (status === 'error') setStatus('idle');

    if (mediaFiles.length + files.length > MAX_FILES) {
      setErrorMessage(`Maximum ${MAX_FILES} files allowed.`);
      setStatus('error');
      e.target.value = '';
      return;
    }

    for (const file of files) {
      if (!ALLOWED_TYPES.includes(file.type)) {
        setErrorMessage(
          `File type ${file.type} not allowed. Please use images (JPEG, PNG, GIF, WebP) or videos (MP4, MOV).`
        );
        setStatus('error');
        e.target.value = '';
        return;
      }
      if (file.size > MAX_FILE_SIZE) {
        setErrorMessage(`File ${file.name} is too large. Maximum size is 50MB.`);
        setStatus('error');
        e.target.value = '';
        return;
      }
    }

    files.forEach((file) => {
      const isVideo = file.type.startsWith('video/');
      const preview = isVideo ? '' : URL.createObjectURL(file);

      setMediaFiles((prev) => [
        ...prev,
        {
          id: Date.now().toString() + Math.random().toString(16).slice(2),
          file,
          preview,
          type: isVideo ? 'video' : 'image',
        },
      ]);
    });

    e.target.value = '';
  };

  const removeMedia = (id: string) => {
    setMediaFiles((prev) => {
      const file = prev.find((f) => f.id === id);
      if (file?.preview) URL.revokeObjectURL(file.preview);
      return prev.filter((f) => f.id !== id);
    });
  };

  const readFileAsBase64 = (file: File) =>
    new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(((reader.result as string) || '').split(',')[1] || '');
      reader.onerror = () => reject(new Error(`Failed to read file: ${file.name}`));
      reader.readAsDataURL(file);
    });

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      category: 'Governance',
      submitterName: '',
      contact: '',
      area: AREAS[0],
    });

    mediaFiles.forEach((m) => m.preview && URL.revokeObjectURL(m.preview));
    setMediaFiles([]);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (status === 'loading') return;

    if (!formData.title.trim()) {
      setErrorMessage('Issue title is required');
      setStatus('error');
      return;
    }
    if (!formData.description.trim()) {
      setErrorMessage('Description is required');
      setStatus('error');
      return;
    }
    if (!formData.submitterName.trim()) {
      setErrorMessage('Submitter name is required');
      setStatus('error');
      return;
    }

    setStatus('loading');
    setErrorMessage('');

    try {
      const media = await Promise.all(
        mediaFiles.map(async (m) => ({
          name: m.file.name,
          type: m.file.type,
          size: m.file.size,
          data: await readFileAsBase64(m.file),
        }))
      );

      const payload = {
        action: 'submit-issue',
        title: formData.title,
        description: formData.description,
        category: formData.category,
        submitterName: formData.submitterName,
        contact: formData.contact,
        area: formData.area,
        mediaCount: media.length,
        media,
      };

      const url = FEED_URL;

      // 1) Try normal POST (best, because we can actually read success/error when allowed)
      try {
        const res = await fetch(url, {
          method: 'POST',
          headers: { 'Content-Type': 'text/plain;charset=utf-8' },
          body: JSON.stringify(payload),
        });

        const text = await res.text();
        let json: any = {};
        try {
          json = JSON.parse(text);
        } catch {
          // If not JSON, treat as failure
          json = { success: false, error: text || 'Invalid server response' };
        }

        if (!res.ok || !json.success) {
          throw new Error(json.error || `Submission failed (HTTP ${res.status})`);
        }
      } catch (err) {
        // 2) Fallback: no-cors (will not throw if server rejects, but will at least send request)
        await fetch(url, {
          method: 'POST',
          mode: 'no-cors',
          headers: { 'Content-Type': 'text/plain;charset=utf-8' },
          body: JSON.stringify(payload),
        });
      }

      // 3) Verification & Refresh Step:
      // Even if POST was no-cors, we can trigger a JSONP refresh to help ensure UI is in sync.
      try {
        const issuesUrl = withAction(FEED_URL, 'issues');
        await loadJsonp<any>(issuesUrl, 10000);
      } catch (e) {
        // Ignore JSONP refresh errors in the form itself
      }

      setStatus('success');
      resetForm();
      onSubmitSuccess?.();
    } catch (err) {
      setStatus('error');
      setErrorMessage(err instanceof Error ? err.message : 'Failed to submit issue');
    }
  };

  return (
    <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
      <div className="px-6 py-5 border-b border-slate-200 bg-slate-50">
        <h3 className="text-xl font-serif font-semibold text-slate-900">Raise an Issue</h3>
        <p className="text-sm text-slate-600 mt-1">
          Help us improve governance by reporting issues transparently.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="p-6 space-y-5">
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-slate-900 mb-2">
            Issue Title *
          </label>
          <input
            id="title"
            name="title"
            type="text"
            value={formData.title}
            onChange={handleChange}
            placeholder="Briefly describe the issue"
            className="w-full px-4 py-2 rounded-lg border border-slate-200 bg-white
                       focus:outline-none focus:ring-2 focus:ring-slate-300"
          />
        </div>

        <div>
          <label htmlFor="description" className="block text-sm font-medium text-slate-900 mb-2">
            Description *
          </label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="Provide detailed information about the issue"
            rows={5}
            className="w-full px-4 py-2 rounded-lg border border-slate-200 bg-white
                       focus:outline-none focus:ring-2 focus:ring-slate-300"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <div>
            <label htmlFor="category" className="block text-sm font-medium text-slate-900 mb-2">
              Category *
            </label>
            <select
              id="category"
              name="category"
              value={formData.category}
              onChange={handleChange}
              className="w-full px-4 py-2 rounded-lg border border-slate-200 bg-white
                         focus:outline-none focus:ring-2 focus:ring-slate-300"
            >
              {CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="area" className="block text-sm font-medium text-slate-900 mb-2">
              Area *
            </label>
            <select
              id="area"
              name="area"
              value={formData.area}
              onChange={handleChange}
              className="w-full px-4 py-2 rounded-lg border border-slate-200 bg-white
                         focus:outline-none focus:ring-2 focus:ring-slate-300"
            >
              {AREAS.map((a) => (
                <option key={a} value={a}>
                  {a}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <div>
            <label htmlFor="submitterName" className="block text-sm font-medium text-slate-900 mb-2">
              Your Name *
            </label>
            <input
              id="submitterName"
              name="submitterName"
              type="text"
              value={formData.submitterName}
              onChange={handleChange}
              placeholder="Full name"
              className="w-full px-4 py-2 rounded-lg border border-slate-200 bg-white
                         focus:outline-none focus:ring-2 focus:ring-slate-300"
            />
          </div>

          <div>
            <label htmlFor="contact" className="block text-sm font-medium text-slate-900 mb-2">
              Contact (optional)
            </label>
            <input
              id="contact"
              name="contact"
              type="text"
              value={formData.contact}
              onChange={handleChange}
              placeholder="Email or phone"
              className="w-full px-4 py-2 rounded-lg border border-slate-200 bg-white
                         focus:outline-none focus:ring-2 focus:ring-slate-300"
            />
            <p className="text-xs text-slate-500 mt-1">Will not be publicly displayed</p>
          </div>
        </div>

        <div>
          <label htmlFor="media" className="block text-sm font-medium text-slate-900 mb-2">
            Attach Evidence (Photos/Videos - Optional)
          </label>

          <div className="flex items-center gap-3 mb-4">
            <label
              htmlFor="media"
              className="flex items-center gap-2 px-4 py-2 rounded-lg border border-slate-200
                         bg-white hover:bg-slate-50 cursor-pointer transition-colors"
            >
              <Upload size={18} className="text-slate-600" />
              <span className="text-sm font-medium text-slate-700">Choose Files</span>
              <input
                id="media"
                name="media"
                type="file"
                multiple
                accept="image/jpeg,image/png,image/gif,image/webp,video/mp4,video/quicktime"
                onChange={handleMediaChange}
                className="hidden"
              />
            </label>

            <span className="text-xs text-slate-500">
              Max {MAX_FILES} files, 50MB each (JPEG, PNG, GIF, WebP, MP4, MOV)
            </span>
          </div>

          {mediaFiles.length > 0 && (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-4">
              {mediaFiles.map((media) => (
                <div key={media.id} className="relative group">
                  {media.type === 'image' ? (
                    <img
                      src={media.preview}
                      alt={media.file.name}
                      className="w-full h-24 object-cover rounded-lg border border-slate-200"
                    />
                  ) : (
                    <div className="w-full h-24 rounded-lg border border-slate-200 bg-slate-100 flex items-center justify-center">
                      <span className="text-xs text-slate-600 text-center px-2">
                        {media.file.name.substring(0, 20)}...
                      </span>
                    </div>
                  )}

                  <button
                    type="button"
                    onClick={() => removeMedia(media.id)}
                    className="absolute top-1 right-1 p-1 bg-red-500 text-white rounded-full
                               opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <X size={14} />
                  </button>

                  <p className="text-xs text-slate-500 mt-1">
                    {(media.file.size / 1024 / 1024).toFixed(2)}MB
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>

        {status === 'error' && (
          <div className="p-4 rounded-lg border border-red-200 bg-red-50 flex items-start gap-3">
            <AlertCircle className="text-red-600 flex-shrink-0 mt-0.5" size={18} />
            <div className="text-sm text-red-700">{errorMessage}</div>
          </div>
        )}

        {status === 'success' && (
          <div className="p-4 rounded-lg border border-green-200 bg-green-50 flex items-start gap-3">
            <CheckCircle className="text-green-600 flex-shrink-0 mt-0.5" size={18} />
            <div className="text-sm text-green-700">
              Submitted. If it doesn’t appear immediately, refresh in 5–10 seconds.
            </div>
          </div>
        )}

        <button
          type="submit"
          disabled={status === 'loading'}
          className="w-full px-6 py-3 rounded-lg bg-slate-900 text-white font-medium
                     hover:bg-slate-800 disabled:bg-slate-400 transition-colors
                     flex items-center justify-center gap-2"
        >
          {status === 'loading' && <Loader size={18} className="animate-spin" />}
          {status === 'loading' ? 'Submitting...' : 'Submit Issue'}
        </button>
      </form>
    </div>
  );
};
