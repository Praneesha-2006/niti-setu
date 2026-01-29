
import React, { useState, useEffect } from 'react';
import { extractProfileFromText } from '../services/geminiService';
import { FarmerProfile } from '../types';

interface VoiceControlProps {
  onProfileExtracted: (profile: Partial<FarmerProfile>) => void;
}

const VoiceControl: React.FC<VoiceControlProps> = ({ onProfileExtracted }) => {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Check for SpeechRecognition support
  const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
  const [recognition] = useState(() => SpeechRecognition ? new SpeechRecognition() : null);

  if (recognition) {
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = 'en-IN';
  }

  const startListening = async () => {
    setError(null);
    setTranscript('');

    if (!recognition) {
      setError("Speech recognition is not supported in this browser. Please try Chrome or Edge.");
      return;
    }

    try {
      // Proactively request microphone access to trigger permission dialog and check for capture issues
      await navigator.mediaDevices.getUserMedia({ audio: true });
      setIsListening(true);
      recognition.start();
    } catch (err: any) {
      console.error("Microphone access error:", err);
      if (err.name === 'NotAllowedError' || err.name === 'PermissionDeniedError') {
        setError("Microphone permission denied. Please allow microphone access in your browser settings.");
      } else if (err.name === 'NotFoundError' || err.name === 'DevicesNotFoundError') {
        setError("No microphone found. Please connect a microphone and try again.");
      } else {
        setError("Could not start microphone. Ensure no other app is using it.");
      }
    }
  };

  const stopListening = () => {
    if (recognition) {
      recognition.stop();
      setIsListening(false);
    }
  };

  useEffect(() => {
    if (!recognition) return;

    recognition.onresult = async (event: any) => {
      const speechToText = event.results[0][0].transcript;
      setTranscript(speechToText);
      setIsListening(false);
      
      setIsProcessing(true);
      try {
        const profile = await extractProfileFromText(speechToText);
        onProfileExtracted(profile);
      } catch (err) {
        console.error("Profile extraction failed", err);
        setError("Failed to process your request. Please try speaking again.");
      } finally {
        setIsProcessing(false);
      }
    };

    recognition.onerror = (event: any) => {
      console.error("Speech Recognition Error", event.error);
      setIsListening(false);
      
      switch (event.error) {
        case 'audio-capture':
          setError("Microphone capture failed. Ensure your microphone is plugged in and not in use by another app.");
          break;
        case 'not-allowed':
          setError("Microphone access blocked. Please enable it in browser settings.");
          break;
        case 'no-speech':
          setError("No speech detected. Please try again.");
          break;
        case 'network':
          setError("Network error occurred during speech recognition.");
          break;
        default:
          setError(`Speech recognition error: ${event.error}`);
      }
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    return () => {
      if (recognition) recognition.abort();
    };
  }, [recognition, onProfileExtracted]);

  return (
    <div className="flex flex-col items-center p-6 bg-white rounded-2xl shadow-sm border border-emerald-100">
      <div className="text-center mb-6">
        <h3 className="text-xl font-bold text-emerald-800">Voice Assistant</h3>
        <p className="text-sm text-slate-500 mt-1">
          "I am a farmer from Punjab with 4 acres of land..."
        </p>
      </div>

      <button
        onClick={isListening ? stopListening : startListening}
        disabled={isProcessing}
        className={`relative w-24 h-24 rounded-full flex items-center justify-center transition-all shadow-lg ${
          isListening 
            ? 'bg-red-500 text-white mic-active scale-110' 
            : 'bg-emerald-600 text-white hover:bg-emerald-700 active:scale-95'
        } ${isProcessing ? 'opacity-50 cursor-not-allowed' : ''}`}
        aria-label={isListening ? "Stop listening" : "Start listening"}
      >
        {isProcessing ? (
          <i className="fas fa-spinner fa-spin text-3xl"></i>
        ) : (
          <i className={`fas ${isListening ? 'fa-stop' : 'fa-microphone'} text-3xl`}></i>
        )}
      </button>

      <div className="mt-6 w-full space-y-3">
        {isListening && (
          <div className="flex flex-col items-center">
            <div className="flex gap-1 mb-2">
              <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-bounce [animation-delay:-0.3s]"></span>
              <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-bounce [animation-delay:-0.15s]"></span>
              <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-bounce"></span>
            </div>
            <p className="text-emerald-600 font-medium text-sm">Listening for your details...</p>
          </div>
        )}

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 p-3 rounded-lg text-xs flex items-start gap-2 animate-in fade-in slide-in-from-top-1">
            <i className="fas fa-exclamation-circle mt-0.5"></i>
            <span>{error}</span>
          </div>
        )}

        {transcript && !isProcessing && !error && (
          <div className="bg-slate-50 p-3 rounded-lg border border-slate-200">
            <span className="text-[10px] font-black text-slate-400 block mb-1 uppercase tracking-widest">You said:</span>
            <p className="text-sm italic text-slate-700">"{transcript}"</p>
          </div>
        )}
        
        {isProcessing && (
          <div className="text-center text-xs text-slate-500 italic">
            Parsing your voice profile...
          </div>
        )}
      </div>
    </div>
  );
};

export default VoiceControl;
