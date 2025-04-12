import { NavLink } from 'react-router-dom'
import { Icons } from '@/components/ui/icons'
import { cn } from '@/lib/utils'

const navigation = [
  {
    name: 'Dashboard',
    href: '/',
    icon: Icons.home,
  },
  {
    name: 'Learning Path',
    href: '/learning-path',
    icon: Icons.path,
  },
  {
    name: 'Code Playground',
    href: '/playground',
    icon: Icons.code,
  },
  {
    name: 'Assessment',
    href: '/assessment',
    icon: Icons.test,
  },
  {
    name: 'Projects',
    href: '/projects',
    icon: Icons.folder,
  },
  {
    name: 'Community',
    href: '/community',
    icon: Icons.users,
  },
]

export function Sidebar() {
  return (
    <div className="hidden border-r bg-background md:block md:w-64">
      <div className="flex h-full flex-col">
        <div className="flex-1 space-y-1 p-2">
          {navigation.map((item) => (
            <NavLink
              key={item.name}
              to={item.href}
              className={({ isActive }) =>
                cn(
                  'group flex items-center rounded-md px-3 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground',
                  isActive ? 'bg-accent text-accent-foreground' : 'transparent'
                )
              }
            >
              <item.icon className="mr-3 h-4 w-4" />
              {item.name}
            </NavLink>
          ))}
        </div>
      </div>
    </div>
  )
} 