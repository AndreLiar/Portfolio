// This is the root layout. It does not contain language-specific metadata.
// The layout in [lang]/layout.tsx will handle the <html> and <body> tags.

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
