import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Check, AlertCircle, X } from 'lucide-react';
import { FEED_URL, withAction } from '../config';
import { loadJsonp } from '../utils/jsonp';

const RESPONSE_CATEGORIES = [
  'Governance Concern Response',
  'Financial Query Response',
  'Correspondence Reply',
  'Policy Clarification',
  'Organizational Response',
  'Legal Response',
  'Other',
];

const ORGANIZATIONS = [
  'Individual',
  'Bakwena Ba Mogopa Traditional Council',
  'Municipal Government',
  'Provincial Government',
  'Community Organization',
  'NGO/Civil Society',
  'Private Sector',
  'Other Organization',
];

interface MediaFile {
  name: string;
  size: number;
  type: string;
  data: string; // base64
}

export const SubmitResponseForm: React.FC<{ onSubmitSuccess: () => void }> = ({
  onSubmitSuccess,
}) => {
  const [formData, setFormData] = useState({
    respondentName: '',
    respondentOrganization: '',
    respondentEmail: '',
    respondentPhone: '',
    category: '',
    issueReference: '',
    responseTitle: '',
    responseContent: '',
    supportingEvidence: '',
  });

  const [media, setMedia] = useState<MediaFile[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState<'success' | 'error' | null>(null);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleMediaChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.currentTarget.files;
    if (!files) return;

    setMessage('');
    setMessageType(null);

    const fileList = Array.from(files);

    const ALLOWED_TYPES = [
      'image/jpeg',
      'image/png',
      'image/gif',
      'image/webp',
      'video/mp4',
      'video/quicktime',
    ];

    let totalSize = 0;
    for (const file of fileList) {
      if (!ALLOWED_TYPES.includes(file.type)) {
        setMessage('Invalid file type. Allowed: JPEG, PNG, GIF, WebP, MP4, MOV');
        setMessageType('error');
        return;
      }
      if (file.size > 50 * 1024 * 1024) {
        setMessage('File size exceeds 50MB limit');
        setMessageType('error');
        return;
      }
      totalSize += file.size;
    }

    if (totalSize > 250 * 1024 * 1024) {
      setMessage('Total media size exceeds 250MB limit');
      setMessageType('error');
      return;
    }

    if (media.length + fileList.length > 5) {
      setMessage('Maximum 5 files allowed');
      setMessageType('error');
      return;
    }

    try {
      const converted = await Promise.all(
        fileList.map(
          (file) =>
            new Promise<MediaFile>((resolve, reject) => {
              const reader = new FileReader();
              reader.onload = () => {
                const result = reader.result as string;
                const base64 = result.split(',')[1] || '';
                resolve({
                  name: file.name,
                  size: file.size,
                  type: file.type,
                  data: base64,
                });
              };
              reader.onerror = () => reject(new Error(`Failed to read file: ${file.name}`));
              reader.readAsDataURL(file);
            })
        )
      );

      setMedia((prev) => [...prev, ...converted]);
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Failed to read attached files';
      setMessage(msg);
      setMessageType('error');
    } finally {
      e.currentTarget.value = '';
    }
  };

  const removeMedia = (index: number) => {
    setMedia((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;

    if (
      !formData.respondentName.trim() ||
      !formData.respondentEmail.trim() ||
      !formData.category.trim() ||
      !formData.responseTitle.trim() ||
      !formData.responseContent.trim()
    ) {
      setMessage('Please fill in all required fields');
      setMessageType('error');
      return;
    }

    setIsSubmitting(true);
    setMessage('');
    setMessageType(null);

    try {
      const url = FEED_URL;

      // ✅ Avoid CORS preflight + browser block
      await fetch(url, {
        method: 'POST',
        mode: 'no-cors',
        headers: { 'Content-Type': 'text/plain;charset=utf-8' },
        body: JSON.stringify({
          action: 'submit-response',
          ...formData,
          media,
        }),
      });

      // 3) Verification & Refresh Step:
      try {
        const refreshUrl = withAction(FEED_URL, 'responses');
        await loadJsonp<any>(refreshUrl, 10000);
      } catch (e) {
        // Ignore JSONP refresh errors
      }

      setMessage('Submitted. If it doesn’t appear immediately, refresh in 5–10 seconds.');
      setMessageType('success');

      setFormData({
        respondentName: '',
        respondentOrganization: '',
        respondentEmail: '',
        respondentPhone: '',
        category: '',
        issueReference: '',
        responseTitle: '',
        responseContent: '',
        supportingEvidence: '',
      });
      setMedia([]);

      setTimeout(() => onSubmitSuccess(), 600);
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Error submitting response';
      setMessage(msg);
      setMessageType('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <motion.form
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      onSubmit={handleSubmit}
      className="bg-white rounded-lg border border-slate-200 p-8 max-w-2xl mx-auto"
    >
      <h2 className="text-2xl font-serif font-bold text-slate-900 mb-8">Submit Response</h2>

      {message && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className={`mb-6 p-4 rounded-lg flex gap-3 ${
            messageType === 'success'
              ? 'bg-green-50 text-green-800 border border-green-200'
              : 'bg-red-50 text-red-800 border border-red-200'
          }`}
        >
          {messageType === 'success' ? (
            <Check size={20} className="flex-shrink-0 mt-0.5" />
          ) : (
            <AlertCircle size={20} className="flex-shrink-0 mt-0.5" />
          )}
          <span>{message}</span>
        </motion.div>
      )}

      <fieldset className="mb-8 pb-8 border-b border-slate-200">
        <legend className="text-lg font-semibold text-slate-900 mb-4">Your Information</legend>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Name <span className="text-red-600">*</span>
            </label>
            <input
              type="text"
              name="respondentName"
              value={formData.respondentName}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Organization</label>
            <select
              name="respondentOrganization"
              value={formData.respondentOrganization}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Select organization type</option>
              {ORGANIZATIONS.map((org) => (
                <option key={org} value={org}>
                  {org}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Email <span className="text-red-600">*</span>
            </label>
            <input
              type="email"
              name="respondentEmail"
              value={formData.respondentEmail}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Phone</label>
            <input
              type="tel"
              name="respondentPhone"
              value={formData.respondentPhone}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>
      </fieldset>

      <fieldset className="mb-8 pb-8 border-b border-slate-200">
        <legend className="text-lg font-semibold text-slate-900 mb-4">Response Details</legend>

        <div className="mb-4">
          <label className="block text-sm font-medium text-slate-700 mb-2">
            Category <span className="text-red-600">*</span>
          </label>
          <select
            name="category"
            value={formData.category}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Select response category</option>
            {RESPONSE_CATEGORIES.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-slate-700 mb-2">
            Issue Reference (Optional)
          </label>
          <input
            type="text"
            name="issueReference"
            value={formData.issueReference}
            onChange={handleChange}
            placeholder="e.g., ISSUE-1234567890"
            className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-slate-700 mb-2">
            Response Title <span className="text-red-600">*</span>
          </label>
          <input
            type="text"
            name="responseTitle"
            value={formData.responseTitle}
            onChange={handleChange}
            required
            placeholder="e.g., Statement on Financial Management Concerns"
            className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-slate-700 mb-2">
            Response Content <span className="text-red-600">*</span>
          </label>
          <textarea
            name="responseContent"
            value={formData.responseContent}
            onChange={handleChange}
            required
            rows={8}
            placeholder="Provide your detailed response..."
            className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 font-sans"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            Supporting Evidence (Optional)
          </label>
          <textarea
            name="supportingEvidence"
            value={formData.supportingEvidence}
            onChange={handleChange}
            rows={4}
            placeholder="Describe supporting documents, evidence, or references..."
            className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 font-sans"
          />
        </div>
      </fieldset>

      <fieldset className="mb-8">
        <legend className="text-lg font-semibold text-slate-900 mb-4">Attach Media (Optional)</legend>

        <div className="mb-4">
          <label className="block text-sm font-medium text-slate-700 mb-2">
            Supporting Documents or Evidence
          </label>
          <p className="text-sm text-slate-500 mb-3">
            Supported: JPEG, PNG, GIF, WebP (images), MP4, MOV (videos) • Max 50MB per file • Max 5 files
          </p>

          <input
            type="file"
            multiple
            accept="image/*,video/*"
            onChange={handleMediaChange}
            disabled={media.length >= 5}
            className="block w-full text-sm text-slate-500
                      file:mr-4 file:py-2 file:px-4
                      file:rounded-lg file:border-0
                      file:text-sm file:font-semibold
                      file:bg-blue-50 file:text-blue-700
                      hover:file:bg-blue-100 disabled:opacity-50"
          />
        </div>

        {media.length > 0 && (
          <div className="mt-6">
            <h4 className="text-sm font-medium text-slate-900 mb-3">Attached Files</h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {media.map((file, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between p-3 bg-slate-50 rounded-lg border border-slate-200"
                >
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-slate-900 truncate">{file.name}</p>
                    <p className="text-xs text-slate-500">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => removeMedia(idx)}
                    className="ml-3 text-red-600 hover:text-red-700"
                  >
                    <X size={16} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </fieldset>

      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        type="submit"
        disabled={isSubmitting}
        className="w-full py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isSubmitting ? 'Submitting...' : 'Submit Response'}
      </motion.button>
    </motion.form>
  );
};
