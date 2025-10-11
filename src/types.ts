import { Prompt, Comment, Agent, Section, User, Reaction, Save, Favorite, Repost } from '@prisma/client';

export type PromptWithRelations = Prompt & {
  user: User;
  agent: (Agent & { section: Section | null }) | null;
  reactions: Reaction[];
  favorites: Favorite[];
  saves: Save[];
  reposts: Repost[];
  comments: (Comment & { user: User })[];
};
