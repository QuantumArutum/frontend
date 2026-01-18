/**
 * 社区模块类型定义
 * 用于替换项目中的 any 类型，提供完整的类型安全
 */

// ============= 数据库相关类型 =============

interface AuditLog {
  id: number;
  action: string;
  admin_id?: string;
  details?: string;
  created_at: string;
  [key: string]: any;
}

interface FooterLink {
  id: number;
  title: string;
  url: string;
  order: number;
  label?: string;
  link?: string;
  sort_order?: number;
  is_active?: boolean;
  [key: string]: any;
}

interface Domain {
  id: number;
  domain: string;
  is_active: boolean;
  type?: string;
  ssl_enabled?: boolean;
  [key: string]: any;
}

interface Deposit {
  id: number;
  user_id: string;
  amount: number;
  currency: string;
  status: string;
  created_at: string;
  [key: string]: any;
}

interface BlockchainNetwork {
  id: number;
  name: string;
  chain_id: number;
  rpc_url: string;
  is_active: boolean;
  [key: string]: any;
}

// ============= 用户相关类型 =============

export interface User {
  id?: string;
  uid: string;
  email: string;
  username?: string;
  name?: string;
  avatar?: string;
  role?: 'user' | 'moderator' | 'admin';
  level?: number;
  status?: 'active' | 'banned' | 'suspended';
  is_active?: boolean;
  totp_enabled?: boolean;
  created_at?: Date | string;
  createdAt?: Date | string;
  updated_at?: Date | string;
  updatedAt?: Date | string;
  last_login_at?: Date | string;
  post_count?: number;
  comment_count?: number;
  stake_count?: number;
  reputation_points?: number;
  [key: string]: any; // 允许额外的字段
}

export interface UserProfile extends User {
  bio?: string;
  location?: string;
  website?: string;
  socialLinks?: {
    twitter?: string;
    github?: string;
    linkedin?: string;
  };
  joinedAt: string;
  isOnline: boolean;
  stats: UserStats;
  badges: Badge[];
  recentPosts: PostSummary[];
}

export interface UserStats {
  posts: number;
  comments: number;
  likes: number;
  receivedLikes: number;
  reputation: number;
  followers: number;
  following: number;
}

export interface Badge {
  name: string;
  color: string;
  icon: string;
  description?: string;
}

// ============= 帖子相关类型 =============

export interface Post {
  id: number;
  title: string;
  content: string;
  userId: string;
  userName?: string;
  userAvatar?: string;
  categoryId: number;
  category?: string;
  categorySlug?: string;
  viewCount: number;
  likeCount: number;
  commentCount: number;
  isPinned: boolean;
  isLocked?: boolean;
  status: 'draft' | 'published' | 'archived';
  createdAt: Date | string;
  updatedAt: Date | string;
  tags?: Tag[];
}

export interface PostSummary {
  id: string | number;
  title: string;
  category: string;
  categorySlug: string;
  replies: number;
  likes: number;
  views?: number;
  createdAt: string;
}

export interface PostDetail extends Post {
  author: User;
  comments: Comment[];
  relatedPosts?: PostSummary[];
}

// ============= 评论相关类型 =============

export interface Comment {
  id: number;
  postId: number;
  userId: string;
  userName?: string;
  userAvatar?: string;
  content: string;
  parentId?: number;
  likeCount: number;
  replyCount?: number;
  createdAt: Date | string;
  updatedAt?: Date | string;
  replies?: Comment[];
}

// ============= 标签相关类型 =============

export interface Tag {
  id: number;
  name: string;
  slug: string;
  description?: string;
  color?: string;
  useCount: number;
  isOfficial: boolean;
  createdAt: Date | string;
}

// ============= 分类相关类型 =============

export interface Category {
  id: number;
  name: string;
  slug: string;
  description?: string;
  icon?: string;
  color?: string;
  postCount: number;
  order?: number;
  parentId?: number;
  createdAt: Date | string;
}

// ============= 消息相关类型 =============

export interface Conversation {
  id: number;
  participant1Id: string;
  participant2Id: string;
  participant1?: User;
  participant2?: User;
  lastMessage?: string;
  lastMessageAt?: Date | string;
  unreadCount: number;
  createdAt: Date | string;
}

