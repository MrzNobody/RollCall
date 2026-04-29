import React, { useState, useEffect } from 'react';
import { 
  MessageSquare, ThumbsUp, MessageCircle, Pin, 
  MoreHorizontal, Plus, ChevronRight, User, Clock, 
  Tag, Filter, Search, ArrowUp, Send
} from 'lucide-react';
import { supabase } from '../lib/supabase';
import { motion, AnimatePresence } from 'framer-motion';

const ForumPost = ({ post, onSelect, onVote }) => (
  <motion.div 
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    onClick={() => onSelect(post)}
    className="glass p-6 rounded-[2rem] border border-white/5 hover:border-brand-primary/20 transition-all cursor-pointer group"
  >
    <div className="flex gap-6">
      {/* Vote Side */}
      <div className="flex flex-col items-center gap-1 mt-1">
        <button
          title="Upvote this post"
          onClick={(e) => { e.stopPropagation(); onVote(post.id, 1); }}
          className="p-2 hover:bg-brand-primary/10 rounded-xl text-text-muted hover:text-brand-primary transition-all"
        >
          <ArrowUp className="w-5 h-5" />
        </button>
        <span className="text-xs font-black text-text-primary">{post.upvotes}</span>
      </div>

      {/* Content Side */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-3 mb-2">
          {post.is_pinned && (
            <div className="flex items-center gap-1 px-2 py-0.5 bg-brand-secondary/20 text-brand-secondary rounded-md text-[8px] font-black uppercase tracking-widest">
              <Pin className="w-2.5 h-2.5" /> Pinned
            </div>
          )}
          <span className={`px-2 py-0.5 rounded-md text-[8px] font-black uppercase tracking-widest ${
            post.category === 'announcement' ? 'bg-orange-500/10 text-orange-500' :
            post.category === 'tip' ? 'bg-emerald-500/10 text-emerald-500' :
            'bg-brand-primary/10 text-brand-primary'
          }`}>
            {post.category}
          </span>
          <span className="text-[10px] text-text-muted font-medium">• {new Date(post.created_at).toLocaleDateString()}</span>
        </div>
        
        <h4 className="text-lg font-bold text-text-primary mb-2 group-hover:text-brand-primary transition-colors">{post.title}</h4>
        <p className="text-sm text-text-secondary line-clamp-2 leading-relaxed mb-4">{post.content}</p>
        
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2 text-[10px] font-bold text-text-muted uppercase tracking-wider">
            <div className="w-5 h-5 rounded-full bg-white/5 flex items-center justify-center">
              <User className="w-3 h-3" />
            </div>
            Resident {post.author_id?.slice(0, 4)}
          </div>
          <div className="flex items-center gap-1.5 text-[10px] font-bold text-text-muted uppercase tracking-wider">
            <MessageCircle className="w-4 h-4" />
            {post.comment_count || 0} Replies
          </div>
        </div>
      </div>

      <div className="self-center">
        <ChevronRight className="w-5 h-5 text-text-muted group-hover:text-brand-primary group-hover:translate-x-1 transition-all" />
      </div>
    </div>
  </motion.div>
);

const Forum = ({ groupId, user }) => {
  const [posts, setPosts] = useState([]);
  const [selectedPost, setSelectedPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showCreate, setShowCreate] = useState(false);
  const [newPost, setNewPost] = useState({ title: '', content: '', category: 'discussion' });
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [submittingComment, setSubmittingComment] = useState(false);

  useEffect(() => {
    fetchPosts();
  }, [groupId]);

  const fetchComments = async (postId) => {
    const { data, error } = await supabase
      .from('forum_comments')
      .select('id, content, author_id, created_at')
      .eq('post_id', postId)
      .order('created_at', { ascending: true });
    if (!error) setComments(data || []);
  };

  const fetchPosts = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('forum_posts')
        .select(`
          *,
          comment_count:forum_comments(count)
        `)
        .eq('group_id', groupId)
        .order('is_pinned', { ascending: false })
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      setPosts(data.map(p => ({ ...p, comment_count: p.comment_count[0].count })) || []);
    } catch (err) {
      console.error('Error fetching posts:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreatePost = async (e) => {
    e.preventDefault();
    if (!newPost.title || !newPost.content) return;

    try {
      const { error } = await supabase
        .from('forum_posts')
        .insert({
          group_id: groupId,
          author_id: user.id,
          title: newPost.title,
          content: newPost.content,
          category: newPost.category
        });
      
      if (error) throw error;
      setShowCreate(false);
      setNewPost({ title: '', content: '', category: 'discussion' });
      fetchPosts();
    } catch (err) {
      console.error('Post creation failed:', err);
    }
  };

  const handleVote = async (postId, type) => {
    if (!user) return;
    try {
      // Upsert vote — if they already voted, update direction; otherwise insert
      const { error } = await supabase
        .from('post_votes')
        .upsert({ post_id: postId, user_id: user.id, vote_type: type }, { onConflict: 'post_id,user_id' });
      if (error) throw error;
      // Update local state optimistically
      setPosts(prev => prev.map(p => p.id === postId ? { ...p, upvotes: p.upvotes + type } : p));
    } catch (err) {
      console.error('Vote failed:', err);
    }
  };

  const handleSubmitComment = async () => {
    if (!newComment.trim() || !user || !selectedPost) return;
    setSubmittingComment(true);
    try {
      const { error } = await supabase
        .from('forum_comments')
        .insert({ post_id: selectedPost.id, author_id: user.id, content: newComment.trim() });
      if (error) throw error;
      setNewComment('');
      await fetchComments(selectedPost.id);
    } catch (err) {
      console.error('Comment failed:', err);
    } finally {
      setSubmittingComment(false);
    }
  };

  if (selectedPost) {
    return (
      <div className="space-y-8 animate-fade-in">
        <button
          title="Go back to forum threads list"
          onClick={() => setSelectedPost(null)}
          className="flex items-center gap-2 text-text-muted hover:text-text-primary transition-colors text-[10px] font-black uppercase tracking-widest"
        >
          <ChevronRight className="w-4 h-4 rotate-180" /> Back to Threads
        </button>

        <div className="glass p-10 rounded-[3rem] border border-white/10">
          <div className="flex items-center gap-3 mb-6">
            <span className="px-3 py-1 bg-brand-primary/10 text-brand-primary border border-brand-primary/30 rounded-full text-[10px] font-black tracking-widest uppercase">
              {selectedPost.category}
            </span>
            <span className="text-[10px] text-text-muted font-bold uppercase tracking-wider">
              Posted {new Date(selectedPost.created_at).toLocaleDateString()}
            </span>
          </div>
          <h2 className="text-3xl font-black text-text-primary mb-6 tracking-tight">{selectedPost.title}</h2>
          <p className="text-text-secondary leading-relaxed whitespace-pre-wrap">{selectedPost.content}</p>
        </div>

        <div className="space-y-6">
          <h4 className="text-sm font-black uppercase tracking-[0.3em] text-text-muted">Discussion ({comments.length})</h4>

          {comments.length > 0 ? (
            <div className="space-y-4">
              {comments.map(c => (
                <div key={c.id} className="glass p-6 rounded-[2rem] border border-white/5 flex items-start gap-4">
                  <div className="w-10 h-10 rounded-2xl bg-brand-primary/20 flex items-center justify-center text-brand-primary font-bold text-xs shrink-0">
                    {c.author_id?.slice(0, 2).toUpperCase()}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs font-bold text-text-primary">Resident {c.author_id?.slice(0, 4)}</span>
                      <span className="text-[10px] text-text-muted">{new Date(c.created_at).toLocaleDateString()}</span>
                    </div>
                    <p className="text-sm text-text-secondary">{c.content}</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="glass p-8 rounded-[2rem] border border-dashed border-white/10 text-center text-sm text-text-muted">
              No replies yet. Be the first to respond!
            </div>
          )}

          {user && (
            <div className="glass p-6 rounded-[2.5rem] border border-white/10 flex gap-4">
              <input
                value={newComment}
                onChange={e => setNewComment(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && !e.shiftKey && handleSubmitComment()}
                placeholder="Write a reply..."
                className="flex-1 bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-sm focus:outline-none focus:border-brand-primary transition-all"
              />
              <button
                title="Submit your reply to this thread"
                onClick={handleSubmitComment}
                disabled={submittingComment || !newComment.trim()}
                className="bg-brand-primary p-4 rounded-2xl hover:bg-brand-primary/80 transition-all shadow-lg shadow-brand-primary/20 disabled:opacity-50"
              >
                {submittingComment
                  ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  : <Send className="w-5 h-5 text-white" />
                }
              </button>
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-black uppercase tracking-[0.3em] text-text-muted">Community Threads</h3>
        <button
          title="Create a new forum thread"
          onClick={() => setShowCreate(true)}
          className="flex items-center gap-2 px-6 py-3 bg-brand-primary text-white rounded-2xl text-xs font-black uppercase tracking-widest hover:scale-105 transition-all shadow-xl shadow-brand-primary/20"
        >
          <Plus className="w-4 h-4" /> New Thread
        </button>
      </div>

      <AnimatePresence>
        {showCreate && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden"
          >
            <form onSubmit={handleCreatePost} className="glass p-8 rounded-[2.5rem] border border-brand-primary/30 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-text-muted ml-2">Title</label>
                  <input 
                    value={newPost.title}
                    onChange={e => setNewPost({...newPost, title: e.target.value})}
                    placeholder="Thread title..."
                    className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-sm focus:outline-none focus:border-brand-primary transition-all"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-text-muted ml-2">Category</label>
                  <select 
                    value={newPost.category}
                    onChange={e => setNewPost({...newPost, category: e.target.value})}
                    className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-sm focus:outline-none focus:border-brand-primary transition-all appearance-none"
                  >
                    <option value="discussion">Discussion</option>
                    <option value="tip">Strategy/Tip</option>
                    <option value="announcement">Announcement</option>
                  </select>
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-text-muted ml-2">Content</label>
                <textarea 
                  value={newPost.content}
                  onChange={e => setNewPost({...newPost, content: e.target.value})}
                  placeholder="Share your thoughts with the community..."
                  className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-sm h-32 focus:outline-none focus:border-brand-primary transition-all resize-none"
                />
              </div>
              <div className="flex justify-end gap-4">
                <button type="button" title="Cancel and close" onClick={() => setShowCreate(false)} className="px-6 py-3 text-xs font-black uppercase tracking-widest text-text-muted hover:text-text-primary">Cancel</button>
                <button title="Post this thread to the forum" className="px-10 py-3 bg-brand-primary text-white rounded-xl text-xs font-black uppercase tracking-widest hover:bg-brand-primary/80 transition-all shadow-lg shadow-brand-primary/20">Post Thread</button>
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="space-y-4">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 gap-4">
            <div className="w-10 h-10 border-4 border-brand-primary border-t-transparent rounded-full animate-spin" />
            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-text-muted">Loading Discussions...</span>
          </div>
        ) : posts.length > 0 ? (
          posts.map(post => (
            <ForumPost key={post.id} post={post} onSelect={(p) => { setSelectedPost(p); fetchComments(p.id); }} onVote={handleVote} />
          ))
        ) : (
          <div className="glass p-20 rounded-[3rem] border border-dashed border-white/10 text-center space-y-6">
            <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mx-auto">
              <MessageSquare className="w-10 h-10 text-text-muted" />
            </div>
            <div>
              <h4 className="text-xl font-bold text-text-primary">The floor is open</h4>
              <p className="text-sm text-text-muted max-w-xs mx-auto">This community doesn't have any forum threads yet. Be the first to start a conversation!</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Forum;
