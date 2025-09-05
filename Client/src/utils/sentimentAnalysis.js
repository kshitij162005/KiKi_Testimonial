// Simple sentiment analysis utility
// In a production app, you'd use a more sophisticated NLP library or API

const positiveWords = [
  'amazing', 'awesome', 'excellent', 'fantastic', 'great', 'love', 'perfect',
  'wonderful', 'outstanding', 'brilliant', 'superb', 'incredible', 'marvelous',
  'exceptional', 'phenomenal', 'remarkable', 'spectacular', 'terrific', 'fabulous',
  'magnificent', 'impressive', 'delightful', 'pleased', 'satisfied', 'happy',
  'thrilled', 'excited', 'grateful', 'thankful', 'appreciate', 'recommend',
  'best', 'top', 'quality', 'professional', 'helpful', 'friendly', 'fast',
  'efficient', 'reliable', 'trustworthy', 'valuable', 'useful', 'easy',
  'smooth', 'seamless', 'flawless', 'perfect', 'ideal', 'exactly'
];

const negativeWords = [
  'awful', 'terrible', 'horrible', 'bad', 'worst', 'hate', 'disappointing',
  'frustrating', 'annoying', 'useless', 'broken', 'failed', 'error', 'problem',
  'issue', 'bug', 'slow', 'difficult', 'hard', 'confusing', 'complicated',
  'expensive', 'overpriced', 'cheap', 'poor', 'lacking', 'missing', 'incomplete',
  'unreliable', 'untrustworthy', 'unprofessional', 'rude', 'unhelpful',
  'disappointed', 'unsatisfied', 'regret', 'waste', 'money', 'time',
  'never', 'again', 'avoid', 'warning', 'beware', 'scam', 'fraud'
];

const neutralWords = [
  'okay', 'fine', 'average', 'normal', 'standard', 'typical', 'regular',
  'decent', 'acceptable', 'adequate', 'sufficient', 'reasonable', 'fair',
  'moderate', 'middle', 'medium', 'basic', 'simple', 'plain', 'ordinary'
];

/**
 * Analyze sentiment of text
 * @param {string} text - Text to analyze
 * @returns {Object} - Sentiment analysis result
 */
export const analyzeSentiment = (text) => {
  if (!text || typeof text !== 'string') {
    return {
      score: 0,
      label: 'neutral',
      confidence: 0,
      keywords: []
    };
  }

  const words = text.toLowerCase()
    .replace(/[^\w\s]/g, ' ')
    .split(/\s+/)
    .filter(word => word.length > 2);

  let positiveScore = 0;
  let negativeScore = 0;
  let neutralScore = 0;
  const foundKeywords = [];

  words.forEach(word => {
    if (positiveWords.includes(word)) {
      positiveScore++;
      foundKeywords.push({ word, sentiment: 'positive' });
    } else if (negativeWords.includes(word)) {
      negativeScore++;
      foundKeywords.push({ word, sentiment: 'negative' });
    } else if (neutralWords.includes(word)) {
      neutralScore++;
      foundKeywords.push({ word, sentiment: 'neutral' });
    }
  });

  const totalSentimentWords = positiveScore + negativeScore + neutralScore;
  
  // Calculate normalized score (-1 to 1)
  let score = 0;
  if (totalSentimentWords > 0) {
    score = (positiveScore - negativeScore) / Math.max(totalSentimentWords, words.length * 0.1);
    score = Math.max(-1, Math.min(1, score)); // Clamp between -1 and 1
  }

  // Determine label
  let label = 'neutral';
  if (score > 0.1) label = 'positive';
  else if (score < -0.1) label = 'negative';

  // Calculate confidence based on number of sentiment words found
  const confidence = Math.min(1, totalSentimentWords / Math.max(5, words.length * 0.2));

  return {
    score: Number(score.toFixed(3)),
    label,
    confidence: Number(confidence.toFixed(3)),
    keywords: foundKeywords.slice(0, 5) // Return top 5 keywords
  };
};

/**
 * Analyze sentiment for multiple feedback entries
 * @param {Array} feedbackList - Array of feedback objects
 * @returns {Object} - Aggregate sentiment analysis
 */
