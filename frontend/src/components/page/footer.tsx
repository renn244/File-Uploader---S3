export function Footer() {
	return (
		<footer className="site-footer w-full">
			<div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
				<div className="text-center">
					<p className="mb-2 text-primary/60">
						&copy; 2026 FileVault. Built for AWS practice.
					</p>
					<div className="flex justify-center gap-6 text-sm">
						<a
							href="/privacy"
							className="text-primary transition hover:text-primary/70"
						>
							Privacy
						</a>
						<a
							href="/terms"
							className="text-primary transition hover:text-primary/70"
						>
							Terms
						</a>
						<a
							href="mailto:hello@filevault.local"
							className="text-primary transition hover:text-primary/70"
						>
							Contact
						</a>
					</div>
				</div>
			</div>
		</footer>
	);
}
