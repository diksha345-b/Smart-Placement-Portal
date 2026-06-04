/**
 * Render a list of skills as small pills. `variant` controls the color used.
 * `max` truncates the list with a "+N more" indicator.
 */
const VARIANT = {
  default: 'bg-gray-100 text-gray-600',
  matched: 'bg-green-50 text-green-700',
  missing: 'bg-red-50 text-red-700',
  primary: 'bg-primary-50 text-primary-700',
};

const SkillTags = ({ skills = [], variant = 'default', max }) => {
  if (!skills.length) return <span className="text-sm text-gray-400">—</span>;

  const shown = max ? skills.slice(0, max) : skills;
  const remaining = max && skills.length > max ? skills.length - max : 0;

  return (
    <div className="flex flex-wrap gap-1.5">
      {shown.map((skill) => (
        <span
          key={skill}
          className={`rounded px-2 py-0.5 text-xs font-medium ${VARIANT[variant] || VARIANT.default}`}
        >
          {skill}
        </span>
      ))}
      {remaining > 0 && (
        <span className="rounded px-2 py-0.5 text-xs font-medium text-gray-400">
          +{remaining} more
        </span>
      )}
    </div>
  );
};

export default SkillTags;
