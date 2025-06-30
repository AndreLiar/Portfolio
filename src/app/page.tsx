import { redirect } from 'next/navigation';

// This page just redirects to the default language.
export default function RootPage() {
  redirect('/en');
}