export interface Message {
  id: number;
  conversationId: number;
  senderId: string;
  receiverId: string;
  sender?: User;
  receiver?: User;
  content: string;
  isRead: boolean;
  createdAt: Date | string;
}

// ============= 通知相关类型 =============

export interface Notification {
  id: number;
  userId: string;
  type: 'like' | 'comment' | 'reply' | 'follow' | 'mention' | 'system';
  title: string;
  content: string;
  link?: string;
  isRead: boolean;
  createdAt: Date | string;
}

// ============= 活动相关类型 =============

export interface Activity {
  id: number;
  user_id: string;
  activity_type: string;
  description: string;
  created_at: Date | string;
  metadata?: Record<string, any>;
  type?: string; // 别名字段
  target_type?: string;
  target_id?: number;
  [key: string]: any; // 允许额外的字段
}

export interface Event {
  id: number;
  title: string;
  description: string;
  type: 'online' | 'offline' | 'hybrid';
  startTime: Date | string;
  endTime: Date | string;
  location?: string;
  maxParticipants?: number;
  currentParticipants: number;
  status: 'upcoming' | 'ongoing' | 'completed' | 'cancelled';
  createdBy: string;
  createdAt: Date | string;
}

// ============= 治理相关类型 =============

export interface Proposal {
  id: number;
  title: string;
  description: string;
  type: 'governance' | 'feature' | 'parameter' | 'treasury';
  status: 'draft' | 'active' | 'passed' | 'rejected' | 'executed';
  proposer: string;
  proposerName?: string;
  votesFor: number;
  votesAgainst: number;
  votesAbstain: number;
  quorum: number;
  startTime: Date | string;
  endTime: Date | string;
  createdAt: Date | string;
}

export interface Delegate {
  id: string;
  name: string;
  avatar?: string;
  votingPower: number;
  delegators: number;
  participationRate: number;
  bio?: string;
}

// ============= AI相关类型 =============

export interface AIAgent {
  id: number;
  name: string;
  type: string;
  version: string;
  accuracy: number;
  learningHours: number;
  status: 'active' | 'training' | 'inactive';
  description?: string;
  createdAt: Date | string;
}

// ============= API响应类型 =============

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T = any> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
  hasMore: boolean;
}

export interface SearchResult {
  posts: Post[];
  users: User[];
  tags?: Tag[];
}

// ============= 统计相关类型 =============

export interface CommunityStats {
  totalMembers: number;
  totalPosts: number;
  totalComments: number;
  activeToday: number;
  onlineNow: number;
}

export interface MemberStats {
  totalMembers: number;
  newThisWeek: number;
  activeMembers: number;
  topContributors: User[];
}

// ============= 表单相关类型 =============

export interface PostFormData {
  title: string;
  content: string;
  categoryId: number;
  tags?: string[];
  isPinned?: boolean;
}

export interface CommentFormData {
  postId: number;
  content: string;
  parentId?: number;
}

export interface UserSettingsFormData {
  username?: string;
  bio?: string;
  location?: string;
  website?: string;
  avatar?: string;
  coverImage?: string;
  socialLinks?: {
    twitter?: string;
    github?: string;
    linkedin?: string;
  };
}

// ============= 过滤和排序类型 =============

export type PostSortBy = 'latest' | 'popular' | 'trending' | 'controversial';
export type TagSortBy = 'usage' | 'name' | 'created';
export type MemberSortBy = 'reputation' | 'posts' | 'joined';
export type SearchType = 'all' | 'posts' | 'users' | 'tags';

// ============= 权限相关类型 =============

export interface Permission {
  canPost: boolean;
  canComment: boolean;
  canEdit: boolean;
  canDelete: boolean;
  canModerate: boolean;
  canAdmin: boolean;
}

// ============= 版主相关类型 =============

export interface Moderator extends User {
  permissions: string[];
  assignedCategories?: number[];
  actionsCount: number;
}

export interface ModAction {
  id: number;
  moderatorId?: string;
  moderator_id: string;
  moderatorName?: string;
  action: 'pin' | 'lock' | 'delete' | 'ban' | 'warn' | 'move' | string;
  targetType?: 'post' | 'comment' | 'user';
  target_type: string;
  targetId?: string | number;
  target_id: number;
  reason?: string;
  status?: string;
  createdAt?: Date | string;
  created_at: Date | string;
  [key: string]: any; // 允许额外的字段
}
