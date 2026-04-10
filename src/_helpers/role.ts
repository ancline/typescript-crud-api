export const Role = {
    Admin: 'admin',
    User: 'user'
} as const;

export type RoleType = typeof Role[keyof typeof Role];