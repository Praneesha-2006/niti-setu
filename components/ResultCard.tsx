
import React from 'react';
import { EligibilityResult } from '../types';

interface ResultCardProps {
  result: EligibilityResult;
  onReadAloud: (text: string) => void;
}

const ResultCard: React.FC<ResultCardProps> = ({ result, onReadAloud }) => {
  const { isEligible, schemeName, benefit, proofCitation, proofSnippet, nextSteps, requiredDocuments } = result;

  const ttsText = `You are ${isEligible ? 'eligible' : 'not eligible'} for the ${schemeName} scheme. ${isEligible ? 'You could receive ' + benefit : ''}. ${isEligible ? 'The document proof is found at ' + proofCitation : ''}`;

  return (
    <div className={`p-6 rounded-2xl shadow-lg border-2 mb-6 ${isEligible ? 'bg-emerald-50 border-emerald-500' : 'bg-red-50 border-red-500'}`}>
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div className="flex items-center gap-4">
          <div className={`w-16 h-16 rounded-full flex items-center justify-center text-white text-3xl shadow-md ${isEligible ? 'bg-emerald-600' : 'bg-red-600'}`}>
            <i className={`fas ${isEligible ? 'fa-check-circle' : 'fa-times-circle'}`}></i>
          </div>
          <div>
            <h2 className="text-2xl font-black text-slate-800 uppercase">{schemeName}</h2>
            <p className={`text-lg font-bold ${isEligible ? 'text-emerald-700' : 'text-red-700'}`}>
              {isEligible ? '✓ ELIGIBLE' : '✗ NOT ELIGIBLE'}
            </p>
          </div>
        </div>
        <button 
          onClick={() => onReadAloud(ttsText)}
          className="flex items-center gap-2 bg-white px-4 py-2 rounded-lg border border-slate-200 shadow-sm hover:bg-slate-50 font-bold transition"
        >
          <i className="fas fa-volume-up text-emerald-600"></i>
          Hear Result
        </button>
      </div>

      {isEligible && (
        <div className="bg-white p-4 rounded-xl border border-emerald-200 mb-6 shadow-sm">
          <div className="flex items-center gap-2 mb-2">
            <i className="fas fa-gift text-emerald-600"></i>
            <span className="text-sm font-black text-emerald-800 uppercase tracking-widest">Expected Benefit</span>
          </div>
          <p className="text-xl font-bold text-slate-800">{benefit}</p>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm h-full">
            <div className="flex items-center gap-2 mb-3">
              <i className="fas fa-file-contract text-blue-600"></i>
              <span className="text-sm font-black text-slate-500 uppercase">Document Proof</span>
            </div>
            <div className="bg-slate-50 p-3 rounded border border-slate-100 italic text-slate-600 text-sm mb-2">
              "{proofSnippet}"
            </div>
            <div className="text-xs font-bold text-blue-600">
              <i className="fas fa-bookmark mr-1"></i> Citation: {proofCitation}
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
            <div className="flex items-center gap-2 mb-3">
              <i className="fas fa-clipboard-list text-orange-600"></i>
              <span className="text-sm font-black text-slate-500 uppercase">Required Documents</span>
            </div>
            <ul className="text-sm space-y-2">
              {requiredDocuments.map((doc, idx) => (
                <li key={idx} className="flex items-center gap-2 text-slate-700">
                  <i className="fas fa-check text-slate-300"></i> {doc}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {isEligible && (
        <div className="mt-6">
           <div className="flex items-center gap-2 mb-3">
              <i className="fas fa-shoe-prints text-emerald-600"></i>
              <span className="text-sm font-black text-slate-500 uppercase">Next Steps to Apply</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {nextSteps.map((step, idx) => (
                <div key={idx} className="bg-emerald-600 text-white p-3 rounded-lg text-xs font-bold flex items-center justify-center text-center">
                  {idx + 1}. {step}
                </div>
              ))}
            </div>
        </div>
      )}
    </div>
  );
};

export default ResultCard;
