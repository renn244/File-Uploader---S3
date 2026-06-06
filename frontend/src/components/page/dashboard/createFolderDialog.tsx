import { Plus } from "lucide-react";
import { useState } from "react";
import { useCreateFolderMutation } from "#/hook/folder.hook";
import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";

export function CreateFolderDialog() {
	const [open, setOpen] = useState(false);
	const [folderName, setFolderName] = useState("");

	const { mutateAsync: createFolder, isPending } = useCreateFolderMutation();

	const trimmedFolderName = folderName.trim();

	return (
		<Dialog onOpenChange={setOpen} open={open}>
			<DialogTrigger asChild>
				<Button className="gap-2">
					<Plus className="w-4 h-4" />
					Create Folder
				</Button>
			</DialogTrigger>
			<DialogContent className="sm:max-w-[425px]">
				<DialogHeader>
					<DialogTitle>Create New Folder</DialogTitle>
					<DialogDescription>
						Create a new folder to organize your photos.
					</DialogDescription>
				</DialogHeader>
				<div className="space-y-4 py-4">
					<div className="space-y-2">
						<label
							htmlFor="folder-name"
							className="text-sm font-medium text-foreground"
						>
							Folder Name
						</label>
						<Input
							value={folderName}
							onChange={(e) => setFolderName(e.target.value)}
							id="folder-name"
							placeholder="e.g., Client assets, Summer launch"
							className="bg-white/70 border-white/50 text-foreground"
						/>
					</div>
					<div className="flex gap-2 justify-end pt-4">
						<Button
							onClick={() => setOpen(false)}
							disabled={isPending}
							variant="outline"
						>
							Cancel
						</Button>
						<Button
							disabled={!trimmedFolderName || isPending}
							onClick={async () =>
								createFolder(
									{ name: trimmedFolderName },
									{
										onSuccess: () => {
											setFolderName("");
											setOpen(false);
										},
									},
								)
							}
						>
							{isPending ? "Creating..." : "Create Folder"}
						</Button>
					</div>
				</div>
			</DialogContent>
		</Dialog>
	);
}
