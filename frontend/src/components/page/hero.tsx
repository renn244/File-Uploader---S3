import { Link } from "@tanstack/react-router";
import {
	ArrowRight,
	FileImage,
	FolderOpen,
	ImageDown,
	LockKeyhole,
	Sparkles,
	UploadCloud,
} from "lucide-react";
import { Button } from "@/components/ui/button";

const pipelineSteps = [
	{
		icon: UploadCloud,
		label: "Signed upload",
		detail: "Browser sends photos safely",
	},
	{
		icon: FolderOpen,
		label: "S3 originals",
		detail: "Stored by folder in AWS",
	},
	{
		icon: Sparkles,
		label: "Lambda resize",
		detail: "Triggered on object created",
	},
	{
		icon: ImageDown,
		label: "WebP thumbs",
		detail: "200x200 previews saved",
	},
];

export function Hero() {
	return (
		<section className="landing-hero relative w-full overflow-hidden px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
			<div className="mx-auto grid max-w-7xl items-center gap-12 lg:grid-cols-[0.95fr_1.05fr]">
				<div className="relative z-10">
					<div className="landing-kicker mb-6">
						<LockKeyhole className="h-4 w-4" />
						AWS-backed photo workspace
					</div>

					<h1 className="font-serif text-5xl font-bold leading-[0.95] tracking-[-0.055em] text-[color:var(--sea-ink)] sm:text-6xl lg:text-7xl">
						Upload photos, organize folders, and let Lambda make the previews.
					</h1>

					<p className="mt-7 max-w-2xl text-lg leading-8 text-[color:var(--sea-ink-soft)] sm:text-xl">
						FileVault is a small cloud file manager with Clerk auth, folder
						ownership, pre-signed S3 uploads, and an event-driven AWS Lambda
						that turns originals into fast WebP thumbnails.
					</p>

					<div className="mt-8 flex flex-col gap-3 sm:flex-row">
						<Button
							asChild
							className="h-13 rounded-full bg-[color:var(--sea-ink)] px-7 text-base text-white shadow-xl shadow-[color:var(--lagoon)]/20 hover:bg-[color:var(--sea-ink)]/90"
						>
							<Link to="/dashboard">
								Open dashboard
								<ArrowRight className="ml-2 h-4 w-4" />
							</Link>
						</Button>
						<Button
							asChild
							variant="outline"
							className="h-13 rounded-full border-[color:var(--chip-line)] bg-white/60 px-7 text-base text-[color:var(--sea-ink)] backdrop-blur hover:bg-white/85"
						>
							<a href="#features">See what is inside</a>
						</Button>
					</div>

					<div className="mt-9 grid max-w-xl grid-cols-3 gap-3 text-sm">
						<div className="landing-stat">
							<span>01</span>
							Authenticated folders
						</div>
						<div className="landing-stat">
							<span>S3</span>
							Private object storage
						</div>
						<div className="landing-stat">
							<span>200</span>
							Pixel WebP thumbnails
						</div>
					</div>
				</div>

				<div className="aws-card relative z-10">
					<div className="mb-5 flex items-center justify-between gap-4">
						<div>
							<p className="text-xs font-bold uppercase tracking-[0.24em] text-[color:var(--palm)]">
								Implemented flow
							</p>
							<h2 className="mt-2 text-2xl font-bold text-[color:var(--sea-ink)]">
								S3 event to Lambda resize pipeline
							</h2>
						</div>
						<div className="rounded-full border border-[color:var(--chip-line)] bg-white/70 px-3 py-1 text-xs font-bold text-[color:var(--lagoon-deep)]">
							LocalStack ready
						</div>
					</div>

					<div className="pipeline-stage">
						<svg
							className="pipeline-lines"
							viewBox="0 0 760 260"
							role="img"
							aria-label="Animated AWS upload flow from browser to S3, Lambda, and thumbnail bucket"
						>
							<defs>
								<linearGradient id="lineGlow" x1="0" x2="1" y1="0" y2="0">
									<stop offset="0%" stopColor="#4fb8b2" />
									<stop offset="50%" stopColor="#f6b04b" />
									<stop offset="100%" stopColor="#ec6b44" />
								</linearGradient>
								<filter
								id="softGlow"
								x="-20%"
								y="-20%"
								width="140%"
								height="140%"
								>
									<feGaussianBlur stdDeviation="4" result="blur" />
									<feMerge>
										<feMergeNode in="blur" />
										<feMergeNode in="SourceGraphic" />
									</feMerge>
								</filter>
							</defs>
							<path
							className="circuit-line"
							d="M102 112 H178 C224 112 210 190 256 190 H304 C344 190 330 132 374 132 H448 C516 132 520 110 590 110 H654"
							/>
							<path
							className="laser laser-one"
							d="M102 112 H178 C224 112 210 190 256 190 H304 C344 190 330 132 374 132 H448 C516 132 520 110 590 110 H654"
							/>
							<circle cx="102" cy="112" r="4" className="circuit-dot" />
							<circle cx="256" cy="190" r="4" className="circuit-dot" />
							<circle cx="374" cy="132" r="8" className="lambda-pulse" />
							<circle cx="654" cy="110" r="4" className="circuit-dot" />
						</svg>

						<div className="pipeline-node node-upload">
							<FileImage className="h-6 w-6" />
							<span>Browser</span>
						</div>
						<div className="pipeline-node node-s3">
							<UploadCloud className="h-6 w-6" />
							<span>S3 originals</span>
						</div>
						<div className="pipeline-node node-lambda">
							<Sparkles className="h-7 w-7" />
							<span>Lambda</span>
						</div>
						<div className="pipeline-node node-thumb">
							<ImageDown className="h-6 w-6" />
							<span>Thumbnail S3</span>
						</div>
					</div>

					<div className="mt-6 grid gap-3 sm:grid-cols-4">
						{pipelineSteps.map((step) => {
							const Icon = step.icon;
							return (
								<div className="flow-chip" key={step.label}>
									<Icon className="h-4 w-4" />
									<div>
										<p>{step.label}</p>
										<span>{step.detail}</span>
									</div>
								</div>
							);
						})}
					</div>
				</div>
			</div>
		</section>
	);
}
