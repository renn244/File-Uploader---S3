import { DashboardLayout } from '#/components/page/dashboard/dashboardLayout';
import { FolderDetailView } from '#/components/page/dashboard/folder-detail-view';
import { useGetPhotosQuery } from '#/hook/fileUpload.hook';
import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/dashboard/folder/$folderId')({
  component: RouteComponent,
})

function RouteComponent() {
    const folderId = Route.useParams().folderId;

    const { data: folderData } = useGetPhotosQuery(folderId)

    return (
        <DashboardLayout>
            <FolderDetailView folderId={folderData?.id} folderName={folderData?.name} photos={folderData?.photos} />
        </DashboardLayout>
    )
}
