import ScoreRing from './ScoreRing';
import SkillTags from './SkillTags';
import { formatDate } from '../../utils/helpers';

/**
 * Displays the resume analysis result: score ring, detected skills,
 * suggestions, and the uploaded file name.
 */
const ResumeScoreCard = ({ resume }) => {
  if (!resume) {
    return (
      <div className="card text-center text-sm text-gray-500">
        No resume analyzed yet. Upload a PDF to see your score.
      </div>
    );
  }

  return (
    <div className="card">
      <div className="flex flex-col items-center gap-4 sm:flex-row sm:items-start">
        <div className="flex flex-col items-center">
          <ScoreRing score={resume.score} />
          <p className="mt-2 text-xs font-medium text-gray-500">Resume Score</p>
        </div>

        <div className="flex-1">
          <div className="mb-3">
            <p className="text-sm font-medium text-gray-700">Detected Skills</p>
            <div className="mt-1">
              <SkillTags skills={resume.skills} variant="primary" />
            </div>
          </div>

          {resume.suggestions?.length > 0 && (
            <div>
              <p className="text-sm font-medium text-gray-700">Suggestions</p>
              <ul className="mt-1 list-inside list-disc space-y-1 text-sm text-gray-600">
                {resume.suggestions.map((s, i) => (
                  <li key={i}>{s}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>

      {(resume.originalName || resume.uploadedAt) && (
        <p className="mt-4 border-t border-gray-100 pt-3 text-xs text-gray-400">
          {resume.originalName ? `File: ${resume.originalName}` : ''}
          {resume.uploadedAt ? ` · Uploaded ${formatDate(resume.uploadedAt)}` : ''}
        </p>
      )}
    </div>
  );
};

export default ResumeScoreCard;
