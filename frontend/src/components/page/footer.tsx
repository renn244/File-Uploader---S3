export function Footer() {
    return (
        <footer className="w-full border-t border-border bg-secondary/20">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="text-center">
                    <p className="text-primary/60 mb-2">© 2026 FileVault. All rights reserved.</p>
                    <div className="flex justify-center gap-6 text-sm">
                        <a href="#" className="text-primary hover:text-primary/70 transition">
                            Privacy
                        </a>
                        <a href="#" className="text-primary hover:text-primary/70 transition">
                            Terms
                        </a>
                        <a href="#" className="text-primary hover:text-primary/70 transition">
                            Contact
                        </a>
                    </div>
                </div>
            </div>
        </footer>
    );
}
