import {
  Code,
  Cloud,
  Database,
  BrainCircuit,
  BotMessageSquare,
  Type,
} from 'lucide-react';

import { MainContent } from '@/components/portfolio/main-content';
import messages from '../../messages/en.json';

const iconMap: { [key: string]: React.ElementType } = {
  Code,
  Cloud,
  Database,
  BrainCircuit,
  BotMessageSquare,
  Type,
};

export default function Home() {
  const skillsWithIcons = messages.data.skills.map((skill: any) => ({
    ...skill,
    Icon: iconMap[skill.Icon],
  }));

  return (
    <MainContent
      messages={messages}
      skillsWithIcons={skillsWithIcons}
    />
  );
}
