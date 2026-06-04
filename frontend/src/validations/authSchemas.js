import * as yup from 'yup';

export const loginSchema = yup.object({
  email: yup.string().required('Email is required').email('Enter a valid email'),
  password: yup.string().required('Password is required'),
});

export const registerSchema = yup.object({
  name: yup.string().required('Name is required').max(80, 'Name is too long'),
  email: yup.string().required('Email is required').email('Enter a valid email'),
  password: yup
    .string()
    .required('Password is required')
    .min(6, 'Password must be at least 6 characters'),
  role: yup.string().oneOf(['student', 'hr'], 'Select a valid role').required('Role is required'),
  company: yup.string().when('role', {
    is: 'hr',
    then: (schema) => schema.required('Company is required for HR accounts'),
    otherwise: (schema) => schema.optional(),
  }),
});
