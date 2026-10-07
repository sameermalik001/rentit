'use client';

import React, { useState, useEffect, useRef, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import {
  MessageSquare,
  Send,
  User,
  ExternalLink,
  Clock,
  CheckCheck,
  Package,
  ArrowLeft,
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { DataStore } from '@/lib/store';
import { Conversation, Message } from '@/lib/types';
import { formatDate } from '@/lib/utils';

function MessagesContent() {
  const { user } = useAuth();
  const searchParams = useSearchParams();
  const convParam = searchParams.get('conv');

  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [activeConversationId, setActiveConversationId] = useState<string | null>(convParam || null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newText, setNewText] = useState('');
  const [mobileView, setMobileView] = useState<'list' | 'chat'>(convParam ? 'chat' : 'list');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const loadConversations = () => {
    if (user) {
      const convs = DataStore.getConversations(user.id);
      setConversations(convs);

      if (convParam && convs.some((c) => c.id === convParam)) {
        setActiveConversationId(convParam);
        setMobileView('chat');
      } else if (convs.length > 0 && !activeConversationId) {
        setActiveConversationId(convs[0].id);
      }
    }
  };

  useEffect(() => {
    loadConversations();
  }, [user, convParam]);

  useEffect(() => {
    if (activeConversationId) {
      const msgs = DataStore.getMessages(activeConversationId);
      setMessages(msgs);
    }
  }, [activeConversationId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !activeConversationId || !newText.trim()) return;

    DataStore.sendMessage(activeConversationId, user.id, newText.trim());
    setNewText('');
    setMessages(DataStore.getMessages(activeConversationId));
    loadConversations();
  };

  if (!user) {
    return (
      <div className="bg-white rounded-3xl p-10 text-center border border-slate-200">
        <p className="text-slate-500 text-sm">Please log in to access messages.</p>
      </div>
    );
  }

  const activeConv = conversations.find((c) => c.id === activeConversationId);

  return (
    <div className="bg-white rounded-3xl border border-slate-200/90 shadow-xs overflow-hidden h-[750px] flex flex-col md:flex-row">
      {/* Conversations List Panel (Left) */}
      <div
        className={`w-full md:w-80 border-r border-slate-100 flex flex-col h-full bg-slate-50/50 ${
          mobileView === 'chat' ? 'hidden md:flex' : 'flex'
        }`}
      >
        <div className="p-4 border-b border-slate-100 bg-white">
          <h2 className="text-base font-bold text-slate-900">Conversations</h2>
          <p className="text-[11px] text-slate-400">Direct rental communications</p>
        </div>

        <div className="flex-1 overflow-y-auto divide-y divide-slate-100">
          {conversations.length > 0 ? (
            conversations.map((conv) => {
              const isActive = conv.id === activeConversationId;
              return (
                <button
                  key={conv.id}
                  onClick={() => {
                    setActiveConversationId(conv.id);
                    setMobileView('chat');
                  }}
                  className={`w-full text-left p-3.5 flex items-start gap-3 transition-colors ${
                    isActive ? 'bg-emerald-50/80 border-r-2 border-emerald-600' : 'hover:bg-slate-100/70'
                  }`}
                >
                  <img
                    src={
                      conv.other_user?.avatar_url ||
                      'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=100&q=80'
                    }
                    alt=""
                    className="w-10 h-10 rounded-xl object-cover shrink-0 ring-1 ring-slate-200"
                  />
                  <div className="flex-1 overflow-hidden">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-slate-900 text-xs truncate">
                        {conv.other_user?.full_name || 'Neighbor'}
                      </span>
                      <span className="text-[10px] text-slate-400">
                        {formatDate(conv.last_message_at)}
                      </span>
                    </div>

                    {conv.listing && (
                      <span className="text-[10px] font-semibold text-emerald-700 truncate block">
                        Re: {conv.listing.title}
                      </span>
                    )}

                    <p className="text-xs text-slate-500 truncate mt-0.5">
                      {conv.last_message_text || 'Conversation opened'}
                    </p>
                  </div>
                </button>
              );
            })
          ) : (
            <div className="p-8 text-center text-xs text-slate-400">
              No conversations yet. Inquire about any rental product to chat!
            </div>
          )}
        </div>
      </div>

      {/* Chat Thread Panel (Right) */}
      <div
        className={`flex-1 flex flex-col h-full bg-white ${
          mobileView === 'list' ? 'hidden md:flex' : 'flex'
        }`}
      >
        {activeConv ? (
          <>
            {/* Chat Header */}
            <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-white shadow-2xs">
              <div className="flex items-center gap-3">
                {/* Mobile Back button */}
                <button
                  onClick={() => setMobileView('list')}
                  className="md:hidden p-1.5 rounded-lg text-slate-500 hover:bg-slate-100"
                  title="Back to conversation list"
                >
                  <ArrowLeft className="w-4 h-4" />
                </button>

                <img
                  src={
                    activeConv.other_user?.avatar_url ||
                    'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=100&q=80'
                  }
                  alt=""
                  className="w-9 h-9 rounded-xl object-cover ring-1 ring-emerald-500/20"
                />
                <div>
                  <h3 className="font-bold text-slate-900 text-sm">
                    {activeConv.other_user?.full_name || 'User'}
                  </h3>
                  <p className="text-[11px] text-slate-400">
                    {activeConv.other_user?.city}, {activeConv.other_user?.locality}
                  </p>
                </div>
              </div>

              {activeConv.listing && (
                <Link
                  href={`/product/${activeConv.listing_id}`}
                  className="flex items-center gap-1.5 text-xs font-semibold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 px-3 py-1.5 rounded-xl border border-emerald-200 transition-colors"
                >
                  <Package className="w-3.5 h-3.5" />
                  <span className="truncate max-w-[140px]">{activeConv.listing.title}</span>
                  <ExternalLink className="w-3 h-3" />
                </Link>
              )}
            </div>

            {/* Message History */}
            <div className="flex-1 p-5 overflow-y-auto space-y-4 bg-slate-50/40">
              {messages.map((msg) => {
                const isMe = msg.sender_id === user.id;
                return (
                  <div
                    key={msg.id}
                    className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}
                  >
                    <div
                      className={`max-w-[75%] rounded-2xl p-3 text-xs leading-relaxed shadow-xs ${
                        isMe
                          ? 'bg-emerald-600 text-white rounded-br-xs'
                          : 'bg-white text-slate-800 border border-slate-200 rounded-bl-xs'
                      }`}
                    >
                      {msg.content}
                    </div>
                    <div className="flex items-center gap-1 mt-1 text-[10px] text-slate-400">
                      <span>{formatDate(msg.created_at)}</span>
                      {isMe && <CheckCheck className="w-3 h-3 text-emerald-600" />}
                    </div>
                  </div>
                );
              })}
              <div ref={messagesEndRef} />
            </div>

            {/* Message Input Box */}
            <form
              onSubmit={handleSendMessage}
              className="p-3 border-t border-slate-100 bg-white flex items-center gap-2"
            >
              <input
                type="text"
                placeholder="Type your message about handover, pickup time, or product..."
                value={newText}
                onChange={(e) => setNewText(e.target.value)}
                className="flex-1 bg-slate-50 border border-slate-200 text-sm rounded-xl px-4 py-2.5 text-slate-800 focus:bg-white focus:border-emerald-500 focus:outline-hidden"
              />
              <button
                type="submit"
                disabled={!newText.trim()}
                className="bg-emerald-600 hover:bg-emerald-700 disabled:opacity-40 text-white p-2.5 rounded-xl shadow-xs transition-colors"
                title="Send Message"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center p-8 text-center text-slate-400">
            <MessageSquare className="w-12 h-12 text-slate-300 mb-2" />
            <p className="text-sm font-semibold text-slate-600">No conversation selected</p>
            <p className="text-xs text-slate-400">Select a thread on the left to start messaging.</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default function MessagesPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-slate-400">Loading messages...</div>}>
      <MessagesContent />
    </Suspense>
  );
}
