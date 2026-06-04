import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { useParams, useNavigate, Link } from 'react-router-dom';
import toast from 'react-hot-toast';

import PageHeader from '../../components/common/PageHeader';
import Input from '../../components/common/Input';
import Select from '../../components/common/Select';
import Textarea from '../../components/common/Textarea';
import Button from '../../components/common/Button';
import Loader from '../../components/common/Loader';
import SkillsInput from '../../components/forms/SkillsInput';
import { jobService } from '../../services/jobService';
import { metaService } from '../../services/adminService';
import { jobSchema } from '../../validations/jobSchema';
import { useAuth } from '../../hooks/useAuth';
import { JOB_TYPES, JOB_STATUS } from '../../utils/constants';
import { getErrorMessage } from '../../utils/helpers';

const JobForm = () => {
  const { id } = useParams();
  const isEdit = Boolean(id);
  const navigate = useNavigate();
  const { user } = useAuth();

  const [requiredSkills, setRequiredSkills] = useState([]);
  const [skillSuggestions, setSkillSuggestions] = useState([]);
  const [loading, setLoading] = useState(isEdit);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: yupResolver(jobSchema),
    defaultValues: {
      title: '',
      company: user?.company || '',
      location: '',
      jobType: 'Full-time',
      salaryRange: '',
      experienceLevel: '',
      description: '',
      status: 'Open',
    },
  });

  useEffect(() => {
    metaService.skills().then(setSkillSuggestions).catch(() => {});
  }, []);

  useEffect(() => {
    if (!isEdit) return;
    jobService
      .get(id)
      .then((data) => {
        const j = data.job;
        reset({
          title: j.title,
          company: j.company,
          location: j.location,
          jobType: j.jobType,
          salaryRange: j.salaryRange || '',
          experienceLevel: j.experienceLevel || '',
          description: j.description,
          status: j.status,
        });
        setRequiredSkills(j.requiredSkills || []);
      })
      .catch((err) => {
        toast.error(getErrorMessage(err, 'Job not found'));
        navigate('/hr/jobs');
      })
      .finally(() => setLoading(false));
  }, [id, isEdit, navigate, reset]);

  const onSubmit = async (values) => {
    try {
      const payload = { ...values, requiredSkills };
      if (isEdit) {
        await jobService.update(id, payload);
        toast.success('Job updated');
      } else {
        await jobService.create(payload);
        toast.success('Job posted');
      }
      navigate('/hr/jobs');
    } catch (err) {
      toast.error(getErrorMessage(err, 'Could not save job'));
    }
  };

  if (loading) return <Loader fullPage />;

  return (
    <div>
      <Link to="/hr/jobs" className="mb-4 inline-flex items-center text-sm text-gray-500 hover:text-gray-700">
        ← Back to my jobs
      </Link>

      <PageHeader title={isEdit ? 'Edit job' : 'Post a new job'} subtitle="Provide the role details and required skills." />

      <form onSubmit={handleSubmit(onSubmit)} className="max-w-3xl space-y-5" noValidate>
        <div className="card space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <Input label="Job title" error={errors.title?.message} {...register('title')} />
            <Input label="Company" error={errors.company?.message} {...register('company')} />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <Input label="Location" placeholder="Remote / City" error={errors.location?.message} {...register('location')} />
            <Select label="Job type" options={JOB_TYPES} error={errors.jobType?.message} {...register('jobType')} />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <Input label="Salary range" placeholder="e.g. 8-12 LPA" error={errors.salaryRange?.message} {...register('salaryRange')} />
            <Input label="Experience level" placeholder="e.g. 0-2 years" error={errors.experienceLevel?.message} {...register('experienceLevel')} />
          </div>

          {isEdit && (
            <Select label="Status" options={JOB_STATUS} error={errors.status?.message} {...register('status')} />
          )}

          <SkillsInput
            label="Required skills"
            value={requiredSkills}
            onChange={setRequiredSkills}
            suggestions={skillSuggestions}
          />

          <Textarea
            label="Description"
            rows={8}
            placeholder="Describe the role, responsibilities, and requirements."
            error={errors.description?.message}
            {...register('description')}
          />
        </div>

        <div className="flex gap-3">
          <Button type="submit" loading={isSubmitting}>
            {isEdit ? 'Save changes' : 'Post job'}
          </Button>
          <Button type="button" variant="secondary" onClick={() => navigate('/hr/jobs')}>
            Cancel
          </Button>
        </div>
      </form>
    </div>
  );
};

export default JobForm;
