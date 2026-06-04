/**
 * Smart shortlisting logic.
 *
 * Compares a candidate's resume skills against a job's required skills,
 * produces a percentage match score, and maps it to an application status:
 *
 *   0 - 40%   => Rejected
 *   41 - 70%  => Under Review
 *   71 - 100% => Shortlisted
 */

const normalize = (skill) => skill.trim().toLowerCase();

/**
 * Compute the match between candidate skills and required job skills.
 * Returns the percentage score, the matched skills, and the missing skills.
 */
const computeMatch = (candidateSkills = [], requiredSkills = []) => {
  if (!requiredSkills.length) {
    // No skills specified for the job: treat as a neutral mid-range match.
    return { score: 50, matchedSkills: [], missingSkills: [] };
  }

  const candidateSet = new Set(candidateSkills.map(normalize));

  const matchedSkills = [];
  const missingSkills = [];

  requiredSkills.forEach((req) => {
    if (candidateSet.has(normalize(req))) {
      matchedSkills.push(req);
    } else {
      missingSkills.push(req);
    }
  });

  const score = Math.round((matchedSkills.length / requiredSkills.length) * 100);

  return { score, matchedSkills, missingSkills };
};

/**
 * Map a match score to an application status per the shortlisting rules.
 */
const statusFromScore = (score) => {
  if (score <= 40) return 'Rejected';
  if (score <= 70) return 'Under Review';
  return 'Shortlisted';
};

/**
 * Full evaluation used when a student applies to a job.
 */
const evaluateApplication = (candidateSkills, requiredSkills) => {
  const { score, matchedSkills, missingSkills } = computeMatch(candidateSkills, requiredSkills);
  return {
    matchScore: score,
    status: statusFromScore(score),
    matchedSkills,
    missingSkills,
  };
};

module.exports = { computeMatch, statusFromScore, evaluateApplication };
