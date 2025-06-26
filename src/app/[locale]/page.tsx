import { redirect } from 'next/navigation';

// This page permanently redirects any traffic from /en, /fr, etc. to the root homepage.
export default function LocalePage() {
  redirect('/');
}
