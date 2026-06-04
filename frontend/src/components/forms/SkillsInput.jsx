import { useState } from 'react';

/**
 * Tag-style skills editor. Holds an array of strings in `value` and calls
 * `onChange` with the next array. Type a skill and press Enter or comma to add.
 * `suggestions` (optional) powers a datalist for quick picking.
 */
const SkillsInput = ({ label, value = [], onChange, suggestions = [], placeholder = 'Add a skill and press Enter' }) => {
  const [draft, setDraft] = useState('');

  const addSkill = (raw) => {
    const skill = raw.trim();
    if (!skill) return;
    const exists = value.some((s) => s.toLowerCase() === skill.toLowerCase());
    if (!exists) onChange([...value, skill]);
    setDraft('');
  };

  const removeSkill = (skill) => {
    onChange(value.filter((s) => s !== skill));
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      addSkill(draft);
    } else if (e.key === 'Backspace' && !draft && value.length) {
      removeSkill(value[value.length - 1]);
    }
  };

  return (
    <div>
      {label && <label className="form-label">{label}</label>}
      <div className="flex flex-wrap items-center gap-2 rounded-md border border-gray-300 p-2 focus-within:border-primary-500 focus-within:ring-1 focus-within:ring-primary-500">
        {value.map((skill) => (
          <span
            key={skill}
            className="inline-flex items-center gap-1 rounded bg-primary-50 px-2 py-1 text-xs font-medium text-primary-700"
          >
            {skill}
            <button
              type="button"
              onClick={() => removeSkill(skill)}
              className="text-primary-400 hover:text-primary-600"
              aria-label={`Remove ${skill}`}
            >
              ×
            </button>
          </span>
        ))}
        <input
          list="skills-suggestions"
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={handleKeyDown}
          onBlur={() => addSkill(draft)}
          placeholder={value.length ? '' : placeholder}
          className="min-w-[140px] flex-1 border-0 p-1 text-sm focus:outline-none focus:ring-0"
        />
        {suggestions.length > 0 && (
          <datalist id="skills-suggestions">
            {suggestions.map((s) => (
              <option key={s} value={s} />
            ))}
          </datalist>
        )}
      </div>
      <p className="mt-1 text-xs text-gray-400">Press Enter or comma to add each skill.</p>
    </div>
  );
};

export default SkillsInput;
