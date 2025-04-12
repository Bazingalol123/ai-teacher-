import { useQuery } from '@tanstack/react-query'
import { Card } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { Icons } from '@/components/ui/icons'
import { Button } from '@/components/ui/button'
import { useNavigate } from 'react-router-dom'

interface Course {
  id: string
  title: string
  progress: number
  totalLessons: number
  completedLessons: number
  lastAccessed: string
}

export function Dashboard() {
  const navigate = useNavigate()
  const { data: courses, isLoading } = useQuery<Course[]>({
    queryKey: ['courses'],
    queryFn: async () => {
      // Simulated API call
      return [
        {
          id: '1',
          title: 'React Fundamentals',
          progress: 65,
          totalLessons: 12,
          completedLessons: 8,
          lastAccessed: '2024-03-20T10:30:00Z',
        },
        {
          id: '2',
          title: 'Advanced JavaScript',
          progress: 30,
          totalLessons: 15,
          completedLessons: 5,
          lastAccessed: '2024-03-19T15:45:00Z',
        },
      ]
    },
  })

  if (isLoading) {
    return <div>Loading...</div>
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Welcome back!</h1>
        <Button onClick={() => navigate('/learning-path')}>
          Start New Course
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {courses?.map((course) => (
          <Card key={course.id} className="p-6">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="font-semibold">{course.title}</h3>
                <p className="text-sm text-muted-foreground">
                  {course.completedLessons} of {course.totalLessons} lessons
                  completed
                </p>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => navigate(`/learning-path/${course.id}`)}
              >
                <Icons.path className="h-4 w-4" />
              </Button>
            </div>
            <Progress value={course.progress} className="mt-4" />
          </Card>
        ))}
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card className="p-6">
          <h3 className="font-semibold">Recent Activity</h3>
          {/* Add recent activity list */}
        </Card>
        <Card className="p-6">
          <h3 className="font-semibold">Learning Stats</h3>
          {/* Add learning statistics */}
        </Card>
      </div>
    </div>
  )
} 