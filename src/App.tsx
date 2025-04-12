import { Routes, Route } from 'react-router-dom'
import { Layout } from '@/components/layout'
import { Dashboard } from '@/pages/Dashboard'
import { LearningPath } from '@/pages/LearningPath'
import { CodePlayground } from '@/pages/CodePlayground'
import { Profile } from '@/pages/Profile'
import { Assessment } from '@/pages/Assessment'
import { Projects } from '@/pages/Projects'
import { Community } from '@/pages/Community'
import { Settings } from '@/pages/Settings'

export default function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/learning-path/*" element={<LearningPath />} />
        <Route path="/playground" element={<CodePlayground />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/assessment" element={<Assessment />} />
        <Route path="/projects" element={<Projects />} />
        <Route path="/community" element={<Community />} />
        <Route path="/settings" element={<Settings />} />
      </Routes>
    </Layout>
  )
} 