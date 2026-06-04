import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import toast from 'react-hot-toast';

import PageHeader from '../../components/common/PageHeader';
import Input from '../../components/common/Input';
import Textarea from '../../components/common/Textarea';
import Button from '../../components/common/Button';
import SkillsInput from '../../components/forms/SkillsInput';
import { useAuth } from '../../hooks/useAuth';
import { authService } from '../../services/authService';
import { metaService } from '../../services/adminService';
import { profileSchema } from '../../validations/profileSchema';
import { getErrorMessage } from '../../utils/helpers';

const Profile = () => {
  const { user, updateUser } = useAuth();
  const isStudent = user?.role === 'student';
  const isHR = user?.role === 'hr';

  const [skills, setSkills] = useState(user?.skills || []);
  const [skillSuggestions, setSkillSuggestions] = useState([]);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: yupResolver(profileSchema),
    defaultValues: {
      name: user?.name || '',
      phone: user?.phone || '',
      college: user?.college || '',
      degree: user?.degree || '',
      graduationYear: user?.graduationYear || '',
      bio: user?.bio || '',
      company: user?.company || '',
    },
  });

  useEffect(() => {
    if (isStudent) {
      metaService.skills().then(setSkillSuggestions).catch(() => {});
    }
  }, [isStudent]);

  const onSubmit = async (values) => {
    try {
      const payload = { ...values };
      // Strip empty graduationYear so it isn't sent as NaN.
      if (!payload.graduationYear) delete payload.graduationYear;
      if (isStudent) payload.skills = skills;
      if (!isHR) delete payload.company;

      const { user: updated } = await authService.updateProfile(payload);
      updateUser(updated);
      toast.success('Profile updated');
    } catch (error) {
      toast.error(getErrorMessage(error, 'Could not update profile'));
    }
  };

  return (
    <div>
      <PageHeader title="Profile" subtitle="Manage your account details." />

      <form onSubmit={handleSubmit(onSubmit)} className="max-w-2xl space-y-5" noValidate>
        <div className="card space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <Input label="Full name" error={errors.name?.message} {...register('name')} />
            <Input label="Email" value={user?.email} disabled readOnly />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <Input label="Phone" error={errors.phone?.message} {...register('phone')} />
            {isHR && (
              <Input label="Company" error={errors.company?.message} {...register('company')} />
            )}
          </div>

          {isStudent && (
            <>
              <div className="grid gap-4 sm:grid-cols-2">
                <Input label="College" error={errors.college?.message} {...register('college')} />
                <Input label="Degree" error={errors.degree?.message} {...register('degree')} />
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <Input
                  label="Graduation year"
                  type="number"
                  error={errors.graduationYear?.message}
                  {...register('graduationYear')}
                />
              </div>
              <SkillsInput
                label="Skills"
                value={skills}
                onChange={setSkills}
                suggestions={skillSuggestions}
              />
            </>
          )}

          <Textarea
            label="Bio"
            rows={3}
            placeholder="A short introduction"
            error={errors.bio?.message}
            {...register('bio')}
          />
        </div>

        <Button type="submit" loading={isSubmitting}>
          Save changes
        </Button>
      </form>
    </div>
  );
};

export default Profile;
