import React, { useEffect, useState } from "react";
import { employees, types, statuses, priorities } from "../data";

export default function TaskModal({ isOpen, onClose, onSave, editing }) {
  const [form, setForm] = useState({
    id: null,
    title: "",
    type: types[0],
    status: "قيد التنفيذ",
    client: "",
    assignee: employees[0],
    priority: "متوسطة",
    startDate: "",
    dueDate: "",
    progress: 0,
    tags: [],
    attachments: []
  });

  useEffect(()=>{
    if (editing) setForm(editing);
    else setForm(f=>({...f, id:null, title:"", client:"", startDate:"", dueDate:"", progress:0, tags:[], attachments: [] }));
  },[editing, isOpen]);

  if (!isOpen) return null;

  function handleSave() {
    const payload = { 
      ...form, 
      progress: Number(form.progress)||0, 
      tags: Array.isArray(form.tags)?form.tags: String(form.tags||'').split(',').map(s=>s.trim()).filter(Boolean) 
    };
    onSave(payload);
  }

  async function handleFiles(e) {
    const files = Array.from(e.target.files || []);
    const converted = await Promise.all(files.map(f => fileToDataUrl(f)));
    setForm(prev => ({...prev, attachments: [...(prev.attachments||[]), ...converted]}));
  }

  function removeAttachment(i) {
    setForm(prev => ({...prev, attachments: prev.attachments.filter((_,idx)=>idx!==i)}));
  }

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow p-4 w-[95vw] max-w-3xl">
        <h3 className="font-semibold text-lg mb-3">{editing ? "تعديل مهمة" : "مهمة جديدة"}</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <Input label="اسم المهمة" value={form.title} onChange={e=>setForm({...form,title:e.target.value})}/>
          <Input label="الجهة" value={form.client} onChange={e=>setForm({...form,client:e.target.value})}/>
          <Select label="النوع" value={form.type} onChange={e=>setForm({...form,type:e.target.value})} options={types}/>
          <Select label="الحالة" value={form.status} onChange={e=>setForm({...form,status:e.target.value})} options={statuses}/>
          <Select label="المسؤول" value={form.assignee} onChange={e=>setForm({...form,assignee:e.target.value})} options={employees}/>
          <Select label="الأولوية" value={form.priority} onChange={e=>setForm({...form,priority:e.target.value})} options={priorities}/>
          <Input label="تاريخ البداية" type="date" value={form.startDate} onChange={e=>setForm({...form,startDate:e.target.value})}/>
          <Input label="تاريخ الاستحقاق" type="date" value={form.dueDate} onChange={e=>setForm({...form,dueDate:e.target.value})}/>
          <Input label="نسبة الإنجاز (%)" type="number" value={form.progress} onChange={e=>setForm({...form,progress:e.target.value})}/>
          <Input label="وسوم (مفصولة بفواصل)" value={Array.isArray(form.tags)?form.tags.join(', '):form.tags} onChange={e=>setForm({...form,tags:e.target.value})}/>
          <div className="md:col-span-2">
            <label className="text-sm">
              <div className="mb-1 text-gray-600">مرفقات</div>
              <input type="file" multiple onChange={handleFiles} className="w-full px-3 py-2 border rounded-lg"/>
            </label>
            <div className="mt-2 grid grid-cols-1 md:grid-cols-2 gap-2">
              {(form.attachments||[]).map((a, i) => (
                <div key={i} className="border rounded p-2 text-sm flex items-center justify-between">
                  <div className="truncate">{a.name} <span className="text-gray-400">({Math.round((a.size||0)/1024)} KB)</span></div>
                  <div className="flex items-center gap-2">
                    <a href={a.dataUrl} download={a.name} className="text-blue-600 hover:underline">تحميل</a>
                    <button onClick={()=>removeAttachment(i)} className="text-red-600">حذف</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="mt-4 flex items-center justify-end gap-2">
          <button onClick={onClose} className="px-4 py-2 rounded-lg border">إلغاء</button>
          <button onClick={handleSave} className="px-4 py-2 rounded-lg bg-blue-600 text-white">{editing?"حفظ التعديل":"إضافة"}</button>
        </div>
      </div>
    </div>
  );
}

function Input({ label, ...rest }) {
  return (
    <label className="text-sm">
      <div className="mb-1 text-gray-600">{label}</div>
      <input className="w-full px-3 py-2 border rounded-lg" {...rest} />
    </label>
  );
}

function Select({ label, options, ...rest }) {
  return (
    <label className="text-sm">
      <div className="mb-1 text-gray-600">{label}</div>
      <select className="w-full px-3 py-2 border rounded-lg" {...rest}>
        {options.map(o => <option key={o} value={o}>{o}</option>)}
      </select>
    </label>
  );
}

function fileToDataUrl(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve({ name: file.name, size: file.size, type: file.type, dataUrl: reader.result });
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}