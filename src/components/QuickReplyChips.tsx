import React from 'react';

export interface QuickReply {
  id: string;
  text: string;
  action: string;
  icon?: string;
}

interface QuickReplyChipsProps {
  options: QuickReply[];
  onSelect: (action: string, text: string) => void;
  disabled?: boolean;
}

export const QuickReplyChips: React.FC<QuickReplyChipsProps> = ({
  options,
  onSelect,
  disabled = false
}) => {
  if (options.length === 0) return null;

  return (
    <div className="px-6 pb-4">
      <div className="glass rounded-2xl p-4 border border-white/10">
        <div className="text-xs text-slate-400 mb-3 font-medium">Quick Actions</div>
        <div className="flex flex-wrap gap-2">
          {options.map((option) => (
            <button
              key={option.id}
              onClick={() => !disabled && onSelect(option.action, option.text)}
              disabled={disabled}
              className={`
                px-4 py-2 rounded-lg text-sm font-medium
                bg-white/5 border border-white/10
                text-slate-200
                transition-all duration-200
                ${disabled 
                  ? 'opacity-50 cursor-not-allowed' 
                  : 'hover:bg-white/10 hover:border-white/20 hover:text-white active:scale-[0.98] cursor-pointer'
                }
              `}
            >
              {option.text}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

// Predefined quick reply sets for different stages
export const QUICK_REPLIES = {
  initial: [
    { id: 'check-eligibility', text: 'Check Eligibility', action: 'eligibility' },
    { id: 'loan-types', text: 'Loan Products', action: 'loan-types' },
    { id: 'interest-rates', text: 'Interest Rates', action: 'rates' },
  ],
  
  identified: [
    { id: 'apply-loan', text: 'Apply for Loan', action: 'apply' },
    { id: 'view-offers', text: 'View My Offers', action: 'offers' },
    { id: 'emi-calculator', text: 'Calculate EMI', action: 'calculate-emi' },
  ],
  
  loanDiscussion: [
    { id: 'quick-5l', text: '₹5 Lakhs', action: 'amount:500000' },
    { id: 'quick-10l', text: '₹10 Lakhs', action: 'amount:1000000' },
    { id: 'quick-custom', text: 'Custom Amount', action: 'amount:custom' },
  ],
  
  tenureSelection: [
    { id: 'tenure-12', text: '12 Months', action: 'tenure:12' },
    { id: 'tenure-24', text: '24 Months', action: 'tenure:24' },
    { id: 'tenure-36', text: '36 Months', action: 'tenure:36' },
    { id: 'tenure-60', text: '60 Months', action: 'tenure:60' },
  ],
  
  approval: [
    { id: 'upload-doc', text: 'Upload Document', action: 'upload' },
    { id: 'view-details', text: 'View Details', action: 'details' },
    { id: 'accept-offer', text: 'Accept Offer', action: 'accept' },
  ],
  
  postApproval: [
    { id: 'download-pdf', text: 'Download PDF', action: 'download-pdf' },
    { id: 'email-letter', text: 'Email Letter', action: 'email' },
    { id: 'new-application', text: 'New Application', action: 'new' },
  ]
};
