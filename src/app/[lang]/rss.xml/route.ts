import { redirect } from 'next/navigation';

interface RouteParams {
  params: Promise<{ lang: string }>;
}

// Redirect old RSS route to new API endpoint
export async function GET(_request: Request, { params }: RouteParams) {
  const { lang } = await params;
  redirect(`/api/rss/${lang}`);
}