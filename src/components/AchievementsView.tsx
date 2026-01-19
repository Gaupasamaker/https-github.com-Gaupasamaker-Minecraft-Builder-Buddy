import React from 'react';
import { motion } from 'motion/react';
import { ArrowLeft, Trophy, Star, Lock, TreeDeciduous, Pickaxe, Zap, Flower, Car, Castle, Crown, Book, Bookmark, Medal, Flame, Target } from 'lucide-react';
import { useStorage } from '../context/StorageContext';
import { useLanguage } from '../context/LanguageContext';

interface AchievementsViewProps {
  onBack: () => void;
}

export default function AchievementsView({ onBack }: AchievementsViewProps) {
  const { achievements, xp } = useStorage();
  const { t } = useLanguage();

  const level = Math.floor(xp / 100) + 1;
  const progress = xp % 100;

  const ACHIEVEMENT_LIST = [
    // Basic
    { id: 'first_build', icon: <Star className="w-8 h-8 text-yellow-500" />, ...t.achievements.list.first_build },
    { id: 'three_builds', icon: <HammerIcon className="w-8 h-8 text-blue-500" />, ...t.achievements.list.three_builds },
    { id: 'master_builder', icon: <Crown className="w-8 h-8 text-amber-500" />, ...t.achievements.list.master_builder },
    
    // Categories - Level 1
    { id: 'wood_master', icon: <TreeDeciduous className="w-8 h-8 text-green-600" />, ...t.achievements.list.wood_master },
    { id: 'stone_mason', icon: <Pickaxe className="w-8 h-8 text-stone-500" />, ...t.achievements.list.stone_mason },
    { id: 'redstone_engineer', icon: <Zap className="w-8 h-8 text-red-500" />, ...t.achievements.list.redstone_engineer },
    { id: 'green_thumb', icon: <Flower className="w-8 h-8 text-pink-500" />, ...t.achievements.list.green_thumb },
    { id: 'mechanic', icon: <Car className="w-8 h-8 text-blue-600" />, ...t.achievements.list.mechanic },
    { id: 'dream_builder', icon: <Castle className="w-8 h-8 text-purple-500" />, ...t.achievements.list.dream_builder },

    // Categories - Level 2
    { id: 'architect', icon: <TreeDeciduous className="w-8 h-8 text-green-800" />, ...t.achievements.list.architect },
    { id: 'sculptor', icon: <Pickaxe className="w-8 h-8 text-stone-700" />, ...t.achievements.list.sculptor },
    { id: 'tech_wizard', icon: <Zap className="w-8 h-8 text-red-700" />, ...t.achievements.list.tech_wizard },
    { id: 'nature_lover', icon: <Flower className="w-8 h-8 text-pink-700" />, ...t.achievements.list.nature_lover },
    { id: 'pilot', icon: <Car className="w-8 h-8 text-blue-800" />, ...t.achievements.list.pilot },
    { id: 'fantasy_lord', icon: <Castle className="w-8 h-8 text-purple-800" />, ...t.achievements.list.fantasy_lord },

    // Collection
    { id: 'idea_collector', icon: <Book className="w-8 h-8 text-indigo-500" />, ...t.achievements.list.idea_collector },
    { id: 'idea_hoarder', icon: <Bookmark className="w-8 h-8 text-indigo-600" />, ...t.achievements.list.idea_hoarder },
    { id: 'library_curator', icon: <BookIcon className="w-8 h-8 text-indigo-800" />, ...t.achievements.list.library_curator },

    // Levels
    { id: 'dedicated', icon: <Medal className="w-8 h-8 text-bronze-500" />, ...t.achievements.list.dedicated },
    { id: 'expert', icon: <Medal className="w-8 h-8 text-slate-400" />, ...t.achievements.list.expert },
    { id: 'elite', icon: <Medal className="w-8 h-8 text-yellow-400" />, ...t.achievements.list.elite },
    { id: 'legendary', icon: <Flame className="w-8 h-8 text-orange-500" />, ...t.achievements.list.legendary },

    // Totals
    { id: 'marathon_runner', icon: <Target className="w-8 h-8 text-red-600" />, ...t.achievements.list.marathon_runner },
    { id: 'centurion', icon: <Trophy className="w-8 h-8 text-yellow-600" />, ...t.achievements.list.centurion },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <button 
          onClick={onBack}
          className="p-2 hover:bg-green-200 rounded-full transition-colors"
        >
          <ArrowLeft className="w-6 h-6 text-green-800" />
        </button>
        <h2 className="text-3xl text-green-800">{t.achievements.title}</h2>
      </div>

      {/* Profile Header */}
      <div className="bg-gradient-to-r from-green-500 to-emerald-600 rounded-2xl p-8 text-white shadow-lg relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-10 -mt-10" />
        <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/10 rounded-full -ml-10 -mb-10" />
        
        <div className="relative z-10 flex flex-col md:flex-row items-center gap-8">
          <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center shadow-xl border-4 border-green-300">
            <Trophy className="w-12 h-12 text-green-600" />
          </div>
          
          <div className="flex-1 w-full text-center md:text-left">
            <h3 className="text-2xl font-bold mb-2">{t.achievements.level} {level}</h3>
            <div className="flex items-center gap-2 mb-2 justify-center md:justify-start">
              <span className="text-green-100 font-bold">{xp} {t.achievements.xp}</span>
            </div>
            
            <div className="w-full bg-black/20 h-4 rounded-full overflow-hidden backdrop-blur-sm">
              <motion.div 
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                className="h-full bg-yellow-400"
              />
            </div>
            <p className="text-xs text-green-100 mt-2 text-right">{progress}/100 to next level</p>
          </div>
        </div>
      </div>

      {/* Badges Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {ACHIEVEMENT_LIST.map((badge) => {
          const isUnlocked = achievements.some(a => a.id === badge.id);
          
          return (
            <motion.div
              key={badge.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`p-4 rounded-xl border-2 flex items-center gap-4 transition-all ${
                isUnlocked 
                  ? 'bg-white border-green-200 shadow-md' 
                  : 'bg-slate-50 border-slate-200 opacity-60 grayscale'
              }`}
            >
              <div className={`w-14 h-14 rounded-full flex items-center justify-center shrink-0 ${
                isUnlocked ? 'bg-slate-50' : 'bg-slate-200'
              }`}>
                {isUnlocked ? badge.icon : <Lock className="w-6 h-6 text-slate-400" />}
              </div>
              
              <div>
                <h4 className="text-base font-bold text-slate-800 flex items-center gap-2 leading-tight">
                  {badge.title}
                </h4>
                <p className="text-slate-600 text-xs mt-1">{badge.desc}</p>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}

function HammerIcon({ className }: { className?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="m15 12-8.5 8.5c-.83.83-2.17.83-3 0 0 0 0 0 0 0a2.12 2.12 0 0 1 0-3L12 9" />
      <path d="M17.64 15 22 10.64" />
      <path d="m20.91 11.7-1.25-1.25c-.6-.6-.93-1.4-.93-2.25V7.86c0-.55-.45-1-1-1H16.4c-.84 0-1.65-.33-2.25-.93L12.9 4.68" />
      <path d="M16.25 16.25 9 9" />
    </svg>
  );
}

function BookIcon({ className }: { className?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1 0-5H20" />
    </svg>
  );
}
