'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CopyButton } from '@/components/ui/copy-button';
import { motion } from 'framer-motion';
import type { ReactNode } from 'react';
import { Heart, Bookmark, Repeat2, MessageCircle, ThumbsDown, ThumbsUp } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useState } from 'react';
import { PromptWithRelations } from '@/types';

interface PromptCardProps {
  prompt: PromptWithRelations & {
    likes: number;
    dislikes: number;
    isFavorited: boolean;
    isSaved: boolean;
    viewerId: string | null;
  };
  viewerId: string | null;
}

export function PromptCard({ prompt }: PromptCardProps) {
  const { t, i18n } = useTranslation('prompts');
  const [copied, setCopied] = useState(false);

  const comments = prompt.comments ?? [];

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
      <Card className="grid gap-0 md:grid-cols-[2fr,1fr]">
        <CardHeader className="md:col-span-2">
          <div className="flex flex-col gap-3">
            <div>
              <p className="text-sm font-medium text-primary">{prompt.agent?.section?.name_i18n?.[i18n.language as 'es' | 'en'] ?? 'Prompt'}</p>
              <CardTitle>{prompt.title}</CardTitle>
              <p className="text-sm text-slate-500">{prompt.agent?.name_i18n?.[i18n.language as 'es' | 'en']}</p>
            </div>
            <CopyButton value={prompt.body} onCopy={() => setCopied(true)} copied={copied} />
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="rounded-2xl bg-slate-50 p-4 text-sm leading-relaxed text-slate-700 shadow-inner dark:bg-slate-900/70 dark:text-slate-200">
              {prompt.body}
            </div>
            <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500">
              {(prompt.tags ?? []).map((tag) => (
                <span key={tag} className="rounded-full bg-primary/10 px-3 py-1 text-primary">
                  #{tag}
                </span>
              ))}
            </div>
          </div>
        </CardContent>
        <CardContent className="border-t border-slate-100 dark:border-slate-900">
          <h4 className="mb-4 text-sm font-semibold uppercase tracking-widest text-slate-400">{t('comments')}</h4>
          <div className="space-y-3">
            {comments.map((comment) => (
              <div key={comment.id} className="rounded-2xl bg-slate-50 p-3 text-sm text-slate-600 dark:bg-slate-900/70 dark:text-slate-200">
                <p className="text-xs font-semibold text-primary">{comment.user.username}</p>
                <p>{comment.body}</p>
              </div>
            ))}
            {comments.length === 0 && (
              <p className="text-sm text-slate-400">{t('comments')} (0)</p>
            )}
          </div>
        </CardContent>
        <CardContent className="flex flex-wrap items-center gap-3 border-t border-slate-100 bg-slate-50/60 dark:border-slate-900 dark:bg-slate-900/60 md:col-span-2">
          <ActionButton icon={<ThumbsUp className="h-4 w-4" />} label={`${t('like')} (${prompt.likes})`} />
          <ActionButton icon={<ThumbsDown className="h-4 w-4" />} label={`${t('dislike')} (${prompt.dislikes})`} />
          <ActionButton icon={<Bookmark className="h-4 w-4" />} label={`${t('save')}`} active={prompt.isSaved} />
          <ActionButton icon={<Heart className="h-4 w-4" />} label={`${t('favorite')}`} active={prompt.isFavorited} />
          <ActionButton icon={<Repeat2 className="h-4 w-4" />} label={t('repost')} />
          <ActionButton icon={<MessageCircle className="h-4 w-4" />} label={t('comments')} />
        </CardContent>
      </Card>
    </motion.div>
  );
}

interface ActionButtonProps {
  icon: ReactNode;
  label: string;
  active?: boolean;
}

function ActionButton({ icon, label, active }: ActionButtonProps) {
  return (
    <Button variant={active ? 'secondary' : 'ghost'} size="sm" className="gap-2 rounded-full">
      {icon}
      {label}
    </Button>
  );
}
