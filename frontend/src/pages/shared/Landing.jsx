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
    <div className="min-h-screen bg-slate-950 text-white">
      <header className="border-b border-slate-800 bg-slate-950/95 backdrop-blur-xl">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-5">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-3xl bg-gradient-to-br from-primary-500 to-cyan-500 text-lg font-bold text-white shadow-lg shadow-primary-500/20">
              P
            </div>
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.3em] text-primary-300">Smart Placement Portal</p>
            </div>
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

      <section className="relative overflow-hidden px-6 py-24 sm:px-8">
        <div className="absolute left-1/2 top-0 h-72 w-72 -translate-x-1/2 rounded-full bg-primary-500/20 blur-3xl" />
        <div className="mx-auto max-w-6xl">
          <div className="grid gap-10 lg:grid-cols-[1.2fr_0.8fr] lg:items-center">
            <div className="relative z-10">
              <p className="mb-4 text-sm font-semibold uppercase tracking-[0.4em] text-cyan-300">Modern placement platform</p>
              <h1 className="max-w-3xl text-5xl font-semibold leading-tight text-white sm:text-6xl">
                Match students with the best jobs using AI-backed resumes and skills.
              </h1>
              <p className="mt-6 max-w-2xl text-lg tracking-wide text-slate-300">
                A clean portal for students, recruiters, and administrators — with resume scoring, skill matching, and a polished dashboard experience.
              </p>
              <div className="mt-10 flex flex-col gap-3 sm:flex-row">
                <Link to={primaryTo} className="btn btn-primary">
                  {user ? 'Open Dashboard' : 'Create free account'}
                </Link>
                {!user && (
                  <Link to="/login" className="btn btn-secondary">
                    Sign in
                  </Link>
                )}
              </div>
            </div>

            <div className="rounded-[32px] border border-white/10 bg-white/5 p-8 shadow-2xl shadow-slate-950/20 backdrop-blur-xl">
              <div className="rounded-3xl bg-slate-950/80 p-6 shadow-inner shadow-slate-900/40">
                <p className="text-sm uppercase tracking-[0.35em] text-cyan-300">Live demo stats</p>
                <div className="mt-8 grid gap-4 sm:grid-cols-2">
                  <div className="rounded-3xl bg-slate-900/80 p-5">
                    <p className="text-sm text-slate-400">Open jobs</p>
                    <p className="mt-3 text-3xl font-semibold text-white">3</p>
                  </div>
                  <div className="rounded-3xl bg-slate-900/80 p-5">
                    <p className="text-sm text-slate-400">Active users</p>
                    <p className="mt-3 text-3xl font-semibold text-white">1,200+</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 pb-24 sm:px-8">
        <div className="grid gap-6 sm:grid-cols-3">
          {features.map((f) => (
            <div key={f.title} className="surface-panel transform transition duration-300 hover:-translate-y-1 hover:bg-slate-900/95">
              <h3 className="text-lg font-semibold text-white">{f.title}</h3>
              <p className="mt-3 text-sm leading-6 text-slate-400">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default Landing;
