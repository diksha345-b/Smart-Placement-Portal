const fs = require('fs');
const pdfParse = require('pdf-parse');
const { SKILL_DICTIONARY } = require('../utils/skills');

/**
 * Extract raw text from a PDF file on disk.
 */
const extractText = async (filePath) => {
  const dataBuffer = fs.readFileSync(filePath);
  const parsed = await pdfParse(dataBuffer);
  return parsed.text || '';
};

/**
 * Detect which known skills are present in a block of text.
 * Returns an array of canonical skill names.
 */
const detectSkills = (text) => {
  const lower = text.toLowerCase();
  const found = new Set();

  SKILL_DICTIONARY.forEach((skill) => {
    const matched = skill.aliases.some((alias) => {
      // Aliases may already contain regex (e.g. \bc\b, c\+\+); treat them as patterns.
      const pattern = new RegExp(`(^|[^a-z0-9])(${alias})([^a-z0-9]|$)`, 'i');
      return pattern.test(lower);
    });
    if (matched) found.add(skill.name);
  });

  return Array.from(found);
};

/**
 * Heuristic sections we expect a strong resume to contain. Their presence
 * contributes to the overall score alongside the number of detected skills.
 */
const RESUME_SECTIONS = [
  { key: 'experience', keywords: ['experience', 'work history', 'employment'] },
  { key: 'education', keywords: ['education', 'b.tech', 'bachelor', 'degree', 'university'] },
  { key: 'projects', keywords: ['project', 'projects'] },
  { key: 'contact', keywords: ['email', '@', 'phone', 'linkedin'] },
];

const detectSections = (text) => {
  const lower = text.toLowerCase();
  return RESUME_SECTIONS.filter((section) =>
    section.keywords.some((kw) => lower.includes(kw))
  ).map((s) => s.key);
};

/**
 * Produce suggestions based on what is missing from the resume.
 */
const buildSuggestions = (skills, sections, text) => {
  const suggestions = [];

  if (skills.length < 5) {
    suggestions.push('List more technical skills relevant to your target roles.');
  }
  if (!sections.includes('experience')) {
    suggestions.push('Add a work experience or internship section.');
  }
  if (!sections.includes('projects')) {
    suggestions.push('Showcase 2-3 projects with measurable impact.');
  }
  if (!sections.includes('education')) {
    suggestions.push('Include your education details and graduation year.');
  }
  if (!sections.includes('contact')) {
    suggestions.push('Add complete contact information (email, phone, LinkedIn).');
  }
  if (text.trim().length < 400) {
    suggestions.push('Expand your resume with more detail; it currently looks short.');
  }
  if (!/\d/.test(text)) {
    suggestions.push('Quantify achievements with numbers (e.g. "improved load time by 30%").');
  }
  if (suggestions.length === 0) {
    suggestions.push('Strong resume. Keep it tailored to each job you apply for.');
  }

  return suggestions;
};

/**
 * Compute a 0-100 resume score from detected skills and present sections.
 *  - up to 60 points from skills (10 skills = full)
 *  - up to 40 points from the four key sections (10 each)
 */
const computeScore = (skills, sections) => {
  const skillScore = Math.min(skills.length, 10) * 6; // max 60
  const sectionScore = sections.length * 10; // max 40
  return Math.min(100, skillScore + sectionScore);
};

/**
 * Full analysis pipeline for an uploaded resume PDF.
 */
const analyzeResume = async (filePath) => {
  const text = await extractText(filePath);
  const skills = detectSkills(text);
  const sections = detectSections(text);
  const score = computeScore(skills, sections);
  const suggestions = buildSuggestions(skills, sections, text);

  return {
    score,
    skills,
    sections,
    suggestions,
    textLength: text.length,
  };
};

module.exports = { analyzeResume, detectSkills, extractText };
