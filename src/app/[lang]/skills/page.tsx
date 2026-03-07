import { getDictionary } from '@/lib/dictionaries';
import { Locale } from '@/i18n-config';
import { SkillCard } from '@/components/portfolio/skill-card';
import { SkillsPageHeader } from '@/components/portfolio/skills-page-header';
import { getIconComponent } from '@/lib/icon-constants';

export default async function SkillsPage({
    params,
}: {
    params: Promise<{ lang: Locale }>;
}) {
    const { lang } = await params;
    const dict = await getDictionary(lang);
    const { data } = dict;

    const skillsWithIcons = data.skills.map((skill: any) => ({
        ...skill,
        Icon: getIconComponent(skill.Icon),
    }));

    return (
        <div className="min-h-screen bg-background">
            <SkillsPageHeader lang={lang} />
            <div className="container mx-auto px-4 py-12">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {skillsWithIcons.map((skillCategory: any, index: number) => (
                        <SkillCard
                            key={index}
                            title={skillCategory.title}
                            description={skillCategory.description}
                            skills={skillCategory.skills}
                            subcategories={skillCategory.subcategories}
                            Icon={skillCategory.Icon}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
}