export const analyzeFeedbackSentiment = (feedbackList) => {
  if (!Array.isArray(feedbackList) || feedbackList.length === 0) {
    return {
      overall: { score: 0, label: 'neutral', confidence: 0 },
      distribution: { positive: 0, neutral: 0, negative: 0 },
      totalAnalyzed: 0,
      trends: [],
      topKeywords: []
    };
  }

  const analyses = feedbackList.map(feedback => {
    const text = feedback.content || feedback.text || '';
    return {
      ...feedback,
      sentiment: analyzeSentiment(text)
    };
  });

  // Calculate overall metrics
  const totalScore = analyses.reduce((sum, item) => sum + item.sentiment.score, 0);
  const averageScore = totalScore / analyses.length;

  const distribution = analyses.reduce((dist, item) => {
    dist[item.sentiment.label]++;
    return dist;
  }, { positive: 0, neutral: 0, negative: 0 });

  // Collect all keywords
  const allKeywords = analyses.flatMap(item => item.sentiment.keywords);
  const keywordCounts = allKeywords.reduce((counts, keyword) => {
    const key = `${keyword.word}-${keyword.sentiment}`;
    counts[key] = (counts[key] || 0) + 1;
    return counts;
  }, {});

  const topKeywords = Object.entries(keywordCounts)
    .sort(([,a], [,b]) => b - a)
    .slice(0, 10)
    .map(([key, count]) => {
      const [word, sentiment] = key.split('-');
      return { word, sentiment, count };
    });

  // Calculate trends (if timestamps are available)
  const trends = calculateSentimentTrends(analyses);

  return {
    overall: {
      score: Number(averageScore.toFixed(3)),
      label: averageScore > 0.1 ? 'positive' : averageScore < -0.1 ? 'negative' : 'neutral',
      confidence: Number((analyses.reduce((sum, item) => sum + item.sentiment.confidence, 0) / analyses.length).toFixed(3))
    },
    distribution,
    totalAnalyzed: analyses.length,
    trends,
    topKeywords,
    analyses // Include individual analyses
  };
};

/**
 * Calculate sentiment trends over time
 * @param {Array} analyses - Array of analyzed feedback
 * @returns {Array} - Trend data points
 */
const calculateSentimentTrends = (analyses) => {
  // Group by date (assuming createdAt or timestamp field exists)
  const dateGroups = analyses.reduce((groups, item) => {
    const date = item.createdAt || item.timestamp || new Date();
    const dateKey = new Date(date).toISOString().split('T')[0]; // YYYY-MM-DD
    
    if (!groups[dateKey]) {
      groups[dateKey] = [];
    }
    groups[dateKey].push(item);
    return groups;
  }, {});

  return Object.entries(dateGroups)
    .map(([date, items]) => {
      const avgScore = items.reduce((sum, item) => sum + item.sentiment.score, 0) / items.length;
      const distribution = items.reduce((dist, item) => {
        dist[item.sentiment.label]++;
        return dist;
      }, { positive: 0, neutral: 0, negative: 0 });

      return {
        date,
        score: Number(avgScore.toFixed(3)),
        count: items.length,
        distribution
      };
    })
    .sort((a, b) => new Date(a.date) - new Date(b.date));
};

/**
 * Get sentiment insights and recommendations
 * @param {Object} sentimentData - Result from analyzeFeedbackSentiment
 * @returns {Array} - Array of insights and recommendations
 */
export const getSentimentInsights = (sentimentData) => {
  const insights = [];
  const { overall, distribution, totalAnalyzed, topKeywords } = sentimentData;

  if (totalAnalyzed === 0) {
    return [{ type: 'info', message: 'No feedback available for analysis.' }];
  }

  // Overall sentiment insight
  if (overall.score > 0.3) {
    insights.push({
      type: 'positive',
      message: `Great news! Your overall sentiment is strongly positive (${(overall.score * 100).toFixed(0)}%).`,
      recommendation: 'Consider showcasing these positive testimonials prominently on your website.'
    });
  } else if (overall.score < -0.3) {
    insights.push({
      type: 'negative',
      message: `Your sentiment analysis shows room for improvement (${(overall.score * 100).toFixed(0)}%).`,
      recommendation: 'Focus on addressing the common issues mentioned in negative feedback.'
    });
  } else {
    insights.push({
      type: 'neutral',
      message: 'Your feedback sentiment is balanced.',
      recommendation: 'Look for opportunities to exceed customer expectations and generate more positive feedback.'
    });
  }

  // Distribution insights
  const positivePercentage = (distribution.positive / totalAnalyzed * 100).toFixed(0);
  const negativePercentage = (distribution.negative / totalAnalyzed * 100).toFixed(0);

  if (distribution.positive > distribution.negative * 2) {
    insights.push({
      type: 'positive',
      message: `${positivePercentage}% of your feedback is positive - excellent work!`,
      recommendation: 'Use these positive testimonials in your marketing materials.'
    });
  }

  if (distribution.negative > distribution.positive) {
    insights.push({
      type: 'warning',
      message: `${negativePercentage}% of feedback is negative, which needs attention.`,
      recommendation: 'Analyze negative feedback patterns and create an action plan for improvement.'
    });
  }

  // Keyword insights
  const topPositiveKeywords = topKeywords.filter(k => k.sentiment === 'positive').slice(0, 3);
  const topNegativeKeywords = topKeywords.filter(k => k.sentiment === 'negative').slice(0, 3);

  if (topPositiveKeywords.length > 0) {
    insights.push({
      type: 'info',
      message: `Most praised aspects: ${topPositiveKeywords.map(k => k.word).join(', ')}`,
      recommendation: 'Highlight these strengths in your product descriptions and marketing.'
    });
  }

  if (topNegativeKeywords.length > 0) {
    insights.push({
      type: 'warning',
      message: `Common concerns: ${topNegativeKeywords.map(k => k.word).join(', ')}`,
      recommendation: 'Address these specific issues to improve customer satisfaction.'
    });
  }

  return insights;
};