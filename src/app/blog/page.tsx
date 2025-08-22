import React from 'react';
import Link from 'next/link';
import { blogPosts } from '@/helper/blogData';

export const dynamic = 'force-static';

const BlogPage = () => {
  const sorted = [...blogPosts].sort((a, b) => +new Date(b.date) - +new Date(a.date));

  return (
    <div className="max-w-7xl mx-auto py-10 px-3 sm:px-4">
      <header className="mb-8">
        <h1 className="text-3xl sm:text-4xl font-bold tracking-tight">Blog</h1>
        <p className="text-gray-600 mt-2">Tips, panduan, dan tren seputar event dan ticketing.</p>
      </header>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
        {sorted.map((post) => (
          <Link href={`/blog/${post.slug}`} key={post.id} className="group">
            <article className="h-full rounded-2xl overflow-hidden border border-gray-200 shadow-sm hover:shadow-md transition-shadow bg-white flex flex-col">
              <div className="w-full overflow-hidden">
                <img
                  src={post.coverImage}
                  alt={post.title}
                  className="w-full aspect-[16/9] object-cover group-hover:scale-105 transition-transform"
                  loading="lazy"
                />
              </div>
              <div className="p-4 sm:p-5 flex-1 flex flex-col">
                <div className="text-xs text-gray-500">{new Date(post.date).toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' })}</div>
                <h2 className="text-lg sm:text-xl font-semibold mt-1 leading-snug line-clamp-2">{post.title}</h2>
                <p className="text-gray-600 text-sm sm:text-base mt-2 line-clamp-3">{post.excerpt}</p>
                <div className="mt-auto pt-3 text-pink-600 font-semibold">Baca selengkapnya →</div>
              </div>
            </article>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default BlogPage;
