import { DashboardLayout } from "#/components/page/dashboard/dashboardLayout"
import {
  DashboardErrorState,
  DashboardPageLoading,
} from "#/components/page/dashboard/dashboardStates"
import { FolderDetailView } from "#/components/page/dashboard/folder-detail-view"
import { useGetPhotosQuery } from "#/hook/fileUpload.hook"
import { createFileRoute } from "@tanstack/react-router"

export const Route = createFileRoute('/dashboard/folder/$folderId')({
  component: RouteComponent,
})

function RouteComponent() {
    const folderId = Route.useParams().folderId
    const {
      data: folderData,
      isPending,
      isError,
      refetch,
    } = useGetPhotosQuery(folderId)

    if (isPending) {
      return (
        <DashboardLayout>
          <DashboardPageLoading
            title="Loading folder"
            description="Pulling the latest files and previews."
          />
        </DashboardLayout>
      )
    }

    if (isError || !folderData) {
      return (
        <DashboardLayout>
          <DashboardErrorState
            title="Could not load this folder"
            description="The folder data or file list could not be retrieved."
            onRetry={() => void refetch()}
          />
        </DashboardLayout>
      )
    }

    return (
      <DashboardLayout>
        <FolderDetailView
          folderId={folderData.id}
          folderName={folderData.name}
          photos={folderData.photos}
        />
      </DashboardLayout>
    )
}
