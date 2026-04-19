import React, { useEffect, useState } from 'react';
import { Link } from 'react-router';
import { TrendingUp, Clock, ChevronRight, Mail, ArrowRight, Flame, Star, BarChart2 } from 'lucide-react';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';
const CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME || '';

type BlogPost = {
  id: number;
  title: string;
  slug: string;
  excerpt: string | null;
  coverImageUrl: string | null;
  authorName: string;
  isFeatured: boolean;
  isTrending: boolean;
  isPopular: boolean;
  status: 'published' | 'draft';
  publishedAt: string | null;
  createdAt: string;
  categoryName: string | null;
  categorySlug: string | null;
  categoryIcon: string | null;
  categoryColor: string | null;
};

type BlogCategory = {
  id: number;
  name: string;
  slug: string;
  icon: string;
  color: string;
  description: string | null;
};

type BlogSettings = Record<string, string | null>;

function imageUrl(url: string | null) {
  if (!url) return '';
  if (url.startsWith('http')) return url;
  if (CLOUD_NAME) return `https://res.cloudinary.com/${CLOUD_NAME}/image/upload/c_fill,w_1200,h_700/${url}`;
  return url;
}

function formatDate(d: string | null) {
  if (!d) return '';
  return new Date(d).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' });
}

function CategoryBadge({ name, icon, color }: { name: string; icon: string; color: string }) {
  return (
    <span
      className="inline-flex items-center gap-1 text-[10px] font-bold tracking-widest uppercase px-2 py-0.5 rounded-full"
      style={{ background: color + '22', color }}
    >
      {icon} {name}
    </span>
  );
}

