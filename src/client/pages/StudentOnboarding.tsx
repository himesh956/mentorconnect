import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext.tsx';
import { api } from '../api/apiClient.ts';
import {
  Sparkles,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  GraduationCap,
  Briefcase,
  Target,
  Clock,
  Layers,
  Award
} from 'lucide-react';

interface StudentOnboardingProps {
  onComplete: () => void;
}

export const StudentOnboarding: React.FC<StudentOnboardingProps> = ({ onComplete }) => {
  const { user } = useAuth();
  const [step, setStep] = useState(1);
  const [loadingAI, setLoadingAI] = useState(false);

  // Form State
  const [name, setName] = useState(user?.name || 'Himesh Rajput');
  const [age, setAge] = useState(20);
  const [college, setCollege] = useState('Maharaja Agrasen College, University of Delhi');
  const [degree, setDegree] = useState('B.Sc (Hons) Computer Science');
  const [branch, setBranch] = useState('Computer Science');
  const [yearOrSemester, setYearOrSemester] = useState('3rd Year (5th Sem)');
  const [skills, setSkills] = useState('JavaScript, React, Node.js, DSA basics, Git');
  const [interests, setInterests] = useState('Full Stack Development, System Design, Hackathons');
  const [targetCareer, setTargetCareer] = useState('Software Engineer');
  const [targetCompanies, setTargetCompanies] = useState('Microsoft, Google, Razorpay, Atlassian');
  const [targetExams, setTargetExams] = useState('Campus Placements, Off-Campus Drives');
  const [currentProblems, setCurrentProblems] = useState('Need guidance on structuring my daily DSA vs MERN stack prep to crack product company internships.');
  const [availability, setAvailability] = useState('Weekday evenings (6 PM - 9 PM) & weekends');

  // AI-generated summary result
  const [aiSummary, setAiSummary] = useState<any>(null);

  const handleNextStep = async () => {
    if (step === 6) {
      // Trigger AI Analysis for Step 7
      setLoadingAI(true);
      try {
        const studentPayload = {
          name,
          age,
          college,
          degree,
          branch,
          yearOrSemester,
          skills: skills.split(',').map(s => s.trim()),
          interests: interests.split(',').map(s => s.trim()),
          targetCareer,
          targetCompanies: targetCompanies.split(',').map(s => s.trim()),
          targetExams: targetExams.split(',').map(s => s.trim()),
          currentProblems,
          availability
        };

        const res = await api.analyzeCareer(studentPayload);
        setAiSummary(res.analysis);
        setStep(7);
      } catch (err: any) {
        alert(err.message || 'Error running AI analysis');
      } finally {
        setLoadingAI(false);
      }
    } else if (step === 7) {
      // Save and Complete
      try {
        await api.updateStudentProfile({
          name,
          age,
          college,
          degree,
          branch,
          yearOrSemester,
          skills: skills.split(',').map(s => s.trim()),
          interests: interests.split(',').map(s => s.trim()),
          targetCareer,
          targetCompanies: targetCompanies.split(',').map(s => s.trim()),
          targetExams: targetExams.split(',').map(s => s.trim()),
          currentProblems,
          availability,
          aiProfileSummary: aiSummary,
          careerReadinessScore: 64
        });
        onComplete();
      } catch (err: any) {
        alert(err.message || 'Failed to save student profile');
      }
    } else {
      setStep(prev => prev + 1);
    }
  };

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 py-10 space-y-8">
      {/* Step Indicator */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-xs font-bold text-slate-500 uppercase tracking-wider">
          <span>Step {step} of 7</span>
          <span className="text-indigo-600 font-extrabold">{Math.round((step / 7) * 100)}% Completed</span>
        </div>
        <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
          <div
            className="bg-indigo-600 h-full rounded-full transition-all duration-300"
            style={{ width: `${(step / 7) * 100}%` }}
          ></div>
        </div>
      </div>

      {/* Card Form */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xl space-y-6">
        {step === 1 && (
          <div className="space-y-4">
            <h2 className="text-xl font-black text-slate-900">Step 1: Basic Information</h2>
            <p className="text-xs text-slate-500">Let's set up your core student profile credentials.</p>

            <div className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Full Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-300 font-medium"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Age</label>
                <input
                  type="number"
                  value={age}
                  onChange={e => setAge(Number(e.target.value))}
                  className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-300 font-medium"
                />
              </div>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-4">
            <h2 className="text-xl font-black text-slate-900">Step 2: University &amp; Education</h2>
            <p className="text-xs text-slate-500">Mentors are matched with seniors who understand your curriculum.</p>

            <div className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">College / University</label>
                <input
                  type="text"
                  value={college}
                  onChange={e => setCollege(e.target.value)}
                  className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-300 font-medium"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Degree</label>
                  <input
                    type="text"
                    value={degree}
                    onChange={e => setDegree(e.target.value)}
                    className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-300 font-medium"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Year / Semester</label>
                  <input
                    type="text"
                    value={yearOrSemester}
                    onChange={e => setYearOrSemester(e.target.value)}
                    className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-300 font-medium"
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-4">
            <h2 className="text-xl font-black text-slate-900">Step 3: Skills &amp; Technical Interests</h2>
            <p className="text-xs text-slate-500">Comma-separated list of your current languages and domains.</p>

            <div className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Current Skills</label>
                <input
                  type="text"
                  value={skills}
                  onChange={e => setSkills(e.target.value)}
                  className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-300 font-medium"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Areas of Interest</label>
                <input
                  type="text"
                  value={interests}
                  onChange={e => setInterests(e.target.value)}
                  className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-300 font-medium"
                />
              </div>
            </div>
          </div>
        )}

        {step === 4 && (
          <div className="space-y-4">
            <h2 className="text-xl font-black text-slate-900">Step 4: Target Career &amp; Companies</h2>
            <p className="text-xs text-slate-500">What specific roles and dream organizations are you targeting?</p>

            <div className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Target Career Role</label>
                <input
                  type="text"
                  value={targetCareer}
                  onChange={e => setTargetCareer(e.target.value)}
                  className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-300 font-medium"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Target Companies (Comma-separated)</label>
                <input
                  type="text"
                  value={targetCompanies}
                  onChange={e => setTargetCompanies(e.target.value)}
                  className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-300 font-medium"
                />
              </div>
            </div>
          </div>
        )}

        {step === 5 && (
          <div className="space-y-4">
            <h2 className="text-xl font-black text-slate-900">Step 5: Current Challenges &amp; Mentorship Needs</h2>
            <p className="text-xs text-slate-500">What are you currently struggling with or confused about?</p>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Your Core Doubts</label>
              <textarea
                rows={3}
                value={currentProblems}
                onChange={e => setCurrentProblems(e.target.value)}
                className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-300 font-medium"
              />
            </div>
          </div>
        )}

        {step === 6 && (
          <div className="space-y-4">
            <h2 className="text-xl font-black text-slate-900">Step 6: Availability</h2>
            <p className="text-xs text-slate-500">When are you free to join 1-on-1 mentorship video sessions?</p>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Preferred Time Windows</label>
              <input
                type="text"
                value={availability}
                onChange={e => setAvailability(e.target.value)}
                className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-300 font-medium"
              />
            </div>
          </div>
        )}

        {step === 7 && aiSummary && (
          <div className="space-y-5">
            <div className="flex items-center gap-2 text-indigo-700 font-bold text-xs uppercase tracking-wide">
              <Sparkles className="w-4 h-4 text-indigo-600" />
              <span>Step 7: AI-Generated Career Profile Synthesis</span>
            </div>

            <div className="p-4 bg-indigo-50/80 rounded-2xl border border-indigo-200/80 space-y-2">
              <h4 className="font-bold text-xs text-indigo-950 uppercase">Career Direction</h4>
              <p className="text-xs text-indigo-900 font-semibold">{aiSummary.careerDirection}</p>
            </div>

            <div className="space-y-2">
              <h4 className="font-bold text-xs text-slate-800 uppercase">Recommended Focus Skills</h4>
              <div className="space-y-1.5">
                {aiSummary.recommendedSkillAreas?.map((sa: string, idx: number) => (
                  <div key={idx} className="flex items-center gap-2 text-xs text-slate-700 bg-slate-50 p-2.5 rounded-xl border border-slate-200/60">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    <span>{sa}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="p-3.5 bg-emerald-50 rounded-2xl border border-emerald-200 text-xs text-emerald-950 space-y-1">
              <span className="font-bold uppercase tracking-wider text-[11px] text-emerald-800">Ideal Mentor Persona:</span>
              <p className="font-medium">{aiSummary.suggestedMentorType}</p>
            </div>
          </div>
        )}

        {/* Navigation Buttons */}
        <div className="flex items-center justify-between pt-4 border-t border-slate-100">
          {step > 1 ? (
            <button
              type="button"
              onClick={() => setStep(prev => prev - 1)}
              className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer flex items-center gap-1.5"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back</span>
            </button>
          ) : <div></div>}

          <button
            type="button"
            disabled={loadingAI}
            onClick={handleNextStep}
            className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl shadow-md shadow-indigo-600/20 transition-all cursor-pointer flex items-center gap-1.5 disabled:opacity-50"
          >
            {loadingAI ? (
              <span>Synthesizing Profile with AI...</span>
            ) : step === 7 ? (
              <>
                <span>Complete Onboarding &amp; Enter Dashboard</span>
                <CheckCircle2 className="w-4 h-4" />
              </>
            ) : (
              <>
                <span>Continue</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
