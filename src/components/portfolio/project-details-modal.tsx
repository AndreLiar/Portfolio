import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CheckCircle, Code, Cpu, ExternalLink, FileText, Layers, Lightbulb, ShieldCheck, Terminal } from "lucide-react";

interface ProjectDetailsModalProps {
    project: any;
    isOpen: boolean;
    onClose: () => void;
}

export function ProjectDetailsModal({ project, isOpen, onClose }: ProjectDetailsModalProps) {
    if (!project) return null;

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="w-full max-w-4xl h-[90vh] flex flex-col p-0 gap-0 bg-background/95 backdrop-blur-xl border-border/50">
                <DialogHeader className="p-4 sm:p-6 pb-4 border-b border-border/50">
                    <div className="flex items-start justify-between gap-4">
                        <div>
                            <DialogTitle className="text-2xl font-bold font-headline mb-2">{project.title}</DialogTitle>
                            <DialogDescription className="text-base">
                                {project.oneLinePitch || project.purpose}
                            </DialogDescription>
                        </div>
                    </div>
                    <div className="flex flex-wrap gap-2 mt-4">
                        {project.stack?.map((tech: string) => (
                            <Badge key={tech} variant="secondary" className="text-xs">
                                {tech}
                            </Badge>
                        ))}
                    </div>
                </DialogHeader>

                <ScrollArea className="flex-1 p-4 sm:p-6">
                    <Tabs defaultValue="overview" className="w-full">
                        <TabsList className={`grid w-full mb-8 h-auto gap-1 ${project.screenshots?.length ? 'grid-cols-3 sm:grid-cols-5' : 'grid-cols-2 sm:grid-cols-4'}`}>
                            <TabsTrigger value="overview">Overview</TabsTrigger>
                            <TabsTrigger value="technical">Technical</TabsTrigger>
                            <TabsTrigger value="process">Process</TabsTrigger>
                            <TabsTrigger value="impact">Impact</TabsTrigger>
                            {project.screenshots?.length > 0 && (
                                <TabsTrigger value="proof">Live Proof</TabsTrigger>
                            )}
                        </TabsList>

                        <TabsContent value="overview" className="space-y-8">
                            {/* Why It Matters */}
                            {project.whyItMatters && (
                                <section>
                                    <h3 className="text-lg font-semibold mb-3 flex items-center gap-2 text-primary">
                                        <Lightbulb className="w-5 h-5" /> Why It Matters
                                    </h3>
                                    <p className="text-muted-foreground leading-relaxed">{project.whyItMatters}</p>
                                </section>
                            )}

                            {/* Differentiators */}
                            {project.differentiators && (
                                <section>
                                    <h3 className="text-lg font-semibold mb-3 flex items-center gap-2 text-primary">
                                        <Layers className="w-5 h-5" /> Key Differentiators
                                    </h3>
                                    <ul className="grid sm:grid-cols-2 gap-3">
                                        {project.differentiators.map((item: string, i: number) => (
                                            <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                                                <CheckCircle className="w-4 h-4 text-primary mt-0.5 shrink-0" />
                                                <span>{item}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </section>
                            )}

                            {/* Features (Original) */}
                            <section>
                                <h3 className="text-lg font-semibold mb-3 flex items-center gap-2 text-primary">
                                    <FileText className="w-5 h-5" /> Core Features
                                </h3>
                                <ul className="grid sm:grid-cols-2 gap-3">
                                    {project.features?.map((feature: string, i: number) => (
                                        <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                                            <CheckCircle className="w-4 h-4 text-primary mt-0.5 shrink-0" />
                                            <span>{feature}</span>
                                        </li>
                                    ))}
                                </ul>
                            </section>
                        </TabsContent>

                        <TabsContent value="technical" className="space-y-8">
                            {/* Architecture */}
                            {project.architecture && (
                                <section>
                                    <h3 className="text-lg font-semibold mb-3 flex items-center gap-2 text-primary">
                                        <Cpu className="w-5 h-5" /> Architecture
                                    </h3>
                                    <ul className="space-y-2">
                                        {project.architecture.map((item: string, i: number) => (
                                            <li key={i} className="text-sm text-muted-foreground p-3 bg-muted/30 rounded-lg border border-border/50">
                                                {item}
                                            </li>
                                        ))}
                                    </ul>
                                </section>
                            )}

                            {/* Repo Blueprint */}
                            {project.repoBlueprint && (
                                <section>
                                    <h3 className="text-lg font-semibold mb-3 flex items-center gap-2 text-primary">
                                        <Code className="w-5 h-5" /> Repository Structure
                                    </h3>
                                    <pre className="bg-muted/50 p-4 rounded-lg overflow-x-auto text-xs font-mono border border-border/50">
                                        {project.repoBlueprint}
                                    </pre>
                                </section>
                            )}

                            {/* ATS Keywords */}
                            {project.atsKeywords && (
                                <section>
                                    <h3 className="text-lg font-semibold mb-3 flex items-center gap-2 text-primary">
                                        <Terminal className="w-5 h-5" /> Key Technologies
                                    </h3>
                                    <div className="flex flex-wrap gap-2">
                                        {project.atsKeywords.map((keyword: string) => (
                                            <Badge key={keyword} variant="outline" className="font-mono text-xs">
                                                {keyword}
                                            </Badge>
                                        ))}
                                    </div>
                                </section>
                            )}
                        </TabsContent>

                        <TabsContent value="process" className="space-y-8">
                            {/* Scope / Feature Set */}
                            {project.scope && (
                                <section>
                                    <h3 className="text-lg font-semibold mb-3 flex items-center gap-2 text-primary">
                                        <Layers className="w-5 h-5" /> Scope & Evolution
                                    </h3>
                                    <ul className="space-y-2">
                                        {project.scope.map((item: string, i: number) => (
                                            <li key={i} className="text-sm text-muted-foreground flex gap-2">
                                                <span className="w-1.5 h-1.5 rounded-full bg-primary mt-2 shrink-0" />
                                                {item}
                                            </li>
                                        ))}
                                    </ul>
                                </section>
                            )}

                            {/* Test Plan */}
                            {project.testPlan && (
                                <section>
                                    <h3 className="text-lg font-semibold mb-3 flex items-center gap-2 text-primary">
                                        <ShieldCheck className="w-5 h-5" /> Quality Assurance
                                    </h3>
                                    <ul className="space-y-2">
                                        {project.testPlan.map((item: string, i: number) => (
                                            <li key={i} className="text-sm text-muted-foreground flex gap-2">
                                                <span className="w-1.5 h-1.5 rounded-full bg-primary mt-2 shrink-0" />
                                                {item}
                                            </li>
                                        ))}
                                    </ul>
                                </section>
                            )}
                        </TabsContent>

                        <TabsContent value="impact" className="space-y-8">
                            {/* Impact (Original + Enhanced) */}
                            <section>
                                <h3 className="text-lg font-semibold mb-3 flex items-center gap-2 text-primary">
                                    <Lightbulb className="w-5 h-5" /> Business Impact
                                </h3>
                                <p className="text-muted-foreground leading-relaxed mb-4">{project.impact}</p>
                            </section>

                            {/* Interview Talking Points */}
                            {project.interviewTalkingPoints && (
                                <section>
                                    <h3 className="text-lg font-semibold mb-3 flex items-center gap-2 text-primary">
                                        <BotMessageSquare className="w-5 h-5" /> Key Challenges & Solutions
                                    </h3>
                                    <ul className="space-y-3">
                                        {project.interviewTalkingPoints.map((point: string, i: number) => (
                                            <li key={i} className="text-sm text-muted-foreground p-3 bg-primary/5 rounded-lg border border-primary/10">
                                                {point}
                                            </li>
                                        ))}
                                    </ul>
                                </section>
                            )}
                        </TabsContent>

                        {/* Live Proof tab — screenshots + live links */}
                        {project.screenshots?.length > 0 && (
                            <TabsContent value="proof" className="space-y-8">
                                <section>
                                    <h3 className="text-lg font-semibold mb-2 flex items-center gap-2 text-primary">
                                        <ShieldCheck className="w-5 h-5" /> Live System Evidence
                                    </h3>
                                    <p className="text-sm text-muted-foreground mb-6">
                                        Screenshots and live endpoints from the running production system — not mocked, not demo data.
                                    </p>
                                    <div className="space-y-8">
                                        {project.screenshots.map((s: { title: string; caption: string; src: string; link?: string }, i: number) => (
                                            <div key={i} className="rounded-xl border border-border/50 overflow-hidden bg-muted/20">
                                                <img
                                                    src={s.src}
                                                    alt={s.title}
                                                    className="w-full object-cover"
                                                    loading="lazy"
                                                />
                                                <div className="p-4 flex items-start justify-between gap-3">
                                                    <div>
                                                        <p className="font-semibold text-sm">{s.title}</p>
                                                        <p className="text-xs text-muted-foreground mt-1">{s.caption}</p>
                                                    </div>
                                                    {s.link && (
                                                        <a
                                                            href={s.link}
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                            className="shrink-0 flex items-center gap-1 text-xs text-primary hover:underline"
                                                        >
                                                            <ExternalLink className="w-3 h-3" /> Live
                                                        </a>
                                                    )}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </section>

                                {/* Live endpoints */}
                                {project.liveEndpoints && (
                                    <section>
                                        <h3 className="text-lg font-semibold mb-3 flex items-center gap-2 text-primary">
                                            <Terminal className="w-5 h-5" /> Live Endpoints
                                        </h3>
                                        <div className="space-y-3">
                                            {project.liveEndpoints.map((ep: { label: string; command: string; url: string }, i: number) => (
                                                <div key={i} className="rounded-lg border border-border/50 p-3 bg-muted/30">
                                                    <div className="flex items-center justify-between mb-2">
                                                        <span className="text-xs font-semibold text-primary">{ep.label}</span>
                                                        <a href={ep.url} target="_blank" rel="noopener noreferrer"
                                                            className="text-xs text-muted-foreground hover:text-primary flex items-center gap-1">
                                                            <ExternalLink className="w-3 h-3" /> Open
                                                        </a>
                                                    </div>
                                                    <pre className="text-xs font-mono text-muted-foreground overflow-x-auto">{ep.command}</pre>
                                                </div>
                                            ))}
                                        </div>
                                    </section>
                                )}
                            </TabsContent>
                        )}
                    </Tabs>
                </ScrollArea>
            </DialogContent>
        </Dialog>
    );
}

// Helper icon component
function BotMessageSquare(props: any) {
    return (
        <svg
            {...props}
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <path d="M12 6V2H8" />
            <path d="m8 18-4 4V8a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2Z" />
            <path d="M2 12h2" />
            <path d="M9 11v2" />
            <path d="M15 11v2" />
            <path d="M20 12h2" />
        </svg>
    )
}
