import React, { useMemo } from "react";
import { Pencil, Trash2 } from "lucide-react";

export default function TaskTable({ tasks, onEdit, onDelete, groupBy = "لا شيء" }) {
  const grouped = useMemo(() => {
    if (groupBy === "لا شيء") return { "": tasks };
    const keyMap = {
      "الحالة": "status",
      "الجهة": "client",
      "المسؤول": "assignee"
    };
    const key = keyMap[groupBy];
    const m = {};
    tasks.forEach(t => {
      const k = t[key] || "غير محدد";
      (m[k] = m[k] || []).push(t);
    });
    return m;
  }, [tasks, groupBy]);

  return (
    <div className="bg-white rounded-xl shadow p-4 overflow-x-auto space-y-6">
      {Object.entries(grouped).map(([group, rows]) => (
        <div key={group || "all"}>
          {groupBy !== "لا شيء" && <div className="text-sm font-semibold text-gray-600 mb-2">{group} <span className="text-gray-400">({rows.length})</span></div>}
          <table className="w-full min-w-[1000px]">
            <thead className="bg-gray-50">
              <tr>
                <TH>اسم المهمة</TH><TH>النوع</TH><TH>الحالة</TH><TH>الجهة</TH><TH>المسؤول</TH>
                <TH>الأولوية</TH><TH>الإنجاز</TH><TH>بداية</TH><TH>استحقاق</TH><TH>مرفقات</TH><TH>إجراءات</TH>
              </tr>
            </thead>
            <tbody className="divide-y">
              {rows.map(t => (
                <tr key={t.id} className="hover:bg-gray-50">
                  <TD title={t.title} className="max-w-[240px] truncate">{t.title}</TD>
                  <TD>{t.type}</TD>
                  <TD><Badge status={t.status} /></TD>
                  <TD>{t.client}</TD>
                  <TD>{t.assignee}</TD>
                  <TD>{t.priority}</TD>
                  <TD>
                    <div className="flex items-center gap-2">
                      <div className="w-20 bg-gray-200 h-2 rounded-full">
                        <div className={`h-2 rounded-full ${t.progress===100?'bg-green-500':'bg-blue-500'}`} style={{width: `${t.progress}%`}}></div>
                      </div>
                      <span className="text-xs">{t.progress}%</span>
                    </div>
                  </TD>
                  <TD>{t.startDate}</TD>
                  <TD>{t.dueDate}</TD>
                  <TD className="text-xs text-gray-600">{(t.attachments||[]).length}</TD>
                  <TD>
                    <div className="flex items-center gap-2">
                      <button onClick={()=>onEdit(t)} className="p-1 rounded hover:bg-gray-100"><Pencil className="w-4 h-4"/></button>
                      <button onClick={()=>onDelete(t.id)} className="p-1 rounded hover:bg-gray-100"><Trash2 className="w-4 h-4"/></button>
                    </div>
                  </TD>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ))}
    </div>
  );
}

function Badge({ status }) {
  const cls = status==='مكتمل'?'bg-green-100 text-green-700': status==='متأخر'?'bg-red-100 text-red-700':'bg-yellow-100 text-yellow-700';
  return <span className={`px-2 py-1 rounded-full text-xs ${cls}`}>{status}</span>;
}
function TH({ children }) { return <th className="text-right text-xs font-semibold text-gray-600 px-3 py-2">{children}</th>; }
function TD({ children, className, ...rest }) { return <td className={`px-3 py-2 text-sm ${className||''}`} {...rest}>{children}</td>; }