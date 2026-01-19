import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowLeft, RefreshCw, Sparkles, Loader2, Hammer, Box, CheckCircle, MapPin, CircleHelp, ChevronDown, ChevronUp, Heart, Trophy } from 'lucide-react';
import { getAi, MODELS } from '../services/gemini';
import ReactMarkdown from 'react-markdown';
import { useLanguage } from '../context/LanguageContext';
import { useStorage, Idea, BuildGuide } from '../context/StorageContext';
import { Type } from '@google/genai';
import confetti from 'canvas-confetti';

interface IdeaGeneratorProps {
  onBack: () => void;
}

export default function IdeaGenerator({ onBack }: IdeaGeneratorProps) {
  const { t, language } = useLanguage();
  const { addFavorite, isFavorite, completeBuild } = useStorage();
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [ideas, setIdeas] = useState<Idea[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedIdea, setSelectedIdea] = useState<Idea | null>(null);
  const [guide, setGuide] = useState<BuildGuide | null>(null);
  const [loadingGuide, setLoadingGuide] = useState(false);
  const [expandedStep, setExpandedStep] = useState<number | null>(null);
  const [showAchievement, setShowAchievement] = useState<string | null>(null);

  const CATEGORIES = [
    { id: 'house', name: t.ideas.categories.house, emoji: '🏠' },
    { id: 'vehicle', name: t.ideas.categories.vehicle, emoji: '🚗' },
    { id: 'monument', name: t.ideas.categories.monument, emoji: '🗿' },
    { id: 'redstone', name: t.ideas.categories.redstone, emoji: '🔌' },
    { id: 'garden', name: t.ideas.categories.garden, emoji: '🌳' },
    { id: 'fantasy', name: t.ideas.categories.fantasy, emoji: '🏰' },
  ];

  const generateImage = async (visualPrompt: string): Promise<string | undefined> => {
    try {
      const ai = getAi();
      const response = await ai.models.generateContent({
        model: MODELS.image,
        contents: {
          parts: [{ text: `Minecraft style, ${visualPrompt}, high quality, vibrant colors, shader pack style` }]
        },
      });
      
      const candidates = response.candidates;
      if (candidates && candidates[0]?.content?.parts) {
        for (const part of candidates[0].content.parts) {
          if (part.inlineData && part.inlineData.data) {
             return `data:${part.inlineData.mimeType || 'image/png'};base64,${part.inlineData.data}`;
          }
        }
      }
      return undefined;
    } catch (error) {
      console.error("Image generation error:", error);
      return undefined;
    }
  };

  const generateIdeas = async (category: string) => {
    setLoading(true);
    setSelectedCategory(category);
    setIdeas([]);
    setSelectedIdea(null);
    setGuide(null);

    try {
      const prompt = `Generate 3 fun, creative, and kid-friendly Minecraft building ideas for the category: "${category}". 
      
      IMPORTANT:
      - Include a mix of invented/fantasy ideas AND famous real-world structures if applicable (e.g., for Monuments: Eiffel Tower, Pyramids; for Vehicles: Titanic, Space Shuttle).
      - If it is a real-world structure, set isRealWorld to true.
      
      Respond with a JSON array of objects. Each object must have:
      - title: A cool title (string)
      - description: A 1-sentence description (string)
      - visualPrompt: A description of what the building looks like to generate an image (string)
      - isRealWorld: true if it exists in real life, false otherwise (boolean)
      
      Keep the tone enthusiastic and encouraging for an 11-year-old.
      Respond in ${language === 'es' ? 'Spanish' : 'English'}.`;

      const ai = getAi();
      const response = await ai.models.generateContent({
        model: MODELS.text,
        contents: prompt,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                title: { type: Type.STRING },
                description: { type: Type.STRING },
                visualPrompt: { type: Type.STRING },
                isRealWorld: { type: Type.BOOLEAN }
              },
              required: ["title", "description", "visualPrompt", "isRealWorld"]
            }
          }
        }
      });

      const generatedIdeas: Idea[] = JSON.parse(response.text || "[]");
      setIdeas(generatedIdeas);

      generatedIdeas.forEach(async (idea, index) => {
        const imageUrl = await generateImage(idea.visualPrompt);
        if (imageUrl) {
          setIdeas(prev => prev.map((item, i) => i === index ? { ...item, image: imageUrl } : item));
        }
      });

    } catch (error) {
      console.error("Error generating ideas:", error);
    } finally {
      setLoading(false);
    }
  };

  const generateGuide = async (idea: Idea) => {
    setLoadingGuide(true);
    setGuide(null);
    setExpandedStep(null);

    try {
      const prompt = `Create a precise, step-by-step Minecraft building guide for: "${idea.title}".
      Description: ${idea.description}
      
      Respond with a JSON object containing:
      - materials: An array of strings listing key blocks needed with estimated counts (e.g., "Oak Planks (approx. 64)", "Glass Panes (x12)").
      - steps: An array of objects. Each object must have:
        - instruction: A clear, precise instruction with exact block counts/dimensions where possible (e.g., "Build a 5x5 square base using Oak Planks.", "Stack 4 Oak Logs on each corner.").
        - tip: A helpful tip or detailed explanation for this step (e.g., "This makes the foundation. You can dig one block deep if you want a floor flush with the ground.").
      
      Keep it simple for an 11-year-old. Max 8-10 steps.
      Respond in ${language === 'es' ? 'Spanish' : 'English'}.`;

      const ai = getAi();
      const response = await ai.models.generateContent({
        model: MODELS.text,
        contents: prompt,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              materials: { type: Type.ARRAY, items: { type: Type.STRING } },
              steps: { 
                type: Type.ARRAY, 
                items: { 
                  type: Type.OBJECT,
                  properties: {
                    instruction: { type: Type.STRING },
                    tip: { type: Type.STRING }
                  },
                  required: ["instruction", "tip"]
                } 
              }
            },
            required: ["materials", "steps"]
          }
        }
      });

      const guideData: BuildGuide = JSON.parse(response.text || "{}");
      setGuide(guideData);
      
      // Update the selected idea with the guide so it can be saved properly
      setSelectedIdea(prev => prev ? { ...prev, guide: guideData } : null);

    } catch (error) {
      console.error("Error generating guide:", error);
    } finally {
      setLoadingGuide(false);
    }
  };

  const handleIdeaClick = (idea: Idea) => {
    setSelectedIdea(idea);
    generateGuide(idea);
  };

  const clearSelection = () => {
    setSelectedIdea(null);
    setGuide(null);
  };

  const toggleStep = (index: number) => {
    setExpandedStep(expandedStep === index ? null : index);
  };

  const handleSave = () => {
    if (selectedIdea) {
      addFavorite(selectedIdea);
    }
  };

  const handleComplete = () => {
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 }
    });

    const { xpGained, newAchievements } = completeBuild(selectedCategory || undefined);
    
    if (newAchievements.length > 0) {
      // Show the first new achievement
      const achievementKey = newAchievements[0] as keyof typeof t.achievements.list;
      const achievementTitle = t.achievements.list[achievementKey]?.title || "Achievement Unlocked!";
      setShowAchievement(achievementTitle);
      setTimeout(() => setShowAchievement(null), 4000);
    }
  };

  return (
    <div className="space-y-6 relative">
      <AnimatePresence>
        {showAchievement && (
          <motion.div
            initial={{ opacity: 0, y: -50, scale: 0.8 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -50, scale: 0.8 }}
            className="fixed top-24 left-1/2 -translate-x-1/2 z-50 bg-yellow-400 text-yellow-900 px-8 py-4 rounded-full shadow-2xl border-4 border-yellow-200 flex items-center gap-4"
          >
            <Trophy className="w-8 h-8" />
            <div>
              <p className="font-bold text-sm uppercase tracking-wider">{t.achievements.unlocked}</p>
              <p className="text-xl font-black">{showAchievement}</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex items-center gap-4">
        <button 
          onClick={selectedIdea ? clearSelection : onBack}
          className="p-2 hover:bg-green-200 rounded-full transition-colors"
        >
          <ArrowLeft className="w-6 h-6 text-green-800" />
        </button>
        <h2 className="text-3xl text-green-800">{t.ideas.title}</h2>
      </div>

      <AnimatePresence mode="wait">
        {!selectedIdea ? (
          <motion.div 
            key="list"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="bg-white rounded-2xl p-6 shadow-xl border-b-8 border-green-200"
          >
            <h3 className="text-xl font-bold mb-4 text-slate-700">{t.ideas.pickCategory}</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-8">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => generateIdeas(cat.name)}
                  disabled={loading}
                  className={`p-4 rounded-xl border-2 transition-all text-left flex flex-col gap-2
                    ${selectedCategory === cat.name 
                      ? 'bg-green-100 border-green-500 ring-2 ring-green-500 ring-offset-2' 
                      : 'bg-slate-50 border-slate-200 hover:border-green-400 hover:bg-green-50'
                    }
                  `}
                >
                  <span className="text-3xl">{cat.emoji}</span>
                  <span className="font-bold text-slate-700">{cat.name}</span>
                </button>
              ))}
            </div>

            {loading && (
              <div className="flex flex-col items-center justify-center py-12 text-green-600">
                <Loader2 className="w-12 h-12 animate-spin mb-4" />
                <p className="text-xl font-pixel animate-pulse">{t.ideas.mining}</p>
              </div>
            )}

            {!loading && ideas.length > 0 && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-2xl text-yellow-800 flex items-center gap-2">
                    <Sparkles className="w-6 h-6" />
                    {t.ideas.suggestions}
                  </h3>
                  <button 
                    onClick={() => selectedCategory && generateIdeas(selectedCategory)}
                    className="flex items-center gap-2 text-sm font-bold text-yellow-700 hover:bg-yellow-100 px-3 py-1 rounded-lg transition-colors"
                  >
                    <RefreshCw className="w-4 h-4" />
                    {t.ideas.newIdeas}
                  </button>
                </div>

                <div className="grid md:grid-cols-3 gap-6">
                  {ideas.map((idea, idx) => (
                    <motion.div
                      key={idx}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: idx * 0.1 }}
                      onClick={() => handleIdeaClick(idea)}
                      className="bg-white rounded-xl border-2 border-slate-200 overflow-hidden hover:border-green-400 hover:shadow-lg transition-all cursor-pointer group flex flex-col h-full"
                    >
                      <div className="aspect-square bg-slate-100 relative overflow-hidden">
                        {idea.image ? (
                          <img 
                            src={idea.image} 
                            alt={idea.title} 
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                          />
                        ) : (
                          <div className="w-full h-full flex flex-col items-center justify-center text-slate-400 p-4 text-center">
                            <Loader2 className="w-8 h-8 animate-spin mb-2" />
                            <span className="text-xs font-bold">{t.ideas.generatingImage}</span>
                          </div>
                        )}
                        {idea.isRealWorld && (
                          <div className="absolute top-2 right-2 bg-blue-500 text-white text-xs font-bold px-2 py-1 rounded-full shadow-md flex items-center gap-1">
                            <MapPin className="w-3 h-3" />
                            {t.ideas.realWorld}
                          </div>
                        )}
                      </div>
                      <div className="p-4 flex flex-col flex-grow">
                        <h4 className="text-xl font-bold text-slate-800 mb-2 group-hover:text-green-600 transition-colors">{idea.title}</h4>
                        <p className="text-slate-600 text-sm flex-grow">{idea.description}</p>
                        <div className="mt-4 text-green-600 text-sm font-bold flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          {t.ideas.viewDetails} <ArrowLeft className="w-4 h-4 rotate-180" />
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            )}
          </motion.div>
        ) : (
          <motion.div
            key="details"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            className="bg-white rounded-2xl overflow-hidden shadow-xl border-b-8 border-green-200"
          >
            <div className="relative h-64 md:h-80 bg-slate-100">
              {selectedIdea.image && (
                <img 
                  src={selectedIdea.image} 
                  alt={selectedIdea.title} 
                  className="w-full h-full object-cover"
                />
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-6">
                <div className="w-full flex justify-between items-end">
                  <div>
                    {selectedIdea.isRealWorld && (
                      <span className="bg-blue-500 text-white text-xs font-bold px-2 py-1 rounded-full mb-2 inline-flex items-center gap-1">
                        <MapPin className="w-3 h-3" />
                        {t.ideas.realWorld}
                      </span>
                    )}
                    <h2 className="text-4xl text-white font-bold drop-shadow-md">{selectedIdea.title}</h2>
                    <p className="text-white/90 text-lg mt-1">{selectedIdea.description}</p>
                  </div>
                  
                  {guide && (
                    <button
                      onClick={handleSave}
                      disabled={isFavorite(selectedIdea.title)}
                      className={`p-3 rounded-full shadow-lg transition-all transform hover:scale-110 active:scale-95 flex items-center gap-2 font-bold ${
                        isFavorite(selectedIdea.title) 
                          ? 'bg-red-500 text-white cursor-default' 
                          : 'bg-white text-red-500 hover:bg-red-50'
                      }`}
                    >
                      <Heart className={`w-6 h-6 ${isFavorite(selectedIdea.title) ? 'fill-current' : ''}`} />
                      <span className="hidden md:inline">
                        {isFavorite(selectedIdea.title) ? t.ideas.saved : t.ideas.save}
                      </span>
                    </button>
                  )}
                </div>
              </div>
              <button 
                onClick={clearSelection}
                className="absolute top-4 left-4 bg-white/90 p-2 rounded-full hover:bg-white text-slate-800 shadow-lg transition-colors"
              >
                <ArrowLeft className="w-6 h-6" />
              </button>
            </div>

            <div className="p-6 md:p-8">
              {loadingGuide ? (
                <div className="flex flex-col items-center justify-center py-12 text-green-600">
                  <Loader2 className="w-12 h-12 animate-spin mb-4" />
                  <p className="text-xl font-pixel animate-pulse">{t.ideas.loadingGuide}</p>
                </div>
              ) : guide ? (
                <div className="grid md:grid-cols-3 gap-8">
                  <div className="md:col-span-1 bg-yellow-50 p-6 rounded-xl border-2 border-yellow-200 h-fit">
                    <h3 className="text-xl font-bold text-yellow-800 mb-4 flex items-center gap-2">
                      <Box className="w-5 h-5" />
                      {t.ideas.materials}
                    </h3>
                    <ul className="space-y-2">
                      {guide.materials.map((mat, idx) => (
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
                      {guide.steps.map((step, idx) => (
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
                    
                    <div className="mt-8 flex justify-center">
                      <button
                        onClick={handleComplete}
                        className="bg-green-600 text-white px-8 py-4 rounded-xl font-bold text-xl hover:bg-green-700 shadow-lg active:scale-95 flex items-center gap-3 transition-all animate-bounce"
                      >
                        <CheckCircle className="w-8 h-8" />
                        {t.ideas.complete}
                      </button>
                    </div>
                  </div>
                </div>
              ) : null}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
