import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../Components/ui/card';
import { Button } from '../Components/ui';
import { ArrowLeft, ExternalLink, Copy, Code } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import AnimatedBackground from '../Components/ui/AnimatedBackground/AnimatedBackground';

const ApiDocs = () => {
  const navigate = useNavigate();

  const copyToClipboard = async (text) => {
    try {
      await navigator.clipboard.writeText(text);
    } catch (err) {
      console.error('Failed to copy: ', err);
    }
  };

  return (
    <AnimatedBackground>
      <div className="max-w-4xl mx-auto px-6 py-10">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-6">
            <Button 
              onClick={() => navigate(-1)} 
              variant="ghost"
              size="sm"
              className="p-2"
            >
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <div>
              <h1 className="text-3xl font-bold text-gray-100">API Documentation</h1>
              <p className="text-gray-400 mt-2">Integrate testimonial data into your platform</p>
            </div>
          </div>
        </div>

        {/* Overview */}
        <Card className="bg-gray-900 border-gray-800 mb-6">
          <CardHeader>
            <CardTitle className="text-gray-100 flex items-center gap-2">
              <Code className="w-5 h-5" />
              Overview
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-300 mb-4">
              Our API allows organizations to integrate testimonial data directly into their own platforms. 
              All endpoints return JSON data with complete feedback information including ratings, responses, and timestamps.
            </p>
            <div className="bg-blue-900/20 border border-blue-800/30 rounded-lg p-4">
              <h4 className="text-blue-200 font-medium mb-2">Base URL</h4>
              <code className="text-green-400 text-sm">http://localhost:3000/api</code>
            </div>
          </CardContent>
        </Card>

        {/* Endpoints */}
        <div className="space-y-6">
          {/* Global Organization API */}
          <Card className="bg-gray-900 border-gray-800">
            <CardHeader>
              <CardTitle className="text-gray-100 flex items-center gap-2">
                <span className="bg-green-600 text-white px-2 py-1 rounded text-xs font-mono">GET</span>
                All Organization Feedbacks
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h4 className="text-gray-200 font-medium mb-2">Endpoint</h4>
                <div className="flex items-center gap-3 p-3 bg-gray-800 rounded-lg">
                  <code className="flex-1 text-green-400 text-sm break-all font-mono">
                    /api/organization/{'{userId}'}/feedbacks
                  </code>
                  <Button
                    onClick={() => copyToClipboard('/api/organization/{userId}/feedbacks')}
                    size="sm"
                    variant="outline"
                    className="shrink-0"
                  >
                    <Copy className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              <div>
                <h4 className="text-gray-200 font-medium mb-2">Description</h4>
                <p className="text-gray-300 text-sm">
                  Returns all feedback data from all spaces created by an organization. Perfect for dashboard integrations 
                  showing overall testimonial performance.
                </p>
              </div>

              <div>
                <h4 className="text-gray-200 font-medium mb-2">Parameters</h4>
                <div className="bg-gray-800 rounded-lg p-3">
                  <div className="text-sm">
                    <span className="text-blue-400">userId</span> 
                    <span className="text-gray-400"> (path parameter)</span> - The organization's user ID
                  </div>
                </div>
              </div>

              <div>
                <h4 className="text-gray-200 font-medium mb-2">Example Response</h4>
                <div className="bg-gray-800 rounded-lg p-4 overflow-x-auto">
                  <pre className="text-xs text-gray-300">
{`{
  "organization": {
    "id": "user_id",
    "name": "Organization Name",
    "email": "org@example.com"
  },
  "totalSpaces": 5,
  "totalFeedbacks": 25,
  "spaces": [
    {
      "spaceId": "space_id",
      "spaceName": "Product Feedback",
      "publicUrl": "product-feedback",
      "totalFeedbacks": 10,
      "feedbacks": [
        {
          "feedbackId": "feedback_id",
          "name": "John Doe",
          "email": "john@example.com",
          "rating": 5,
          "responses": [...],
          "submittedAt": "2024-01-16T14:20:00.000Z"
        }
      ]
    }
  ]
}`}
                  </pre>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Space-Specific API */}
          <Card className="bg-gray-900 border-gray-800">
            <CardHeader>
              <CardTitle className="text-gray-100 flex items-center gap-2">
                <span className="bg-green-600 text-white px-2 py-1 rounded text-xs font-mono">GET</span>
                Space-Specific Feedbacks
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h4 className="text-gray-200 font-medium mb-2">Endpoint</h4>
                <div className="flex items-center gap-3 p-3 bg-gray-800 rounded-lg">
                  <code className="flex-1 text-green-400 text-sm break-all font-mono">
                    /api/organization/{'{userId}'}/space/{'{publicUrl}'}/feedbacks
                  </code>
                  <Button
                    onClick={() => copyToClipboard('/api/organization/{userId}/space/{publicUrl}/feedbacks')}
                    size="sm"
                    variant="outline"
                    className="shrink-0"
                  >
                    <Copy className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              <div>
                <h4 className="text-gray-200 font-medium mb-2">Description</h4>
                <p className="text-gray-300 text-sm">
                  Returns feedback data for a specific space with detailed analytics including rating distribution 
                  and feedback counts. Great for embedding specific product/service testimonials.
                </p>
              </div>

              <div>
                <h4 className="text-gray-200 font-medium mb-2">Parameters</h4>
                <div className="bg-gray-800 rounded-lg p-3 space-y-2">
                  <div className="text-sm">
                    <span className="text-blue-400">userId</span> 
                    <span className="text-gray-400"> (path parameter)</span> - The organization's user ID
                  </div>
                  <div className="text-sm">
                    <span className="text-blue-400">publicUrl</span> 
                    <span className="text-gray-400"> (path parameter)</span> - The space's public URL identifier
                  </div>
                </div>
              </div>

              <div>
                <h4 className="text-gray-200 font-medium mb-2">Example Response</h4>
                <div className="bg-gray-800 rounded-lg p-4 overflow-x-auto">
                  <pre className="text-xs text-gray-300">
{`{
  "organization": {
    "id": "user_id",
    "name": "Organization Name",
    "email": "org@example.com"
  },
  "space": {
    "spaceId": "space_id",
    "spaceName": "Product Feedback",
    "publicUrl": "product-feedback",
    "headerTitle": "Tell us what you think",
    "questions": ["How was your experience?"],
    "starRatingsEnabled": true,
    "createdAt": "2024-01-15T10:30:00.000Z"
  },
  "analytics": {
    "totalFeedbacks": 10,
    "textFeedbacks": 8,
    "videoFeedbacks": 2,
    "averageRating": 4.5,
    "ratingDistribution": {
      "1": 0, "2": 1, "3": 2, "4": 3, "5": 4
    }
  },
  "feedbacks": [...]
}`}
                  </pre>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Usage Examples */}
        <Card className="bg-gray-900 border-gray-800 mt-6">
          <CardHeader>
            <CardTitle className="text-gray-100">Usage Examples</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <h4 className="text-gray-200 font-medium mb-3">JavaScript / Node.js</h4>
              <div className="bg-gray-800 rounded-lg p-4 overflow-x-auto">
                <pre className="text-sm text-gray-300 whitespace-pre-wrap break-words">
{`// Get all organization feedbacks
const response = await fetch(
  'http://localhost:3000/api/organization/USER_ID/feedbacks'
);
const data = await response.json();

// Get specific space feedbacks  
const spaceResponse = await fetch(
  'http://localhost:3000/api/organization/USER_ID/space/SPACE_URL/feedbacks'
);
const spaceData = await spaceResponse.json();`}
                </pre>
              </div>
            </div>

            <div>
              <h4 className="text-gray-200 font-medium mb-3">cURL</h4>
              <div className="bg-gray-800 rounded-lg p-4 overflow-x-auto">
                <pre className="text-sm text-gray-300 whitespace-pre-wrap break-words">
{`# Get all organization feedbacks
curl -X GET \\
  "http://localhost:3000/api/organization/USER_ID/feedbacks"

# Get specific space feedbacks
curl -X GET \\
  "http://localhost:3000/api/organization/USER_ID/space/SPACE_URL/feedbacks"`}
                </pre>
              </div>
            </div>

            <div>
              <h4 className="text-gray-200 font-medium mb-3">Python</h4>
              <div className="bg-gray-800 rounded-lg p-4 overflow-x-auto">
                <pre className="text-sm text-gray-300 whitespace-pre-wrap break-words">
{`import requests

# Get all organization feedbacks
response = requests.get(
    'http://localhost:3000/api/organization/USER_ID/feedbacks'
)
data = response.json()

# Get specific space feedbacks
space_response = requests.get(
    'http://localhost:3000/api/organization/USER_ID/space/SPACE_URL/feedbacks'
)
space_data = space_response.json()`}
                </pre>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Error Responses */}
        <Card className="bg-gray-900 border-gray-800 mt-6">
          <CardHeader>
            <CardTitle className="text-gray-100">Error Responses</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <span className="bg-red-600 text-white px-2 py-1 rounded text-xs font-mono">404</span>
                <span className="text-gray-300">Organization or space not found</span>
              </div>
              <div className="flex items-center gap-4">
                <span className="bg-red-600 text-white px-2 py-1 rounded text-xs font-mono">500</span>
                <span className="text-gray-300">Internal server error</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </AnimatedBackground>
  );
};

export default ApiDocs;