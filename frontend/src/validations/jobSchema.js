import * as yup from 'yup';
import { JOB_TYPES } from '../utils/constants';

export const jobSchema = yup.object({
  title: yup.string().required('Title is required').max(120),
  company: yup.string().required('Company is required').max(120),
  location: yup.string().max(120).optional(),
  jobType: yup.string().oneOf(JOB_TYPES, 'Select a valid job type').required('Job type is required'),
  salaryRange: yup.string().max(60).optional(),
  experienceLevel: yup.string().max(60).optional(),
  description: yup
    .string()
    .required('Description is required')
    .max(5000, 'Description is too long'),
  status: yup.string().oneOf(['Open', 'Closed']).optional(),
});
