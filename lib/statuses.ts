export const STATUSES = ["prepared", "applied", "replied", "interview", "offer", "closed"] as const;
export type Status = (typeof STATUSES)[number];
