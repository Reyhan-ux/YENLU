import { Users, Leaf, MapPin, Camera, Heart } from '@phosphor-icons/react';
import Card from '../components/Card';
import MethodologyTelemetry from '../components/MethodologyTelemetry';

/**
 * About & Methodology Page:
 * 1. Meet Team YENLU (Founder, Younger Brother, Mum)
 * 2. Official Family Team Photograph (User, Brother, Mum)
 * 3. Our Family Story (Impactful typography, African green motif background, logo font title)
 * 4. NASA Earth Observation Scientific Telemetry
 */
export default function About() {
  const teamMembers = [
    {
      relationship: 'Team Lead',
      name: 'Founder & Agritech Architect',
      title: 'Project Lead',
      bio: 'Architecting YENLU Field Shift to bridge NASA Earth observation telemetry with the daily realities of smallholder farmers across the volcanic slopes of Mount Cameroon.',
      tags: ['System Architecture', 'NASA Data Engineering', 'Agro-Climatology'],
      tagColor: 'bg-[#184A2C] text-white'
    },
    {
      relationship: 'Younger Brother',
      name: 'Field Operations & Data Engineering',
      title: 'Co-Founder',
      bio: 'Leading ground truthing, field data verification, and micro-climate mapping across Buea, Muea, Bokwango, and surrounding volcanic farming corridors.',
      tags: ['Field Operations', 'Ground Truthing', 'Slope Verification'],
      tagColor: 'bg-[#276F46] text-white'
    },
    {
      relationship: 'Mum',
      name: 'Indigenous Agronomy & Senior Community Advisor',
      title: 'Senior Farm Advisor',
      bio: 'Bringing decades of hands-on farming experience, traditional crop succession knowledge, and deep community trust with local women farmers and cooperatives in Fako Division.',
      tags: ['Indigenous Knowledge', 'Crop Succession', 'Community Trust'],
      tagColor: 'bg-[#8A5A0A] text-white'
    }
  ];

  return (
    <div className="space-y-10 pb-16">
      
      {/* Header with clean editorial status indicator */}
      <section className="space-y-3">
        <div className="inline-flex items-center gap-2 rounded-md border border-stone-200 bg-stone-100/80 px-2.5 py-1 text-[11px] font-bold uppercase tracking-widest text-[#184A2C] dark:border-white/10 dark:bg-white/5 dark:text-[#A3E3B5]">
          <span className="h-1.5 w-1.5 rounded-full bg-[#184A2C] dark:bg-[#A3E3B5]" />
          <span>NASA Space Apps Challenge 2026 · Buea, Cameroon</span>
        </div>
        <h1 className="text-3xl font-extrabold tracking-tight text-ink sm:text-4xl dark:text-leaf-50 font-sans">
          About YENLU & Scientific Methodology
        </h1>
        <p className="max-w-2xl text-sm sm:text-base text-ink/70 dark:text-leaf-100/70 leading-relaxed font-sans">
          Rooted on the volcanic slopes of Mount Cameroon in Buea. We fuse generations of family indigenous farming wisdom with 20 years of NASA satellite telemetry to safeguard smallholder crop rotations against torrential deluges.
        </p>
      </section>

      {/* Team YENLU Section */}
      <section aria-labelledby="team-heading" className="space-y-6">
        <div className="flex items-center justify-between border-b border-ink/10 pb-3 dark:border-white/10">
          <div className="flex items-center gap-2.5">
            <Users size={22} weight="bold" className="text-[#184A2C] dark:text-[#A3E3B5]" />
            <h2 id="team-heading" className="text-2xl font-bold tracking-tight text-ink dark:text-leaf-50 font-sans">
              Meet Team YENLU
            </h2>
          </div>
          <span className="text-xs font-semibold uppercase tracking-wider text-ink/50 dark:text-leaf-100/50">
            Fako Division, Cameroon
          </span>
        </div>

        {/* 3 Team Cards - Clean Text Layout without empty photo placeholders */}
        <div className="grid gap-6 md:grid-cols-3">
          {teamMembers.map((member, i) => (
            <div
              key={i}
              className="flex flex-col justify-between rounded-2xl border border-[#E3D9CC] bg-[#FAF5EE] p-6 shadow-xs transition hover:border-[#184A2C]/60 hover:shadow-md dark:border-white/10 dark:bg-[#1A120E]"
            >
              <div>
                {/* Relationship Badge */}
                <div className="mb-3">
                  <span className={`inline-block rounded-md ${member.tagColor} px-2.5 py-1 text-[11px] font-extrabold uppercase tracking-wider shadow-2xs`}>
                    {member.relationship}
                  </span>
                </div>

                {/* Title & Role */}
                <h3 className="text-lg font-bold text-ink dark:text-leaf-50 font-sans leading-tight">
                  {member.name}
                </h3>
                <p className="mt-1 text-xs font-bold text-[#184A2C] dark:text-[#A3E3B5]">
                  {member.title}
                </p>

                {/* Bio */}
                <p className="mt-3.5 text-xs sm:text-sm text-ink/80 dark:text-leaf-100/80 leading-relaxed font-sans">
                  {member.bio}
                </p>
              </div>

              {/* Tags */}
              <div className="mt-6 border-t border-[#E3D9CC] pt-3.5 dark:border-white/10">
                <div className="flex flex-wrap gap-1.5">
                  {member.tags.map((tag, tIdx) => (
                    <span
                      key={tIdx}
                      className="rounded-md border border-[#E3D9CC] bg-white px-2 py-0.5 text-[10px] font-semibold text-stone-700 dark:border-white/10 dark:bg-white/5 dark:text-stone-300"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Authentic Family Photograph Underneath - Tastefully Sized & Centered */}
        <div className="mx-auto w-full max-w-2xl overflow-hidden rounded-3xl border border-[#E3D9CC] bg-[#FAF5EE] shadow-md dark:border-white/10 dark:bg-[#1A120E]">
          <div className="relative aspect-[16/10] w-full max-h-[340px] overflow-hidden bg-stone-100">
            <img
              src="/team-yenlu.jpg"
              alt="Team YENLU: Younger Brother, Founder / Team Lead, and Mum in Buea"
              className="h-full w-full object-cover object-center"
            />
          </div>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 sm:p-5 bg-white dark:bg-[#1A120E] border-t border-[#E3D9CC] dark:border-white/10">
            <div>
              <h4 className="font-sans text-sm font-bold text-stone-900 dark:text-stone-100">
                Team YENLU — Family Agritech Initiative
              </h4>
              <p className="mt-0.5 text-xs text-stone-600 dark:text-stone-400">
                From left: <strong>Younger Brother</strong> (Field Operations), <strong>Project Lead</strong> (Founder & Architect), and <strong>Mum</strong> (Senior Indigenous Agronomy Advisor) — Buea, Cameroon.
              </p>
            </div>
            <div className="inline-flex items-center gap-1.5 rounded-full bg-[#184A2C]/10 px-3 py-1 text-xs font-bold text-[#184A2C] shrink-0 dark:bg-white/10 dark:text-[#A3E3B5]">
              <MapPin size={13} weight="bold" />
              <span>Mount Cameroon</span>
            </div>
          </div>
        </div>

        {/* Family Story Card - Stepped up with African Green Motif Background, Big Text & Logo Font Header */}
        <div className="relative overflow-hidden rounded-3xl bg-[#1C5535] p-8 sm:p-10 text-white shadow-xl border border-[#276F46]">
          
          {/* Large African Motifs in Background */}
          <div className="pointer-events-none absolute -right-6 -bottom-8 flex opacity-[0.14] text-white" aria-hidden="true">
            <svg className="w-64 h-64 shrink-0 stroke-current fill-none stroke-[2.2]" viewBox="0 0 100 100">
              <path d="M50 42 C44 26 26 22 20 32 C15 44 32 54 50 42 Z" />
              <path d="M50 42 C56 26 74 22 80 32 C85 44 68 54 50 42 Z" />
              <line x1="50" y1="42" x2="50" y2="82" />
              <path d="M15 84 Q50 68 85 84" />
              <circle cx="50" cy="18" r="8" />
            </svg>
            <svg className="w-52 h-52 shrink-0 stroke-current fill-none stroke-[2.2]" viewBox="0 0 100 100">
              <polygon points="50,12 80,48 50,86 20,48" />
              <polygon points="50,26 68,48 50,72 32,48" />
              <circle cx="50" cy="48" r="5" fill="currentColor" />
            </svg>
          </div>

          <div className="relative z-10 space-y-4">
            {/* Title in exact Logo Font stack (Bricolage Grotesque / weight 900) */}
            <div className="flex items-center justify-between flex-wrap gap-2">
              <h2 className="font-['Bricolage_Grotesque','Figtree','Raleway',sans-serif] font-black uppercase tracking-wider text-2xl sm:text-3xl text-[#F8D063]">
                OUR FAMILY STORY
              </h2>
              <div className="inline-flex items-center gap-1.5 rounded-full bg-white/10 px-3.5 py-1 text-xs font-semibold text-leaf-100 backdrop-blur-xs">
                <MapPin size={14} weight="bold" />
                <span>Buea, Mount Cameroon</span>
              </div>
            </div>

            {/* Stepped-up large, readable story text */}
            <p className="text-base sm:text-lg md:text-xl font-normal leading-relaxed text-white/95 max-w-4xl font-sans">
              We designed YENLU because we saw our own family and neighbors in Buea suffer crop losses from unexpected torrential downpours and soil nutrient exhaustion. By combining NASA satellite observations with our mum's generations-old indigenous planting wisdom, we provide recommendations that actually work in our volcanic soil.
            </p>
          </div>
        </div>
      </section>

      {/* Methodology Section */}
      <section aria-labelledby="methodology-heading" className="space-y-4 pt-2">
        <div id="methodology">
          <MethodologyTelemetry />
        </div>
      </section>

    </div>
  );
}
