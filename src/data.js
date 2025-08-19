export const employees = ["صالح","نواف","الجوهرة","أخدان","فاطمة","غيداء","فلوة","أسامة","ريما","نازك","رامي","شروق","لذة"];
export const types = ["تقارير","خطط إعلامية","عروض","مراجعات"];
export const statuses = ["قيد التنفيذ","مكتمل","متأخر"];
export const priorities = ["عالية","متوسطة","منخفضة"];

export const seedTasks = [
  { id: 1, title: "تقرير شهر ديسمبر لعام 2024", type: "تقارير", status: "مكتمل", client: "داخلي", assignee: "صالح", startDate: "2023-12-31", dueDate: "2025-01-01", priority: "عالية", progress: 100, tags:["تقرير","شهرية"], attachments: []},
  { id: 2, title: "التقرير السنوي لإدارة التخطيط الإعلامي", type: "تقارير", status: "مكتمل", client: "داخلي", assignee: "الجوهرة", startDate: "2025-01-01", dueDate: "2025-01-01", priority: "عالية", progress: 100, tags:["تقرير","سنوي"], attachments: []},
  { id: 3, title: "الخطة التفصيلية لتنفيذ البدائل المقترحة", type: "خطط إعلامية", status: "قيد التنفيذ", client: "توجيه", assignee: "نواف", startDate: "2024-05-09", dueDate: "2025-10-01", priority: "عالية", progress: 95, tags:["خطة"], attachments: []},
  { id: 4, title: "مراجعة مبادرات الخطة الوطنية", type: "مراجعات", status: "قيد التنفيذ", client: "المكتب التنفيذي", assignee: "فاطمة", startDate: "2024-12-30", dueDate: "2025-11-15", priority: "متوسطة", progress: 35, tags:["مبادرات"], attachments: []},
  { id: 5, title: "الخطة الإعلامية لجمعية ارتقاء", type: "خطط إعلامية", status: "قيد التنفيذ", client: "جمعية ارتقاء", assignee: "غيداء", startDate: "2025-01-15", dueDate: "2025-09-30", priority: "متوسطة", progress: 80, tags:["جمعيات"], attachments: []},
  { id: 6, title: "خطة مؤتمر ومعرض الحج", type: "خطط إعلامية", status: "مكتمل", client: "وزارة الحج والعمرة", assignee: "ريما", startDate: "2025-01-01", dueDate: "2025-01-08", priority: "عالية", progress: 100, tags:["مؤتمرات"], attachments: []},
  { id: 7, title: "خطة التعامل مع المخاطر", type: "خطط إعلامية", status: "قيد التنفيذ", client: "وزارة الداخلية", assignee: "أسامة", startDate: "2025-01-07", dueDate: "2025-12-31", priority: "عالية", progress: 60, tags:["مخاطر"], attachments: []},
  { id: 8, title: "جمع ممثلي الأجهزة الحكومية", type: "عروض", status: "قيد التنفيذ", client: "داخلي", assignee: "رامي", startDate: "2025-01-13", dueDate: "2025-10-30", priority: "منخفضة", progress: 15, tags:["تنسيق"], attachments: []},
  { id: 9, title: "جمع بيانات ممثلي الأجهزة", type: "عروض", status: "قيد التنفيذ", client: "داخلي", assignee: "شروق", startDate: "2025-01-13", dueDate: "2025-10-30", priority: "منخفضة", progress: 20, tags:["بيانات"], attachments: []},
  { id: 10, title: "تقارير رصد الرأي العام", type: "خطط إعلامية", status: "قيد التنفيذ", client: "داخلي", assignee: "نازك", startDate: "2025-01-09", dueDate: "2025-10-15", priority: "متوسطة", progress: 70, tags:["رصد"], attachments: []}
];