/**
 * Sidebar navigation items per role. Icons are inline SVGs to avoid an icon
 * dependency. Each item: { to, label, icon }.
 */
const icon = (path) => (
  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.7}>
    <path strokeLinecap="round" strokeLinejoin="round" d={path} />
  </svg>
);

const ICONS = {
  dashboard: icon('M3 12l2-2m0 0l7-7 7 7m-9 2v8m4-8v8'),
  jobs: icon('M21 13.255A23.9 23.9 0 0112 15c-3.18 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z'),
  resume: icon('M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z'),
  applications: icon('M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4'),
  profile: icon('M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z'),
  users: icon('M17 20h5v-2a4 4 0 00-3-3.87M9 20H4v-2a4 4 0 013-3.87m6-1.13a4 4 0 10-4-4 4 4 0 004 4z'),
  analytics: icon('M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m0 0v-6a2 2 0 012-2h2a2 2 0 012 2v6a2 2 0 01-2 2h-2a2 2 0 01-2-2z'),
};

export const NAV_BY_ROLE = {
  student: [
    { to: '/student', label: 'Dashboard', icon: ICONS.dashboard, end: true },
    { to: '/student/jobs', label: 'Browse Jobs', icon: ICONS.jobs },
    { to: '/student/applications', label: 'My Applications', icon: ICONS.applications },
    { to: '/student/resume', label: 'Resume', icon: ICONS.resume },
    { to: '/student/profile', label: 'Profile', icon: ICONS.profile },
  ],
  hr: [
    { to: '/hr', label: 'Dashboard', icon: ICONS.dashboard, end: true },
    { to: '/hr/jobs', label: 'My Jobs', icon: ICONS.jobs },
    { to: '/hr/jobs/new', label: 'Post a Job', icon: ICONS.resume },
    { to: '/hr/profile', label: 'Profile', icon: ICONS.profile },
  ],
  admin: [
    { to: '/admin', label: 'Dashboard', icon: ICONS.dashboard, end: true },
    { to: '/admin/users', label: 'Manage Users', icon: ICONS.users },
    { to: '/admin/jobs', label: 'Manage Jobs', icon: ICONS.jobs },
    { to: '/admin/analytics', label: 'Analytics', icon: ICONS.analytics },
  ],
};

export const ROLE_LABEL = {
  student: 'Student',
  hr: 'Recruiter',
  admin: 'Administrator',
};
