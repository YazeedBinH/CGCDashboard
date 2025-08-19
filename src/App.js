import React, { useEffect, useMemo, useState } from "react";
import { Activity, Filter, Download, PlusCircle, LayoutGrid, Table as TableIcon, Printer, Users } from "lucide-react";
import { seedTasks, employees, types, statuses, priorities } from "./data";
import DashboardCharts from "./components/DashboardCharts";
import TaskTable from "./components/TaskTable";
import KanbanBoard from "./components/KanbanBoard";
import TaskModal from "./components/TaskModal";
import CalendarView from "./components/CalendarView";
import { exportToCSV } from "./utils/exportCsv";

const STORAGE_KEY = "admin-dashboard-pro-tasks";
const ROLE_KEY = "admin-dashboard-pro-role";

export default function App() {
  const [tasks, setTasks] = useState(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : seedTasks;
  });
  const [view, setView] = useState("table"); // table | kanban | calendar
  const [isOpen, setIsOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [role, setRole] = useState(localStorage.getItem(ROLE_KEY) || "admin"); // admin | member

  const [filters, setFilters] = useState({
    q: "",
    status: "الكل",
    type: "الكل",
    client: "الكل",
    assignee: "الكل",
    priority: "الكل",
    start: "",
    end: "",
    groupBy: "لا شيء"
  });

  useEffect(() => localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks)), [tasks]);
  useEffect(() => localStorage.setItem(ROLE_KEY, role), [role]);

  const filtered = useMemo(() => {
    const q = filters.q.trim().toLowerCase();
    const startTime = filters.start ? new Date(filters.start).getTime() : null;
    const endTime = filters.end ? new Date(filters.end).getTime() : null;
    return tasks.filter(t => {
      const inQ = !q || [t.title, t.client, t.type, t.assignee, ...(t.tags||[])].join(" ").toLowerCase().includes(q);
      const inStatus = filters.status === "الكل" || t.status === filters.status;
      const inType = filters.type === "الكل" || t.type === filters.type;
      const inClient = filters.client === "الكل" || t.client === filters.client;
      const inAssignee = filters.assignee === "الكل" || t.assignee === filters.assignee;
      const inPriority = filters.priority === "الكل" || t.priority === filters.priority;
      const due = new Date(t.dueDate).getTime();
      const inDate = (!startTime || due >= startTime) && (!endTime || due <= endTime);
      return inQ && inStatus && inType && inClient && inAssignee && inPriority && inDate;
    });
  }, [tasks, filters]);

  const kpis = useMemo(() => {
    const total = filtered.length;
    const completed = filtered.filter(t => t.status === "مكتمل").length;
    const late = filtered.filter(t => t.status === "متأخر").length;
    const inProgress = filtered.filter(t => t.status === "قيد التنفيذ").length;
    const avg = Math.round(filtered.reduce((s,t)=>s+(t.progress||0),0)/(total||1));
    return { total, completed, late, inProgress, avg };
  }, [filtered]);

  function requireAdmin() {
    if (role !== "admin") { alert("ليس لديك صلاحية هذا الإجراء (فقط المدير)."); return false; }
    return true;
  }

  function onSave(task) {
    if (!requireAdmin()) return;
    if (task.id) setTasks(prev => prev.map(t => t.id === task.id ? task : t));
    else {
      const nextId = (tasks.reduce((m,t)=>Math.max(m,t.id),0) + 1) || 1;
      setTasks(prev => [...prev, { ...task, id: nextId }]);
    }
    setIsOpen(false); setEditing(null);
  }
  function onDelete(id) {
    if (!requireAdmin()) return;
    setTasks(prev => prev.filter(t => t.id !== id));
  }
  function exportFiltered() {
    const rows = filtered.map(t => ({
      "المعرف": t.id, "اسم المهمة": t.title, "النوع": t.type, "الحالة": t.status, "الجهة": t.client,
      "المسؤول": t.assignee, "الأولوية": t.priority, "بداية": t.startDate, "استحقاق": t.dueDate,
      "الإنجاز": t.progress + "%", "وسوم": (t.tags||[]).join("|"), "مرفقات": (t.attachments||[]).map(a=>a.name).join("|")
    }));
    exportToCSV("tasks.csv", rows);
  }

  return (
    <div dir="rtl" className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <div className="p-4 md:p-6 bg-white shadow">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-blue-600 p-3 rounded-lg"><Activity className="text-white w-7 h-7"/></div>
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-gray-800">لوحة إدارة المهام الاحترافية</h1>
              <p className="text-sm text-gray-500">إدارة وتتبّع المهام — نسخة جاهزة للنشر</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-2 bg-gray-100 px-3 py-2 rounded-lg">
              <Users className="w-4 h-4"/><span className="text-sm">الدور:</span>
              <select className="bg-transparent" value={role} onChange={e=>setRole(e.target.value)}>
                <option value="admin">مدير</option>
                <option value="member">عضو</option>
              </select>
            </div>
            <button onClick={()=>{window.print()}} className="px-3 py-2 rounded-lg bg-gray-100 hover:bg-gray-200 flex items-center gap-2"><Printer className="w-4 h-4"/> طباعة</button>
            <button onClick={exportFiltered} className="px-3 py-2 rounded-lg bg-green-600 hover:bg-green-700 text-white flex items-center gap-2"><Download className="w-4 h-4"/> تصدير</button>
            <button onClick={()=>{ if(role!=='admin'){return alert('فقط المدير يمكنه إضافة المهام');} setEditing(null); setIsOpen(true);}} className="px-3 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white flex items-center gap-2"><PlusCircle className="w-4 h-4"/> مهمة جديدة</button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-4 md:p-6">
        <div className="bg-white p-4 md:p-6 rounded-xl shadow">
          <div className="flex items-center gap-2 mb-4"><Filter className="w-5 h-5 text-gray-600"/><h2 className="font-semibold text-lg">التصفية المتقدمة</h2></div>
          <div className="grid grid-cols-1 md:grid-cols-4 lg:grid-cols-9 gap-3">
            <input placeholder="بحث..." className="px-3 py-2 border rounded-lg" value={filters.q} onChange={e=>setFilters(f=>({...f,q:e.target.value}))}/>
            <select className="px-3 py-2 border rounded-lg" value={filters.status} onChange={e=>setFilters(f=>({...f,status:e.target.value}))}>
              <option>الكل</option>{statuses.map(s=><option key={s}>{s}</option>)}
            </select>
            <select className="px-3 py-2 border rounded-lg" value={filters.type} onChange={e=>setFilters(f=>({...f,type:e.target.value}))}>
              <option>الكل</option>{types.map(s=><option key={s}>{s}</option>)}
            </select>
            <input placeholder="الجهة" className="px-3 py-2 border rounded-lg" value={filters.client} onChange={e=>setFilters(f=>({...f,client:e.target.value}))}/>
            <select className="px-3 py-2 border rounded-lg" value={filters.assignee} onChange={e=>setFilters(f=>({...f,assignee:e.target.value}))}>
              <option>الكل</option>{employees.map(s=><option key={s}>{s}</option>)}
            </select>
            <select className="px-3 py-2 border rounded-lg" value={filters.priority} onChange={e=>setFilters(f=>({...f,priority:e.target.value}))}>
              <option>الكل</option>{['عالية','متوسطة','منخفضة'].map(s=><option key={s}>{s}</option>)}
            </select>
            <input type="date" className="px-3 py-2 border rounded-lg" value={filters.start} onChange={e=>setFilters(f=>({...f,start:e.target.value}))}/>
            <input type="date" className="px-3 py-2 border rounded-lg" value={filters.end} onChange={e=>setFilters(f=>({...f,end:e.target.value}))}/>
            <select className="px-3 py-2 border rounded-lg" value={filters.groupBy} onChange={e=>setFilters(f=>({...f,groupBy:e.target.value}))}>
              <option>لا شيء</option>
              <option>الحالة</option>
              <option>الجهة</option>
              <option>المسؤول</option>
            </select>
            <button onClick={()=>setFilters({q:"",status:"الكل",type:"الكل",client:"الكل",assignee:"الكل",priority:"الكل",start:"",end:"",groupBy:"لا شيء"})} className="px-3 py-2 border rounded-lg">إعادة تعيين</button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-4 md:p-6 pt-0">
        <DashboardCharts tasks={filtered} kpis={kpis} />
      </div>

      <div className="max-w-7xl mx-auto p-4 md:p-6 pt-0">
        <div className="flex items-center gap-2 mb-3">
          <button onClick={()=>setView('table')} className={`px-3 py-2 rounded-lg border flex items-center gap-2 ${view==='table'?'bg-blue-600 text-white':'bg-white'}`}><TableIcon className="w-4 h-4"/> جدول</button>
          <button onClick={()=>setView('kanban')} className={`px-3 py-2 rounded-lg border flex items-center gap-2 ${view==='kanban'?'bg-blue-600 text-white':'bg-white'}`}><LayoutGrid className="w-4 h-4"/> كانبان</button>
          <button onClick={()=>setView('calendar')} className={`px-3 py-2 rounded-lg border flex items-center gap-2 ${view==='calendar'?'bg-blue-600 text-white':'bg-white'}`}><LayoutGrid className="w-4 h-4"/> تقويم</button>
        </div>

        {view === "table" && <TaskTable tasks={filtered} groupBy={filters.groupBy} onEdit={(t)=>{ setEditing(t); setIsOpen(true);}} onDelete={onDelete}/>}
        {view === "kanban" && <KanbanBoard tasks={filtered} onEdit={(t)=>{ setEditing(t); setIsOpen(true);}} />}
        {view === "calendar" && <CalendarView tasks={filtered} />}
      </div>

      <TaskModal isOpen={isOpen} onClose={()=>{setIsOpen(false); setEditing(null);}} onSave={onSave} editing={editing} />
      <footer className="text-center text-sm text-gray-500 py-6">© 2025 إدارة التخطيط — نسخة جاهزة للنشر</footer>
    </div>
  );
}