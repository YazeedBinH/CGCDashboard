import React, { useMemo } from "react";
import { CheckCircle, Clock, AlertTriangle, TrendingUp } from "lucide-react";
import { ResponsiveContainer, BarChart, Bar, CartesianGrid, XAxis, YAxis, Tooltip, PieChart, Pie, Cell, AreaChart, Area, LineChart, Line } from "recharts";
import { format } from "date-fns";

export default function DashboardCharts({ tasks, kpis }) {
  const colors = ['#8884d8', '#82ca9d', '#ffc658', '#ff7300', '#8dd1e1', '#d084d0'];

  const byStatus = useMemo(()=>{
    const m = {"مكتمل":0,"قيد التنفيذ":0,"متأخر":0};
    tasks.forEach(t=>{ m[t.status] = (m[t.status]||0) + 1; });
    return Object.entries(m).map(([status,count])=>({status,count}));
  },[tasks]);

  const byAssignee = useMemo(()=>{
    const m = {};
    tasks.forEach(t=>{ m[t.assignee] = (m[t.assignee]||0) + 1; });
    return Object.entries(m).map(([assignee,count])=>({assignee,count})).sort((a,b)=>b.count-a.count).slice(0,8);
  },[tasks]);

  const progressDist = useMemo(()=>{
    const ranges = {'0-25%':0,'26-50%':0,'51-75%':0,'76-100%':0};
    tasks.forEach(t=>{
      const p = t.progress||0;
      if (p<=25) ranges['0-25%']++;
      else if (p<=50) ranges['26-50%']++;
      else if (p<=75) ranges['51-75%']++;
      else ranges['76-100%']++;
    });
    return Object.entries(ranges).map(([range,count])=>({range,count}));
  },[tasks]);

  const byMonth = useMemo(()=>{
    const m = {};
    tasks.forEach(t=>{
      const d = new Date(t.dueDate);
      const key = format(d, "yyyy-MM");
      m[key] = (m[key]||0)+1;
    });
    return Object.entries(m).sort(([a],[b])=>a.localeCompare(b)).map(([month,count])=>({month,count}));
  },[tasks]);

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <KPI title="إجمالي المهام" value={kpis.total} icon={<TrendingUp className="text-blue-600"/>}/>
        <KPI title="مكتملة" value={kpis.completed} icon={<CheckCircle className="text-green-600"/>}/>
        <KPI title="قيد التنفيذ" value={kpis.inProgress} icon={<Clock className="text-yellow-600"/>}/>
        <KPI title="متوسط الإنجاز" value={`${kpis.avg}%`} icon={<AlertTriangle className="text-purple-600"/>}/>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <div className="bg-white rounded-xl shadow p-4">
          <h3 className="font-semibold mb-2">توزيع الحالات</h3>
          <ResponsiveContainer width="100%" height={260}>
            <PieChart>
              <Pie data={byStatus} dataKey="count" nameKey="status" cx="50%" cy="50%" outerRadius={90} label>
                {byStatus.map((entry, index) => <Cell key={index} fill={colors[index % colors.length]}/>)}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
        <div className="bg-white rounded-xl shadow p-4">
          <h3 className="font-semibold mb-2">المهام حسب المسؤول (Top 8)</h3>
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={byAssignee}>
              <CartesianGrid strokeDasharray="3 3"/>
              <XAxis dataKey="assignee"/>
              <YAxis/>
              <Tooltip/>
              <Bar dataKey="count" fill="#82ca9d"/>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow p-4">
          <h3 className="font-semibold mb-2">توزيع نسب الإنجاز</h3>
          <ResponsiveContainer width="100%" height={260}>
            <AreaChart data={progressDist}>
              <CartesianGrid strokeDasharray="3 3"/>
              <XAxis dataKey="range"/>
              <YAxis/>
              <Tooltip/>
              <Area type="monotone" dataKey="count" stroke="#8884d8" fill="#8884d8" fillOpacity={0.4}/>
            </AreaChart>
          </ResponsiveContainer>
        </div>
        <div className="bg-white rounded-xl shadow p-4">
          <h3 className="font-semibold mb-2">مهام بحسب شهر الاستحقاق</h3>
          <ResponsiveContainer width="100%" height={260}>
            <LineChart data={byMonth}>
              <CartesianGrid strokeDasharray="3 3"/>
              <XAxis dataKey="month"/>
              <YAxis/>
              <Tooltip/>
              <Line type="monotone" dataKey="count" stroke="#ff7300"/>
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </>
  );
}

function KPI({ title, value, icon }) {
  return (
    <div className="bg-white rounded-xl shadow p-4 flex items-center gap-3">
      <div className="p-3 rounded-lg bg-gray-100">{icon}</div>
      <div>
        <p className="text-sm text-gray-500">{title}</p>
        <p className="text-2xl font-bold">{value}</p>
      </div>
    </div>
  );
}