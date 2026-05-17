import { Button } from '@/components/ui/button';
import { Upload } from 'lucide-react';

export function Hero() {
    return (
        <section className="w-full py-20 px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto text-center">

                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-primary mb-6">
                    Simple File Upload
                </h1>

                <p className="text-lg sm:text-xl text-primary/70 mb-12 max-w-2xl mx-auto">
                    Upload, store, and manage your files securely in the cloud. Fast, reliable, and easy to use.
                </p>

                <div className="mb-12">
                    <div className="border-2 border-dashed border-primary/30 rounded-lg p-12 hover:border-primary/60 transition-colors cursor-pointer bg-secondary/30">
                        <Upload className="w-12 h-12 text-primary/50 mx-auto mb-4" />
                        <p className="text-primary mb-2 font-medium">Drag and drop your files here</p>
                        <p className="text-primary/60 text-sm">or click to browse</p>
                    </div>
                </div>

                <Button className="bg-primary text-primary-foreground hover:bg-primary/90 px-8 py-6 text-lg">
                    Get Started
                </Button>
                
            </div>
        </section>
    );
}
