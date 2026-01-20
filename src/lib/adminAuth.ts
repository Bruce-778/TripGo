export function requireAdmin(req: Request) {
  const token = process.env.ADMIN_TOKEN;
  if (!token) return { ok: false as const, error: "服务端未配置 ADMIN_TOKEN" };
  const got = req.headers.get("x-admin-token") || "";
  if (got !== token) return { ok: false as const, error: "未授权" };
  return { ok: true as const, error: null };
}


