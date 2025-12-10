// Sentiment Analysis for tone-aware responses
export type SentimentType = 'POSITIVE' | 'NEUTRAL' | 'NEGATIVE' | 'ANXIOUS' | 'FRUSTRATED' | 'EXCITED';

export interface SentimentResult {
  sentiment: SentimentType;
  confidence: number;
  keywords: string[];
  suggestedTone: string;
}

export class SentimentAnalyzer {
  private positiveKeywords = [
    'great', 'excellent', 'wonderful', 'amazing', 'perfect', 'happy', 'good', 
    'awesome', 'fantastic', 'love', 'thank', 'thanks', 'appreciate', 'excited',
    'interested', 'helpful', 'clear', 'understand', 'yes', 'sure', 'definitely'
  ];

  private negativeKeywords = [
    'bad', 'terrible', 'horrible', 'worst', 'poor', 'disappointed', 'unhappy',
    'sad', 'angry', 'hate', 'dislike', 'not good', 'problem', 'issue', 'wrong',
    'confused', 'difficult', 'hard', 'complicated', 'no', 'not', 'never'
  ];

  private anxiousKeywords = [
    'worried', 'concerned', 'nervous', 'anxious', 'scared', 'afraid', 'unsure',
    'uncertain', 'hesitant', 'doubt', 'risk', 'safe', 'secure', 'trust',
    'guarantee', 'what if', 'but', 'however', 'concern'
  ];

  private frustratedKeywords = [
    'frustrated', 'annoying', 'irritating', 'waste', 'time', 'long', 'slow',
    'again', 'still', 'yet', 'why', 'how long', 'when', 'waiting', 'stuck',
    'repeated', 'keep', 'multiple', 'many times'
  ];

  private excitedKeywords = [
    'excited', 'can\'t wait', 'eager', 'looking forward', 'ready', 'now',
    'asap', 'soon', 'immediately', 'quick', 'fast', 'urgent', 'need',
    'want', 'must', 'have to', 'let\'s go', 'let\'s do'
  ];

  analyze(text: string): SentimentResult {
    const lowerText = text.toLowerCase();
    const words = lowerText.split(/\s+/);

    // Count keyword matches
    const positiveCount = this.countMatches(words, this.positiveKeywords);
    const negativeCount = this.countMatches(words, this.negativeKeywords);
    const anxiousCount = this.countMatches(words, this.anxiousKeywords);
    const frustratedCount = this.countMatches(words, this.frustratedKeywords);
    const excitedCount = this.countMatches(words, this.excitedKeywords);

    // Check for question marks (indicates uncertainty/need for info)
    const questionMarks = (text.match(/\?/g) || []).length;
    
    // Check for exclamation marks (indicates strong emotion)
    const exclamationMarks = (text.match(/!/g) || []).length;

    // Determine dominant sentiment
    let sentiment: SentimentType = 'NEUTRAL';
    let confidence = 0.5;
    let keywords: string[] = [];

    if (anxiousCount > 0 && anxiousCount >= Math.max(positiveCount, negativeCount)) {
      sentiment = 'ANXIOUS';
      confidence = Math.min(0.9, 0.6 + (anxiousCount * 0.1));
      keywords = this.findMatchingKeywords(words, this.anxiousKeywords);
    } else if (frustratedCount > 0 && frustratedCount >= Math.max(positiveCount, negativeCount)) {
      sentiment = 'FRUSTRATED';
      confidence = Math.min(0.9, 0.6 + (frustratedCount * 0.1));
      keywords = this.findMatchingKeywords(words, this.frustratedKeywords);
    } else if (excitedCount > 1 || exclamationMarks > 1) {
      sentiment = 'EXCITED';
      confidence = Math.min(0.9, 0.6 + (excitedCount * 0.1));
      keywords = this.findMatchingKeywords(words, this.excitedKeywords);
    } else if (positiveCount > negativeCount && positiveCount > 0) {
      sentiment = 'POSITIVE';
      confidence = Math.min(0.9, 0.5 + ((positiveCount - negativeCount) * 0.1));
      keywords = this.findMatchingKeywords(words, this.positiveKeywords);
    } else if (negativeCount > positiveCount && negativeCount > 0) {
      sentiment = 'NEGATIVE';
      confidence = Math.min(0.9, 0.5 + ((negativeCount - positiveCount) * 0.1));
      keywords = this.findMatchingKeywords(words, this.negativeKeywords);
    } else if (questionMarks > 1) {
      sentiment = 'ANXIOUS';
      confidence = 0.6;
      keywords = ['multiple questions'];
    }

    return {
      sentiment,
      confidence,
      keywords,
      suggestedTone: this.getSuggestedTone(sentiment)
    };
  }

  private countMatches(words: string[], keywords: string[]): number {
    return words.filter(word => keywords.includes(word)).length;
  }

  private findMatchingKeywords(words: string[], keywords: string[]): string[] {
    return words.filter(word => keywords.includes(word)).slice(0, 3);
  }

  private getSuggestedTone(sentiment: SentimentType): string {
    switch (sentiment) {
      case 'POSITIVE':
        return 'Match their enthusiasm! Be warm, engaging, and maintain the positive energy.';
      
      case 'NEGATIVE':
        return 'Show empathy and understanding. Acknowledge their concerns and focus on solutions.';
      
      case 'ANXIOUS':
        return 'Be reassuring and patient. Provide clear, detailed information. Address concerns directly with facts.';
      
      case 'FRUSTRATED':
        return 'Apologize for any inconvenience. Be efficient and solution-oriented. Avoid lengthy explanations.';
      
      case 'EXCITED':
        return 'Match their energy! Be quick, enthusiastic, and action-oriented. Focus on moving forward fast.';
      
      case 'NEUTRAL':
      default:
        return 'Maintain professional friendliness. Be clear, informative, and helpful.';
    }
  }

  generateTonePrompt(sentiment: SentimentResult): string {
    return `[SENTIMENT DETECTED: ${sentiment.sentiment} (${Math.round(sentiment.confidence * 100)}% confidence)]
Keywords: ${sentiment.keywords.join(', ')}

TONE GUIDANCE: ${sentiment.suggestedTone}

Adjust your response style accordingly:
${this.getToneAdjustments(sentiment.sentiment)}`;
  }

  private getToneAdjustments(sentiment: SentimentType): string {
    switch (sentiment) {
      case 'POSITIVE':
        return `- Use upbeat language and emojis sparingly
- Celebrate their interest and positive outlook
- Make the process feel easy and exciting`;

      case 'NEGATIVE':
        return `- Lead with empathy: "I understand this is frustrating..."
- Focus on how you'll solve their concern
- Avoid defensive language or excuses`;

      case 'ANXIOUS':
        return `- Provide specific, factual reassurance
- Break down complex processes into simple steps
- Offer security details (encryption, privacy, RBI compliance)
- Use phrases like "Let me clarify..." and "Here's exactly what happens..."`;

      case 'FRUSTRATED':
        return `- Acknowledge the frustration immediately
- Be direct and concise - no fluff
- Focus on the quickest path to resolution
- Use phrases like "Let me help you right away..." or "Here's the fastest solution..."`;

      case 'EXCITED':
        return `- Match their pace and energy
- Use action words: "Let's do it!", "Ready when you are!"
- Skip long explanations, get to the point
- Emphasize speed: "instant approval", "within minutes"`;

      case 'NEUTRAL':
      default:
        return `- Maintain balanced, professional tone
- Be informative but not overwhelming
- Let them set the pace`;
    }
  }
}