// ─── Hero ──────────────────────────────────────────────────────────────────────
function HeroSection({ post }: { post: BlogPost | null }) {
  if (!post) return (
    <div className="w-full h-[480px] md:h-[600px] bg-gradient-to-br from-red-900/30 to-gray-900/50 animate-pulse rounded-2xl" />
  );

  return (
    <div className="relative w-full h-[480px] md:h-[600px] rounded-2xl overflow-hidden shadow-2xl group">
      {/* Background image */}
      {post.coverImageUrl ? (
        <img
          src={imageUrl(post.coverImageUrl)}
          alt={post.title}
          className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
        />
      ) : (
        <div className="absolute inset-0 bg-gradient-to-br from-red-900 to-gray-900" />
      )}

      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent" />

      {/* Content */}
      <div className="absolute inset-0 flex flex-col justify-end p-6 md:p-10">
        <div className="max-w-3xl space-y-4">
          {post.categoryName && (
            <CategoryBadge
              name={post.categoryName}
              icon={post.categoryIcon ?? '📰'}
              color={post.categoryColor ?? '#b91c1c'}
            />
          )}
          <h1 className="text-2xl md:text-4xl lg:text-5xl font-black text-white leading-tight">
            {post.title}
          </h1>
          {post.excerpt && (
            <p className="text-sm md:text-base text-white/75 leading-relaxed line-clamp-2 max-w-xl">
              {post.excerpt}
            </p>
          )}
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-full bg-white/20 flex items-center justify-center text-xs font-bold text-white">
                {post.authorName.charAt(0)}
              </div>
              <span className="text-white/80 text-sm">{post.authorName}</span>
            </div>
            <span className="text-white/40 text-xs">·</span>
            <div className="flex items-center gap-1 text-white/60 text-xs">
              <Clock size={12} />
              {formatDate(post.publishedAt ?? post.createdAt)}
            </div>
            <Link
              to={`/blog/${post.slug}`}
              className="ml-auto flex items-center gap-2 bg-[#b91c1c] hover:bg-red-700 text-white px-5 py-2.5 rounded-xl text-sm font-bold transition-all hover:-translate-y-0.5 shadow-lg shadow-red-900/40"
            >
              Baca Selengkapnya <ArrowRight size={14} />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Trending ─────────────────────────────────────────────────────────────────
function TrendingSection({ posts }: { posts: BlogPost[] }) {
  return (
    <section>
      <div className="flex items-center gap-2 mb-4">
        <Flame size={18} className="text-[#b91c1c]" />
        <h2 className="text-sm font-bold tracking-widest uppercase" style={{ color: 'var(--text2)' }}>
          Trending Hari Ini
        </h2>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {posts.slice(0, 3).map((post, i) => (
          <Link key={post.slug} to={`/blog/${post.slug}`} className="group relative rounded-xl overflow-hidden h-48 block shadow-lg">
            {post.coverImageUrl ? (
              <img
                src={imageUrl(post.coverImageUrl)}
                alt={post.title}
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
            ) : (
              <div className="absolute inset-0 flex items-center justify-center text-5xl" style={{ background: 'var(--surface)' }}>
                {post.categoryIcon ?? '📰'}
              </div>
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
            <div className="absolute inset-0 flex flex-col justify-end p-3">
              {post.categoryName && (
                <CategoryBadge
                  name={post.categoryName}
                  icon={post.categoryIcon ?? '📰'}
                  color={post.categoryColor ?? '#b91c1c'}
                />
              )}
              <p className="text-white font-bold text-sm leading-tight mt-1.5 line-clamp-2">
                {post.title}
              </p>
              <p className="text-white/60 text-[10px] mt-1 flex items-center gap-1">
                <Clock size={10} /> {formatDate(post.publishedAt ?? post.createdAt)}
              </p>
            </div>
            <div className="absolute top-2 left-2 w-6 h-6 rounded-full bg-[#b91c1c] flex items-center justify-center text-xs font-black text-white">
              {i + 1}
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}

// ─── Latest Stories ────────────────────────────────────────────────────────────
function LatestStories({ posts }: { posts: BlogPost[] }) {
  return (
    <section className="space-y-5">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-bold" style={{ color: 'var(--text1)' }}>Berita Terbaru</h2>
        <Link to="/blog" className="text-xs text-[#b91c1c] font-semibold hover:underline flex items-center gap-1">
          Lihat semua <ChevronRight size={13} />
        </Link>
      </div>

      <div className="divide-y" style={{ borderColor: 'color-mix(in srgb, var(--text2) 12%, transparent)' }}>
        {posts.slice(0, 6).map(post => (
          <Link key={post.slug} to={`/blog/${post.slug}`} className="flex gap-4 py-4 group">
            {/* Thumbnail */}
            <div className="flex-shrink-0 w-24 h-20 sm:w-32 sm:h-24 rounded-xl overflow-hidden" style={{ background: 'var(--surface)' }}>
              {post.coverImageUrl ? (
                <img
                  src={imageUrl(post.coverImageUrl)}
                  alt={post.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-3xl">{post.categoryIcon ?? '📰'}</div>
              )}
            </div>

            {/* Content */}
            <div className="flex-1 min-w-0 flex flex-col justify-center">
              {post.categoryName && (
                <CategoryBadge
                  name={post.categoryName}
                  icon={post.categoryIcon ?? '📰'}
                  color={post.categoryColor ?? '#b91c1c'}
                />
              )}
              <h3
                className="text-sm sm:text-base font-bold leading-snug mt-1.5 group-hover:text-[#b91c1c] transition-colors line-clamp-2"
                style={{ color: 'var(--text1)' }}
              >
                {post.title}
              </h3>
              {post.excerpt && (
                <p className="text-xs mt-1 line-clamp-1 hidden sm:block" style={{ color: 'var(--text2)' }}>
                  {post.excerpt}
                </p>
              )}
              <div className="flex items-center gap-3 mt-2">
                <span className="text-[10px] flex items-center gap-1" style={{ color: 'var(--text2)' }}>
                  <Clock size={10} /> {formatDate(post.publishedAt ?? post.createdAt)}
                </span>
                <span className="text-[10px]" style={{ color: 'var(--text2)' }}>· {post.authorName}</span>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}

// ─── Popular Sidebar ──────────────────────────────────────────────────────────
function PopularSidebar({ posts }: { posts: BlogPost[] }) {
  return (
    <aside className="space-y-5">
      <div className="flex items-center gap-2">
        <BarChart2 size={16} className="text-[#b91c1c]" />
        <h2 className="text-sm font-bold tracking-widest uppercase" style={{ color: 'var(--text2)' }}>
          Populer Minggu Ini
        </h2>
      </div>
      <div className="space-y-4">
        {posts.slice(0, 5).map((post, i) => (
          <Link key={post.slug} to={`/blog/${post.slug}`} className="flex items-start gap-3 group">
            <span
              className="flex-shrink-0 text-2xl font-black leading-none pt-0.5"
              style={{ color: i === 0 ? '#b91c1c' : 'color-mix(in srgb, var(--text2) 40%, transparent)' }}
            >
              {String(i + 1).padStart(2, '0')}
            </span>
            <div>
              {post.categoryName && (
                <p className="text-[10px] font-bold uppercase tracking-wide" style={{ color: post.categoryColor ?? '#b91c1c' }}>
                  {post.categoryIcon} {post.categoryName}
                </p>
              )}
              <p
                className="text-sm font-semibold leading-snug group-hover:text-[#b91c1c] transition-colors line-clamp-2"
                style={{ color: 'var(--text1)' }}
              >
                {post.title}
              </p>
              <p className="text-[10px] mt-1 flex items-center gap-1" style={{ color: 'var(--text2)' }}>
                <Clock size={9} /> {formatDate(post.publishedAt ?? post.createdAt)}
              </p>
            </div>
          </Link>
        ))}
      </div>
    </aside>
  );
}

// ─── Newsletter ────────────────────────────────────────────────────────────────
function NewsletterBanner({ settings }: { settings: BlogSettings }) {
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);
  return (
    <section
      className="rounded-2xl p-8 md:p-12 text-center"
      style={{ background: 'linear-gradient(135deg, #b91c1c 0%, #7f1d1d 100%)' }}
    >
      <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-white/20 mb-4">
        <Mail size={22} className="text-white" />
      </div>
      <h2 className="text-2xl md:text-3xl font-black text-white mb-2">
        {settings.newsletter_title ?? 'Berlangganan Newsletter'}
      </h2>
      <p className="text-white/75 text-sm md:text-base max-w-md mx-auto mb-6">
        {settings.newsletter_subtitle ?? 'Dapatkan berita terbaru langsung di email kamu setiap hari.'}
      </p>
      {sent ? (
        <p className="text-white font-bold text-lg animate-pulse">🎉 Terima kasih! Kamu sudah berlangganan.</p>
      ) : (
        <div className="flex gap-2 max-w-sm mx-auto">
          <input
            type="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            placeholder={settings.newsletter_placeholder ?? 'Masukkan email kamu...'}
            className="flex-1 rounded-xl bg-white/20 border border-white/30 px-4 py-2.5 text-sm text-white placeholder:text-white/50 focus:outline-none focus:border-white/60"
          />
          <button
            onClick={() => { if (email) setSent(true); }}
            className="flex-shrink-0 bg-white text-[#b91c1c] rounded-xl px-5 py-2.5 text-sm font-bold hover:bg-white/90 transition-colors"
          >
            {settings.newsletter_button ?? 'Berlangganan'}
          </button>
        </div>
      )}
    </section>
  );
}

// ─── Categories Grid ──────────────────────────────────────────────────────────
function CategoriesGrid({ categories }: { categories: BlogCategory[] }) {
  return (
    <section>
      <div className="text-center mb-8">
        <h2 className="text-2xl font-black" style={{ color: 'var(--text1)' }}>Jelajahi Kategori</h2>
        <p className="text-sm mt-2" style={{ color: 'var(--text2)' }}>Temukan berita sesuai minatmu</p>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
        {categories.map(cat => (
          <Link
            key={cat.slug}
            to={`/blog?category=${cat.slug}`}
            className="group flex flex-col items-center gap-2 p-4 rounded-2xl border transition-all hover:-translate-y-1"
            style={{
              background: 'var(--surface)',
              borderColor: 'color-mix(in srgb, var(--text2) 10%, transparent)',
            }}
          >
            <div
              className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl transition-transform group-hover:scale-110"
              style={{ background: cat.color + '22' }}
            >
              {cat.icon}
            </div>
            <span className="text-xs font-semibold text-center leading-snug" style={{ color: 'var(--text1)' }}>
              {cat.name}
            </span>
          </Link>
        ))}
      </div>
    </section>
  );
}

// ─── Main Blog Page ────────────────────────────────────────────────────────────
export function BlogPage() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [trendingPosts, setTrendingPosts] = useState<BlogPost[]>([]);
  const [popularPosts, setPopularPosts] = useState<BlogPost[]>([]);
  const [featuredPost, setFeaturedPost] = useState<BlogPost | null>(null);
  const [categories, setCategories] = useState<BlogCategory[]>([]);
  const [settings, setSettings] = useState<BlogSettings>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAll = async () => {
      setLoading(true);
      try {
        const [postsRes, trendRes, popRes, featRes, catsRes, settRes] = await Promise.all([
          fetch(`${API_URL}/blog/posts?status=published&pageSize=10`),
          fetch(`${API_URL}/blog/posts?status=published&trending=true&pageSize=3`),
          fetch(`${API_URL}/blog/posts?status=published&popular=true&pageSize=5`),
          fetch(`${API_URL}/blog/posts?status=published&featured=true&pageSize=1`),
          fetch(`${API_URL}/blog/categories`),
          fetch(`${API_URL}/blog/settings`),
        ]);
        const [postsData, trendData, popData, featData, catsData, settData] = await Promise.all([
          postsRes.json(), trendRes.json(), popRes.json(), featRes.json(),
          catsRes.json(), settRes.json(),
        ]);
        setPosts(postsData.data ?? []);
        setTrendingPosts(trendData.data ?? []);
        setPopularPosts(popData.data ?? []);
        setFeaturedPost(featData.data?.[0] ?? null);
        setCategories(Array.isArray(catsData) ? catsData : []);
        setSettings(typeof settData === 'object' ? settData : {});
      } catch (e) {
        console.error('Blog fetch error:', e);
      } finally {
        setLoading(false);
      }
    };
    fetchAll();
  }, []);

  const skeletonCard = (h = 48) => (
    <div className="rounded-xl overflow-hidden animate-pulse" style={{ background: 'var(--surface)', height: h }}>
      <div className="w-full h-full opacity-30" style={{ background: 'var(--text2)' }} />
    </div>
  );

  return (
    <div className="min-h-screen pb-20" style={{ background: 'var(--bg)', transition: 'background 0.4s' }}>
      {/* Blog header bar */}
      <div
        className="border-b"
        style={{ borderColor: 'color-mix(in srgb, var(--text2) 12%, transparent)' }}
      >
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
          <h1 className="text-xl font-black tracking-tight" style={{ color: 'var(--text1)' }}>
            <span className="text-[#b91c1c]">●</span>{' '}
            {settings.blog_name || 'Berita'}
          </h1>
          <p className="text-xs hidden sm:block" style={{ color: 'var(--text2)' }}>
            {settings.blog_tagline || 'Informasi terkini, terpercaya'}
          </p>
          <div className="flex items-center gap-3">
            {categories.slice(0, 4).map(cat => (
              <Link
                key={cat.slug}
                to={`/blog?category=${cat.slug}`}
                className="hidden md:block text-xs font-medium transition-colors hover:text-[#b91c1c]"
                style={{ color: 'var(--text2)' }}
              >
                {cat.name}
              </Link>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-8 space-y-12">
        {/* Hero */}
        {loading ? skeletonCard(500) : <HeroSection post={featuredPost} />}

        {/* Trending */}
        {loading ? (
          <div className="grid grid-cols-3 gap-4">{[1, 2, 3].map(i => <div key={i} className="rounded-xl overflow-hidden animate-pulse" style={{ background: 'var(--surface)', height: 192 }}><div className="w-full h-full opacity-30" style={{ background: 'var(--text2)' }} /></div>)}</div>
        ) : trendingPosts.length > 0 && (
          <TrendingSection posts={trendingPosts} />
        )}

        {/* Latest + Popular sidebar */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            {loading ? (
              <div className="space-y-4">{[1, 2, 3, 4].map(i => <div key={i} className="rounded-xl overflow-hidden animate-pulse" style={{ background: 'var(--surface)', height: 96 }}><div className="w-full h-full opacity-30" style={{ background: 'var(--text2)' }} /></div>)}</div>
            ) : (
              <LatestStories posts={posts} />
            )}
          </div>
          <div>
            {loading ? (
              <div className="space-y-3">{[1, 2, 3, 4, 5].map(i => <div key={i} className="rounded-xl overflow-hidden animate-pulse" style={{ background: 'var(--surface)', height: 60 }}><div className="w-full h-full opacity-30" style={{ background: 'var(--text2)' }} /></div>)}</div>
            ) : popularPosts.length > 0 && (
              <PopularSidebar posts={popularPosts} />
            )}
          </div>
        </div>

        {/* Newsletter */}
        <NewsletterBanner settings={settings} />

        {/* Explore Categories */}
        {categories.length > 0 && <CategoriesGrid categories={categories} />}
      </div>
    </div>
  );
}
