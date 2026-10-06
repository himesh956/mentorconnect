import { StudentProfile, MentorProfile, MatchScoreResult } from '../../types/index.ts';

/**
 * Deterministic Mentor Matching Engine
 * Calculates multi-dimensional compatibility between student career aspirations and verified mentor profile.
 * 
 * Weights:
 * - Career Goal & Role alignment: 30%
 * - Skill & Tech stack overlap: 20%
 * - Target Company & Exam relevance: 15%
 * - Experience & Seniority: 15%
 * - Availability alignment: 10%
 * - College / Academic background affinity: 5%
 * - Language & Communication preference: 5%
 */
export function calculateMentorMatch(
  student: StudentProfile,
  mentor: MentorProfile
): MatchScoreResult {
  const reasons: string[] = [];
  const matchedSkills: string[] = [];
  const matchedGoals: string[] = [];
  const matchedCategories: string[] = [];

  // 1. Career Goal & Role Match (Weight: 30)
  let careerScore = 0;
  const sGoal = (student.targetCareer || student.preferredDomain || '').toLowerCase();
  const mRole = (mentor.currentRole || '').toLowerCase();
  const mBio = (mentor.bio || '').toLowerCase();

  const isRoleMatch =
    (sGoal.includes('software') || sGoal.includes('sde') || sGoal.includes('developer')) &&
    (mRole.includes('software') || mRole.includes('sde') || mRole.includes('engineer') || mRole.includes('developer'));

  const isAIMatch =
    (sGoal.includes('ai') || sGoal.includes('ml') || sGoal.includes('data')) &&
    (mRole.includes('ai') || mRole.includes('ml') || mRole.includes('data') || mRole.includes('scientist'));

  const isConsultingMatch =
    (sGoal.includes('consulting') || sGoal.includes('mba') || sGoal.includes('management')) &&
    (mRole.includes('consultant') || mRole.includes('analyst') || mRole.includes('strategy'));

  if (isRoleMatch || isAIMatch || isConsultingMatch) {
    careerScore = 30;
    matchedGoals.push(student.targetCareer);
    reasons.push(`Direct career alignment: ${mentor.currentRole} at ${mentor.companyOrOrg}`);
  } else if (mentor.targetDomains.some(d => d.toLowerCase().includes(sGoal) || sGoal.includes(d.toLowerCase()))) {
    careerScore = 24;
    matchedGoals.push(student.targetCareer);
    reasons.push(`Specializes in ${student.targetCareer} mentorship domain`);
  } else {
    careerScore = 12; // Base baseline for professional guidance
  }

  // 2. Skill & Tech Stack Overlap (Weight: 20)
  let skillScore = 0;
  const studentSkills = (student.skills || []).map(s => s.toLowerCase());
  const mentorSkills = (mentor.skills || []).map(s => s.toLowerCase());

  mentorSkills.forEach(ms => {
    studentSkills.forEach(ss => {
      if (ms.includes(ss) || ss.includes(ms)) {
        if (!matchedSkills.includes(ms)) {
          matchedSkills.push(ms);
        }
      }
    });
  });

  if (matchedSkills.length >= 3) {
    skillScore = 20;
    reasons.push(`Strong skill overlap across ${matchedSkills.slice(0, 3).join(', ')}`);
  } else if (matchedSkills.length > 0) {
    skillScore = 14;
    reasons.push(`Practical skill match in ${matchedSkills.join(', ')}`);
  } else {
    skillScore = 8;
  }

  // 3. Target Company & Exam Relevance (Weight: 15)
  let companyExamScore = 0;
  const targetCompanies = (student.targetCompanies || []).map(c => c.toLowerCase());
  const mentorCompany = (mentor.companyOrOrg || '').toLowerCase();
  const companyMatch = targetCompanies.some(tc => mentorCompany.includes(tc) || tc.includes(mentorCompany));

  const targetExams = (student.targetExams || []).map(e => e.toLowerCase());
  const examsHandled = (mentor.examsHandled || []).map(e => e.toLowerCase());
  const examMatch = targetExams.some(te => examsHandled.some(eh => eh.includes(te) || te.includes(eh)));

  if (companyMatch && examMatch) {
    companyExamScore = 15;
    reasons.push(`Works at your target company (${mentor.companyOrOrg}) & cleared your target exams`);
  } else if (companyMatch) {
    companyExamScore = 14;
    reasons.push(`Currently working at your target company: ${mentor.companyOrOrg}`);
  } else if (examMatch) {
    companyExamScore = 12;
    reasons.push(`Has personal experience cracking ${student.targetExams.join(', ')}`);
  } else {
    companyExamScore = 6;
  }

  // 4. Experience & Mentorship Track Record (Weight: 15)
  let expScore = 0;
  if (mentor.experienceYears >= 3 && mentor.rating >= 4.8) {
    expScore = 15;
    reasons.push(`${mentor.experienceYears}+ years industry experience with exceptional ${mentor.rating}★ rating`);
  } else if (mentor.experienceYears >= 1) {
    expScore = 12;
    reasons.push(`${mentor.experienceYears} years practical experience at ${mentor.companyOrOrg}`);
  } else {
    expScore = 8;
  }

  // 5. Availability Overlap (Weight: 10)
  let availScore = 0;
  const sAvail = (student.availability || '').toLowerCase();
  const mAvail = (mentor.availabilityDescription || '').toLowerCase();

  const weekendMatch = sAvail.includes('weekend') && mAvail.includes('sat') || mAvail.includes('sun');
  const eveningMatch = sAvail.includes('evening') && (mAvail.includes('pm') || mAvail.includes('evening'));

  if (weekendMatch || eveningMatch) {
    availScore = 10;
    reasons.push(`Compatible schedule: ${mentor.availabilityDescription}`);
  } else {
    availScore = 6;
  }

  // 6. College / Academic Background Affinity (Weight: 5)
  let collegeScore = 0;
  const sCollege = (student.college || '').toLowerCase();
  const mCollege = (mentor.college || '').toLowerCase();

  if (
    (sCollege.includes('du') || sCollege.includes('delhi university') || sCollege.includes('agrasen')) &&
    (mCollege.includes('du') || mCollege.includes('delhi university') || mCollege.includes('agrasen'))
  ) {
    collegeScore = 5;
    reasons.push(`Fellow Delhi University senior from ${mentor.college}`);
  } else if (
    (sCollege.includes('dtu') && mCollege.includes('dtu')) ||
    (sCollege.includes('iit') && mCollege.includes('iit')) ||
    (sCollege.includes('nit') && mCollege.includes('nit'))
  ) {
    collegeScore = 5;
    reasons.push(`Same collegiate background: ${mentor.college}`);
  } else {
    collegeScore = 3;
  }

  // 7. Language & Communication (Weight: 5)
  let langScore = 4;
  if (mentor.languages && mentor.languages.includes('Hindi') && mentor.languages.includes('English')) {
    langScore = 5;
  }

  // Total Score (Normalized to 0 - 100)
  const totalRaw = careerScore + skillScore + companyExamScore + expScore + availScore + collegeScore + langScore;
  const finalScore = Math.min(99, Math.max(50, Math.round(totalRaw)));

  // Mentorship categories matched
  mentor.mentorshipCategories.forEach(cat => {
    if (student.interests.some(i => i.toLowerCase().includes(cat.toLowerCase())) ||
        student.targetCareer.toLowerCase().includes(cat.toLowerCase())) {
      matchedCategories.push(cat);
    }
  });

  return {
    mentorId: mentor.id,
    score: finalScore,
    reasons: reasons.slice(0, 5),
    matchedSkills,
    matchedGoals,
    matchedCategories,
    careerMatchPercent: Math.round((careerScore / 30) * 100),
    skillMatchPercent: Math.round((skillScore / 20) * 100),
    experienceMatchPercent: Math.round((expScore / 15) * 100),
    availabilityMatchPercent: Math.round((availScore / 10) * 100),
    collegeMatchPercent: Math.round((collegeScore / 5) * 100),
  };
}

/**
 * Ranks all available mentors for a student with transparent scoring
 */
export function rankMentorsForStudent(
  student: StudentProfile,
  mentors: MentorProfile[]
): { mentor: MentorProfile; match: MatchScoreResult }[] {
  return mentors
    .map(mentor => ({
      mentor,
      match: calculateMentorMatch(student, mentor)
    }))
    .sort((a, b) => b.match.score - a.match.score);
}
