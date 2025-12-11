import React from 'react';

const Hero: React.FC = () => {

  return (
    <div className="flex flex-col justify-center h-full px-4 sm:px-6 lg:px-8 xl:px-10 max-w-4xl overflow-y-auto scrollbar-premium py-3">
      {/* Badge */}
      <div className="inline-flex mb-8 animate-fade-in-up">
        <div className="glass px-4 py-2 rounded-full">
          <span className="text-xs font-medium tracking-wide text-white/60">
            NBFC-GRADE AGENTIC AI
          </span>
        </div>
      </div>

      {/* Hero Heading */}
      <h1 
        className="text-4xl sm:text-5xl md:text-6xl lg:text-6xl xl:text-7xl font-bold leading-[1.1] tracking-tight mb-6 sm:mb-8 animate-fade-in-up"
        style={{ animationDelay: '0.1s' }}
      >
        Loan underwriting,
        <br />
        <span className="text-gradient">reimagined</span>
      </h1>

      {/* Subcopy */}
      <p 
        className="text-base sm:text-lg lg:text-xl xl:text-xl text-white/60 leading-relaxed mb-8 sm:mb-12 max-w-2xl animate-fade-in-up"
        style={{ animationDelay: '0.2s' }}
      >
        FinSync AI orchestrates multiple specialized agents to deliver instant,
        intelligent loan decisions — from sales to sanction in under 10 minutes.
      </p>

      {/* CTAs */}
      <div 
        className="flex flex-col sm:flex-row flex-wrap gap-3 sm:gap-4 mb-8 sm:mb-12 animate-fade-in-up"
        style={{ animationDelay: '0.3s' }}
      >
        <button className="group relative px-6 sm:px-8 py-3 sm:py-4 bg-gradient-to-r from-accent-purple to-accent-cyan rounded-xl sm:rounded-2xl font-semibold text-sm sm:text-base text-white transition-all duration-300 hover:scale-105 hover:shadow-2xl glow-purple w-full sm:w-auto">
          <span className="relative z-10">Get Started</span>
          <div className="absolute inset-0 bg-gradient-to-r from-accent-cyan to-accent-purple rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        </button>
        
        <button className="px-6 sm:px-8 py-3 sm:py-4 glass rounded-xl sm:rounded-2xl font-semibold text-sm sm:text-base text-white/90 transition-all duration-300 hover:scale-105 hover:bg-white/5 w-full sm:w-auto">
          View Orchestration
        </button>
      </div>

      {/* Stats Row */}
      <div 
        className="animate-fade-in-up"
        style={{ animationDelay: '0.4s' }}
      >
        <StatsRow />
      </div>
    </div>
  );
};

const StatsRow: React.FC = () => {
  const stats = [
    { value: '3x', label: 'Conversion Rate' },
    { value: '<10 min', label: 'Approval Time' },
    { value: '99.7%', label: 'Accuracy' },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
      {stats.map((stat, index) => (
        <div key={index} className="group">
          <div className="glass rounded-xl sm:rounded-2xl p-4 sm:p-6 transition-all duration-300 hover:scale-105 hover:bg-white/5">
            <div className="text-2xl sm:text-3xl font-bold text-gradient mb-1 sm:mb-2">{stat.value}</div>
            <div className="text-xs sm:text-sm text-white/50 uppercase tracking-wide">{stat.label}</div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Hero;