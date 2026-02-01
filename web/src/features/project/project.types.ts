export type Status = "active" | "revoked" | "expired";

export type ProjectDto = {
  id: string;
  name: string;
  status: Status;
  usedCount: number;
  lastUsedAt: string;
  expiredAt: string;
};
