/// <reference types="react" />

import * as React from 'react'
import { useState } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Icons } from '@/components/ui/icons'
import { formatDate } from '@/lib/utils'

interface Post {
  id: string
  title: string
  content: string
  author: {
    name: string
    avatar: string
  }
  likes: number
  comments: number
  tags: string[]
  createdAt: string
}

const posts: Post[] = [
  {
    id: '1',
    title: 'Getting Started with React',
    content: 'Here are some tips for beginners learning React...',
    author: {
      name: 'John Doe',
      avatar: '/avatars/john.jpg'
    },
    likes: 15,
    comments: 5,
    tags: ['react', 'beginners', 'javascript'],
    createdAt: '2024-03-15T10:00:00Z'
  },
  {
    id: '2',
    title: 'Understanding React Hooks',
    content:
      'Can someone explain the difference between useEffect and useLayoutEffect? When should I use one over the other?',
    author: {
      name: 'Jane Smith',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Jane',
    },
    likes: 18,
    comments: 8,
    tags: ['React', 'Hooks', 'JavaScript'],
    createdAt: '2024-03-19T15:45:00Z',
  },
]

export function Community(): React.ReactElement {
  const [activeTab, setActiveTab] = useState<'discussions' | 'study-groups'>(
    'discussions'
  )

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Community</h1>
        <Button>
          <Icons.path className="mr-2 h-4 w-4" />
          New Post
        </Button>
      </div>

      <div className="flex space-x-4 border-b">
        <Button
          variant={activeTab === 'discussions' ? 'default' : 'ghost'}
          onClick={() => setActiveTab('discussions')}
        >
          Discussions
        </Button>
        <Button
          variant={activeTab === 'study-groups' ? 'default' : 'ghost'}
          onClick={() => setActiveTab('study-groups')}
        >
          Study Groups
        </Button>
      </div>

      {activeTab === 'discussions' ? (
        <div className="space-y-4">
          {posts.map((post) => (
            <Card key={post.id} className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <img
                    src={post.author.avatar}
                    alt={post.author.name}
                    className="h-10 w-10 rounded-full"
                  />
                  <div>
                    <h3 className="font-semibold">{post.title}</h3>
                    <p className="text-sm text-muted-foreground">
                      {post.author.name} • {formatDate(post.createdAt)}
                    </p>
                  </div>
                </div>
                <Button variant="ghost" size="icon">
                  <Icons.folder className="mr-2 h-4 w-4" />
                </Button>
              </div>
              <p className="mt-2">{post.content}</p>
              <div className="mt-4 flex flex-wrap gap-2">
                {post.tags.map((tag) => (
                  <span
                    key={tag}
                    className="rounded-full bg-secondary px-3 py-1 text-xs font-medium"
                  >
                    {tag}
                  </span>
                ))}
              </div>
              <div className="mt-4 flex items-center space-x-4">
                <Button variant="ghost" size="sm">
                  <Icons.heart
                    className={`mr-2 h-4 w-4 ${
                      post.likes > 0 ? 'fill-primary text-primary' : ''
                    }`}
                  />
                  {post.likes}
                </Button>
                <Button variant="ghost" size="sm">
                  <Icons.bell className="mr-2 h-4 w-4" />
                  {post.comments}
                </Button>
                <Button variant="ghost" size="sm">
                  <Icons.path className="mr-2 h-4 w-4" />
                  Share
                </Button>
              </div>
            </Card>
          ))}
        </div>
      ) : (
        <div className="text-center">
          <p className="text-muted-foreground">Study Groups feature coming soon!</p>
        </div>
      )}
    </div>
  )
} 