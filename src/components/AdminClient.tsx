"use client";

import { useEffect, useMemo, useState } from "react";
import { formatMoneyFromJpy } from "@/lib/currencyClient";
import { formatDateTimeJST } from "@/lib/timeFormat";
import type { Currency } from "@/lib/currency";

// Client-side currency helper
function getCurrencyFromCookie(): Currency {
  if (typeof document === "undefined") return "JPY";
  const cookie = document.cookie.split("; ").find((c) => c.startsWith("japango_currency="));
  const currencyFromCookie = cookie?.split("=")[1]?.toUpperCase();
  if (currencyFromCookie === "USD" || currencyFromCookie === "CNY") {
    return currencyFromCookie;
  }
  return "JPY";
}

type AdminRow = {
  id: string;
  createdAt: string;
  pickupTime: string;
  fromTo: string;
  vehicleName: string;
  contactName: string;
  contactEmail: string;
  status: string;
  isUrgent: boolean;
  totalJpy: number;
  manualAdjustmentJpy: number;
  pricingNote: string | null;
};
type Labels = {
  loginTitle: string;
  loginSubtitle: string;
  enter: string;
  loading: string;
  orders: string;
  edit: string;
  editTitle: string;
  status: string;
  manualAdjustment: string;
  note: string;
  save: string;
  saving: string;
};

