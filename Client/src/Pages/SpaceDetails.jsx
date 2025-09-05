import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Copy, CheckCircle, ExternalLink, Users, MessageSquare, Star } from 'lucide-react';
import "./Styles/SpaceDetails.css";

const SpaceDetails = () => {
  const [space, setSpace] = useState(null);
  const [feedback, setFeedback] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [copied, setCopied] = useState(false);
  const navigate = useNavigate();

  // Get publicUrl from session storage
  const publicUrl = JSON.parse(sessionStorage.getItem('selectedSpace'))?.publicUrl;
  
  const copyToClipboard = async (text) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy: ', err);
    }
  };

  useEffect(() => {
    if (!publicUrl) {
      navigate('/'); 
      return;
    }

    const fetchSpaceDetails = async () => {
      try {
        const response = await fetch(`http://localhost:3000/space/${publicUrl}`);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const result = await response.json();
        setSpace(result);

        // Fetch feedback details
        const feedbackResponse = await fetch(`http://localhost:3000/space/${publicUrl}/feedbackDetails`);
        if (!feedbackResponse.ok) {
          throw new Error(`HTTP error! status: ${feedbackResponse.status}`);
        }
        const feedbackResult = await feedbackResponse.json();
        setFeedback(feedbackResult);

      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchSpaceDetails();
  }, [publicUrl, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center">
        <div className="flex items-center gap-3 text-gray-300">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500"></div>
          <span>Loading space details...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center p-4">
        <Card className="w-full max-w-md bg-gray-900 border-gray-800">
          <CardContent className="pt-6 text-center">
            <div className="text-red-400 mb-4">
              <ExternalLink className="w-12 h-12 mx-auto mb-2" />
              <h2 className="text-lg font-semibold">Error Loading Space</h2>
            </div>
            <p className="text-gray-300 mb-4">{error}</p>
            <Button onClick={() => navigate('/dashboard')} variant="outline">
              Back to Dashboard
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!space) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center p-4">
        <Card className="w-full max-w-md bg-gray-900 border-gray-800">
          <CardContent className="pt-6 text-center">
            <p className="text-gray-300">No space details available.</p>
            <Button onClick={() => navigate('/dashboard')} variant="outline" className="mt-4">
              Back to Dashboard
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const feedbackUrl = `http://localhost:5173/${space.publicUrl}`;

  return (
    <div className="min-h-screen bg-gray-950">
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-3xl font-bold text-gray-100">{space.spacename}</h1>
            <Button onClick={() => navigate('/dashboard')} variant="outline">
              Back to Dashboard
            </Button>
          </div>
          
          {/* Feedback URL Card */}
          <Card className="bg-gray-900 border-gray-800 mb-6">
            <CardHeader>
              <CardTitle className="text-gray-100 flex items-center gap-2">
                <ExternalLink className="w-5 h-5" />
                Feedback Collection URL
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-3 p-3 bg-gray-800 rounded-lg">
                <code className="flex-1 text-blue-400 text-sm break-all">
                  {feedbackUrl}
                </code>
                <Button
                  onClick={() => copyToClipboard(feedbackUrl)}
                  size="sm"
                  variant="outline"
                  className="shrink-0"
                >
                  {copied ? (
                    <>
                      <CheckCircle className="w-4 h-4 mr-2" />
                      Copied!
                    </>
                  ) : (
                    <>
                      <Copy className="w-4 h-4 mr-2" />
                      Copy
                    </>
                  )}
                </Button>
                <Button
                  onClick={() => window.open(feedbackUrl, '_blank')}
                  size="sm"
                  variant="outline"
                  className="shrink-0"
                >
                  <ExternalLink className="w-4 h-4 mr-2" />
                  Open
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Space Configuration */}
          <div className="lg:col-span-1">
            <Card className="bg-gray-900 border-gray-800">
              <CardHeader>
                <CardTitle className="text-gray-100">Space Configuration</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h3 className="text-sm font-medium text-gray-400 mb-1">Header Title</h3>
                  <p className="text-gray-200">{space.headerTitle}</p>
                </div>
                
                <div>
                  <h3 className="text-sm font-medium text-gray-400 mb-1">Custom Message</h3>
                  <p className="text-gray-200">{space.customMessage}</p>
                </div>

                <div>
                  <h3 className="text-sm font-medium text-gray-400 mb-2">Features</h3>
                  <div className="flex items-center gap-2 text-sm">
                    {space.starRatings ? (
                      <div className="flex items-center gap-1 text-yellow-400">
                        <Star className="w-4 h-4" />
                        <span>Star Ratings Enabled</span>
                      </div>
                    ) : (
                      <div className="flex items-center gap-1 text-gray-500">
                        <Star className="w-4 h-4" />
                        <span>Star Ratings Disabled</span>
                      </div>
                    )}
                  </div>
                </div>

                <div>
                  <h3 className="text-sm font-medium text-gray-400 mb-2">Questions</h3>
                  <div className="space-y-2">
                    {space.questions.map((question, index) => (
                      <div key={index} className="p-2 bg-gray-800 rounded text-sm text-gray-200">
                        {index + 1}. {question}
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Feedback Section */}
          <div className="lg:col-span-2">
            <Card className="bg-gray-900 border-gray-800">
              <CardHeader>
                <CardTitle className="text-gray-100 flex items-center gap-2">
                  <MessageSquare className="w-5 h-5" />
                  Feedback Responses ({feedback.length})
                </CardTitle>
              </CardHeader>
              <CardContent>
                {feedback.length === 0 ? (
                  <div className="text-center py-8">
                    <Users className="w-12 h-12 text-gray-600 mx-auto mb-3" />
                    <p className="text-gray-400 mb-2">No feedback received yet</p>
                    <p className="text-sm text-gray-500">
                      Share your feedback URL to start collecting responses
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4 max-h-96 overflow-y-auto">
                    {feedback.map((fb, index) => (
                      <Card key={index} className="bg-gray-800 border-gray-700">
                        <CardContent className="pt-4">
                          <div className="flex items-start justify-between mb-3">
                            <div>
                              <h4 className="font-medium text-gray-100">{fb.name}</h4>
                              <p className="text-sm text-gray-400">{fb.email}</p>
                            </div>
                            {fb.rating && (
                              <div className="flex items-center gap-1">
                                {[...Array(5)].map((_, i) => (
                                  <Star
                                    key={i}
                                    className={`w-4 h-4 ${
                                      i < fb.rating ? 'text-yellow-400 fill-current' : 'text-gray-600'
                                    }`}
                                  />
                                ))}
                                <span className="text-sm text-gray-400 ml-1">
                                  {fb.rating}/5
                                </span>
                              </div>
                            )}
                          </div>
                          
                          <div className="space-y-3">
                            {fb.responses.map((response, idx) => (
                              <div key={idx} className="border-l-2 border-gray-700 pl-3">
                                <p className="text-sm font-medium text-gray-300 mb-1">
                                  {response.question}
                                </p>
                                <p className="text-sm text-gray-400">
                                  {response.answer}
                                </p>
                              </div>
                            ))}
                          </div>
                          
                          {fb.submittedAt && (
                            <p className="text-xs text-gray-500 mt-3">
                              Submitted: {new Date(fb.submittedAt).toLocaleString()}
                            </p>
                          )}
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SpaceDetails;