import { useState } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { Icons } from '@/components/ui/icons'

interface Question {
  id: string
  type: 'multiple-choice' | 'coding'
  question: string
  options?: string[]
  correctAnswer: string
  explanation: string
  code?: string
}

const questions: Question[] = [
  {
    id: '1',
    type: 'multiple-choice',
    question: 'What is the output of console.log(typeof [])?',
    options: ['array', 'object', 'undefined', 'null'],
    correctAnswer: 'object',
    explanation:
      'In JavaScript, arrays are objects. The typeof operator returns "object" for arrays.',
  },
  {
    id: '2',
    type: 'coding',
    question: 'Write a function that reverses a string.',
    code: 'function reverseString(str) {\n  // Your code here\n}',
    correctAnswer:
      'function reverseString(str) {\n  return str.split("").reverse().join("");\n}',
    explanation:
      'This solution splits the string into an array of characters, reverses the array, and joins it back into a string.',
  },
]

export function Assessment() {
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [answers, setAnswers] = useState<Record<string, string>>({})
  const [showResults, setShowResults] = useState(false)
  const [code, setCode] = useState(
    questions[currentQuestion].type === 'coding'
      ? questions[currentQuestion].code || ''
      : ''
  )

  const handleAnswer = (answer: string) => {
    setAnswers((prev) => ({
      ...prev,
      [questions[currentQuestion].id]: answer,
    }))
  }

  const handleNext = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion((prev) => prev + 1)
      if (questions[currentQuestion + 1].type === 'coding') {
        setCode(questions[currentQuestion + 1].code || '')
      }
    } else {
      setShowResults(true)
    }
  }

  const calculateScore = () => {
    let correct = 0
    questions.forEach((q) => {
      if (answers[q.id] === q.correctAnswer) {
        correct++
      }
    })
    return (correct / questions.length) * 100
  }

  if (showResults) {
    const score = calculateScore()
    return (
      <Card className="mx-auto max-w-2xl p-6">
        <h2 className="text-2xl font-bold">Assessment Results</h2>
        <div className="mt-4">
          <Progress value={score} className="h-2" />
          <p className="mt-2 text-center text-lg">
            Your score: {score.toFixed(0)}%
          </p>
        </div>
        <div className="mt-6 space-y-4">
          {questions.map((q) => (
            <div
              key={q.id}
              className={`rounded-lg border p-4 ${
                answers[q.id] === q.correctAnswer
                  ? 'border-green-500 bg-green-50'
                  : 'border-red-500 bg-red-50'
              }`}
            >
              <p className="font-medium">{q.question}</p>
              <p className="mt-2">
                Your answer: <code>{answers[q.id]}</code>
              </p>
              <p className="mt-1">
                Correct answer: <code>{q.correctAnswer}</code>
              </p>
              <p className="mt-2 text-sm text-gray-600">{q.explanation}</p>
            </div>
          ))}
        </div>
        <Button className="mt-6" onClick={() => window.location.reload()}>
          Try Again
        </Button>
      </Card>
    )
  }

  const question = questions[currentQuestion]

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <Card className="p-6">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-2xl font-bold">Assessment</h2>
          <p>
            Question {currentQuestion + 1} of {questions.length}
          </p>
        </div>
        <Progress
          value={((currentQuestion + 1) / questions.length) * 100}
          className="mb-6"
        />
        <div className="space-y-4">
          <h3 className="text-lg font-medium">{question.question}</h3>
          {question.type === 'multiple-choice' ? (
            <div className="grid gap-2">
              {question.options?.map((option) => (
                <Button
                  key={option}
                  variant={
                    answers[question.id] === option ? 'default' : 'outline'
                  }
                  className="justify-start"
                  onClick={() => handleAnswer(option)}
                >
                  {option}
                </Button>
              ))}
            </div>
          ) : (
            <div className="space-y-4">
              <textarea
                value={code}
                onChange={(e) => {
                  setCode(e.target.value)
                  handleAnswer(e.target.value)
                }}
                className="h-[200px] w-full rounded-md border bg-background p-4 font-mono text-sm"
                placeholder="Write your code here..."
              />
              <Button
                onClick={() => {
                  try {
                    // eslint-disable-next-line no-new-func
                    const fn = new Function(code)
                    fn()
                  } catch (error) {
                    console.error('Code execution error:', error)
                  }
                }}
              >
                <Icons.play className="mr-2 h-4 w-4" />
                Run Code
              </Button>
            </div>
          )}
        </div>
        <div className="mt-6 flex justify-end">
          <Button
            onClick={handleNext}
            disabled={!answers[question.id]}
          >
            {currentQuestion === questions.length - 1 ? 'Finish' : 'Next'}
          </Button>
        </div>
      </Card>
    </div>
  )
} 