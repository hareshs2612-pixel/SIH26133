import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { dataStore } from '../../services/dataStore';
import { 
  HeartHandshake, 
  ShieldCheck, 
  Stethoscope, 
  AlertTriangle, 
  MapPin, 
  Sparkles, 
  FileText, 
  ArrowRight, 
  CheckCircle2, 
  Users, 
  Lock,
  Building2,
  Activity
} from 'lucide-react';

export const LandingPage: React.FC = () => {
  const navigate = useNavigate();

  const handleLaunchPersona = (uid: string, route: string) => {
    dataStore.setCurrentUser(uid);
    navigate(route);
  };

  return (
    <div className="space-y-16 pb-16">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-teal-900 via-teal-950 to-slate-950 text-white pt-16 pb-20 px-4 sm:px-6 lg:px-8">
        {/* Subtle background mesh */}
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#14b8a6_1px,transparent_1px)] [background-size:24px_24px] pointer-events-none"></div>

        <div className="max-w-6xl mx-auto text-center space-y-6 relative z-10">
          <div className="inline-flex items-center gap-2 bg-teal-800/60 border border-teal-500/30 px-3.5 py-1.5 rounded-full text-xs text-teal-200 font-semibold shadow-xs">
            <span className="w-2 h-2 rounded-full bg-teal-400 animate-pulse"></span>
            Smart India Hackathon 2026 Prototype — Problem Statement SIH26133
          </div>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight text-white max-w-4xl mx-auto leading-tight">
            Longitudinal Health Records & Controlled Emergency Care for <span className="text-teal-400">Rural India</span>
          </h1>

          <p className="text-sm sm:text-base text-slate-300 max-w-2xl mx-auto leading-relaxed">
            Connecting rural patients, Primary Health Centres, and authorized doctors through a secure, low-bandwidth platform. Doctor remains the decision-maker; AI provides assistive synthesis.
          </p>

          {/* Quick 1-Click Interactive Demo Personas */}
          <div className="pt-4 max-w-3xl mx-auto">
            <div className="bg-white/10 backdrop-blur-md border border-white/20 p-5 rounded-2xl shadow-xl space-y-3">
              <span className="text-xs font-bold text-teal-300 uppercase tracking-wider block">
                ⚡ 1-Click SIH Judge Evaluation Personas:
              </span>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-left">
                {/* Persona 1 */}
                <button
                  onClick={() => handleLaunchPersona('pat-ramesh', '/patient')}
                  className="p-3 bg-white/10 hover:bg-teal-500 hover:text-slate-950 rounded-xl transition border border-white/10 group"
                >
                  <div className="flex items-center gap-2 mb-1">
                    <HeartHandshake className="w-4 h-4 text-teal-300 group-hover:text-slate-950" />
                    <span className="font-bold text-xs">Ramesh Kumar</span>
                  </div>
                  <p className="text-[11px] text-slate-300 group-hover:text-slate-900 leading-tight">
                    Rural Farmer (Sitapur, UP). T2DM, HTN & severe Penicillin allergy.
                  </p>
                </button>

                {/* Persona 2 */}
                <button
                  onClick={() => handleLaunchPersona('doc-sharma', '/doctor')}
                  className="p-3 bg-white/10 hover:bg-teal-500 hover:text-slate-950 rounded-xl transition border border-white/10 group"
                >
                  <div className="flex items-center gap-2 mb-1">
                    <Stethoscope className="w-4 h-4 text-teal-300 group-hover:text-slate-950" />
                    <span className="font-bold text-xs">Dr. Anita Sharma</span>
                  </div>
                  <p className="text-[11px] text-slate-300 group-hover:text-slate-900 leading-tight">
                    Medical Officer, CHC Rampur. Holds active consent to Ramesh's records.
                  </p>
                </button>

                {/* Persona 3 */}
                <button
                  onClick={() => handleLaunchPersona('doc-verma', '/emergency?patientId=pat-ramesh')}
                  className="p-3 bg-white/10 hover:bg-rose-500 hover:text-white rounded-xl transition border border-white/10 group"
                >
                  <div className="flex items-center gap-2 mb-1">
                    <AlertTriangle className="w-4 h-4 text-rose-300 group-hover:text-white" />
                    <span className="font-bold text-xs">Emergency Triage</span>
                  </div>
                  <p className="text-[11px] text-slate-300 group-hover:text-white leading-tight">
                    Dr. Verma triggers audited override for acute trauma triage.
                  </p>
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Core Differentiator Pillars */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="text-center space-y-2">
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900">
            Engineered Specifically for Rural Healthcare Challenges
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 max-w-xl mx-auto">
            Addressing paper loss, missing medical history, absence of smart devices, and acute trauma triage in underserved regions.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Pillar 1 */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm hover:shadow-md transition space-y-3">
            <div className="w-12 h-12 rounded-xl bg-teal-50 text-teal-600 flex items-center justify-center">
              <FileText className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-slate-900">Longitudinal Health Records</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Consolidates past paper prescriptions, discharge summaries, and clinic notes into a permanent timeline. Explicit provenance badges separate doctor-verified clinical facts from patient-reported notes.
            </p>
            <div className="text-xs text-teal-700 font-semibold flex items-center gap-1 pt-1">
              <CheckCircle2 className="w-3.5 h-3.5 text-teal-600" />
              Missing home vitals transparently marked "Unavailable"
            </div>
          </div>

          {/* Pillar 2 */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm hover:shadow-md transition space-y-3">
            <div className="w-12 h-12 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-slate-900">Controlled Emergency Triage</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Nearby doctors cannot browse patient files without explicit consent. During trauma, doctors trigger an audited emergency protocol that unlocks strictly the <strong>Minimum Dataset</strong> (Allergies & Blood Group).
            </p>
            <div className="text-xs text-rose-700 font-semibold flex items-center gap-1 pt-1">
              <CheckCircle2 className="w-3.5 h-3.5 text-rose-600" />
              Immutable audit log: WHO, WHEN, WHY, WHAT LEVEL
            </div>
          </div>

          {/* Pillar 3 */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm hover:shadow-md transition space-y-3">
            <div className="w-12 h-12 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <Sparkles className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-slate-900">Assistive Gemini Clinical AI</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Synthesizes years of scattered records into an executive brief for busy PHC doctors and translates technical medical jargon into plain everyday language for rural patients. AI never diagnoses or prescribes.
            </p>
            <div className="text-xs text-indigo-700 font-semibold flex items-center gap-1 pt-1">
              <CheckCircle2 className="w-3.5 h-3.5 text-indigo-600" />
              Strict safety bounds & doctor review check
            </div>
          </div>
        </div>
      </section>

      {/* Verification Workflow Demonstration */}
      <section className="bg-slate-100 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto space-y-8">
          <div className="text-center space-y-2">
            <h2 className="text-2xl font-black text-slate-900">
              End-to-End Hackathon Demonstration Flow
            </h2>
            <p className="text-xs text-slate-500">
              Walk through the complete lifecycle from patient registration to doctor review and emergency override.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 text-xs">
            <div className="bg-white p-4 rounded-xl border border-slate-200 space-y-2">
              <span className="w-6 h-6 rounded-full bg-teal-600 text-white font-black flex items-center justify-center text-xs">1</span>
              <h4 className="font-bold text-slate-900">Patient Uploads Record</h4>
              <p className="text-slate-500">Ramesh uploads an existing paper blood test from Sitapur Diagnostics. Gemini extracts HbA1c and glucose parameters.</p>
            </div>

            <div className="bg-white p-4 rounded-xl border border-slate-200 space-y-2">
              <span className="w-6 h-6 rounded-full bg-teal-600 text-white font-black flex items-center justify-center text-xs">2</span>
              <h4 className="font-bold text-slate-900">Patient Grants Consent</h4>
              <p className="text-slate-500">Ramesh authorizes Dr. Anita Sharma at CHC Rampur. Unapproved doctors remain locked out.</p>
            </div>

            <div className="bg-white p-4 rounded-xl border border-slate-200 space-y-2">
              <span className="w-6 h-6 rounded-full bg-teal-600 text-white font-black flex items-center justify-center text-xs">3</span>
              <h4 className="font-bold text-slate-900">Doctor Reviews & Prescribes</h4>
              <p className="text-slate-500">Dr. Sharma inspects the longitudinal timeline, reviews the AI summary, and writes an official clinical prescription.</p>
            </div>

            <div className="bg-white p-4 rounded-xl border border-slate-200 space-y-2">
              <span className="w-6 h-6 rounded-full bg-rose-600 text-white font-black flex items-center justify-center text-xs">4</span>
              <h4 className="font-bold text-slate-900">Emergency Override Tested</h4>
              <p className="text-slate-500">In acute triage, Dr. Verma triggers audited override, exposing only critical allergies and blood type.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Public Healthcare Discovery CTA */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-r from-teal-800 to-slate-900 text-white rounded-3xl p-8 sm:p-10 shadow-xl flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-3 max-w-xl">
            <div className="inline-flex items-center gap-1.5 text-xs text-teal-300 font-bold uppercase tracking-wider">
              <MapPin className="w-4 h-4" />
              <span>Public Health Infrastructure Discovery</span>
            </div>
            <h3 className="text-2xl sm:text-3xl font-black">
              Explore Rural Public Healthcare Facilities
            </h3>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              Locate Primary Health Centres, Community Health Centres, Sub-Centres, and Jan Aushadhi discount pharmacies across rural districts.
            </p>
          </div>

          <Link
            to="/facilities"
            className="bg-teal-400 hover:bg-teal-300 text-slate-950 font-black px-6 py-3 rounded-2xl text-xs flex items-center gap-2 transition shadow-lg shrink-0"
          >
            Launch Healthcare Map
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>
    </div>
  );
};
