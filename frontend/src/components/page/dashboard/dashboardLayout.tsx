import { Navbar } from "#/components/common/NavBar";

interface DashboardLayoutProps {
	children: React.ReactNode;
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
	return (
		<div className="dashboard-shell min-h-screen">
			<div className="pointer-events-none absolute inset-x-0 top-0 h-[28rem] bg-[radial-gradient(circle_at_top,rgba(79,184,178,0.24),transparent_60%)]" />
			<Navbar />
			<main className="relative mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 lg:py-10">
				{children}
			</main>
		</div>
	);
}
