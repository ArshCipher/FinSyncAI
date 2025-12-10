import React from 'react';

const Sidebar: React.FC = () => {
  return (
    <div className="hidden lg:flex lg:flex-col bg-gradient-to-br from-primary-50 to-white border-r border-gray-200 p-8 w-80">
      {/* Logo */}
      <div className="flex items-center gap-3 mb-8">
        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary-500 to-primary-600 flex items-center justify-center text-white font-bold text-lg shadow-lg">
          FS
        </div>
        <div>
          <h1 className="text-2xl font-bold text-gray-800">FinSync AI</h1>
          <p className="text-xs text-gray-500">Intelligent Loan Assistant</p>
        </div>
      </div>

      {/* Features */}
      <div className="flex-1">
        <h2 className="text-sm font-semibold text-gray-600 uppercase tracking-wide mb-4">
          Features
        </h2>
        <div className="space-y-4">
          <FeatureItem 
            icon="★"
            title="Understands your loan needs"
            description="Smart conversation to understand your requirements"
          />
          <FeatureItem 
            icon="•"
            title="Multi-agent orchestration"
            description="Sales, verification & underwriting agents working together"
          />
          <FeatureItem 
            icon="■"
            title="Sanction letter generation"
            description="Generates PDF sanction letters instantly"
          />
          <FeatureItem 
            icon="►"
            title="Powered by Groq"
            description="Lightning-fast AI responses"
          />
        </div>
      </div>

      {/* Disclaimer */}
      <div className="mt-auto pt-6 border-t border-gray-200">
        <p className="text-xs text-gray-500 leading-relaxed">
          <span className="font-semibold">Note:</span> This system uses secure CRM integration and credit bureau data. All information is encrypted and handled according to RBI guidelines.
        </p>
      </div>
    </div>
  );
};

interface FeatureItemProps {
  icon: string;
  title: string;
  description: string;
}

const FeatureItem: React.FC<FeatureItemProps> = ({ icon, title, description }) => {
  return (
    <div className="flex gap-3 items-start">
      <span className="text-2xl flex-shrink-0">{icon}</span>
      <div>
        <h3 className="text-sm font-semibold text-gray-800">{title}</h3>
        <p className="text-xs text-gray-600 mt-0.5">{description}</p>
      </div>
    </div>
  );
};

export default Sidebar;
