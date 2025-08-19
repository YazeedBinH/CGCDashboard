# لوحة إدارة المهام الاحترافية (جاهزة للنشر)

**تقنيات:** React + Tailwind + Recharts + lucide-react + date-fns  
**مزايا:** فلاتر متقدمة، جداول + كانبان + تقويم، إضافة/تعديل/حذف، مرفقات، تصدير CSV، طباعة، أدوار (مدير/عضو)، تخزين محلي.

## التشغيل محليًا
```bash
npm install
npm start
```

## البناء والنشر (Static)
### Vercel
- اربط المستودع ثم اترك الإعدادات الافتراضية (React).  
- الملف `vercel.json` موجود وجاهز.  

### Netlify
- اختَر: Build command = `npm run build`, Publish directory = `build`  
- يوجد `netlify.toml`.  

### GitHub Pages
```bash
npm run build
npm run deploy
```
> سيقوم بنشر محتوى `build/` إلى فرع `gh-pages` تلقائيًا.

## تلميحات
- تغيير الدور من شريط العنوان (مدير/عضو) يؤثر على صلاحيات التعديل.
- المرفقات تُحفظ محليًا (localStorage) لسهولة التجربة.
- يمكنك استيراد بياناتك عبر تعديل `src/data.js` أو بناء شاشة استيراد CSV.