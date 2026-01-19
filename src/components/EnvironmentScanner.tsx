import React, { useState, useRef, useCallback } from 'react';
import Webcam from 'react-webcam';
import { motion } from 'motion/react';
import { ArrowLeft, Camera, Upload, RefreshCw, Loader2, Image as ImageIcon } from 'lucide-react';
import { getAi, MODELS } from '../services/gemini';
import ReactMarkdown from 'react-markdown';
import { useLanguage } from '../context/LanguageContext';

interface EnvironmentScannerProps {
  onBack: () => void;
}

export default function EnvironmentScanner({ onBack }: EnvironmentScannerProps) {
  const { t, language } = useLanguage();
  const [image, setImage] = useState<string | null>(null);
  const [analysis, setAnalysis] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [cameraActive, setCameraActive] = useState(false);
  const webcamRef = useRef<Webcam>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const capture = useCallback(() => {
    const imageSrc = webcamRef.current?.getScreenshot();
    if (imageSrc) {
      setImage(imageSrc);
      setCameraActive(false);
      analyzeImage(imageSrc);
    }
  }, [webcamRef]);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        setImage(base64String);
        analyzeImage(base64String);
      };
      reader.readAsDataURL(file);
    }
  };

  const analyzeImage = async (base64Image: string) => {
    setLoading(true);
    setAnalysis('');

    try {
      // Remove the data URL prefix to get just the base64 string
      const base64Data = base64Image.split(',')[1];
      const mimeType = base64Image.split(';')[0].split(':')[1];

      const prompt = `Look at this Minecraft screenshot (or photo of a screen). 
      1. Identify the biome and surrounding terrain (e.g., forest, desert, mountain, near water).
      2. Suggest 3 building ideas that would fit perfectly in this specific environment.
      3. Explain WHY they fit (e.g., "A treehouse works great here because of the tall jungle trees").
      Keep it fun and encouraging for an 11-year-old!
      Respond in ${language === 'es' ? 'Spanish' : 'English'}.`;

      const ai = getAi();
      const response = await ai.models.generateContent({
        model: MODELS.vision,
        contents: {
          parts: [
            { inlineData: { mimeType: mimeType, data: base64Data } },
            { text: prompt }
          ]
        }
      });

      setAnalysis(response.text || t.scanner.noAnalysis);
    } catch (error) {
      console.error("Vision error:", error);
      setAnalysis(t.scanner.error);
    } finally {
      setLoading(false);
    }
  };

  const reset = () => {
    setImage(null);
    setAnalysis('');
    setCameraActive(false);
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
        <h2 className="text-3xl text-green-800">{t.scanner.title}</h2>
      </div>

      <div className="bg-white rounded-2xl p-6 shadow-xl border-b-8 border-green-200 min-h-[500px]">
        {!image && !cameraActive && (
          <div className="flex flex-col items-center justify-center h-full py-12 gap-8">
            <div className="text-center space-y-2">
              <h3 className="text-2xl font-bold text-slate-700">{t.scanner.introTitle}</h3>
              <p className="text-slate-500">{t.scanner.introDesc}</p>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-6">
              <button
                onClick={() => setCameraActive(true)}
                className="flex flex-col items-center gap-4 p-8 bg-purple-50 border-2 border-purple-200 rounded-2xl hover:bg-purple-100 hover:border-purple-400 transition-all group"
              >
                <div className="bg-purple-200 p-4 rounded-full group-hover:scale-110 transition-transform">
                  <Camera className="w-12 h-12 text-purple-700" />
                </div>
                <span className="text-xl font-bold text-purple-800">{t.scanner.useCamera}</span>
              </button>

              <button
                onClick={() => fileInputRef.current?.click()}
                className="flex flex-col items-center gap-4 p-8 bg-blue-50 border-2 border-blue-200 rounded-2xl hover:bg-blue-100 hover:border-blue-400 transition-all group"
              >
                <div className="bg-blue-200 p-4 rounded-full group-hover:scale-110 transition-transform">
                  <Upload className="w-12 h-12 text-blue-700" />
                </div>
                <span className="text-xl font-bold text-blue-800">{t.scanner.uploadImage}</span>
              </button>
              <input 
                type="file" 
                ref={fileInputRef} 
                onChange={handleFileUpload} 
                accept="image/*" 
                className="hidden" 
              />
            </div>
          </div>
        )}

        {cameraActive && (
          <div className="flex flex-col items-center gap-6">
            <div className="relative rounded-2xl overflow-hidden shadow-lg border-4 border-slate-800 bg-black">
              <Webcam
                audio={false}
                ref={webcamRef}
                screenshotFormat="image/jpeg"
                className="w-full max-w-lg"
                videoConstraints={{ facingMode: "environment" }}
              />
            </div>
            <div className="flex gap-4">
              <button
                onClick={capture}
                className="bg-green-600 text-white px-8 py-3 rounded-full font-bold text-xl hover:bg-green-700 shadow-lg active:scale-95 flex items-center gap-2"
              >
                <Camera className="w-6 h-6" />
                {t.scanner.snapPhoto}
              </button>
              <button
                onClick={() => setCameraActive(false)}
                className="bg-slate-200 text-slate-700 px-6 py-3 rounded-full font-bold hover:bg-slate-300"
              >
                {t.scanner.cancel}
              </button>
            </div>
          </div>
        )}

        {image && (
          <div className="flex flex-col md:flex-row gap-6">
            <div className="md:w-1/3 flex flex-col gap-4">
              <div className="relative rounded-xl overflow-hidden border-4 border-slate-200 shadow-md">
                <img src={image} alt="Captured environment" className="w-full h-auto" />
              </div>
              <button
                onClick={reset}
                className="w-full py-3 bg-slate-100 text-slate-700 rounded-xl font-bold hover:bg-slate-200 flex items-center justify-center gap-2"
              >
                <RefreshCw className="w-5 h-5" />
                {t.scanner.scanNew}
              </button>
            </div>

            <div className="md:w-2/3">
              {loading ? (
                <div className="h-full flex flex-col items-center justify-center text-purple-600 min-h-[200px]">
                  <Loader2 className="w-12 h-12 animate-spin mb-4" />
                  <p className="text-xl font-pixel animate-pulse">{t.scanner.analyzing}</p>
                </div>
              ) : (
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="bg-purple-50 p-6 rounded-xl border-2 border-purple-200 h-full"
                >
                  <h3 className="text-2xl text-purple-800 font-bold mb-4 flex items-center gap-2">
                    <ImageIcon className="w-6 h-6" />
                    {t.scanner.results}
                  </h3>
                  <div className="prose prose-slate prose-lg max-w-none">
                    <ReactMarkdown>{analysis}</ReactMarkdown>
                  </div>
                </motion.div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
