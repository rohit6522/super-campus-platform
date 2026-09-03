import { ResumeDocument } from '../../resumes/schemas/resume.schema.js';

export interface AtsScoreResult {
  overallScore: number;
  keywordMatchScore: number;
  skillsMatchScore: number;
  experienceMatchScore: number;
  educationMatchScore: number;
  missingKeywords: string[];
  formattingIssues: string[];
  suggestions: string[];
}

// Extracts meaningful keywords from a job description: strips common stopwords and short words
function extractKeywords(text: string): string[] {
  const stopwords = new Set([
    'the', 'and', 'for', 'with', 'you', 'your', 'are', 'will', 'have',
    'this', 'that', 'from', 'our', 'able', 'who', 'can', 'has', 'must',
    'about', 'into', 'their', 'they', 'not', 'all', 'a', 'an', 'to', 'of',
    'in', 'on', 'is', 'as', 'be', 'or', 'we',
  ]);

  return Array.from(
    new Set(
      text
        .toLowerCase()
        .replace(/[^a-z0-9\s+#.]/g, ' ')
        .split(/\s+/)
        .filter((word) => word.length > 2 && !stopwords.has(word)),
    ),
  );
}

export function analyzeResumeAgainstJob(
  resume: ResumeDocument,
  jobDescription: string,
): AtsScoreResult {
  const jdKeywords = extractKeywords(jobDescription);

  // Build a single searchable text blob from the resume's content
  const resumeText = [
    resume.summary ?? '',
    resume.skills.join(' '),
    resume.experience.map((e) => `${e.role} ${e.description ?? ''}`).join(' '),
    resume.projects.map((p) => `${p.title} ${p.description ?? ''} ${p.technologies.join(' ')}`).join(' '),
    resume.certifications.map((c) => c.name).join(' '),
  ]
    .join(' ')
    .toLowerCase();

  const matchedKeywords = jdKeywords.filter((kw) => resumeText.includes(kw));
  const missingKeywords = jdKeywords.filter((kw) => !resumeText.includes(kw)).slice(0, 15); // cap for readability

  const keywordMatchScore =
    jdKeywords.length > 0 ? Math.round((matchedKeywords.length / jdKeywords.length) * 100) : 0;

  // Skills match: how many of the resume's declared skills appear in the JD text
  const jdLower = jobDescription.toLowerCase();
  const matchedSkills = resume.skills.filter((skill) => jdLower.includes(skill.toLowerCase()));
  const skillsMatchScore =
    resume.skills.length > 0 ? Math.round((matchedSkills.length / resume.skills.length) * 100) : 0;

  // Experience match: presence of any experience/projects at all is a proxy signal here
  const experienceMatchScore =
    resume.experience.length > 0 ? 80 : resume.projects.length > 0 ? 50 : 20;

  // Education match: presence of at least one education entry
  const educationMatchScore = resume.education.length > 0 ? 100 : 0;

  const overallScore = Math.round(
    keywordMatchScore * 0.4 +
      skillsMatchScore * 0.3 +
      experienceMatchScore * 0.2 +
      educationMatchScore * 0.1,
  );

  const formattingIssues: string[] = [];
  if (!resume.summary) formattingIssues.push('Missing a professional summary section');
  if (resume.skills.length < 5) formattingIssues.push('Fewer than 5 skills listed — consider adding more relevant ones');
  if (resume.experience.length === 0 && resume.projects.length === 0) {
    formattingIssues.push('No experience or projects listed');
  }

  const suggestions: string[] = [];
  if (missingKeywords.length > 0) {
    suggestions.push(
      `Consider adding these relevant keywords if applicable: ${missingKeywords.slice(0, 5).join(', ')}`,
    );
  }
  if (skillsMatchScore < 50) {
    suggestions.push('Align your listed skills more closely with the job description');
  }
  if (resume.projects.length === 0 && resume.experience.length === 0) {
    suggestions.push('Add at least one project or work experience to strengthen your resume');
  }

  return {
    overallScore,
    keywordMatchScore,
    skillsMatchScore,
    experienceMatchScore,
    educationMatchScore,
    missingKeywords,
    formattingIssues,
    suggestions,
  };
}