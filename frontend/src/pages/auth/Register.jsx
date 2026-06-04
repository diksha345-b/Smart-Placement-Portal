import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import Input from '../../components/common/Input';
import Select from '../../components/common/Select';
import Button from '../../components/common/Button';
import { useAuth } from '../../hooks/useAuth';
import { registerSchema } from '../../validations/authSchemas';
import { getErrorMessage } from '../../utils/helpers';

const ROLE_HOME = { student: '/student', hr: '/hr' };

const Register = () => {
  const { register: registerUser } = useAuth();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: yupResolver(registerSchema),
    defaultValues: { role: 'student' },
  });

  const role = watch('role');

  const onSubmit = async (values) => {
    try {
      const payload = { ...values };
      if (payload.role !== 'hr') delete payload.company;
      const user = await registerUser(payload);
      toast.success('Account created!');
      navigate(ROLE_HOME[user.role] || '/', { replace: true });
    } catch (error) {
      toast.error(getErrorMessage(error, 'Registration failed'));
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-semibold text-gray-900">Create your account</h1>
      <p className="mt-1 text-sm text-gray-500">Join as a student or recruiter.</p>

      <form onSubmit={handleSubmit(onSubmit)} className="mt-6 space-y-4" noValidate>
        <Select
          label="I am a"
          options={[
            { value: 'student', label: 'Student looking for jobs' },
            { value: 'hr', label: 'Recruiter / HR posting jobs' },
          ]}
          error={errors.role?.message}
          {...register('role')}
        />
        <Input
          label="Full name"
          placeholder="Jane Doe"
          error={errors.name?.message}
          {...register('name')}
        />
        <Input
          label="Email"
          type="email"
          placeholder="you@example.com"
          error={errors.email?.message}
          {...register('email')}
        />
        {role === 'hr' && (
          <Input
            label="Company"
            placeholder="Acme Inc."
            error={errors.company?.message}
            {...register('company')}
          />
        )}
        <Input
          label="Password"
          type="password"
          placeholder="At least 6 characters"
          error={errors.password?.message}
          {...register('password')}
        />
        <Button type="submit" className="w-full" loading={isSubmitting}>
          Create account
        </Button>
      </form>

      <p className="mt-6 text-center text-sm text-gray-500">
        Already have an account?{' '}
        <Link to="/login" className="font-medium text-primary-600 hover:text-primary-700">
          Sign in
        </Link>
      </p>
    </div>
  );
};

export default Register;
