/**
 * A curated dictionary of skills the resume analyzer can detect.
 *
 * Each entry has a canonical name plus a set of aliases/keywords that may
 * appear in resume text. Matching is case-insensitive and uses word
 * boundaries so "java" does not match inside "javascript".
 */
const SKILL_DICTIONARY = [
  { name: 'JavaScript', aliases: ['javascript', 'js', 'es6', 'ecmascript'] },
  { name: 'TypeScript', aliases: ['typescript', 'ts'] },
  { name: 'React', aliases: ['react', 'reactjs', 'react.js'] },
  { name: 'Redux', aliases: ['redux'] },
  { name: 'Next.js', aliases: ['next.js', 'nextjs'] },
  { name: 'Node.js', aliases: ['node.js', 'nodejs', 'node'] },
  { name: 'Express', aliases: ['express', 'expressjs', 'express.js'] },
  { name: 'MongoDB', aliases: ['mongodb', 'mongo', 'mongoose'] },
  { name: 'SQL', aliases: ['sql', 'mysql', 'postgresql', 'postgres', 'sqlite'] },
  { name: 'HTML', aliases: ['html', 'html5'] },
  { name: 'CSS', aliases: ['css', 'css3'] },
  { name: 'Tailwind CSS', aliases: ['tailwind', 'tailwindcss'] },
  { name: 'Python', aliases: ['python', 'py'] },
  { name: 'Django', aliases: ['django'] },
  { name: 'Flask', aliases: ['flask'] },
  { name: 'Java', aliases: ['java'] },
  { name: 'Spring Boot', aliases: ['spring boot', 'spring'] },
  { name: 'C++', aliases: ['c\\+\\+', 'cpp'] },
  { name: 'C', aliases: ['\\bc\\b'] },
  { name: 'C#', aliases: ['c#', 'c sharp', 'csharp'] },
  { name: 'Go', aliases: ['golang', '\\bgo\\b'] },
  { name: 'Rust', aliases: ['rust'] },
  { name: 'PHP', aliases: ['php'] },
  { name: 'Ruby', aliases: ['ruby', 'rails'] },
  { name: 'Docker', aliases: ['docker'] },
  { name: 'Kubernetes', aliases: ['kubernetes', 'k8s'] },
  { name: 'AWS', aliases: ['aws', 'amazon web services'] },
  { name: 'Azure', aliases: ['azure'] },
  { name: 'GCP', aliases: ['gcp', 'google cloud'] },
  { name: 'Git', aliases: ['git', 'github', 'gitlab'] },
  { name: 'CI/CD', aliases: ['ci/cd', 'cicd', 'jenkins', 'github actions'] },
  { name: 'GraphQL', aliases: ['graphql'] },
  { name: 'REST API', aliases: ['rest', 'rest api', 'restful'] },
  { name: 'Redis', aliases: ['redis'] },
  { name: 'Kafka', aliases: ['kafka'] },
  { name: 'Machine Learning', aliases: ['machine learning', 'ml', 'scikit', 'sklearn'] },
  { name: 'Deep Learning', aliases: ['deep learning', 'tensorflow', 'pytorch', 'keras'] },
  { name: 'Data Analysis', aliases: ['data analysis', 'pandas', 'numpy'] },
  { name: 'Figma', aliases: ['figma'] },
  { name: 'Jest', aliases: ['jest'] },
  { name: 'Testing', aliases: ['unit testing', 'integration testing', 'cypress', 'mocha'] },
];

/**
 * Build a flat list of all canonical skill names (useful for HR job forms,
 * dropdowns, etc.).
 */
const ALL_SKILLS = SKILL_DICTIONARY.map((s) => s.name);

module.exports = { SKILL_DICTIONARY, ALL_SKILLS };
