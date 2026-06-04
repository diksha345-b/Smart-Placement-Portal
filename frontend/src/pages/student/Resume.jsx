import { useEffect, useRef, useState } from 'react';
import toast from 'react-hot-toast';

import PageHeader from '../../components/common/PageHeader';
import Button from '../../components/common/Button';
import Loader from '../../components/common/Loader';
import ResumeScoreCard from '../../components/cards/ResumeScoreCard';
import { resumeService } from '../../services/resumeService';
import { useAuth } from '../../hooks/useAuth';
import { getErrorMessage } from '../../utils/helpers';

const MAX_MB = 5;

const Resume = () => {
  const { user, updateUser } = useAuth();
  const [resume, setResume] = useState(null);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const fileRef = useRef(null);

  useEffect(() => {
    resumeService
      .getScore()
      .then(({ resume: r }) => setResume(r))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const handleSelect = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    // Frontend validation: type + size.
    if (file.type !== 'application/pdf') {
      toast.error('Only PDF files are allowed');
      e.target.value = '';
      return;
    }
    if (file.size > MAX_MB * 1024 * 1024) {
      toast.error(`File too large. Max size is ${MAX_MB}MB`);
      e.target.value = '';
      return;
    }
    setSelectedFile(file);
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      toast.error('Choose a PDF file first');
      return;
    }
    setUploading(true);
    try {
      const { resume: r } = await resumeService.upload(selectedFile);
      setResume(r);
      setSelectedFile(null);
      if (fileRef.current) fileRef.current.value = '';
      // Resume upload also merges skills into the profile; refresh local user.
      updateUser({ ...user, skills: Array.from(new Set([...(user.skills || []), ...(r.skills || [])])) });
      toast.success('Resume analyzed successfully');
    } catch (error) {
      toast.error(getErrorMessage(error, 'Upload failed'));
    } finally {
      setUploading(false);
    }
  };

  return (
    <div>
      <PageHeader
        title="Resume"
        subtitle="Upload your resume (PDF) to get an instant analysis and score."
      />

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="card">
          <h3 className="text-sm font-semibold text-gray-900">Upload resume</h3>
          <p className="mt-1 text-xs text-gray-500">PDF only, up to {MAX_MB}MB.</p>

          <label className="mt-4 flex cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-gray-300 px-6 py-10 text-center hover:border-primary-400">
            <input
              ref={fileRef}
              type="file"
              accept="application/pdf"
              className="hidden"
              onChange={handleSelect}
            />
            <svg className="h-8 w-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M7 16a4 4 0 01-.88-7.9A5 5 0 1115.9 6.6 4 4 0 0118 16H7zm5-4v-4m0 0l-2 2m2-2l2 2" />
            </svg>
            <span className="mt-2 text-sm font-medium text-gray-700">
              {selectedFile ? selectedFile.name : 'Click to choose a PDF'}
            </span>
            <span className="mt-0.5 text-xs text-gray-400">
              {selectedFile ? `${(selectedFile.size / 1024 / 1024).toFixed(2)} MB` : 'or drag your file here'}
            </span>
          </label>

          <Button className="mt-4 w-full" onClick={handleUpload} loading={uploading} disabled={!selectedFile}>
            Analyze resume
          </Button>
        </div>

        <div>
          {loading ? <Loader /> : <ResumeScoreCard resume={resume} />}
        </div>
      </div>
    </div>
  );
};

export default Resume;
