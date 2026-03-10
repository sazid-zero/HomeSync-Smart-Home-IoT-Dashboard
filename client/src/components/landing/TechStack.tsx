import React from 'react';
import { 
    SiReact, 
    SiTypescript, 
    SiNodedotjs, 
    SiPostgresql, 
    SiTailwindcss, 
    SiVite, 
    SiDocker, 
    SiSocketdotio, 
    SiExpress, 
    SiChartdotjs,
    SiJavascript,
    SiMongodb,
    SiRedis,
    SiPrisma
} from 'react-icons/si';

const techs = [
    { name: 'React', icon: SiReact, color: '#61DAFB', size: 'large', rotation: '-2deg' },
    { name: 'TypeScript', icon: SiTypescript, color: '#3178C6', size: 'small', rotation: '1deg' },
    { name: 'Node.js', icon: SiNodedotjs, color: '#339933', size: 'medium', rotation: '-1deg' },
    { name: 'PostgreSQL', icon: SiPostgresql, color: '#4169E1', size: 'large', rotation: '2deg' },
    { name: 'Tailwind CSS', icon: SiTailwindcss, color: '#06B6D4', size: 'small', rotation: '-3deg' },
    { name: 'Vite', icon: SiVite, color: '#646CFF', size: 'medium', rotation: '1deg' },
    { name: 'Docker', icon: SiDocker, color: '#2496ED', size: 'large', rotation: '-2deg' },
    { name: 'Socket.io', icon: SiSocketdotio, color: '#010101', size: 'small', rotation: '3deg' },
    { name: 'Express', icon: SiExpress, color: '#000000', size: 'medium', rotation: '-1deg' },
    { name: 'Chart.js', icon: SiChartdotjs, color: '#FF6384', size: 'large', rotation: '2deg' },
    { name: 'JavaScript', icon: SiJavascript, color: '#F7DF1E', size: 'small', rotation: '-1deg' },
    { name: 'MongoDB', icon: SiMongodb, color: '#47A248', size: 'medium', rotation: '1deg' },
    { name: 'Redis', icon: SiRedis, color: '#DC382D', size: 'small', rotation: '-2deg' },
    { name: 'Prisma', icon: SiPrisma, color: '#2D3748', size: 'medium', rotation: '1deg' },
];

export const TechStack: React.FC = () => {
    // Split techs into two rows
    const row1 = techs.slice(0, Math.ceil(techs.length / 2));
    const row2 = techs.slice(Math.ceil(techs.length / 2));

    // Duplicate for infinite scroll
    const doubledRow1 = [...row1, ...row1, ...row1];
    const doubledRow2 = [...row2, ...row2, ...row2];

    return (
        <section className="py-24 theme-bg-secondary overflow-hidden">
            <div className="max-w-7xl mx-auto px-6 mb-16 text-center lg:text-left">
                <h2 className="text-xs font-bold text-cyan-500 uppercase tracking-[0.4em] mb-4">The Engine Room</h2>
                <h3 className="text-4xl md:text-5xl font-black theme-text-primary tracking-tight">
                    Powered by a <br />
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-500 to-blue-600">Premium Tech Fabric.</span>
                </h3>
            </div>

            <div className="space-y-4">
                {/* Row 1: Scrolling Left */}
                <div className="relative flex overflow-x-hidden">
                    <div className="flex animate-scroll-left whitespace-nowrap py-4">
                        {doubledRow1.map((tech, index) => {
                            const Icon = tech.icon;
                            const sizeClasses = {
                                small: 'w-40 h-28',
                                medium: 'w-60 h-36',
                                large: 'w-80 h-44'
                            }[tech.size as 'small' | 'medium' | 'large'];

                            return (
                                <div 
                                    key={index}
                                    className={`flex-shrink-0 mx-4 ${sizeClasses} rounded-[2.5rem] border theme-border bg-cyan-500/[0.03] p-8 flex flex-col justify-between group hover:border-cyan-500 transition-all duration-700 hover:scale-110 shadow-xl theme-shadow cursor-default`}
                                    style={{ transform: `rotate(${tech.rotation})` }}
                                >
                                    <div className="flex justify-between items-start">
                                        <div className="w-12 h-12 flex items-center justify-center group-hover:scale-110 transition-transform relative z-10">
                                            <Icon className="text-2xl transition-all group-hover:scale-110" style={{ color: tech.color }} />
                                        </div>
                                        <div className="w-2 h-2 rounded-full bg-cyan-500/20 group-hover:bg-cyan-500 animate-pulse"></div>
                                    </div>
                                    <div>
                                        <h4 className="text-sm font-black theme-text-primary tracking-tight">{tech.name}</h4>
                                        <p className="text-[10px] theme-text-tertiary uppercase font-bold tracking-widest mt-1">Industrial Grade</p>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* Row 2: Scrolling Right */}
                <div className="relative flex overflow-x-hidden">
                    <div className="flex animate-scroll-right whitespace-nowrap py-4">
                        {doubledRow2.map((tech, index) => {
                            const Icon = tech.icon;
                            const sizeClasses = {
                                small: 'w-40 h-28',
                                medium: 'w-60 h-36',
                                large: 'w-80 h-44'
                            }[tech.size as 'small' | 'medium' | 'large'];

                            return (
                                <div 
                                    key={index}
                                    className={`flex-shrink-0 mx-4 ${sizeClasses} rounded-[2.5rem] border theme-border bg-cyan-500/[0.03] p-8 flex flex-col justify-between group hover:border-cyan-500 transition-all duration-700 hover:scale-110 shadow-xl theme-shadow cursor-default`}
                                    style={{ transform: `rotate(${tech.rotation})` }}
                                >
                                    <div className="flex justify-between items-start">
                                        <div className="w-12 h-12 flex items-center justify-center group-hover:scale-110 transition-transform relative z-10">
                                            <Icon className="text-2xl transition-all group-hover:scale-110" style={{ color: tech.color }} />
                                        </div>
                                        <div className="w-2 h-2 rounded-full bg-cyan-500/20 group-hover:bg-cyan-500 animate-pulse"></div>
                                    </div>
                                    <div>
                                        <h4 className="text-sm font-black theme-text-primary tracking-tight">{tech.name}</h4>
                                        <p className="text-[10px] theme-text-tertiary uppercase font-bold tracking-widest mt-1">Industrial Grade</p>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>

            <style dangerouslySetInnerHTML={{ __html: `
                @keyframes scroll-left {
                    0% { transform: translateX(0); }
                    100% { transform: translateX(-33.33%); }
                }
                @keyframes scroll-right {
                    0% { transform: translateX(-33.33%); }
                    100% { transform: translateX(0); }
                }
                .animate-scroll-left {
                    animation: scroll-left 50s linear infinite;
                }
                .animate-scroll-right {
                    animation: scroll-right 50s linear infinite;
                }
                .animate-scroll-left:hover, .animate-scroll-right:hover {
                    animation-play-state: paused;
                }
            ` }} />
        </section>
    );
};
