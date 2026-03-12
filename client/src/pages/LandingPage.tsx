import React, { useEffect } from 'react';
import Lenis from 'lenis';
import { LandingNavbar } from '../components/landing/LandingNavbar.tsx';
import { Hero } from '../components/landing/Hero.tsx';
import { BentoFeatures } from '../components/landing/BentoFeatures.tsx';
import { CreativeGraphics } from '../components/landing/CreativeGraphics.tsx';
import { CTASection, LandingFooter } from '../components/landing/CTAFooter.tsx';
import { TechStack } from '../components/landing/TechStack.tsx';

const LandingPage: React.FC = () => {
    useEffect(() => {
        const lenis = new Lenis({
            autoRaf: true,
        });

        // Uncomment if you want to use manual raf
        // function raf(time: number) {
        //     lenis.raf(time);
        //     requestAnimationFrame(raf);
        // }
        // requestAnimationFrame(raf);

        return () => {
            lenis.destroy();
        };
    }, []);

    return (
        <div className="min-h-screen theme-bg-primary overflow-x-hidden relative">
            <LandingNavbar />
            <Hero />
            <BentoFeatures />
            <CreativeGraphics />
            <CTASection />
            <TechStack />
            <LandingFooter />
        </div>
    );
};

export default LandingPage;
