import * as yup from 'yup';

export const profileSchema = yup.object({
  name: yup.string().required('Name is required').max(80),
  phone: yup.string().max(20).optional(),
  college: yup.string().max(120).optional(),
  degree: yup.string().max(120).optional(),
  graduationYear: yup
    .number()
    .transform((value, original) => (original === '' ? undefined : value))
    .typeError('Graduation year must be a number')
    .min(1950, 'Invalid year')
    .max(2100, 'Invalid year')
    .optional(),
  bio: yup.string().max(500, 'Bio must be under 500 characters').optional(),
});
