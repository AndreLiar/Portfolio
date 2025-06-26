import { redirect } from 'next/navigation';

// This page redirects to the root page, as the [locale] route is no longer used.
export default function ObsoleteLocalePage() {
  redirect('/');
}
