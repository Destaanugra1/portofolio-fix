import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router';
import { Clock, ArrowLeft, ChevronRight } from 'lucide-react';
import { Helmet } from 'react-helmet-async';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';
const CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME || '';

type BlogPost = {
  id: number;
  title: string;
  slug: string;
  excerpt: string | null;
  content: string | null;
  coverImageUrl: string | null;
  authorName: string;
  publishedAt: string | null;
  createdAt: string;
  categoryName: string | null;
  categorySlug: string | null;
  categoryIcon: string | null;
  categoryColor: string | null;
};

type RelatedPost = {
  slug: string;
  title: string;
  coverImageUrl: string | null;
  publishedAt: string | null;
  createdAt: string;
  categoryName: string | null;
  categoryIcon: string | null;
  categoryColor: string | null;
};

function imageUrl(url: string | null) {
  if (!url) return '';
  if (url.startsWith('http')) return url;
  if (CLOUD_NAME) return `https://res.cloudinary.com/${CLOUD_NAME}/image/upload/c_fill,w_1400,h_800/${url}`;
  return url;
}

function formatDate(d: string | null) {
  if (!d) return '';
  return new Date(d).toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
}

function stripHtml(html: string) {
  return html.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();
}

export function BlogDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const [post, setPost] = useState<BlogPost | null>(null);
  const [related, setRelated] = useState<RelatedPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    if (!slug) return;
    window.scrollTo(0, 0);

    const fetchPost = async () => {
      setLoading(true);
      setNotFound(false);
      try {
        const res = await fetch(`${API_URL}/blog/posts/${slug}`);
        if (!res.ok) { setNotFound(true); return; }
        const data = await res.json();
        setPost(data);

        // Fetch related posts from same category
        if (data.categorySlug) {
          const relRes = await fetch(`${API_URL}/blog/posts?status=published&category=${data.categorySlug}&pageSize=3`);
          const relData = await relRes.json();
          setRelated((relData.data ?? []).filter((p: any) => p.slug !== slug));
        }
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    fetchPost();
  }, [slug]);

  if (loading) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-12 space-y-6">
        <div className="h-10 w-2/3 rounded-xl animate-pulse" style={{ background: 'var(--surface)' }} />
        <div className="h-64 w-full rounded-2xl animate-pulse" style={{ background: 'var(--surface)' }} />
        {[1, 2, 3, 4].map(i => (
          <div key={i} className="h-4 rounded animate-pulse" style={{ background: 'var(--surface)', width: `${80 + Math.random() * 20}%` }} />
        ))}
      </div>
    );
  }

  if (notFound || !post) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-20 text-center">
        <div className="text-6xl mb-4">📭</div>
        <h1 className="text-2xl font-black mb-2" style={{ color: 'var(--text1)' }}>Artikel Tidak Ditemukan</h1>
        <p className="text-sm mb-6" style={{ color: 'var(--text2)' }}>Artikel yang kamu cari mungkin sudah dihapus atau URL tidak valid.</p>
        <Link to="/blog" className="inline-flex items-center gap-2 bg-[#b91c1c] text-white px-5 py-2.5 rounded-xl font-bold text-sm hover:bg-red-700 transition-colors">
          <ArrowLeft size={14} /> Kembali ke Blog
        </Link>
      </div>
    );
  }

  const pageTitle = post.title ? `${post.title} | Desta Anugra Pratama` : 'Blog | Desta Anugra Pratama';
  const pageDescription =
    post.excerpt ?? (post.content ? stripHtml(post.content).slice(0, 160) : '');
  const pageImage = post.coverImageUrl ? imageUrl(post.coverImageUrl) : '';
  const pageUrl = typeof window !== 'undefined' ? window.location.href : '';

  return (
    <div className="min-h-screen pb-20" style={{ background: 'var(--bg)', transition: 'background 0.4s' }}>
      <Helmet>
        <title>{pageTitle}</title>
        {pageDescription && <meta name="description" content={pageDescription} />}
        <meta property="og:title" content={post.title} />
        {pageDescription && <meta property="og:description" content={pageDescription} />}
        {pageImage && <meta property="og:image" content={pageImage} />}
        {pageUrl && <meta property="og:url" content={pageUrl} />}
        <meta property="og:type" content="article" />
        <meta name="twitter:card" content={pageImage ? 'summary_large_image' : 'summary'} />
        <meta name="twitter:title" content={post.title} />
        {pageDescription && <meta name="twitter:description" content={pageDescription} />}
        {pageImage && <meta name="twitter:image" content={pageImage} />}
      </Helmet>
      <div className="max-w-3xl mx-auto px-4 py-8">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-1.5 text-xs mb-6" style={{ color: 'var(--text2)' }}>
          <Link to="/" className="hover:text-[#b91c1c] transition-colors">Home</Link>
          <ChevronRight size={12} />
          <Link to="/blog" className="hover:text-[#b91c1c] transition-colors">Blog</Link>
          {post.categoryName && (
            <>
              <ChevronRight size={12} />
              <Link to={`/blog?category=${post.categorySlug}`} className="hover:text-[#b91c1c] transition-colors">
                {post.categoryIcon} {post.categoryName}
              </Link>
            </>
          )}
          <ChevronRight size={12} />
          <span className="truncate max-w-[140px]">{post.title}</span>
        </nav>

        {/* Category badge */}
        {post.categoryName && (
          <Link
            to={`/blog?category=${post.categorySlug}`}
            className="inline-flex items-center gap-1 text-[11px] font-bold tracking-widest uppercase px-3 py-1 rounded-full mb-4 transition-opacity hover:opacity-80"
            style={{ background: (post.categoryColor ?? '#b91c1c') + '22', color: post.categoryColor ?? '#b91c1c' }}
          >
            {post.categoryIcon} {post.categoryName}
          </Link>
        )}

        {/* Title */}
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-black leading-tight mb-4" style={{ color: 'var(--text1)' }}>
          {post.title}
        </h1>

        {/* Meta */}
        <div className="flex items-center gap-4 mb-8 pb-4 border-b" style={{ borderColor: 'color-mix(in srgb, var(--text2) 15%, transparent)' }}>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-[#b91c1c]/20 flex items-center justify-center text-sm font-black text-[#b91c1c]">
              {post.authorName.charAt(0)}
            </div>
            <span className="text-sm font-medium" style={{ color: 'var(--text1)' }}>{post.authorName}</span>
          </div>
          <span style={{ color: 'var(--text2)', opacity: 0.4 }}>—</span>
          <span className="text-sm flex items-center gap-1.5" style={{ color: 'var(--text2)' }}>
            <Clock size={13} /> {formatDate(post.publishedAt ?? post.createdAt)}
          </span>
        </div>

        {/* Cover image */}
        {post.coverImageUrl && (
          <div className="w-full aspect-[16/9] rounded-2xl overflow-hidden mb-8 shadow-2xl">
            <img src={imageUrl(post.coverImageUrl)} alt={post.title} className="w-full h-full object-cover" />
          </div>
        )}

        {/* Excerpt */}
        {post.excerpt && (
          <p className="text-lg font-medium leading-relaxed mb-6 italic border-l-4 border-[#b91c1c] pl-4" style={{ color: 'var(--text2)' }}>
            {post.excerpt}
          </p>
        )}

        {/* Content */}
        {post.content ? (
          <div
            className="prose prose-sm max-w-none blog-content"
            style={{ color: 'var(--text1)' }}
            dangerouslySetInnerHTML={{ __html: post.content }}
          />
        ) : (
          <p className="text-sm text-center py-10" style={{ color: 'var(--text2)' }}>Konten tidak tersedia.</p>
        )}

        {/* Back button */}
        <div className="mt-10 pt-6 border-t" style={{ borderColor: 'color-mix(in srgb, var(--text2) 12%, transparent)' }}>
          <Link
            to="/blog"
            className="inline-flex items-center gap-2 text-sm font-semibold hover:text-[#b91c1c] transition-colors"
            style={{ color: 'var(--text2)' }}
          >
            <ArrowLeft size={15} /> Kembali ke Blog
          </Link>
        </div>

        {/* Related posts */}
        {related.length > 0 && (
          <div className="mt-10">
            <h2 className="text-base font-bold mb-4" style={{ color: 'var(--text1)' }}>
              Artikel Terkait
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {related.slice(0, 3).map(r => (
                <Link key={r.slug} to={`/blog/${r.slug}`} className="group block">
                  <div className="w-full h-36 rounded-xl overflow-hidden mb-2" style={{ background: 'var(--surface)' }}>
                    {r.coverImageUrl ? (
                      <img
                        src={imageUrl(r.coverImageUrl)}
                        alt={r.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-3xl">
                        {r.categoryIcon ?? '📰'}
                      </div>
                    )}
                  </div>
                  {r.categoryName && (
                    <span className="text-[10px] font-bold uppercase" style={{ color: r.categoryColor ?? '#b91c1c' }}>
                      {r.categoryIcon} {r.categoryName}
                    </span>
                  )}
                  <p className="text-sm font-bold leading-snug group-hover:text-[#b91c1c] transition-colors mt-0.5 line-clamp-2" style={{ color: 'var(--text1)' }}>
                    {r.title}
                  </p>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Blog content prose CSS */}
      <style>{`
        .blog-content h1, .blog-content h2, .blog-content h3 {
          font-weight: 800; margin-top: 1.5em; margin-bottom: 0.5em; color: var(--text1);
        }
        .blog-content h2 { font-size: 1.3rem; }
        .blog-content h3 { font-size: 1.1rem; }
        .blog-content p { line-height: 1.85; margin-bottom: 1em; color: var(--text1); }
        .blog-content a { color: #b91c1c; text-decoration: underline; }
        .blog-content ul, .blog-content ol { padding-left: 1.5em; margin-bottom: 1em; }
        .blog-content li { margin-bottom: 0.25em; line-height: 1.7; }
        .blog-content blockquote {
          border-left: 4px solid #b91c1c; padding-left: 1em;
          margin: 1.5em 0; color: var(--text2); font-style: italic;
        }
        .blog-content img { max-width: 100%; border-radius: 0.75rem; margin: 1.5em 0; }
        .blog-content code {
          background: color-mix(in srgb, var(--text2) 12%, transparent);
          padding: 0.15em 0.4em; border-radius: 0.3em;
          font-family: monospace; font-size: 0.9em;
        }
        .blog-content pre {
          background: color-mix(in srgb, var(--surface) 80%, black);
          padding: 1em; border-radius: 0.75rem; overflow-x: auto; margin: 1.5em 0;
        }
        .blog-content hr { border-color: color-mix(in srgb, var(--text2) 20%, transparent); margin: 2em 0; }
      `}</style>
    </div>
  );
}
