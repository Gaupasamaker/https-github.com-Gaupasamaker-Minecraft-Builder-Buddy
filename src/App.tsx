import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Pickaxe, Hammer, Camera, Globe, Heart, Trophy, Share2 } from 'lucide-react';
import IdeaGenerator from './components/IdeaGenerator';
import BuilderChat from './components/BuilderChat';
import EnvironmentScanner from './components/EnvironmentScanner';
import FavoritesView from './components/FavoritesView';
import AchievementsView from './components/AchievementsView';
import PromoGenerator from './components/PromoGenerator';
import { LanguageProvider, useLanguage } from './context/LanguageContext';
import { StorageProvider } from './context/StorageContext';

type Mode = 'home' | 'ideas' | 'builder' | 'scanner' | 'favorites' | 'achievements' | 'promo';

function AppContent() {
  const [mode, setMode] = useState<Mode>('home');
  const { t, language, setLanguage } = useLanguage();

  const renderContent = () => {
    switch (mode) {
      case 'ideas':
        return <IdeaGenerator onBack={() => setMode('home')} />;
      case 'builder':
        return <BuilderChat onBack={() => setMode('home')} />;
      case 'scanner':
        return <EnvironmentScanner onBack={() => setMode('home')} />;
      case 'favorites':
        return <FavoritesView onBack={() => setMode('home')} />;
      case 'achievements':
        return <AchievementsView onBack={() => setMode('home')} />;
      case 'promo':
        return <PromoGenerator onBack={() => setMode('home')} />;
      default:
        return <HomeMenu onSelect={setMode} />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-100 to-green-200 text-slate-800">
      <header className="bg-green-600 text-white p-4 shadow-lg border-b-4 border-green-800 sticky top-0 z-10">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => setMode('home')}>
            <div className="bg-white/20 p-2 rounded-lg">
              <Pickaxe className="w-6 h-6" />
            </div>
            <h1 className="text-2xl md:text-3xl tracking-wider">{t.appTitle}</h1>
          </div>
          
          <div className="flex items-center gap-2 bg-green-700/50 p-1 rounded-lg">
            <button
              onClick={() => setLanguage('en')}
              className={`px-3 py-1 rounded-md text-sm font-bold transition-colors ${
                language === 'en' ? 'bg-white text-green-800' : 'text-green-100 hover:bg-green-600'
              }`}
            >
              EN
            </button>
            <button
              onClick={() => setLanguage('es')}
              className={`px-3 py-1 rounded-md text-sm font-bold transition-colors ${
                language === 'es' ? 'bg-white text-green-800' : 'text-green-100 hover:bg-green-600'
              }`}
            >
              ES
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto p-4 md:p-6">
        <AnimatePresence mode="wait">
          <motion.div
            key={mode}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            {renderContent()}
          </motion.div>
        </AnimatePresence>
      </main>
    </div>
  );
}

function HomeMenu({ onSelect }: { onSelect: (mode: Mode) => void }) {
  const { t } = useLanguage();

  const mainItems = [
    {
      id: 'ideas',
      title: t.home.ideas.title,
      description: t.home.ideas.desc,
      icon: <Pickaxe className="w-12 h-12 text-yellow-600" />,
      color: 'bg-yellow-100 border-yellow-400 hover:bg-yellow-200',
    },
    {
      id: 'builder',
      title: t.home.builder.title,
      description: t.home.builder.desc,
      icon: <Hammer className="w-12 h-12 text-blue-600" />,
      color: 'bg-blue-100 border-blue-400 hover:bg-blue-200',
    },
    {
      id: 'scanner',
      title: t.home.scanner.title,
      description: t.home.scanner.desc,
      icon: <Camera className="w-12 h-12 text-purple-600" />,
      color: 'bg-purple-100 border-purple-400 hover:bg-purple-200',
    },
  ];

  return (
    <div className="space-y-8 py-8">
      <div className="text-center space-y-4">
        <h2 className="text-4xl md:text-5xl text-green-800">{t.home.title}</h2>
        <p className="text-xl text-green-700 font-medium">{t.home.subtitle}</p>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        {mainItems.map((item) => (
          <motion.button
            key={item.id}
            whileHover={{ scale: 1.05, rotate: 1 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => onSelect(item.id as Mode)}
            className={`p-6 rounded-xl border-b-8 border-r-8 transition-colors text-left h-full flex flex-col gap-4 ${item.color}`}
          >
            <div className="bg-white/50 w-fit p-4 rounded-full shadow-sm">
              {item.icon}
            </div>
            <div>
              <h3 className="text-2xl font-bold mb-2">{item.title}</h3>
              <p className="text-slate-700 leading-relaxed">{item.description}</p>
            </div>
          </motion.button>
        ))}
      </div>

      <div className="grid grid-cols-2 gap-6">
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => onSelect('favorites')}
          className="bg-white p-4 rounded-xl border-b-4 border-slate-200 hover:border-green-400 flex items-center gap-4 shadow-sm"
        >
          <div className="bg-red-100 p-3 rounded-full">
            <Heart className="w-6 h-6 text-red-500" />
          </div>
          <div className="text-left">
            <h3 className="text-lg font-bold text-slate-800">{t.favorites.title}</h3>
            <p className="text-sm text-slate-500">{t.favorites.desc}</p>
          </div>
        </motion.button>

        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => onSelect('achievements')}
          className="bg-white p-4 rounded-xl border-b-4 border-slate-200 hover:border-green-400 flex items-center gap-4 shadow-sm"
        >
          <div className="bg-yellow-100 p-3 rounded-full">
            <Trophy className="w-6 h-6 text-yellow-600" />
          </div>
          <div className="text-left">
            <h3 className="text-lg font-bold text-slate-800">{t.achievements.title}</h3>
            <p className="text-sm text-slate-500">{t.achievements.desc}</p>
          </div>
        </motion.button>
      </div>

      <div className="flex justify-center pt-4">
        <button 
          onClick={() => onSelect('promo')}
          className="text-green-600/50 hover:text-green-600 text-sm font-bold flex items-center gap-2 transition-colors"
        >
          <Share2 className="w-4 h-4" />
          Generate Promo Image
        </button>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <LanguageProvider>
      <StorageProvider>
        <AppContent />
      </StorageProvider>
    </LanguageProvider>
  );
}
