import React, { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { 
  FiArrowLeft, 
  FiPlus, 
  FiImage, 
  FiLink, 
  FiCopy, 
  FiCheck,
  FiZap,
  FiSettings,
  FiMessageSquare,
  FiGlobe,
  FiStar
} from 'react-icons/fi'
import { Button } from '../components/ui/button'
import { Input } from '../components/ui/input'
import { Label } from '../components/ui/label'
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/card'
import { Badge } from '../components/ui/badge'
import DynamicQuestions from '../components/forms/DynamicQuestions'

const SpaceFormNew = () => {
  const [formData, setFormData] = useState({
    spacename: '',
    publicUrl: '',
    headerTitle: '',
    customMessage: '',
    questions: [''],
    starRatings: false,
  })

  const [image, setImage] = useState(null)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [generatedLink, setGeneratedLink] = useState('')
  const [showModal, setShowModal] = useState(false)
  const [showCopiedModal, setShowCopiedModal] = useState(false)
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData((prevData) => ({
      ...prevData,
      [name]: type === 'checkbox' ? checked : value,
    }))
  }

  const handleQuestionsChange = (questions) => {
    setFormData((prevData) => ({
      ...prevData,
      questions: questions.filter(q => q.trim() !== ''), // Remove empty questions
    }))
  }

  const handleImageChange = (e) => {
    setImage(e.target.files[0])
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
  
    const userId = localStorage.getItem('userId')
    if (!userId) {
      alert("User ID is not found in local storage. Please log in again.")
      return
    }

    // Validate questions
    const validQuestions = formData.questions.filter(q => q.trim() !== '')
    if (validQuestions.length === 0) {
      alert("Please add at least one question.")
      return
    }

    const formattedData = {
      ...formData,
      questions: validQuestions,
      user_Id: userId,
    }
  
    try {
      setLoading(true)

      const formDataObj = new FormData()
      formDataObj.append('spacename', formattedData.spacename)
      formDataObj.append('publicUrl', formattedData.publicUrl)
      formDataObj.append('headerTitle', formattedData.headerTitle)
      formDataObj.append('customMessage', formattedData.customMessage)
      formDataObj.append('questions', JSON.stringify(formattedData.questions))
      formDataObj.append('starRatings', formattedData.starRatings)
      formDataObj.append('user_Id', formattedData.user_Id)
      
      if (image) {
        formDataObj.append('image', image)
      }

      const response = await fetch('http://localhost:3000/addSpace', {
        method: 'POST',
        body: formDataObj,
      })
  
      if (!response.ok) {
        if (response.status === 400) {
          const result = await response.json()
          alert(result.message)
        } else {
          throw new Error(`HTTP error! status: ${response.status}`)
        }
      } else {
        const result = await response.json()
        const link = result.link
        setGeneratedLink(link)
        setShowModal(true)
  
        sessionStorage.setItem('generatedLink', link)
  
        await fetch(`http://localhost:3000/space/${formData.publicUrl}/addLink`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ link }),
        })
  
        setFormData({
          spacename: '',
          publicUrl: '',
          headerTitle: '',
          customMessage: '',
          questions: [''],
          starRatings: false,
        })
  
        setIsSubmitted(true)
      }
    } catch (error) {
      console.error('Error:', error)
      alert('Failed to create space. Check console for details.')
    } finally {
      setLoading(false)
    }
  }

  const handleCopyLink = () => {
    navigator.clipboard.writeText(generatedLink).then(() => {
      setShowModal(false)
      setShowCopiedModal(true)
    })
  }

  useEffect(() => {
    if (isSubmitted) {
      const timer = setTimeout(() => {
        navigate('/dashboard')
      }, 10000)

      return () => clearTimeout(timer)
    }
  }, [isSubmitted, navigate])

  const features = [
    {
      icon: <FiZap className="w-6 h-6" />,
      title: "Quick Setup",
      description: "Create your feedback space in under 2 minutes"
    },
    {
      icon: <FiGlobe className="w-6 h-6" />,
      title: "Customizable",
      description: "Personalize your space with custom branding and messages"
    },
    {
      icon: <FiMessageSquare className="w-6 h-6" />,
      title: "Smart Questions",
      description: "Ask the right questions to get actionable insights"
    }
  ]

  return (
    <div className="min-h-screen bg-bg">
      {/* Animated background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-0 w-96 h-96 bg-brand/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-brand/5 rounded-full blur-3xl"></div>
      </div>

      {/* Navigation */}
      <nav className="relative z-10 border-b border-border bg-surface/50 backdrop-blur-sm">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button 
                variant="ghost"
                size="sm"
                onClick={() => navigate('/dashboard')}
                className="p-2"
              >
                <FiArrowLeft className="w-5 h-5" />
              </Button>
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-brand to-brand-600 flex items-center justify-center">
                <span className="text-xl font-bold text-bg">N</span>
              </div>
              <span className="text-xl font-bold text-text-primary">Nova</span>
            </div>
            <Badge variant="secondary">Create New Space</Badge>
          </div>
        </div>
      </nav>

      <div className="relative z-10 px-6 py-8">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Side - Features */}
            <div className="lg:col-span-1">
              <div className="sticky top-8">
                <div className="mb-8">
                  <h1 className="text-3xl font-bold text-text-primary mb-4">
                    Create your
                    <span className="block gradient-text">feedback space</span>
                  </h1>
                  <p className="text-lg text-text-secondary leading-relaxed">
                    Set up a dedicated space to collect customer feedback, testimonials, and insights that will help grow your business.
                  </p>
                </div>

                <div className="space-y-6">
                  {features.map((feature, index) => (
                    <div key={index} className="flex items-start space-x-4">
                      <div className="w-12 h-12 rounded-xl bg-brand/20 flex items-center justify-center flex-shrink-0">
                        <div className="text-brand">
                          {feature.icon}
                        </div>
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-text-primary mb-2">{feature.title}</h3>
                        <p className="text-text-secondary leading-relaxed">{feature.description}</p>
                      </div>
                    </div>
                  ))}
                </div>

                <Card className="mt-8">
                  <CardHeader>
                    <CardTitle className="text-lg">What you'll get:</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2 text-sm text-text-secondary">
                      <li className="flex items-center space-x-2">
                        <FiCheck className="w-4 h-4 text-success" />
                        <span>Custom feedback form</span>
                      </li>
                      <li className="flex items-center space-x-2">
                        <FiCheck className="w-4 h-4 text-success" />
                        <span>Shareable link</span>
                      </li>
                      <li className="flex items-center space-x-2">
                        <FiCheck className="w-4 h-4 text-success" />
                        <span>Real-time responses</span>
                      </li>
                      <li className="flex items-center space-x-2">
                        <FiCheck className="w-4 h-4 text-success" />
                        <span>Analytics dashboard</span>
                      </li>
                    </ul>
                  </CardContent>
                </Card>
              </div>
            </div>

            {/* Right Side - Form */}
            <div className="lg:col-span-2">
              <Card className="p-8">
                <div className="mb-8">
                  <h2 className="text-2xl font-bold text-text-primary mb-2">Space Configuration</h2>
                  <p className="text-text-secondary">Configure your feedback space settings and customization options.</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="spacename">
                        Space Name *
                      </Label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <FiSettings className="h-5 w-5 text-text-muted" />
                        </div>
                        <Input
                          id="spacename"
                          type="text"
                          name="spacename"
                          value={formData.spacename}
                          onChange={handleChange}
                          placeholder="My Product Feedback"
                          required
                          className="pl-10"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="publicUrl">
                        Public URL *
                      </Label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <FiLink className="h-5 w-5 text-text-muted" />
                        </div>
                        <Input
                          id="publicUrl"
                          type="text"
                          name="publicUrl"
                          value={formData.publicUrl}
                          onChange={handleChange}
                          placeholder="my-product-feedback"
                          required
                          className="pl-10"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="headerTitle">
                      Header Title
                    </Label>
                    <Input
                      id="headerTitle"
                      type="text"
                      name="headerTitle"
                      value={formData.headerTitle}
                      onChange={handleChange}
                      placeholder="We'd love to hear from you!"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="customMessage">
                      Custom Message
                    </Label>
                    <textarea
                      id="customMessage"
                      name="customMessage"
                      value={formData.customMessage}
                      onChange={handleChange}
                      placeholder="Share your experience with our product and help us improve..."
                      rows={4}
                      className="flex w-full rounded-xl border border-border bg-surface px-3 py-2 text-sm text-text-primary placeholder:text-text-muted transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand/20 focus-visible:ring-offset-2 focus-visible:ring-offset-bg focus-visible:border-brand disabled:cursor-not-allowed disabled:opacity-50 resize-none"
                    />
                  </div>

                  {/* Dynamic Questions Component */}
                  <DynamicQuestions
                    questions={formData.questions}
                    onChange={handleQuestionsChange}
                  />

                  <div className="flex items-center space-x-3">
                    <input
                      type="checkbox"
                      id="starRatings"
                      name="starRatings"
                      checked={formData.starRatings}
                      onChange={handleChange}
                      className="w-4 h-4 text-brand bg-surface border-border rounded focus:ring-brand focus:ring-2"
                    />
                    <Label htmlFor="starRatings" className="flex items-center gap-2">
                      <FiStar className="w-4 h-4" />
                      Enable Star Ratings
                    </Label>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="image">
                      Upload Image
                    </Label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <FiImage className="h-5 w-5 text-text-muted" />
                      </div>
                      <input
                        id="image"
                        type="file"
                        name="image"
                        onChange={handleImageChange}
                        accept="image/*"
                        className="flex h-10 w-full rounded-xl border border-border bg-surface px-3 py-2 pl-10 text-sm text-text-primary transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand/20 focus-visible:ring-offset-2 focus-visible:ring-offset-bg focus-visible:border-brand disabled:cursor-not-allowed disabled:opacity-50 file:border-0 file:bg-transparent file:text-sm file:font-medium"
                      />
                    </div>
                  </div>

                  <Button 
                    type="submit" 
                    disabled={loading}
                    className="w-full text-lg py-3"
                    size="lg"
                  >
                    {loading ? (
                      <div className="flex items-center justify-center">
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-bg mr-2"></div>
                        Creating Space...
                      </div>
                    ) : (
                      <>
                        <FiPlus className="mr-2 w-5 h-5" />
                        Create Space
                      </>
                    )}
                  </Button>
                </form>

                {isSubmitted && (
                  <div className="mt-8 p-6 rounded-xl bg-success/10 border border-success/20 text-center">
                    <p className="text-success mb-4">Redirecting to Dashboard...</p>
                    <Link to="/dashboard">
                      <Button>Go to Dashboard</Button>
                    </Link>
                  </div>
                )}
              </Card>
            </div>
          </div>
        </div>
      </div>

      {/* Success Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setShowModal(false)}></div>
          <Card className="relative p-8 max-w-md w-full text-center">
            <div className="w-16 h-16 rounded-full bg-success/20 flex items-center justify-center mx-auto mb-6">
              <FiCheck className="w-8 h-8 text-success" />
            </div>
            <h2 className="text-2xl font-bold text-text-primary mb-4">Space Created Successfully!</h2>
            <p className="text-text-secondary mb-6">Your space link has been generated:</p>
            <div className="p-4 rounded-lg bg-muted border border-border mb-6">
              <p className="text-sm text-brand break-all">{generatedLink}</p>
            </div>
            <Button onClick={handleCopyLink} className="w-full">
              <FiCopy className="mr-2 w-5 h-5" />
              Copy Link to Clipboard
            </Button>
          </Card>
        </div>
      )}

      {/* Copied Modal */}
      {showCopiedModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setShowCopiedModal(false)}></div>
          <Card className="relative p-8 max-w-md w-full text-center">
            <div className="w-16 h-16 rounded-full bg-success/20 flex items-center justify-center mx-auto mb-6">
              <FiCheck className="w-8 h-8 text-success" />
            </div>
            <h2 className="text-2xl font-bold text-text-primary mb-4">Link Copied!</h2>
            <p className="text-text-secondary mb-6">Your space link has been copied to the clipboard:</p>
            <div className="p-4 rounded-lg bg-muted border border-border mb-6">
              <p className="text-sm text-brand break-all">{generatedLink}</p>
            </div>
            <Button onClick={() => setShowCopiedModal(false)} className="w-full">
              Continue
            </Button>
          </Card>
        </div>
      )}
    </div>
  )
}

export default SpaceFormNew