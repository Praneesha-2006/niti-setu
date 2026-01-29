
import React from 'react';
import { FarmerProfile } from '../types';

interface ProfileFormProps {
  profile: Partial<FarmerProfile>;
  onChange: (updates: Partial<FarmerProfile>) => void;
  onSubmit: () => void;
}

const ProfileForm: React.FC<ProfileFormProps> = ({ profile, onChange, onSubmit }) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    onChange({
      [name]: type === 'number' ? parseFloat(value) : value
    });
  };

  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-bold text-slate-800">Farmer Profile</h3>
        <span className="text-xs px-2 py-1 bg-blue-100 text-blue-700 rounded font-bold uppercase tracking-wider">Manual Entry</span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-bold text-slate-500 mb-1">FULL NAME</label>
          <input
            name="name"
            value={profile.name || ''}
            onChange={handleChange}
            className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-none"
            placeholder="e.g. Rajesh Kumar"
          />
        </div>
        <div>
          <label className="block text-xs font-bold text-slate-500 mb-1">STATE</label>
          <input
            name="state"
            value={profile.state || ''}
            onChange={handleChange}
            className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-none"
            placeholder="e.g. Maharashtra"
          />
        </div>
        <div>
          <label className="block text-xs font-bold text-slate-500 mb-1">LAND HOLDING (ACRES)</label>
          <input
            type="number"
            name="landHolding"
            value={profile.landHolding || ''}
            onChange={handleChange}
            className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-none"
            placeholder="e.g. 2.5"
          />
        </div>
        <div>
          <label className="block text-xs font-bold text-slate-500 mb-1">SOCIAL CATEGORY</label>
          <select
            name="category"
            value={profile.category || 'General'}
            onChange={handleChange}
            className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-none"
          >
            <option value="General">General</option>
            <option value="OBC">OBC</option>
            <option value="SC">SC</option>
            <option value="ST">ST</option>
            <option value="EWS">EWS</option>
          </select>
        </div>
        <div className="md:col-span-2">
          <label className="block text-xs font-bold text-slate-500 mb-1">PRIMARY CROP</label>
          <input
            name="cropType"
            value={profile.cropType || ''}
            onChange={handleChange}
            className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-none"
            placeholder="e.g. Wheat, Cotton"
          />
        </div>
      </div>

      <button
        onClick={onSubmit}
        className="w-full mt-6 bg-emerald-600 text-white py-3 rounded-xl font-bold hover:bg-emerald-700 transition shadow-lg flex items-center justify-center gap-2"
      >
        <i className="fas fa-search"></i>
        Analyze Eligibility
      </button>
    </div>
  );
};

export default ProfileForm;
