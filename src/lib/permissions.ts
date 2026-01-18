// 权限定义
export const PERMISSIONS = {
  // 帖子管理
  PIN_POST: 'pin_post',
  DELETE_POST: 'delete_post',
  LOCK_POST: 'lock_post',
  MOVE_POST: 'move_post',
  EDIT_POST: 'edit_post',

  // 评论管理
  DELETE_COMMENT: 'delete_comment',
  EDIT_COMMENT: 'edit_comment',

  // 用户管理
  MUTE_USER: 'mute_user',
  BAN_USER: 'ban_user',
  VIEW_USER_HISTORY: 'view_user_history',

  // 举报管理
  VIEW_REPORTS: 'view_reports',
  HANDLE_REPORTS: 'handle_reports',

  // 审核管理
  VIEW_QUEUE: 'view_queue',
  REVIEW_CONTENT: 'review_content',

  // 版主管理
  MANAGE_MODERATORS: 'manage_moderators',
  VIEW_LOGS: 'view_logs',
} as const;

// 角色定义
export const ROLES = {
  SUPER_ADMIN: 'super_admin',
  ADMIN: 'admin',
  MODERATOR: 'moderator',
  USER: 'user',
} as const;

// 角色权限映射
export const ROLE_PERMISSIONS: Record<string, string[]> = {
  [ROLES.SUPER_ADMIN]: Object.values(PERMISSIONS),

  [ROLES.ADMIN]: [
    PERMISSIONS.PIN_POST,
    PERMISSIONS.DELETE_POST,
    PERMISSIONS.LOCK_POST,
    PERMISSIONS.MOVE_POST,
    PERMISSIONS.EDIT_POST,
    PERMISSIONS.DELETE_COMMENT,
    PERMISSIONS.EDIT_COMMENT,
    PERMISSIONS.MUTE_USER,
    PERMISSIONS.BAN_USER,
    PERMISSIONS.VIEW_USER_HISTORY,
    PERMISSIONS.VIEW_REPORTS,
    PERMISSIONS.HANDLE_REPORTS,
    PERMISSIONS.VIEW_QUEUE,
    PERMISSIONS.REVIEW_CONTENT,
    PERMISSIONS.VIEW_LOGS,
  ],

  [ROLES.MODERATOR]: [
    PERMISSIONS.PIN_POST,
    PERMISSIONS.DELETE_POST,
    PERMISSIONS.LOCK_POST,
    PERMISSIONS.MOVE_POST,
    PERMISSIONS.DELETE_COMMENT,
    PERMISSIONS.MUTE_USER,
    PERMISSIONS.VIEW_REPORTS,
    PERMISSIONS.HANDLE_REPORTS,
    PERMISSIONS.VIEW_QUEUE,
    PERMISSIONS.REVIEW_CONTENT,
  ],

  [ROLES.USER]: [],
};

// 权限检查函数
export function hasPermission(
  userRole: string,
  permission: string,
  customPermissions?: string[]
): boolean {
  // 如果有自定义权限，优先使用
  if (customPermissions && customPermissions.length > 0) {
    return customPermissions.includes(permission);
  }

  // 否则使用角色默认权限
  const rolePermissions = ROLE_PERMISSIONS[userRole] || [];
  return rolePermissions.includes(permission);
}

// 检查是否是版主
export function isModerator(userRole: string): boolean {
  return [ROLES.SUPER_ADMIN, ROLES.ADMIN, ROLES.MODERATOR].includes(
    userRole as typeof ROLES.SUPER_ADMIN | typeof ROLES.ADMIN | typeof ROLES.MODERATOR
  );
}

// 检查是否是管理员
export function isAdmin(userRole: string): boolean {
  return [ROLES.SUPER_ADMIN, ROLES.ADMIN].includes(
    userRole as typeof ROLES.SUPER_ADMIN | typeof ROLES.ADMIN
  );
}

// 检查是否是超级管理员
export function isSuperAdmin(userRole: string): boolean {
  return userRole === ROLES.SUPER_ADMIN;
}

// 获取用户所有权限
export function getUserPermissions(userRole: string, customPermissions?: string[]): string[] {
  if (customPermissions && customPermissions.length > 0) {
    return customPermissions;
  }
  return ROLE_PERMISSIONS[userRole] || [];
}

// 权限描述
export const PERMISSION_DESCRIPTIONS: Record<string, string> = {
  [PERMISSIONS.PIN_POST]: '置顶帖子',
  [PERMISSIONS.DELETE_POST]: '删除帖子',
  [PERMISSIONS.LOCK_POST]: '锁定帖子',
  [PERMISSIONS.MOVE_POST]: '移动帖子',
  [PERMISSIONS.EDIT_POST]: '编辑帖子',
  [PERMISSIONS.DELETE_COMMENT]: '删除评论',
  [PERMISSIONS.EDIT_COMMENT]: '编辑评论',
  [PERMISSIONS.MUTE_USER]: '禁言用户',
  [PERMISSIONS.BAN_USER]: '封禁用户',
  [PERMISSIONS.VIEW_USER_HISTORY]: '查看用户历史',
  [PERMISSIONS.VIEW_REPORTS]: '查看举报',
  [PERMISSIONS.HANDLE_REPORTS]: '处理举报',
  [PERMISSIONS.VIEW_QUEUE]: '查看审核队列',
  [PERMISSIONS.REVIEW_CONTENT]: '审核内容',
  [PERMISSIONS.MANAGE_MODERATORS]: '管理版主',
  [PERMISSIONS.VIEW_LOGS]: '查看日志',
};

// 角色描述
export const ROLE_DESCRIPTIONS: Record<string, string> = {
  [ROLES.SUPER_ADMIN]: '超级管理员',
  [ROLES.ADMIN]: '管理员',
  [ROLES.MODERATOR]: '版主',
  [ROLES.USER]: '普通用户',
};
