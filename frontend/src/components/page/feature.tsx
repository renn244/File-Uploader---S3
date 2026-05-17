import { Lock, Share2, Zap } from 'lucide-react';

const features = [
    {
        icon: Zap,
        title: 'Lightning Fast',
        description: 'Upload files in seconds with our optimized cloud infrastructure.',
    },
    {
        icon: Lock,
        title: 'Secure Storage',
        description: 'Your files are encrypted and stored safely in AWS.',
    },
    {
        icon: Share2,
        title: 'Easy Sharing',
        description: 'Generate shareable links to collaborate with others instantly.',
    },
];

export function Features() {
    return (
        <section className="w-full py-20 px-4 sm:px-6 lg:px-8 bg-secondary/30">
            <div className="max-w-6xl mx-auto">
                
                <div className="text-center mb-16">
                    <h2 className="text-3xl sm:text-4xl font-bold text-primary mb-4">
                        Why Choose FileVault?
                    </h2>
                    <p className="text-primary/60 text-lg">Everything you need for file management</p>
                </div>

                <div className="grid md:grid-cols-3 gap-8">
                    {features.map((feature) => {
                        const Icon = feature.icon;
                        return (
                            <div
                            key={feature.title}
                            className="p-8 bg-background rounded-lg border border-border hover:border-primary/30 transition-colors"
                            >
                                <Icon className="w-8 h-8 text-primary mb-4" />
                                <h3 className="text-xl font-bold text-primary mb-2">{feature.title}</h3>
                                <p className="text-primary/60">{feature.description}</p>
                            </div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}
