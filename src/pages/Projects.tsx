import { useState } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { Icons } from '@/components/ui/icons'

interface Project {
  id: string
  title: string
  description: string
  difficulty: 'beginner' | 'intermediate' | 'advanced'
  technologies: string[]
  progress: number
  tasks: {
    id: string
    title: string
    completed: boolean
  }[]
}

const projects: Project[] = [
  {
    id: '1',
    title: 'Todo App with React',
    description:
      'Build a simple todo application using React. Learn about state management, components, and basic CRUD operations.',
    difficulty: 'beginner',
    technologies: ['React', 'CSS', 'LocalStorage'],
    progress: 0,
    tasks: [
      {
        id: 't1',
        title: 'Set up React project',
        completed: false,
      },
      {
        id: 't2',
        title: 'Create Todo component',
        completed: false,
      },
      {
        id: 't3',
        title: 'Implement CRUD operations',
        completed: false,
      },
      {
        id: 't4',
        title: 'Add styling',
        completed: false,
      },
      {
        id: 't5',
        title: 'Implement persistence',
        completed: false,
      },
    ],
  },
  {
    id: '2',
    title: 'Weather Dashboard',
    description:
      'Create a weather dashboard that fetches data from a weather API. Learn about API integration, async operations, and data visualization.',
    difficulty: 'intermediate',
    technologies: ['React', 'API', 'Chart.js'],
    progress: 0,
    tasks: [
      {
        id: 't1',
        title: 'Set up project structure',
        completed: false,
      },
      {
        id: 't2',
        title: 'Implement API integration',
        completed: false,
      },
      {
        id: 't3',
        title: 'Create weather display components',
        completed: false,
      },
      {
        id: 't4',
        title: 'Add charts for data visualization',
        completed: false,
      },
      {
        id: 't5',
        title: 'Implement location search',
        completed: false,
      },
    ],
  },
]

export function Projects() {
  const [selectedProject, setSelectedProject] = useState<Project | null>(null)

  const updateTask = (projectId: string, taskId: string) => {
    setSelectedProject((prev) => {
      if (!prev || prev.id !== projectId) return prev

      const updatedTasks = prev.tasks.map((task) =>
        task.id === taskId ? { ...task, completed: !task.completed } : task
      )

      const progress =
        (updatedTasks.filter((t) => t.completed).length / updatedTasks.length) *
        100

      return {
        ...prev,
        tasks: updatedTasks,
        progress,
      }
    })
  }

  if (selectedProject) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">{selectedProject.title}</h1>
            <p className="text-muted-foreground">{selectedProject.description}</p>
          </div>
          <Button
            variant="outline"
            onClick={() => setSelectedProject(null)}
          >
            Back to Projects
          </Button>
        </div>

        <Card className="p-6">
          <div className="mb-4">
            <h2 className="text-xl font-semibold">Project Progress</h2>
            <Progress value={selectedProject.progress} className="mt-2" />
            <p className="mt-1 text-sm text-muted-foreground">
              {selectedProject.progress.toFixed(0)}% Complete
            </p>
          </div>

          <div className="space-y-4">
            <h3 className="font-medium">Tasks</h3>
            {selectedProject.tasks.map((task) => (
              <div
                key={task.id}
                className="flex items-center justify-between rounded-lg border p-4"
              >
                <div className="flex items-center gap-3">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => updateTask(selectedProject.id, task.id)}
                  >
                    {task.completed ? (
                      <Icons.check className="h-4 w-4 text-primary" />
                    ) : (
                      <div className="h-4 w-4 rounded-sm border-2" />
                    )}
                  </Button>
                  <span
                    className={
                      task.completed ? 'text-muted-foreground line-through' : ''
                    }
                  >
                    {task.title}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Projects</h1>
      <div className="grid gap-6 md:grid-cols-2">
        {projects.map((project) => (
          <Card
            key={project.id}
            className="cursor-pointer p-6 transition-colors hover:bg-accent"
            onClick={() => setSelectedProject(project)}
          >
            <h2 className="text-xl font-semibold">{project.title}</h2>
            <p className="mt-2 text-muted-foreground">{project.description}</p>
            <div className="mt-4 flex flex-wrap gap-2">
              {project.technologies.map((tech) => (
                <span
                  key={tech}
                  className="rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary"
                >
                  {tech}
                </span>
              ))}
            </div>
            <div className="mt-4 flex items-center justify-between">
              <span
                className={`text-sm font-medium ${
                  project.difficulty === 'beginner'
                    ? 'text-green-500'
                    : project.difficulty === 'intermediate'
                    ? 'text-yellow-500'
                    : 'text-red-500'
                }`}
              >
                {project.difficulty.charAt(0).toUpperCase() +
                  project.difficulty.slice(1)}
              </span>
              <Button variant="ghost" size="icon">
                <Icons.arrowRight className="h-4 w-4" />
              </Button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  )
} 