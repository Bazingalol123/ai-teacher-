import { useState } from 'react'
import { useParams } from 'react-router-dom'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { Icons } from '@/components/ui/icons'
import { ChatInterface } from '@/components/chat/ChatInterface'

interface Module {
  id: string
  title: string
  description: string
  duration: string
  progress: number
  status: 'completed' | 'in-progress' | 'locked'
}

const modules: Module[] = [
  {
    id: 'module-1',
    title: 'Introduction to React',
    description: 'Learn the basics of React, including components, props, and state.',
    duration: '2 hours',
    progress: 100,
    status: 'completed',
  },
  {
    id: 'module-2',
    title: 'React Hooks',
    description: 'Master the use of React Hooks for state management and side effects.',
    duration: '3 hours',
    progress: 60,
    status: 'in-progress',
  },
  {
    id: 'module-3',
    title: 'Advanced React Patterns',
    description: 'Explore advanced React patterns and best practices.',
    duration: '4 hours',
    progress: 0,
    status: 'locked',
  },
]

export function LearningPath() {
  const { moduleId } = useParams()
  const [selectedModule, setSelectedModule] = useState<Module | null>(
    moduleId ? modules.find((m) => m.id === moduleId) || null : null
  )

  return (
    <div className="grid gap-6 lg:grid-cols-[300px_1fr]">
      <Card className="p-4">
        <h2 className="mb-4 text-lg font-semibold">Course Modules</h2>
        <div className="space-y-4">
          {modules.map((module) => (
            <Card
              key={module.id}
              className={`cursor-pointer p-4 transition-colors hover:bg-accent ${
                selectedModule?.id === module.id ? 'border-primary' : ''
              } ${module.status === 'locked' ? 'opacity-50' : ''}`}
              onClick={() => setSelectedModule(module)}
            >
              <div className="flex items-center justify-between">
                <h3 className="font-medium">{module.title}</h3>
                {module.status === 'completed' && (
                  <Icons.check className="h-4 w-4 text-primary" />
                )}
                {module.status === 'locked' && (
                  <Icons.lock className="h-4 w-4" />
                )}
              </div>
              <p className="mt-1 text-sm text-muted-foreground">
                {module.duration}
              </p>
              <Progress value={module.progress} className="mt-2" />
            </Card>
          ))}
        </div>
      </Card>

      <div className="space-y-6">
        {selectedModule ? (
          <>
            <div>
              <h1 className="text-3xl font-bold">{selectedModule.title}</h1>
              <p className="mt-2 text-muted-foreground">
                {selectedModule.description}
              </p>
            </div>
            <ChatInterface moduleId={selectedModule.id} />
          </>
        ) : (
          <Card className="flex h-[500px] items-center justify-center p-6">
            <div className="text-center">
              <Icons.book className="mx-auto h-12 w-12 text-muted-foreground" />
              <h2 className="mt-4 text-lg font-semibold">
                Select a module to start learning
              </h2>
              <p className="mt-2 text-sm text-muted-foreground">
                Choose a module from the sidebar to begin your learning journey
              </p>
            </div>
          </Card>
        )}
      </div>
    </div>
  )
} 