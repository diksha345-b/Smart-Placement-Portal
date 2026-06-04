import { Link } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';

const ROLE_HOME = { student: '/student', hr: '/hr', admin: '/admin' };

const features = [
  {
    title: 'Resume Analysis',
    desc: 'Upload your PDF resume and get an instant score, detected skills, and improvement tips.',
  },
  {
    title: 'Smart Shortlisting',
    desc: 'Applications are auto-matched to job requirements and ranked so the best fits rise to the top.',
  },
  {
    title: 'Job Management',
    desc: 'Recruiters post roles, review ranked applicants, and shortlist candidates in a few clicks.',
  },
];

const Landing = () => {
  const { user } = useAuth();
  const primaryTo = user ? ROLE_HOME[user.role] || '/' : '/register';

  return (
    <div className="min-h-screen bg-white">
      <header className="border-b border-gray-200">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-md bg-primary-600 text-sm font-bold text-white">
              P
            </div>
            <span className="font-semibold text-gray-900">Smart Placement Portal</span>
          </div>
          <div className="flex items-center gap-3">
            {user ? (
              <Link to={primaryTo} className="btn btn-primary btn-sm">
                Go to Dashboard
              </Link>
            ) : (
              <>
                <Link to="/login" className="btn btn-ghost btn-sm">
                  Sign in
                </Link>
                <Link to="/register" className="btn btn-primary btn-sm">
                  Get started
                </Link>
              </>
            )}
          </div>
        </div>
      </header>

      <section className="mx-auto max-w-6xl px-6 py-20 text-center">
        <h1 className="mx-auto max-w-3xl text-4xl font-semibold leading-tight text-gray-900 sm:text-5xl">
          The smarter way to connect students and recruiters
        </h1>
        <p className="mx-auto mt-4 max-w-2xl text-lg text-gray-500">
          Resume scoring, automatic skill matching, and a clean dashboard for
          students, recruiters, and administrators — all in one place.
        </p>
        <div className="mt-8 flex justify-center gap-3">
          <Link to={primaryTo} className="btn btn-primary">
            {user ? 'Open Dashboard' : 'Create free account'}
          </Link>
          {!user && (
            <Link to="/login" className="btn btn-secondary">
              Sign in
            </Link>
          )}
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 pb-24">
        <div className="grid gap-6 sm:grid-cols-3">
          {features.map((f) => (
            <div key={f.title} className="card">
              <h3 className="text-base font-semibold text-gray-900">{f.title}</h3>
              <p className="mt-2 text-sm text-gray-500">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default Landing;
