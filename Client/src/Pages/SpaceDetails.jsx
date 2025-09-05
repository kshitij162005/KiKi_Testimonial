import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '../Components/ui/card';
import { Copy, CheckCircle, ExternalLink, Users, MessageSquare, ArrowLeft, TrendingUp } from 'lucide-react';
import { Button, StarRating, StarDisplay, EditableField, SearchInput } from '../Components/ui';
import SentimentAnalysis from '../Components/dashboard/SentimentAnalysis/SentimentAnalysis';
import AnimatedBackground from '../Components/ui/AnimatedBackground/AnimatedBackground';
import "./Styles/SpaceDetails.css";

const SpaceDetails = () => {
  const [space, setSpace] = useState(null);
  const [feedback, setFeedback] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [copied, setCopied] = useState(false);
  const [apiCopied, setApiCopied] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilters, setSelectedFilters] = useState([]);
  const navigate = useNavigate();

  // Get publicUrl from session storage
  const publicUrl = JSON.parse(sessionStorage.getItem('selectedSpace'))?.publicUrl;

  // Calculate aggregate rating data
  const ratingData = useMemo(() => {
    const ratingsWithValues = feedback.filter(fb => fb.rating && fb.rating > 0);
    if (ratingsWithValues.length === 0) return null;

    const totalRating = ratingsWithValues.reduce((sum, fb) => sum + fb.rating, 0);
    const averageRating = totalRating / ratingsWithValues.length;
    
    return {
      average: averageRating,
      count: ratingsWithValues.length,
      distribution: [1, 2, 3, 4, 5].map(rating => 
        ratingsWithValues.filter(fb => fb.rating === rating).length
      )
    };
  }, [feedback]);

  // Filter feedback based on search and filters
  const filteredFeedback = useMemo(() => {
    let filtered = feedback;

    // Apply search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(fb => 
        fb.name?.toLowerCase().includes(query) ||
        fb.email?.toLowerCase().includes(query) ||
        fb.responses?.some(response => 
          response.question?.toLowerCase().includes(query) ||
          response.answer?.toLowerCase().includes(query)
        )
      );
    }

    // Apply rating filters
    if (selectedFilters.includes('5-star')) {
      filtered = filtered.filter(fb => fb.rating === 5);
    }
    if (selectedFilters.includes('4-star')) {
      filtered = filtered.filter(fb => fb.rating === 4);
    }
    if (selectedFilters.includes('3-star')) {
      filtered = filtered.filter(fb => fb.rating === 3);
    }
    if (selectedFilters.includes('2-star')) {
      filtered = filtered.filter(fb => fb.rating === 2);
    }
    if (selectedFilters.includes('1-star')) {
      filtered = filtered.filter(fb => fb.rating === 1);
    }
    if (selectedFilters.includes('no-rating')) {
      filtered = filtered.filter(fb => !fb.rating);
    }

    return filtered;
  }, [feedback, searchQuery, selectedFilters]);

  // Search filters
  const searchFilters = useMemo(() => {
    const ratingCounts = [1, 2, 3, 4, 5].map(rating => ({
      id: `${rating}-star`,
      label: `${rating} Star`,
      count: feedback.filter(fb => fb.rating === rating).length
    })).filter(filter => filter.count > 0);

    const noRatingCount = feedback.filter(fb => !fb.rating).length;
    if (noRatingCount > 0) {
      ratingCounts.push({
        id: 'no-rating',
        label: 'No Rating',
        count: noRatingCount
      });
    }

    return ratingCounts;
  }, [feedback]);
  
  const copyToClipboard = async (text) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy: ', err);
    }
  };

  const copyApiUrl = async (text) => {
    try {
      await navigator.clipboard.writeText(text);
      setApiCopied(true);
      setTimeout(() => setApiCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy: ', err);
    }
  };

  const handleSaveSpaceName = async (newName) => {
    try {
      const response = await fetch(`http://localhost:3000/space/${publicUrl}/update`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ spacename: newName }),
      });

      if (!response.ok) {
        throw new Error('Failed to update space name');
      }

      setSpace(prev => ({ ...prev, spacename: newName }));
      return Promise.resolve();
    } catch (error) {
      console.error('Error updating space name:', error);
      throw error;
    }
  };

  const handleSaveHeaderTitle = async (newTitle) => {
    try {
      const response = await fetch(`http://localhost:3000/space/${publicUrl}/update`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ headerTitle: newTitle }),
      });

      if (!response.ok) {
        throw new Error('Failed to update header title');
      }

      setSpace(prev => ({ ...prev, headerTitle: newTitle }));
      return Promise.resolve();
    } catch (error) {
      console.error('Error updating header title:', error);
      throw error;
    }
  };

  const handleSaveCustomMessage = async (newMessage) => {
    try {
      const response = await fetch(`http://localhost:3000/space/${publicUrl}/update`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ customMessage: newMessage }),
      });

      if (!response.ok) {
        throw new Error('Failed to update custom message');
      }

      setSpace(prev => ({ ...prev, customMessage: newMessage }));
      return Promise.resolve();
    } catch (error) {
      console.error('Error updating custom message:', error);
      throw error;
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
    <AnimatedBackground>
      <div className="max-w-7xl mx-auto px-6 py-10">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-4">
              <Button 
                onClick={() => navigate('/dashboard')} 
                variant="ghost"
                size="sm"
                className="p-2"
              >
                <ArrowLeft className="w-5 h-5" />
              </Button>
              <div>
                <EditableField
                  value={space.spacename}
                  onSave={handleSaveSpaceName}
                  placeholder="Space name..."
                  className="text-3xl font-bold text-gray-100"
                  confirmationMessage="Space name updated successfully!"
                />
              </div>
            </div>
            
            {/* Overall Rating Display */}
            {ratingData && (
              <div className="flex items-center gap-6 bg-gray-800/50 rounded-xl p-6 backdrop-blur-sm border border-gray-700">
                <div className="text-center">
                  <div className="text-3xl font-bold text-gray-100 mb-2">
                    {ratingData.average.toFixed(1)}
                  </div>
                  <div className="flex justify-center mb-1">
                    <StarDisplay 
                      rating={ratingData.average} 
                      count={ratingData.count}
                      size="small"
                      showCount={false}
                    />
                  </div>
                </div>
                <div className="text-sm text-gray-400">
                  <div className="flex items-center gap-2">
                    <TrendingUp className="w-5 h-5" />
                    <span>{ratingData.count} rating{ratingData.count !== 1 ? 's' : ''}</span>
                  </div>
                </div>
              </div>
            )}
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

          {/* Space API Integration Card */}
          <Card className="bg-gray-900 border-gray-800 mb-6">
            <CardHeader>
              <CardTitle className="text-gray-100 flex items-center gap-2">
                <TrendingUp className="w-5 h-5" />
                Space API Integration
              </CardTitle>
              <p className="text-gray-400 text-sm mt-2">
                Integrate this space's testimonial data into your platform
              </p>
            </CardHeader>
            <CardContent>
              <div>
                <div className="flex items-center justify-between mb-2">
                  <h4 className="text-sm font-medium text-gray-200">This Space API</h4>
                  <span className="text-xs text-gray-500 bg-gray-800 px-2 py-1 rounded">GET</span>
                </div>
                <p className="text-xs text-gray-400 mb-3">
                  Get feedback data for this specific space with detailed analytics
                </p>
                <div className="flex items-center gap-3 p-3 bg-gray-800 rounded-lg">
                  <code className="flex-1 text-green-400 text-xs break-all font-mono">
                    {`http://localhost:3000/api/organization/${JSON.parse(sessionStorage.getItem('selectedSpace'))?.user_Id || 'USER_ID'}/space/${space.publicUrl}/feedbacks`}
                  </code>
                  <Button
                    onClick={() => copyApiUrl(`http://localhost:3000/api/organization/${JSON.parse(sessionStorage.getItem('selectedSpace'))?.user_Id || 'USER_ID'}/space/${space.publicUrl}/feedbacks`)}
                    size="sm"
                    variant="outline"
                    className={`shrink-0 transition-all duration-200 ${apiCopied ? 'bg-green-600 border-green-600 text-white' : ''}`}
                  >
                    {apiCopied ? (
                      <>
                        <CheckCircle className="w-3 h-3 mr-1" />
                        Copied!
                      </>
                    ) : (
                      <>
                        <Copy className="w-3 h-3 mr-1" />
                        Copy
                      </>
                    )}
                  </Button>
                </div>
              </div>

              {/* Integration Guide */}
              <div className="mt-4 p-4 bg-blue-900/20 border border-blue-800/30 rounded-lg">
                <h4 className="text-sm font-medium text-blue-200 mb-2 flex items-center gap-2">
                  <ExternalLink className="w-4 h-4" />
                  Integration Guide
                </h4>
                <p className="text-xs text-blue-300/80 mb-3">
                  This API returns JSON data with feedback details, analytics, ratings, responses, and timestamps.
                </p>
                <div className="space-y-2">
                  <div className="text-xs text-gray-300">
                    <span className="text-blue-300 font-mono">JavaScript:</span>
                    <div className="mt-1 p-2 bg-gray-800/50 rounded">
                      <code className="text-green-400 text-xs break-all">
                        fetch('API_URL').then(res =&gt; res.json())
                      </code>
                    </div>
                  </div>
                  <div className="text-xs text-gray-300">
                    <span className="text-blue-300 font-mono">cURL:</span>
                    <div className="mt-1 p-2 bg-gray-800/50 rounded">
                      <code className="text-green-400 text-xs break-all">
                        curl -X GET "API_URL"
                      </code>
                    </div>
                  </div>
                </div>
                <Button
                  onClick={() => window.open('/api-docs', '_blank')}
                  size="sm"
                  variant="outline"
                  className="mt-3 text-xs"
                >
                  <ExternalLink className="w-3 h-3 mr-1" />
                  View Full Documentation
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
          {/* Space Configuration */}
          <div className="xl:col-span-1">
            <Card className="bg-gray-900/60 border-gray-700 backdrop-blur-sm shadow-xl">
              <CardHeader className="pb-6 px-8 pt-8">
                <CardTitle className="text-gray-100 text-xl font-semibold">Space Configuration</CardTitle>
              </CardHeader>
              <CardContent className="space-y-10 px-8 pb-8">
                <EditableField
                  label="Header Title"
                  value={space.headerTitle}
                  onSave={handleSaveHeaderTitle}
                  placeholder="Enter header title..."
                  confirmationMessage="Header title updated successfully!"
                />
                
                <EditableField
                  label="Custom Message"
                  value={space.customMessage}
                  onSave={handleSaveCustomMessage}
                  placeholder="Enter custom message..."
                  multiline={true}
                  confirmationMessage="Custom message updated successfully!"
                />

                <div>
                  <h3 className="text-sm font-medium text-gray-400 mb-2">Features</h3>
                  <div className="flex items-center gap-2 text-sm">
                    {space.starRatings ? (
                      <div className="flex items-center gap-1 text-yellow-400">
                        <StarRating value={5} readonly size="small" />
                        <span>Star Ratings Enabled</span>
                      </div>
                    ) : (
                      <div className="flex items-center gap-1 text-gray-500">
                        <StarRating value={0} readonly size="small" />
                        <span>Star Ratings Disabled</span>
                      </div>
                    )}
                  </div>
                </div>

                <div>
                  <h3 className="text-sm font-medium text-gray-400 mb-2">Questions</h3>
                  <div className="space-y-2">
                    {space.questions.map((question, index) => (
                      <div key={index} className="p-3 bg-gray-800/50 rounded-lg text-sm text-gray-200 border border-gray-700">
                        <span className="text-gray-400 font-medium">{index + 1}.</span> {question}
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Sentiment Analysis */}
            <div className="mt-6">
              <SentimentAnalysis feedbackData={feedback} />
            </div>
          </div>

          {/* Feedback Section */}
          <div className="xl:col-span-3">
            <Card className="bg-gray-900/60 border-gray-700 backdrop-blur-sm shadow-xl">
              <CardHeader className="pb-6">
                <div className="flex items-center justify-between mb-4">
                  <CardTitle className="text-gray-100 flex items-center gap-3 text-lg font-semibold">
                    <MessageSquare className="w-6 h-6 text-blue-400" />
                    Feedback Responses ({filteredFeedback.length}{feedback.length !== filteredFeedback.length ? ` of ${feedback.length}` : ''})
                  </CardTitle>
                </div>
                
                {/* Search and Filter */}
                {feedback.length > 0 && (
                  <div className="mt-6">
                    <SearchInput
                      onSearch={setSearchQuery}
                      placeholder="Search feedback by name, email, or content..."
                      filters={searchFilters}
                      selectedFilters={selectedFilters}
                      onFilterChange={setSelectedFilters}
                      showFilters={searchFilters.length > 0}
                      className="w-full"
                    />
                  </div>
                )}
              </CardHeader>
              <CardContent className="p-6">
                {feedback.length === 0 ? (
                  <div className="text-center py-16">
                    <Users className="w-20 h-20 text-gray-600 mx-auto mb-6" />
                    <h3 className="text-xl font-medium text-gray-300 mb-3">No feedback received yet</h3>
                    <p className="text-gray-400 mb-6 max-w-md mx-auto">
                      Share your feedback URL to start collecting responses from your customers
                    </p>
                    <Button
                      onClick={() => copyToClipboard(feedbackUrl)}
                      variant="primary"
                      size="lg"
                      className="px-6 py-3"
                    >
                      <Copy className="w-5 h-5 mr-2" />
                      Copy Feedback URL
                    </Button>
                  </div>
                ) : filteredFeedback.length === 0 ? (
                  <div className="text-center py-12">
                    <MessageSquare className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                    <p className="text-gray-400 mb-2 text-lg">No feedback matches your search</p>
                    <p className="text-sm text-gray-500">
                      Try adjusting your search terms or filters
                    </p>
                  </div>
                ) : (
                  <div className="space-y-6 max-h-[700px] overflow-y-auto pr-2">
                    {filteredFeedback.map((fb, index) => (
                      <Card key={index} className="bg-gray-800/60 border-gray-600 backdrop-blur-sm shadow-lg hover:shadow-xl transition-all duration-200">
                        <CardContent className="p-6">
                          <div className="flex items-start justify-between mb-4">
                            <div className="flex-1">
                              <h4 className="font-semibold text-gray-100 text-lg">{fb.name}</h4>
                              <p className="text-sm text-gray-400 mt-1">{fb.email}</p>
                            </div>
                            {fb.rating && (
                              <div className="flex items-center gap-3 bg-gray-700/50 rounded-lg px-3 py-2">
                                <StarDisplay 
                                  rating={fb.rating} 
                                  size="small"
                                  showCount={false}
                                />
                                <span className="text-sm text-gray-300 font-medium">
                                  {fb.rating}/5
                                </span>
                              </div>
                            )}
                          </div>
                          
                          <div className="space-y-4">
                            {fb.responses.map((response, idx) => (
                              <div key={idx} className="border-l-3 border-blue-400/40 pl-5 py-3 bg-gray-700/40 rounded-r-xl">
                                <p className="text-sm font-semibold text-gray-200 mb-2">
                                  {response.question}
                                </p>
                                <p className="text-gray-100 leading-relaxed">
                                  {response.answer}
                                </p>
                              </div>
                            ))}
                          </div>
                          
                          {fb.submittedAt && (
                            <div className="mt-5 pt-4 border-t border-gray-700">
                              <p className="text-xs text-gray-400 flex items-center gap-2">
                                <span className="w-2 h-2 bg-green-400 rounded-full"></span>
                                Submitted: {new Date(fb.submittedAt).toLocaleString()}
                              </p>
                            </div>
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
    </AnimatedBackground>
  );
};

export default SpaceDetails;