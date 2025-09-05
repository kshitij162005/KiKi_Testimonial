import React, { useState } from 'react'
import { FiPlus, FiTrash2, FiMoreVertical } from 'react-icons/fi'
import { Button } from '../ui/button'
import { Input } from '../ui/input'
import { Label } from '../ui/label'

const DynamicQuestions = ({ questions, onChange }) => {
  const [questionList, setQuestionList] = useState(
    questions.length > 0 ? questions : ['']
  )

  const addQuestion = () => {
    const newQuestions = [...questionList, '']
    setQuestionList(newQuestions)
    onChange(newQuestions)
  }

  const removeQuestion = (index) => {
    if (questionList.length > 1) {
      const newQuestions = questionList.filter((_, i) => i !== index)
      setQuestionList(newQuestions)
      onChange(newQuestions)
    }
  }

  const updateQuestion = (index, value) => {
    const newQuestions = [...questionList]
    newQuestions[index] = value
    setQuestionList(newQuestions)
    onChange(newQuestions)
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <Label className="text-sm font-medium text-text-primary">
          Questions for Customers
        </Label>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={addQuestion}
          className="flex items-center gap-2"
        >
          <FiPlus className="w-4 h-4" />
          Add Question
        </Button>
      </div>

      <div className="space-y-3">
        {questionList.map((question, index) => (
          <div key={index} className="flex items-center gap-3 group">
            <div className="flex items-center text-text-muted cursor-grab">
              <FiMoreVertical className="w-4 h-4" />
            </div>
            
            <div className="flex-1">
              <Input
                type="text"
                value={question}
                onChange={(e) => updateQuestion(index, e.target.value)}
                placeholder={`Question ${index + 1} (e.g., What do you love about our product?)`}
                className="w-full"
              />
            </div>

            {questionList.length > 1 && (
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => removeQuestion(index)}
                className="opacity-0 group-hover:opacity-100 transition-opacity text-danger hover:text-danger hover:bg-danger/10"
              >
                <FiTrash2 className="w-4 h-4" />
              </Button>
            )}
          </div>
        ))}
      </div>

      <div className="text-xs text-text-muted">
        <p>💡 Tip: Ask specific questions to get actionable feedback. Keep them clear and concise.</p>
      </div>

      {questionList.length === 0 && (
        <div className="text-center py-8 text-text-muted">
          <p>No questions added yet.</p>
          <Button
            type="button"
            variant="outline"
            onClick={addQuestion}
            className="mt-2"
          >
            Add Your First Question
          </Button>
        </div>
      )}
    </div>
  )
}

export default DynamicQuestions