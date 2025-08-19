import React, { useMemo } from "react";

export default function CalendarView({ tasks }) {
  const byMonth = useMemo(()=>{
    const m = {};
    tasks.forEach(t=>{
      const d = new Date(t.dueDate);
      if (isNaN(d)) return;
      const key = d.toLocaleDateString('ar-SA', { year: 'numeric', month: 'long' });
      (m[key] = m[key] || []).push(t);
    });
    return m;
  },[tasks]);

  const months = Object.entries(byMonth).sort((a,b)=> a[0].localeCompare(b[0]));

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {months.map(([month, rows]) => (
        <div key={month} className="bg-white rounded-xl shadow p-4">
          <h3 className="font-semibold mb-2">{month} <span className="text-xs text-gray-500">({rows.length})</span></h3>
          <div className="space-y-2">
            {rows.map(t=> (
              <div key={t.id} className="border rounded-lg p-3">
                <div className="flex items-center justify-between">
                  <p className="font-medium truncate">{t.title}</p>
                  <span className="text-xs text-gray-500">{t.dueDate}</span>
                </div>
                <p className="text-xs text-gray-500">{t.assignee} • {t.client} • {t.status}</p>
              </div>
            ))}
          </div>
        </div>
      ))}
      {months.length===0 && <div className="text-sm text-gray-500">لا توجد مهام في التقويم.</div>}
    </div>
  );
}