export function AdminClient({ labels, locale = "zh-CN" }: { labels: Labels; locale?: string }) {
  const [token, setToken] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [rows, setRows] = useState<AdminRow[]>([]);
  const [currency, setCurrency] = useState<Currency>("JPY");

  const [editingId, setEditingId] = useState<string | null>(null);
  const editingRow = useMemo(() => rows.find((r) => r.id === editingId) ?? null, [rows, editingId]);
  const [status, setStatus] = useState<string>("CONFIRMED");
  const [manualAdjustmentJpy, setManualAdjustmentJpy] = useState<number>(0);
  const [pricingNote, setPricingNote] = useState<string>("");

  useEffect(() => {
    setCurrency(getCurrencyFromCookie());
  }, []);

  async function load() {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/admin/orders", { headers: { "x-admin-token": token } });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error ?? "加载失败");
      setRows(data.rows ?? []);
    } catch (e: any) {
      setError(e?.message ?? "加载失败");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (!editingRow) return;
    setStatus(editingRow.status);
    setManualAdjustmentJpy(editingRow.manualAdjustmentJpy);
    setPricingNote(editingRow.pricingNote ?? "");
  }, [editingRow]);

  async function save() {
    if (!editingId) return;
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/admin/bookings", {
        method: "POST",
        headers: { "content-type": "application/json", "x-admin-token": token },
        body: JSON.stringify({
          bookingId: editingId,
          status,
          manualAdjustmentJpy,
          pricingNote
        })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error ?? "保存失败");
      setEditingId(null);
      await load();
    } catch (e: any) {
      setError(e?.message ?? "保存失败");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-4">
      <div className="p-5 rounded-2xl bg-white border border-slate-200">
        <div className="font-semibold">{labels.loginTitle}</div>
        <div className="text-sm text-slate-600 mt-1">{labels.loginSubtitle}</div>
        <div className="mt-4 flex flex-col md:flex-row gap-2">
          <input
            className="flex-1 px-3 py-2 rounded-xl border border-slate-200 bg-white"
            value={token}
            onChange={(e) => setToken(e.target.value)}
            placeholder="输入 ADMIN_TOKEN"
          />
          <button
            onClick={load}
            disabled={!token || loading}
            className="px-4 py-2 rounded-xl bg-slate-900 text-white hover:bg-slate-800 disabled:opacity-60"
          >
            {loading ? labels.loading : labels.enter}
          </button>
        </div>
        {error ? (
          <div className="mt-3 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-sm">
            {error}
          </div>
        ) : null}
      </div>

      <div className="p-5 rounded-2xl bg-white border border-slate-200">
        <div className="font-semibold">{labels.orders}</div>
        <div className="mt-4 overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead className="text-left text-slate-600">
              <tr className="border-b border-slate-200">
                <th className="py-2 pr-4">订单号</th>
                <th className="py-2 pr-4">上车时间</th>
                <th className="py-2 pr-4">路线</th>
                <th className="py-2 pr-4">车型</th>
                <th className="py-2 pr-4">金额</th>
                <th className="py-2 pr-4">状态</th>
                <th className="py-2 pr-4">操作</th>
              </tr>
            </thead>
            <tbody>
              {rows.length === 0 ? (
                <tr>
                  <td className="py-4 text-slate-500" colSpan={7}>
                    暂无数据。请先用用户端下单，然后回来加载。
                  </td>
                </tr>
              ) : (
                rows.map((r) => (
                  <tr key={r.id} className="border-b border-slate-100">
                    <td className="py-3 pr-4 font-mono text-xs">{r.id}</td>
                      <td className="py-3 pr-4">{formatDateTimeJST(r.pickupTime, locale)}</td>
                      <td className="py-3 pr-4">{r.fromTo}</td>
                      <td className="py-3 pr-4">{r.vehicleName}</td>
                      <td className="py-3 pr-4">
                        <div className="font-medium">{formatMoneyFromJpy(r.totalJpy, currency, locale)}</div>
                        {r.manualAdjustmentJpy !== 0 ? (
                          <div className="text-xs text-slate-500">
                            {labels.manualAdjustment}: {formatMoneyFromJpy(r.manualAdjustmentJpy, currency, locale)}
                          </div>
                        ) : null}
                      </td>
                    <td className="py-3 pr-4">
                      <span className="inline-flex items-center gap-2">
                        {r.status}
                        {r.isUrgent ? (
                          <span className="text-xs px-2 py-0.5 rounded-full bg-rose-50 text-rose-700 border border-rose-200">
                            急单
                          </span>
                        ) : null}
                      </span>
                    </td>
                    <td className="py-3 pr-4">
                      <button
                        className="px-3 py-1.5 rounded-lg border border-slate-200 hover:bg-slate-50"
                        onClick={() => setEditingId(r.id)}
                      >
                        {labels.edit}
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {editingRow ? (
        <div className="p-5 rounded-2xl bg-white border border-slate-200">
          <div className="font-semibold">{labels.editTitle}</div>
          <div className="text-sm text-slate-600 mt-1">
            {editingRow.id} · {editingRow.contactName}（{editingRow.contactEmail}）
          </div>

          <div className="mt-4 grid md:grid-cols-3 gap-3">
            <label className="text-sm block">
              <div className="text-slate-700 mb-1">{labels.status}</div>
              <select
                className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white"
                value={status}
                onChange={(e) => setStatus(e.target.value)}
              >
                <option value="PENDING_PAYMENT">PENDING_PAYMENT</option>
                <option value="PAID">PAID</option>
                <option value="CONFIRMED">CONFIRMED</option>
                <option value="IN_SERVICE">IN_SERVICE</option>
                <option value="COMPLETED">COMPLETED</option>
                <option value="CANCELLED">CANCELLED</option>
              </select>
            </label>

            <label className="text-sm block">
              <div className="text-slate-700 mb-1">{labels.manualAdjustment}</div>
              <input
                type="number"
                className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white"
                value={manualAdjustmentJpy}
                onChange={(e) => setManualAdjustmentJpy(Number(e.target.value))}
              />
              <div className="text-xs text-slate-500 mt-1">可为负数（优惠）或正数（加价）</div>
            </label>

            <label className="text-sm block">
              <div className="text-slate-700 mb-1">{labels.note}</div>
              <input
                className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white"
                value={pricingNote}
                onChange={(e) => setPricingNote(e.target.value)}
                placeholder="例如：深夜接送 +2000"
              />
            </label>
          </div>

          <div className="mt-4 flex gap-2">
            <button
              className="px-4 py-2 rounded-xl bg-brand-600 text-white hover:bg-brand-700 disabled:opacity-60"
              disabled={loading}
              onClick={save}
            >
              {loading ? labels.saving : labels.save}
            </button>
            <button
              className="px-4 py-2 rounded-xl border border-slate-200 hover:bg-slate-50 disabled:opacity-60"
              disabled={loading}
              onClick={() => setEditingId(null)}
            >
              关闭
            </button>
          </div>
        </div>
      ) : null}
    </div>
  );
}


