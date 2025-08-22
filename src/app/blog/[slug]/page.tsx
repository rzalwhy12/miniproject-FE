import React from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { blogPosts } from '@/helper/blogData';

export const dynamic = 'force-static';

export function generateStaticParams() {
  return blogPosts.map((p) => ({ slug: p.slug }));
}

function formatDate(date: string) {
  try {
    return new Date(date).toLocaleDateString('id-ID', { weekday: 'long', day: '2-digit', month: 'long', year: 'numeric' });
  } catch {
    return date;
  }
}

const BlogDetailPage = async ({ params }: { params: Promise<{ slug: string }> }) => {
  const { slug } = await params;
  const post = blogPosts.find((p) => p.slug === slug);
  if (!post) return notFound();

  return (
    <div className="max-w-3xl mx-auto py-10 px-3 sm:px-4">
      <nav className="mb-6 text-sm">
        <Link href="/blog" className="text-pink-600 hover:underline">← Kembali ke Blog</Link>
      </nav>

      <article>
        <h1 className="text-3xl sm:text-4xl font-bold leading-tight">{post.title}</h1>
        <div className="text-gray-500 mt-2 text-sm sm:text-base">
          {formatDate(post.date)} · {post.author}
        </div>
        <div className="mt-5 rounded-2xl overflow-hidden border border-gray-200">
          <img src={post.coverImage} alt={post.title} className="w-full aspect-[16/9] object-cover" />
        </div>
        <div className="prose prose-pink max-w-none mt-6">
          {post.content.map((para, idx) => (
            <p key={idx} className="text-gray-800 leading-relaxed text-base sm:text-lg">{para}</p>
          ))}
        </div>

        {post.tags?.length > 0 && (
          <div className="mt-8 flex flex-wrap gap-2">
            {post.tags.map((t) => (
              <span key={t} className="text-xs bg-pink-50 text-pink-700 px-2.5 py-1 rounded-full border border-pink-200">#{t}</span>
            ))}
          </div>
        )}
      </article>
    </div>
  );
};

export default BlogDetailPage;
