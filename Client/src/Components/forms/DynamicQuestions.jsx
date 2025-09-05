import React, { useState } from 'react'
import { FiPlus, FiTrash2 } from 'react-icons/fi'

const DynamicQuestions = ({ questions = [''], onChange }) => {
  const [questionList, setQuestionList] = useState(() => {
    if (questions && questions.length > 0 && questions[0] !== '') {
      return questions.map((q, index) => ({ id: index, text: q }))
    }
    return [{ id: 0, text: '' }]
  })

  const addQuestion = () => {
    const newId = Date.now() // Use timestamp for unique ID
    const newQuestions = [...questionList, { id: newId, text: '' }]
    setQuestionList(newQuestions)
    onChange(newQuestions.map(q => q.text))
  }

  const removeQuestion = (questionId) => {
    if (questionList.length > 1) {
      const newQuestions = questionList.filter(q => q.id !== questionId)
      setQuestionList(newQuestions)
      onChange(newQuestions.map(q => q.text))
    }
  }

  const updateQuestion = (questionId, value) => {
    const newQuestions = questionList.map(q => 
      q.id === questionId ? { ...q, text: value } : q
    )
    setQuestionList(newQuestions)
    onChange(newQuestions.map(q => q.text))
  }

  const moveQuestion = (questionId, direction) => {
    const currentIndex = questionList.findIndex(q => q.id === questionId)
    if (
      (direction === 'up' && currentIndex === 0) ||
      (direction === 'down' && currentIndex === questionList.length - 1)
    ) {
      return
    }

    const newQuestions = [...questionList]
    const targetIndex = direction === 'up' ? currentIndex - 1 : currentIndex + 1
    
    // Swap questions
    const temp = newQuestions[currentIndex]
    newQuestions[currentIndex] = newQuestions[targetIndex]
    newQuestions[targetIndex] = temp
    
    setQuestionList(newQuestions)
    onChange(newQuestions.map(q => q.text))
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <label className="text-sm font-medium text-gray-200">
          Questions for Customers *
        </label>
        <button
          type="button"
          onClick={addQuestion}
          className="flex items-center gap-2 px-3 py-2 bg-blue-600/20 hover:bg-blue-600/30 text-blue-300 border border-blue-600/30 rounded-lg text-sm transition-colors"
        >
          <FiPlus className="w-4 h-4" />
          Add Question
        </button>
      </div>

      <div className="space-y-3">
        {questionList.map((question, index) => (
          <div key={question.id} className="flex items-center gap-3 group bg-gray-800/50 p-4 rounded-lg border border-gray-700">
            <div className="flex flex-col gap-1">
              <button
                type="button"
                onClick={() => moveQuestion(question.id, 'up')}
                disabled={index === 0}
                className="p-1 h-6 w-6 text-gray-400 hover:text-gray-200 disabled:opacity-30 bg-transparent border-0 cursor-pointer disabled:cursor-not-allowed"
              >
                ↑
              </button>
              <button
                type="button"
                onClick={() => moveQuestion(question.id, 'down')}
                disabled={index === questionList.length - 1}
                className="p-1 h-6 w-6 text-gray-400 hover:text-gray-200 disabled:opacity-30 bg-transparent border-0 cursor-pointer disabled:cursor-not-allowed"
              >
                ↓
              </button>
            </div>

            <div className="flex-1">
              <input
                type="text"
                value={question.text}
                onChange={(e) => updateQuestion(question.id, e.target.value)}
                placeholder={`Question ${index + 1} (e.g., What do you love about our product?)`}
                className="w-full px-3 py-2 bg-gray-900/50 border border-gray-600 text-gray-100 placeholder:text-gray-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {questionList.length > 1 && (
              <button
                type="button"
                onClick={() => removeQuestion(question.id)}
                className="opacity-0 group-hover:opacity-100 transition-opacity text-red-400 hover:text-red-300 hover:bg-red-500/10 p-2 rounded bg-transparent border-0 cursor-pointer"
              >
                <FiTrash2 className="w-4 h-4" />
              </button>
            )}
          </div>
        ))}
      </div>

      {questionList.length === 0 && (
        <div className="text-center py-8 text-gray-400 bg-gray-800/30 rounded-lg border border-gray-700 border-dashed">
          <p className="mb-3">No questions added yet.</p>
          <button
            type="button"
            onClick={addQuestion}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600/20 hover:bg-blue-600/30 text-blue-300 border border-blue-600/30 rounded-lg transition-colors mx-auto"
          >
            <FiPlus className="w-4 h-4" />
            Add Your First Question
          </button>
        </div>
      )}

      <div className="text-xs text-gray-400 bg-blue-900/20 border border-blue-800/30 rounded-lg p-3">
        <p>💡 <strong>Tip:</strong> Use the arrow buttons to reorder questions. Ask specific questions to get actionable feedback from your customers.</p>
      </div>
    </div>
  )
}

export default DynamicQuestions