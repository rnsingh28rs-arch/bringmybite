export function getStaffAccessTokenFromSession(session: unknown): string;
export function getStaffDatabaseRole(role: string): string;
export function isStaffSessionShapeValid(session: unknown, expectedRole: string, now?: number): boolean;
