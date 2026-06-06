import { useAuth } from "@clerk/clerk-react";
import { Link } from "@tanstack/react-router";
import { Button } from "#/components/ui/button";
import HeaderUser from "#/integrations/clerk/header-user";

export function Navbar() {
	const { isSignedIn } = useAuth();

	return (
		<nav className="sticky top-0 z-20 w-full border-b border-white/35 bg-[color:var(--header-bg)]/90 backdrop-blur-xl">
			<div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
				<div className="flex h-18 items-center justify-between gap-4 py-3">
					<Link to="/" className="flex items-center gap-3">
						<span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[color:var(--lagoon)]/14 text-[color:var(--lagoon-deep)] shadow-sm shadow-[color:var(--lagoon)]/15">
							FV
						</span>
						<div className="flex flex-col">
							<span className="text-lg font-semibold text-primary">
								FileVault
							</span>
							<span className="text-xs uppercase tracking-[0.2em] text-foreground/45">
								Secure file workspace
							</span>
						</div>
					</Link>

					<div className="flex items-center gap-4">
						{isSignedIn && (
							<Link to="/dashboard">
								<Button className="rounded-full px-5">Dashboard</Button>
							</Link>
						)}

						<HeaderUser />
					</div>
				</div>
			</div>
		</nav>
	);
}
