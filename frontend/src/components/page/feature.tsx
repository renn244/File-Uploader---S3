import {
	FolderKanban,
	KeyRound,
	ShieldCheck,
	WandSparkles,
} from "lucide-react";

const features = [
	{
		icon: KeyRound,
		title: "Pre-signed S3 uploads",
		description:
			"The backend creates short-lived upload URLs so photos go straight into your S3 bucket without exposing AWS credentials.",
	},
	{
		icon: WandSparkles,
		title: "Automatic thumbnails",
		description:
			"An S3 object-created event invokes the image_resizer Lambda, which writes 200x200 WebP thumbnails to a dedicated bucket.",
	},
	{
		icon: FolderKanban,
		title: "Folder-first dashboard",
		description:
			"Create folders, upload photos into them, browse previews, and keep each workspace scoped to its owner.",
	},
	{
		icon: ShieldCheck,
		title: "Auth and ownership guards",
		description:
			"Clerk authentication plus backend ownership checks help keep users inside their own folders and photos.",
	},
];

export function Features() {
	return (
		<section
			id="features"
			className="landing-features w-full px-4 py-20 sm:px-6 lg:px-8"
		>
			<div className="max-w-6xl mx-auto">
				<div className="mx-auto mb-14 max-w-3xl text-center">
					<p className="landing-kicker mx-auto mb-5">What is inside</p>
					<h2 className="font-serif text-4xl font-bold tracking-[-0.04em] text-[color:var(--sea-ink)] sm:text-5xl">
						A real mini cloud app, not just an upload button.
					</h2>
					<p className="mt-5 text-lg leading-8 text-[color:var(--sea-ink-soft)]">
						The landing page mirrors the actual stack: React on the front,
						NestJS for API and ownership, S3 for storage, and Lambda for image
						processing.
					</p>
				</div>

				<div className="grid gap-5 md:grid-cols-2">
					{features.map((feature, index) => {
						const Icon = feature.icon;
						return (
							<div
								key={feature.title}
								className="feature-card"
								style={{ animationDelay: `${index * 90}ms` }}
							>
								<div className="feature-icon">
									<Icon className="h-6 w-6" />
								</div>
								<div>
									<h3 className="mb-2 text-xl font-bold text-[color:var(--sea-ink)]">
										{feature.title}
									</h3>
									<p className="leading-7 text-[color:var(--sea-ink-soft)]">
										{feature.description}
									</p>
								</div>
							</div>
						);
					})}
				</div>

				<div className="mt-8 rounded-[2rem] border border-[color:var(--chip-line)] bg-white/55 p-6 text-center text-sm font-semibold text-[color:var(--sea-ink-soft)] shadow-xl shadow-[color:var(--lagoon)]/5 backdrop-blur">
					Upload URL requested by the app &rarr; photo lands in{" "}
					<span className="text-[color:var(--sea-ink)]">
						file-uploader-bucket
					</span>{" "}
					&rarr; S3 triggers Lambda &rarr; resized preview lands in{" "}
					<span className="text-[color:var(--sea-ink)]">
						thumbnail-uploader-bucket
					</span>
					.
				</div>
			</div>
		</section>
	);
}
