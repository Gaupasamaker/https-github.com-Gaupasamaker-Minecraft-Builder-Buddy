import React, { useState, useEffect } from 'react';
import { ArrowLeft, Download, Loader2, Share2 } from 'lucide-react';
import { getAi, MODELS } from '../services/gemini';
import { useLanguage } from '../context/LanguageContext';

interface PromoGeneratorProps {
  onBack: () => void;
}

export default function PromoGenerator({ onBack }: PromoGeneratorProps) {
  const { t } = useLanguage();
  const [loading, setLoading] = useState(true);
  const [image, setImage] = useState<string | null>(null);

  useEffect(() => {
    generatePromoImage();
  }, []);

  const generatePromoImage = async () => {
    try {
      const prompt = `A vibrant, high-quality promotional image for a Minecraft companion app called "Builder Buddy". 
      Style: 3D render, bright colors, similar to Minecraft promotional art but with a unique twist.
      Content: A friendly, blocky robot character holding a blue blueprint. 
      Background: A beautiful Minecraft landscape with a mix of biomes (forest, mountains) and diverse structures (a castle, a modern house, a redstone machine).
      Text: The words "Builder Buddy" should be integrated into the image in a fun, blocky 3D font, clearly visible.
      Lighting: Sunny, cheerful, with soft shadows.`;

      const ai = getAi();
      const response = await ai.models.generateContent({
        model: MODELS.image,
        contents: {
          parts: [{ text: prompt }]
        },
      });

      const candidates = response.candidates;
      if (candidates && candidates[0]?.content?.parts) {
        for (const part of candidates[0].content.parts) {
          if (part.inlineData && part.inlineData.data) {
             setImage(`data:${part.inlineData.mimeType || 'image/png'};base64,${part.inlineData.data}`);
             break;
          }
        }
      }
    } catch (error) {
      console.error("Error generating promo image:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <button 
          onClick={onBack}
          className="p-2 hover:bg-green-200 rounded-full transition-colors"
        >
          <ArrowLeft className="w-6 h-6 text-green-800" />
        </button>
        <h2 className="text-3xl text-green-800">Promo Image Generator</h2>
      </div>

      <div className="bg-white rounded-2xl p-6 shadow-xl border-b-8 border-green-200 min-h-[400px] flex flex-col items-center justify-center">
        {loading ? (
          <div className="text-center text-green-600">
            <Loader2 className="w-16 h-16 animate-spin mb-4 mx-auto" />
            <p className="text-xl font-bold animate-pulse">Generating your masterpiece...</p>
            <p className="text-sm opacity-75 mt-2">This might take a few seconds.</p>
          </div>
        ) : image ? (
          <div className="space-y-6 w-full max-w-2xl">
            <div className="rounded-xl overflow-hidden shadow-2xl border-4 border-slate-800">
              <img src={image} alt="Builder Buddy Promo" className="w-full h-auto" />
            </div>
            <div className="flex justify-center gap-4">
              <a 
                href={image} 
                download="builder-buddy-promo.png"
                className="bg-green-600 text-white px-8 py-3 rounded-xl font-bold text-lg hover:bg-green-700 shadow-lg flex items-center gap-2"
              >
                <Download className="w-6 h-6" />
                Download Image
              </a>
            </div>
          </div>
        ) : (
          <div className="text-center text-red-500">
            <p className="text-xl font-bold">Oops! Something went wrong.</p>
            <button 
              onClick={() => { setLoading(true); generatePromoImage(); }}
              className="mt-4 text-green-600 underline hover:text-green-800"
            >
              Try Again
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
