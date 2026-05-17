import { DashboardLayout } from '#/components/page/dashboard/dashboardLayout'
import FoldersView from '#/components/page/dashboard/folderView'
import { useAuth } from '@clerk/clerk-react'
import { createFileRoute, useNavigate } from '@tanstack/react-router'

export const Route = createFileRoute('/dashboard/')({
  component: RouteComponent,
})

function RouteComponent() {
  const { isLoaded, isSignedIn } = useAuth();
  const navigate = useNavigate()
  
  if(!isLoaded) return null;

  if(!isSignedIn) {
    return navigate({ to: '/' })
  }

  return (
    <DashboardLayout>
      <FoldersView />
    </DashboardLayout>
  )
}