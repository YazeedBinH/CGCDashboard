import React from "react";

const columns = [
  { key: "قيد التنفيذ", title: "قيد التنفيذ" },
  { key: "متأخر", title: "متأخر" },
  { key: "مكتمل", title: "مكتمل" }
];

export default function KanbanBoard({ tasks, onEdit }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {columns.map(col => {
        const items = tasks.filter(t => t.status === col.key);
        return (
          <div key={col.key} className="bg-white rounded-xl shadow p-3">
            <h3 className="font-semibold mb-2">{col.title} <span className="text-xs text-gray-500">({items.length})</span></h3>
            <div className="space-y-2">
              {items.map(t => (
                <div key={t.id} className="border rounded-lg p-3 hover:shadow cursor-pointer" onClick={()=>onEdit(t)}>
                  <div className="flex items-center justify-between mb-1">
                    <p className="font-medium truncate">{t.title}</p>
                    <span className={`px-2 py-0.5 rounded-full text-xs ${t.priority==='عالية'?'bg-red-100 text-red-700':t.priority==='متوسطة'?'bg-yellow-100 text-yellow-700':'bg-green-100 text-green-700'}`}>{t.priority}</span>
                  </div>
                  <p className="text-xs text-gray-500">{t.assignee} • {t.client}</p>
                  <div className="w-full bg-gray-200 h-2 rounded-full mt-2">
                    <div className={`h-2 rounded-full ${t.progress===100?'bg-green-500':'bg-blue-500'}`} style={{width: `${t.progress}%`}}></div>
                  </div>
                </div>
              ))}
              {items.length===0 && <div className="text-sm text-gray-400">لا توجد مهام</div>}
            </div>
          </div>
        );
      })}
    </div>
  );
}