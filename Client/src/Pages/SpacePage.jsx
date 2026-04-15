import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import StarRating from '../Components/ui/star-rating';
import { Button } from '../Components/ui/button';
import { Input } from '../Components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '../Components/ui/card';
import { Label } from '../Components/ui/label';
import { Textarea } from '../Components/ui/textarea';
import { Loader2, CheckCircle, AlertCircle, User, Mail, MessageSquare } from 'lucide-react';
import { API_ENDPOINTS } from '../config/api.js';

const SpacePage = () => {
  const { publicUrl } = useParams();
  const [spaceData, setSpaceData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState(null);
  const [feedback, setFeedback] = useState({
    name: '',
    email: '',
    rating: 0,
    responses: [],
  });

  useEffect(() => {
    const fetchSpaceData = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await fetch(API_ENDPOINTS.SPACE_BY_URL(publicUrl));
        if (!response.ok) {
          throw new Error('Space not found');
        }
        const data = await response.json();
        setSpaceData(data);
        setFeedback((prevFeedback) => ({
          ...prevFeedback,
          responses: Array(data.questions.length).fill(''),
        }));
      } catch (error) {
        console.error('Error fetching space data:', error);
        setError('Unable to load feedback form. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchSpaceData();
  }, [publicUrl]);

  const handleFeedbackChange = (index, value) => {
    const updatedResponses = [...feedback.responses];
    updatedResponses[index] = value;
    setFeedback((prevFeedback) => ({
      ...prevFeedback,
      responses: updatedResponses,
    }));
  };

  const handleRatingChange = (rating) => {
    setFeedback((prevFeedback) => ({
      ...prevFeedback,
      rating,
    }));
  };

  const handleSubmitFeedback = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    try {
      const submitData = {
        name: feedback.name,
        email: feedback.email,
        responses: feedback.responses,
        feedbackType: 'text',
      };

      if (spaceData?.starRatings && feedback.rating > 0) {
        submitData.rating = feedback.rating;
      }

      const response = await fetch(API_ENDPOINTS.SUBMIT_FEEDBACK(publicUrl), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(submitData),
      });

      if (response.ok) {
        setSubmitted(true);
        setFeedback({
          name: '',
          email: '',
          rating: 0,
          responses: Array(spaceData.questions.length).fill(''),
        });
      } else {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to submit feedback');
      }
    } catch (error) {
      console.error('Error submitting feedback:', error);
      setError(error.message || 'Failed to submit feedback. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center">
        <div className="flex items-center gap-3 text-gray-300">
          <Loader2 className="w-6 h-6 animate-spin" />
          <span>Loading feedback form...</span>
        </div>
      </div>
    );
  }

  if (error && !spaceData) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center p-4">
        <Card className="w-full max-w-md bg-gray-900 border-gray-800">
          <CardContent className="pt-6">
            <div className="flex items-center gap-3 text-red-400 mb-4">
              <AlertCircle className="w-6 h-6" />
              <span className="font-medium">Error</span>
            </div>
            <p className="text-gray-300 mb-4">{error}</p>
            <Button 
              onClick={() => window.location.reload()} 
              variant="outline"
              className="w-full"
            >
              Try Again
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (submitted) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center p-4">
        <Card className="w-full max-w-md bg-gray-900 border-gray-800">
          <CardContent className="pt-6 text-center">
            <CheckCircle className="w-16 h-16 text-green-400 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-gray-100 mb-2">
              Thank you for your feedback!
            </h2>
            <p className="text-gray-400 mb-6">
              Your response has been submitted successfully.
            </p>
            <Button 
              onClick={() => setSubmitted(false)}
              variant="outline"
              className="w-full"
            >
              Submit Another Response
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-950">
      {/* Header Section */}
      <div className="bg-gray-900 border-b border-gray-800">
        <div className="max-w-2xl mx-auto px-4 py-8">
          {spaceData.img && (
            <div className="flex justify-center mb-6">
              <img 
                src={spaceData.img} 
                alt={`${spaceData.spacename} logo`}
                className="h-16 w-16 rounded-lg object-cover"
              />
            </div>
          )}
          <div className="text-center">
            <h1 className="text-3xl font-bold text-gray-100 mb-3">
              {spaceData.headerTitle || spaceData.spacename}
            </h1>
            {spaceData.customMessage && (
              <p className="text-lg text-gray-300 leading-relaxed">
                {spaceData.customMessage}
              </p>
            )}
            {!spaceData.isActive && (
              <div className="mt-4 text-sm text-red-300 bg-red-900/20 border border-red-800/30 inline-block px-3 py-2 rounded">
                This space is currently deactivated. Please contact your provider.
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Feedback Form */}
      <div className="max-w-2xl mx-auto px-4 py-8">
        <Card className="bg-gray-900 border-gray-800">
          <CardHeader>
            <CardTitle className="text-gray-100 flex items-center gap-2">
              <MessageSquare className="w-5 h-5" />
              Share Your Experience
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmitFeedback} className="space-y-6">
              {/* Personal Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name" className="text-gray-200 flex items-center gap-2">
                    <User className="w-4 h-4" />
                    Name
                  </Label>
                  <Input
                    id="name"
                    type="text"
                    value={feedback.name}
                    onChange={(e) => setFeedback({ ...feedback, name: e.target.value })}
                    required
                    className="bg-gray-800 border-gray-700 text-gray-100 focus:border-blue-500"
                    placeholder="Your full name"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-gray-200 flex items-center gap-2">
                    <Mail className="w-4 h-4" />
                    Email
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    value={feedback.email}
                    onChange={(e) => setFeedback({ ...feedback, email: e.target.value })}
                    required
                    className="bg-gray-800 border-gray-700 text-gray-100 focus:border-blue-500"
                    placeholder="your.email@example.com"
                  />
                </div>
              </div>

              {/* Star Rating */}
              {spaceData.starRatings && (
                <div className="space-y-3">
                  <Label className="text-gray-200">Overall Rating</Label>
                  <div className="flex justify-center md:justify-start">
                    <StarRating
                      rating={feedback.rating}
                      onRatingChange={handleRatingChange}
                      size="lg"
                      className="justify-center md:justify-start"
                    />
                  </div>
                </div>
              )}

              {/* Custom Questions */}
              {spaceData.questions.map((question, index) => (
                <div key={index} className="space-y-2">
                  <Label htmlFor={`question-${index}`} className="text-gray-200">
                    {question}
                  </Label>
                  <Textarea
                    id={`question-${index}`}
                    value={feedback.responses[index]}
                    onChange={(e) => handleFeedbackChange(index, e.target.value)}
                    className="bg-gray-800 border-gray-700 text-gray-100 focus:border-blue-500 min-h-[100px]"
                    placeholder="Share your thoughts..."
                  />
                </div>
              ))}

              {/* Error Message */}
              {error && (
                <div className="flex items-center gap-2 text-red-400 bg-red-950/20 border border-red-900/20 rounded-lg p-3">
                  <AlertCircle className="w-4 h-4" />
                  <span className="text-sm">{error}</span>
                </div>
              )}

              {/* Submit Button */}
              <Button
                type="submit"
                disabled={submitting || !spaceData.isActive}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3"
              >
                {submitting ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Submitting...
                  </>
                ) : (
                  (spaceData.isActive ? 'Submit Feedback' : 'Space Deactivated')
                )}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default SpacePage;