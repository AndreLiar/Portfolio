import { LanguageForm } from '@/components/admin/language-form';

export default function NewLanguagePage() {
  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Create New Language</h1>
      <LanguageForm mode="create" />
    </div>
  );
}
