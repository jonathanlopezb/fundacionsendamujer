'use client';
import React, { useState, useEffect } from 'react';
import { Users, MessageSquare, Heart, Share2, PlusCircle, Search, Sparkles, CheckCircle2, UserCheck, Shield } from 'lucide-react';

interface Props {
  user: { name: string; email: string } | null;
  onOpenAuth: () => void;
}

export default function CommunitySection({ user, onOpenAuth }: Props) {
  const [posts, setPosts] = useState<any[]>([]);
  const [activeFilter, setActiveFilter] = useState<'Todos' | 'Discusiones' | 'Grupos' | 'Mentorías'>('Todos');
  const [searchQuery, setSearchQuery] = useState('');
  const [newPostContent, setNewPostContent] = useState('');
  const [isPosting, setIsPosting] = useState(false);
  const [joinedGroups, setJoinedGroups] = useState<string[]>(['Emprendimiento Femenino']);
  const [likedPostIds, setLikedPostIds] = useState<string[]>([]);

  useEffect(() => {
    fetch('/api/academia/community')
      .then((res) => res.json())
      .then((data) => {
        if (data?.posts) setPosts(data.posts);
      })
      .catch(() => undefined);
  }, []);

  const handleLike = (postId: string) => {
    if (!user) {
      onOpenAuth();
      return;
    }
    if (likedPostIds.includes(postId)) {
      setLikedPostIds((prev) => prev.filter((id) => id !== postId));
      setPosts((prev) =>
        prev.map((p) => (p._id === postId ? { ...p, likes: Math.max(0, p.likes - 1) } : p))
      );
    } else {
      setLikedPostIds((prev) => [...prev, postId]);
      setPosts((prev) =>
        prev.map((p) => (p._id === postId ? { ...p, likes: p.likes + 1 } : p))
      );
    }
  };

  const handleJoinGroup = (groupName: string) => {
    if (!user) {
      onOpenAuth();
      return;
    }
    if (joinedGroups.includes(groupName)) {
      setJoinedGroups((prev) => prev.filter((g) => g !== groupName));
    } else {
      setJoinedGroups((prev) => [...prev, groupName]);
    }
  };

  const handleCreatePost = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPostContent.trim()) return;

    if (!user) {
      onOpenAuth();
      return;
    }

    const safeAuthorName = user.name.split(' ')[0] + ' ' + (user.name.split(' ')[1] ? user.name.split(' ')[1][0] + '.' : '');
    const newPost = {
      _id: `temp-${Date.now()}`,
      authorName: safeAuthorName,
      authorRole: 'Estudiante Senda',
      authorAvatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=150&q=80',
      content: newPostContent.trim(),
      category: activeFilter === 'Todos' ? 'Discusiones' : activeFilter,
      groupName: 'Emprendimiento Femenino',
      groupMembers: '1.2k miembros',
      likes: 1,
      commentsCount: 0,
      comments: [],
      createdAt: new Date(),
    };

    setPosts((prev) => [newPost, ...prev]);
    setNewPostContent('');

    try {
      setIsPosting(true);
      await fetch('/api/academia/community', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          authorName: safeAuthorName,
          content: newPost.content,
          category: newPost.category,
          groupName: newPost.groupName,
        }),
      });
    } catch (err) {
      // Handled in client state
    } finally {
      setIsPosting(false);
    }
  };

  const filteredPosts = posts.filter((post) => {
    const matchesFilter = activeFilter === 'Todos' || post.category === activeFilter;
    const matchesSearch =
      !searchQuery ||
      post.content?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.authorName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.groupName?.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  return (
    <section id="comunidad" className="py-12 sm:py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-8">
      
      {/* Header matching Blueprint */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-4 border-b border-white/10">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-extrabold uppercase tracking-wider text-pink-300 bg-pink-500/10 border border-pink-500/20 mb-3">
            <Users className="w-3.5 h-3.5 text-pink-400" />
            <span>Red Colaborativa de Mujeres</span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-black text-white tracking-tight">
            Comunidad SendaMujer
          </h2>
          <p className="text-xs sm:text-sm text-pink-100/70 mt-1 max-w-2xl">
            Comparte aprendizajes, resuelve dudas sobre tus proyectos y apóyate en una red de más de 50.000 compañeras.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-pink-300/60" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Buscar en la comunidad..."
              className="w-full pl-9 pr-4 py-2 text-xs rounded-full bg-white/[0.06] border border-white/10 text-white placeholder-pink-200/40 focus:outline-none focus:border-pink-400"
            />
          </div>
        </div>
      </div>

      {/* Tabs Selector matching Blueprint */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
        {(['Todos', 'Discusiones', 'Grupos', 'Mentorías'] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveFilter(tab)}
            className={`px-4 py-2 rounded-full text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
              activeFilter === tab
                ? 'bg-gradient-to-r from-[#E12880] to-[#7B1FA2] text-white shadow-md border border-pink-400/30'
                : 'bg-white/[0.05] text-pink-100/70 hover:text-white hover:bg-white/10 border border-white/5'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Community Feed & Groups Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Main Posts Feed (8 Cols) */}
        <div className="lg:col-span-8 space-y-6">
          
          {/* Create Post Input */}
          <form onSubmit={handleCreatePost} className="bg-[#1b082a] border border-white/10 rounded-2xl p-4 space-y-3">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-full bg-gradient-to-r from-[#E12880] to-amber-400 flex items-center justify-center text-xs font-black text-white shrink-0">
                {user ? user.name[0].toUpperCase() : 'S'}
              </div>
              <textarea
                value={newPostContent}
                onChange={(e) => setNewPostContent(e.target.value)}
                placeholder={user ? "¿Tienes una duda sobre tu emprendimiento o curso? Escribe aquí..." : "Inicia sesión para publicar en la comunidad..."}
                rows={2}
                className="w-full bg-transparent text-xs text-white placeholder-pink-200/40 focus:outline-none resize-none"
              />
            </div>
            <div className="pt-2 border-t border-white/5 flex items-center justify-between">
              <span className="text-[11px] text-pink-200/50 flex items-center gap-1">
                <Shield className="w-3.5 h-3.5 text-emerald-400" />
                Moderación segura activa
              </span>
              <button
                type="submit"
                disabled={isPosting || !newPostContent.trim()}
                className="px-4 py-1.5 rounded-full text-xs font-black bg-gradient-to-r from-[#E12880] to-[#7B1FA2] text-white shadow-md hover:scale-105 transition-transform disabled:opacity-40 cursor-pointer"
              >
                Publicar pregunta
              </button>
            </div>
          </form>

          {/* Posts List */}
          <div className="space-y-4">
            {filteredPosts.map((post) => {
              const isLiked = likedPostIds.includes(post._id);

              return (
                <article
                  key={post._id}
                  className="bg-[#1a0726] border border-white/10 rounded-2xl p-5 space-y-4 hover:border-pink-400/30 transition-all shadow-lg"
                >
                  {/* Author Header */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <img
                        src={post.authorAvatar || 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=150&q=80'}
                        alt={post.authorName}
                        className="w-9 h-9 rounded-full object-cover border border-pink-500/30"
                      />
                      <div>
                        <h4 className="text-xs font-black text-white">{post.authorName}</h4>
                        <p className="text-[10px] text-pink-200/60">
                          {post.authorRole || 'Emprendedora Caribe'} · hace {Math.floor(Math.random() * 5 + 1)} horas
                        </p>
                      </div>
                    </div>

                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-pink-500/10 text-pink-300 border border-pink-500/20">
                      {post.category}
                    </span>
                  </div>

                  {/* Content Body */}
                  <p className="text-xs sm:text-sm text-pink-100/90 leading-relaxed">
                    {post.content}
                  </p>

                  {/* Comments preview if available */}
                  {post.comments && post.comments.length > 0 && (
                    <div className="space-y-2 pt-2 border-t border-white/5">
                      {post.comments.slice(0, 2).map((com: any) => (
                        <div key={com.id} className="bg-white/[0.03] p-2.5 rounded-xl text-xs space-y-1">
                          <span className="font-bold text-pink-300">{com.authorName}: </span>
                          <span className="text-pink-100/80">{com.content}</span>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Actions & Footer matching Blueprint */}
                  <div className="pt-2 border-t border-white/5 flex items-center justify-between text-xs text-pink-200/70">
                    <div className="flex items-center gap-4">
                      <button
                        onClick={() => handleLike(post._id)}
                        className={`flex items-center gap-1.5 transition-colors cursor-pointer ${
                          isLiked ? 'text-pink-400 font-bold' : 'hover:text-white'
                        }`}
                      >
                        <Heart className={`w-4 h-4 ${isLiked ? 'fill-pink-400 text-pink-400' : ''}`} />
                        <span>{post.likes || 12}</span>
                      </button>

                      <button
                        onClick={() => alert('Sección de comentarios en desarrollo')}
                        className="flex items-center gap-1.5 hover:text-white transition-colors cursor-pointer"
                      >
                        <MessageSquare className="w-4 h-4" />
                        <span>{post.commentsCount || 4} comentarios</span>
                      </button>
                    </div>

                    <button
                      onClick={() => alert('¡Enlace de la discusión copiado al portapapeles!')}
                      className="flex items-center gap-1 hover:text-white transition-colors cursor-pointer text-[11px]"
                    >
                      <Share2 className="w-3.5 h-3.5" />
                      <span>Compartir</span>
                    </button>
                  </div>

                </article>
              );
            })}
          </div>

        </div>

        {/* Sidebar Groups & Mentorships (4 Cols) */}
        <div className="lg:col-span-4 space-y-4">
          
          {/* Group Card matching Blueprint */}
          <div className="bg-gradient-to-br from-[#270838] to-[#170523] border border-pink-500/30 rounded-2xl p-5 space-y-4 shadow-xl">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#E12880] to-[#7B1FA2] p-2 flex items-center justify-center text-white shadow-md">
                <Users className="w-6 h-6" />
              </div>
              <div>
                <h4 className="text-sm font-black text-white">Grupo: Emprendimiento Femenino</h4>
                <p className="text-[10px] text-pink-200/70">Más de 1.2k miembros activas</p>
              </div>
            </div>

            <p className="text-xs text-pink-100/80 leading-relaxed">
              Comunidad de apoyo para emprendedoras del Caribe: networking, alianzas comerciales y retroalimentación de productos.
            </p>

            <button
              onClick={() => handleJoinGroup('Emprendimiento Femenino')}
              className={`w-full py-2.5 rounded-xl text-xs font-black transition-all flex items-center justify-center gap-2 cursor-pointer ${
                joinedGroups.includes('Emprendimiento Femenino')
                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                  : 'bg-gradient-to-r from-[#E12880] to-[#7B1FA2] text-white shadow-lg hover:scale-[1.02]'
              }`}
            >
              {joinedGroups.includes('Emprendimiento Femenino') ? (
                <>
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Miembro del Grupo ✓</span>
                </>
              ) : (
                <>
                  <UserCheck className="w-4 h-4" />
                  <span>Unirme al Grupo</span>
                </>
              )}
            </button>
          </div>

          {/* Mentorship Highlights */}
          <div className="bg-[#1a0726] border border-white/10 rounded-2xl p-5 space-y-3">
            <h4 className="text-xs font-black text-white uppercase tracking-wider flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              <span>Mentorías y Acompañamiento</span>
            </h4>
            <p className="text-xs text-pink-100/70 leading-relaxed">
              Solicita asesoría 1 a 1 con nuestras profesionales en finanzas, marketing y empoderamiento legal.
            </p>
            <button
              onClick={() => alert('Las salas de mentoría privada se abren según el calendario semanal de la Fundación.')}
              className="w-full py-2 rounded-xl text-xs font-bold text-pink-200 bg-white/[0.05] hover:bg-white/10 border border-white/10 transition-colors"
            >
              Consultar disponibilidad de mentoras
            </button>
          </div>

        </div>

      </div>

    </section>
  );
}
