export default async function Page({ params }: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const { default: LegalDocument } = await import(`@/content/${slug}.mdx`);

  return <LegalDocument />;
}

export function generateStaticParams() {
  return [
    { slug: "terms-of-service" },
    { slug: "privacy-policy" },
    { slug: "security-policy" },
  ];
}

export const dynamicParams = false;
