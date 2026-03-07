import { getDictionary } from '@/lib/dictionaries';
import { ResumeView } from '@/components/portfolio/resume-view';
import { Metadata } from 'next';

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
    const { lang } = await params;
    const dictionary = await getDictionary(lang);
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://andre-portfolio.vercel.app';
    const title = `${dictionary.data.fullName ?? dictionary.data.name} - Resume`;
    const description = `Professional resume of ${dictionary.data.fullName ?? dictionary.data.name} — ${dictionary.data.title}. Experience, skills, projects, and education.`;

    return {
        title,
        description,
        openGraph: {
            type: 'website',
            locale: lang,
            url: `${baseUrl}/${lang}/resume`,
            siteName: dictionary.Metadata?.title ?? title,
            title,
            description,
        },
        twitter: {
            card: 'summary_large_image',
            title,
            description,
        },
        alternates: {
            canonical: `${baseUrl}/${lang}/resume`,
        },
    };
}

export default async function ResumePage({ params }: { params: Promise<{ lang: string }> }) {
    const { lang } = await params;
    const dictionary = await getDictionary(lang);
    const resumeLabels = (dictionary as any).Resume
        ? {
            printSavePdf: (dictionary as any).Resume.printSavePdf,
            downloadPdf: (dictionary as any).Resume.downloadPdf,
            downloading: (dictionary as any).Resume.downloading,
            backToHome: (dictionary as any).Resume.backToHome,
            openInNewTab: (dictionary as any).Resume.openInNewTab,
        }
        : undefined;

    return <ResumeView data={dictionary} lang={lang} labels={resumeLabels} />;
}
