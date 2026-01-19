import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowLeft, Trash2, MapPin, Hammer, Box, ChevronUp, ChevronDown, CircleHelp, Sparkles } from 'lucide-react';
import { useStorage, Idea } from '../context/StorageContext';
import { useLanguage } from '../context/LanguageContext';

interface FavoritesViewProps {
  onBack: () => void;
}

export default function FavoritesView({ onBack }: FavoritesViewProps) {
  const { favorites, removeFavorite } = useStorage();
  const { t } = useLanguage();
  const [selectedIdea, setSelectedIdea] = useState<Idea | null>(null);
  const [expandedStep, setExpandedStep] = useState<number | null>(null);

  const toggleStep = (index: number) => {
    setExpandedStep(expandedStep === index ? null : index);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <button 
          onClick={selectedIdea ? () => setSelectedIdea(null) : onBack}
          className="p-2 hover:bg-green-200 rounded-full transition-colors"
        >
          <ArrowLeft className="w-6 h-6 text-green-800" />
        </button>
        <h2 className="text-3xl text-green-800">{t.favorites.title}</h2>
      </div>

      <AnimatePresence mode="wait">
        {!selectedIdea ? (
          <motion.div
            key="list"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="grid md:grid-cols-2 gap-6"
          >
            {favorites.length === 0 && (
              <div className="col-span-2 text-center py-12 bg-white rounded-2xl border-2 border-dashed border-slate-300">
                <p className="text-xl text-slate-500">{t.favorites.empty}</p>
              </div>
            )}

            {favorites.map((idea) => (
              <motion.div
                key={idea.id}
                layoutId={idea.id}
                className="bg-white rounded-xl border-2 border-slate-200 overflow-hidden hover:border-green-400 hover:shadow-lg transition-all flex flex-col group"
              >
                <div 
                  className="aspect-video bg-slate-100 relative overflow-hidden cursor-pointer"
                  onClick={() => setSelectedIdea(idea)}
                >
                  {idea.image && (
                    <img 
                      src={idea.image} 
                      alt={idea.title} 
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  )}
                  {idea.isRealWorld && (
                    <div className="absolute top-2 right-2 bg-blue-500 text-white text-xs font-bold px-2 py-1 rounded-full shadow-md flex items-center gap-1">
                      <MapPin className="w-3 h-3" />
                      {t.ideas.realWorld}
                    </div>
                  )}
                </div>
                <div className="p-4 flex flex-col flex-grow">
                  <div className="flex justify-between items-start mb-2">
                    <h4 className="text-xl font-bold text-slate-800">{idea.title}</h4>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        if (idea.id) removeFavorite(idea.id);
                      }}
                      className="text-slate-400 hover:text-red-500 transition-colors p-1"
                      title={t.favorites.delete}
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                  <p className="text-slate-600 text-sm mb-4 flex-grow">{idea.description}</p>
                  <button
                    onClick={() => setSelectedIdea(idea)}
                    className="w-full py-2 bg-green-50 text-green-700 font-bold rounded-lg hover:bg-green-100 transition-colors"
                  >
                    {t.ideas.viewDetails}
                  </button>
                </div>
              </motion.div>
            ))}
          </motion.div>
        ) : (
          <motion.div
            key="details"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            className="bg-white rounded-2xl overflow-hidden shadow-xl border-b-8 border-green-200"
          >
            {/* Reusing the detail view structure from IdeaGenerator - ideally this should be a shared component */}
            <div className="relative h-64 md:h-80 bg-slate-100">
              {selectedIdea.image && (
                <img 
                  src={selectedIdea.image} 
                  alt={selectedIdea.title} 
                  className="w-full h-full object-cover"
                />
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-6">
                <div>
                  <h2 className="text-4xl text-white font-bold drop-shadow-md">{selectedIdea.title}</h2>
                  <p className="text-white/90 text-lg mt-1">{selectedIdea.description}</p>
                </div>
              </div>
            </div>

            <div className="p-6 md:p-8">
              {selectedIdea.guide ? (
                <div className="grid md:grid-cols-3 gap-8">
                  <div className="md:col-span-1 bg-yellow-50 p-6 rounded-xl border-2 border-yellow-200 h-fit">
                    <h3 className="text-xl font-bold text-yellow-800 mb-4 flex items-center gap-2">
                      <Box className="w-5 h-5" />
                      {t.ideas.materials}
                    </h3>
                    <ul className="space-y-2">
                      {selectedIdea.guide.materials.map((mat, idx) => (
                        <li key={idx} className="flex items-center gap-2 text-slate-700">
                          <div className="w-2 h-2 bg-yellow-400 rounded-full flex-shrink-0" />
                          <span className="font-medium">{mat}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="md:col-span-2">
                    <h3 className="text-2xl font-bold text-green-800 mb-6 flex items-center gap-2">
                      <Hammer className="w-6 h-6" />
                      {t.ideas.steps}
                    </h3>
                    <div className="space-y-4">
                      {selectedIdea.guide.steps.map((step, idx) => (
                        <div key={idx} className="bg-slate-50 rounded-xl border border-slate-200 overflow-hidden">
                          <div 
                            className="p-4 flex gap-4 cursor-pointer hover:bg-slate-100 transition-colors"
                            onClick={() => toggleStep(idx)}
                          >
                            <div className="flex-shrink-0 w-8 h-8 bg-green-100 text-green-700 rounded-full flex items-center justify-center font-bold border-2 border-green-200">
                              {idx + 1}
                            </div>
                            <div className="flex-grow pt-1">
                              <p className="text-lg font-bold text-slate-800">{step.instruction}</p>
                            </div>
                            <button className="text-slate-400 hover:text-green-600 flex-shrink-0 self-start mt-1">
                              {expandedStep === idx ? <ChevronUp className="w-6 h-6" /> : <CircleHelp className="w-6 h-6" />}
                            </button>
                          </div>
                          
                          <AnimatePresence>
                            {expandedStep === idx && (
                              <motion.div
                                initial={{ height: 0, opacity: 0 }}
                                animate={{ height: 'auto', opacity: 1 }}
                                exit={{ height: 0, opacity: 0 }}
                                className="bg-green-50 border-t border-green-100"
                              >
                                <div className="p-4 pl-16 text-green-800 flex gap-2">
                                  <Sparkles className="w-5 h-5 flex-shrink-0 mt-0.5" />
                                  <p>{step.tip}</p>
                                </div>
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center text-slate-500">
                  <p>No guide data available for this saved idea.</p>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
