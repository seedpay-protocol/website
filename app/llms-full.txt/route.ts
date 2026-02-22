import { getLLMText, source } from '@/lib/source';

export const revalidate = false;

export async function GET() {
  const pages = source.getPages();
  const results = await Promise.all(pages.map(getLLMText));
  return new Response(results.join('\n\n---\n\n'));
}
