import React, { useMemo } from 'react';
import { TrendingUp, TrendingDown, Minus, AlertCircle, CheckCircle, Info } from 'lucide-react';
import { cn } from '../../../lib/utils';
import { analyzeFeedbackSentiment, getSentimentInsights } from '../../../utils/sentimentAnalysis';
import './SentimentAnalysis.css';

const SentimentAnalysis = ({ feedbackData = [], className }) => {
  const sentimentData = useMemo(() => {
    return analyzeFeedbackSentiment(feedbackData);
  }, [feedbackData]);

  const insights = useMemo(() => {
    return getSentimentInsights(sentimentData);
  }, [sentimentData]);

  if (!feedbackData.length) {
    return (
      <div className={cn('sentiment-analysis sentiment-analysis-empty', className)}>
        <div className="sentiment-empty-state">
          <Info className="w-12 h-12 text-gray-400 mb-4" />
          <h3 className="text-lg font-medium text-gray-300 mb-2">No Feedback Yet</h3>
          <p className="text-gray-400 text-center">
            Start collecting feedback to see sentiment analysis and insights here.
          </p>
        </div>
      </div>
    );
  }

  const { overall, distribution, totalAnalyzed, topKeywords } = sentimentData;

  const getSentimentIcon = (label) => {
    switch (label) {
      case 'positive':
        return <TrendingUp className="w-5 h-5 text-green-400" />;
      case 'negative':
        return <TrendingDown className="w-5 h-5 text-red-400" />;
      default:
        return <Minus className="w-5 h-5 text-yellow-400" />;
    }
  };

  const getSentimentColor = (label) => {
    switch (label) {
      case 'positive':
        return 'text-green-400';
      case 'negative':
        return 'text-red-400';
      default:
        return 'text-yellow-400';
    }
  };

  const getInsightIcon = (type) => {
    switch (type) {
      case 'positive':
        return <CheckCircle className="w-4 h-4 text-green-400" />;
      case 'negative':
      case 'warning':
        return <AlertCircle className="w-4 h-4 text-red-400" />;
      default:
        return <Info className="w-4 h-4 text-blue-400" />;
    }
  };

  return (
    <div className={cn('sentiment-analysis', className)}>
      <div className="sentiment-header">
        <h3 className="sentiment-title">Customer Sentiment Analysis</h3>
        <span className="sentiment-subtitle">
          Based on {totalAnalyzed} feedback entries
        </span>
      </div>

      {/* Overall Sentiment Score */}
      <div className="sentiment-overall">
        <div className="sentiment-score-container">
          <div className="sentiment-score-icon">
            {getSentimentIcon(overall.label)}
          </div>
          <div className="sentiment-score-details">
            <div className="sentiment-score-value">
              <span className={cn('sentiment-score-number', getSentimentColor(overall.label))}>
                {(overall.score * 100).toFixed(0)}%
              </span>
              <span className="sentiment-score-label">
                {overall.label.charAt(0).toUpperCase() + overall.label.slice(1)}
              </span>
            </div>
            <div className="sentiment-confidence">
              Confidence: {(overall.confidence * 100).toFixed(0)}%
            </div>
          </div>
        </div>

        {/* Sentiment Distribution */}
        <div className="sentiment-distribution">
          <div className="sentiment-distribution-bar">
            <div 
              className="sentiment-bar sentiment-bar-positive"
              style={{ width: `${(distribution.positive / totalAnalyzed) * 100}%` }}
            />
            <div 
              className="sentiment-bar sentiment-bar-neutral"
              style={{ width: `${(distribution.neutral / totalAnalyzed) * 100}%` }}
            />
            <div 
              className="sentiment-bar sentiment-bar-negative"
              style={{ width: `${(distribution.negative / totalAnalyzed) * 100}%` }}
            />
          </div>
          
          <div className="sentiment-distribution-legend">
            <div className="sentiment-legend-item">
              <div className="sentiment-legend-color sentiment-legend-positive" />
              <span>Positive ({distribution.positive})</span>
            </div>
            <div className="sentiment-legend-item">
              <div className="sentiment-legend-color sentiment-legend-neutral" />
              <span>Neutral ({distribution.neutral})</span>
            </div>
            <div className="sentiment-legend-item">
              <div className="sentiment-legend-color sentiment-legend-negative" />
              <span>Negative ({distribution.negative})</span>
            </div>
          </div>
        </div>
      </div>

      {/* Top Keywords */}
      {topKeywords.length > 0 && (
        <div className="sentiment-keywords">
          <h4 className="sentiment-keywords-title">Key Themes</h4>
          <div className="sentiment-keywords-list">
            {topKeywords.slice(0, 8).map((keyword, index) => (
              <span
                key={index}
                className={cn(
                  'sentiment-keyword-tag',
                  `sentiment-keyword-${keyword.sentiment}`
                )}
              >
                {keyword.word}
                <span className="sentiment-keyword-count">
                  {keyword.count}
                </span>
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Insights and Recommendations */}
      <div className="sentiment-insights">
        <h4 className="sentiment-insights-title">Insights & Recommendations</h4>
        <div className="sentiment-insights-list">
          {insights.map((insight, index) => (
            <div
              key={index}
              className={cn(
                'sentiment-insight-item',
                `sentiment-insight-${insight.type}`
              )}
            >
              <div className="sentiment-insight-header">
                {getInsightIcon(insight.type)}
                <span className="sentiment-insight-message">
                  {insight.message}
                </span>
              </div>
              {insight.recommendation && (
                <div className="sentiment-insight-recommendation">
                  <strong>Recommendation:</strong> {insight.recommendation}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SentimentAnalysis;