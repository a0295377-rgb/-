import { useState, type ReactNode } from "react";
import { Link, useParams } from "wouter";
import {
  ArrowLeft,
  BarChart3,
  Check,
  CheckCircle2,
  FileText,
  Lightbulb,
  MessageCircle,
  Pencil,
  Plus,
  Send,
  Trash2,
  Users,
  Video,
  WalletCards,
} from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";
import {
  getGetTeacherDashboardQueryKey,
  getGetTeacherRevenueQueryKey,
  getGetTeacherStudentQueryKey,
  getListCommunityPostsQueryKey,
  getListTeacherContentQueryKey,
  getListTeacherStudentsQueryKey,
  useCreateCommunityPost,
  useCreateContent,
  useCreateTeacherShortVideo,
  useDeleteTeacherContent,
  useGetTeacherDashboard,
  useGetTeacherRevenue,
  useGetTeacherStudent,
  useListCommunityPosts,
  useListTeacherContent,
  useListTeacherStudents,
  useUpdateTeacherContent,
} from "@workspace/api-client-react";
import type { ContentItem, TeacherRevenue, TeacherStudent } from "@workspace/api-client-react";

const TEACHER_ID = "teacher-ahmed";
const palette = ["from-teal-900 via-teal-700 to-amber-500", "from-rose-900 via-orange-700 to-amber-400", "from-slate-800 via-teal-800 to-cyan-500"];

function formatNumber(value: number) {
  return new Intl.NumberFormat("ar-IQ").format(value);
}

function ActionButton({ children, onClick, variant = "primary", disabled = false, testId }: { children: ReactNode; onClick?: () => void; variant?: "primary" | "soft" | "outline" | "danger"; disabled?: boolean; testId: string }) {
  const styles = {
    primary: "bg-primary text-primary-foreground shadow-soft",
    soft: "bg-secondary/45 text-foreground",
    outline: "border bg-card text-foreground",
    danger: "border border-red-200 bg-red-50 text-red-700",
  };
  return <button data-testid={testId} disabled={disabled} onClick={onClick} className={`inline-flex items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-xs font-bold transition hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-50 ${styles[variant]}`}>{children}</button>;
}

function PageHeader({ eyebrow, title, description, action }: { eyebrow: string; title: string; description: string; action?: ReactNode }) {
  return <div className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between"><div><p className="text-[10px] font-bold tracking-[.16em] text-accent">{eyebrow}</p><h1 className="mt-2 text-3xl font-extrabold">{title}</h1><p className="mt-2 text-xs text-muted-foreground">{description}</p></div>{action}</div>;
}

function MetricCard({ label, value, hint, icon: Icon, accent = false }: { label: string; value: string | number; hint: string; icon: typeof Users; accent?: boolean }) {
  return <div className={`rounded-3xl border p-5 shadow-soft ${accent ? "bg-primary text-primary-foreground" : "bg-card"}`} data-testid={`metric-${label}`}><div className="flex items-center justify-between"><span className={`text-[10px] ${accent ? "text-white/65" : "text-muted-foreground"}`}>{label}</span><Icon className={`h-4 w-4 ${accent ? "text-secondary" : "text-primary"}`} /></div><p className="mt-5 font-mono-latin text-3xl font-bold">{typeof value === "number" ? formatNumber(value) : value}</p><p className={`mt-2 text-[10px] ${accent ? "text-white/60" : "text-muted-foreground"}`}>{hint}</p></div>;
}

function ContentTableRow({ item, onEdit, onDelete }: { item: ContentItem; onEdit: () => void; onDelete: () => void }) {
  return <div className="grid gap-3 rounded-2xl border bg-card p-4 shadow-soft md:grid-cols-[1fr_auto_auto] md:items-center" data-testid={`row-teacher-content-${item.id}`}><div className="flex min-w-0 items-center gap-3"><div className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br ${palette[item.views % palette.length]} text-white`}><FileText className="h-4 w-4" /></div><div className="min-w-0"><p className="text-[10px] font-bold text-accent">{item.type === "lesson" ? "محاضرة" : item.type === "short" ? "فيديو قصير" : item.type === "quiz" ? "اختبار" : item.type === "assignment" ? "واجب" : "منشور"} · {item.topic}</p><h3 className="truncate text-sm font-extrabold">{item.title}</h3><p className="mt-1 text-[10px] text-muted-foreground">{item.grade} · {formatNumber(item.views)} مشاهدة · إكمال ٧٦٪</p></div></div><span className="rounded-full bg-secondary/35 px-3 py-1 text-[10px] font-bold text-primary">{item.publishedAt}</span><div className="flex gap-2"><ActionButton onClick={onEdit} variant="outline" testId={`button-edit-content-${item.id}`}><Pencil className="h-3.5 w-3.5" />تعديل</ActionButton><ActionButton onClick={onDelete} variant="danger" testId={`button-delete-content-${item.id}`}><Trash2 className="h-3.5 w-3.5" />حذف</ActionButton></div></div>;
}

export function TeacherDashboardPage() {
  const query = useGetTeacherDashboard(TEACHER_ID);
  const dashboard = query.data ?? { studentsCount: 2840, views: 28400, subscribersCount: 732, avgLessonWatch: 76, avgQuizScore: 84, activeStudents: 416, averageScore: 84, revenue: 12450000, topContent: [], topMistakes: [{ topic: "التفاضل", errors: 182, percentage: 34 }, { topic: "المتجهات", errors: 121, percentage: 23 }, { topic: "الدوال", errors: 96, percentage: 18 }] };
  return <div className="mx-auto max-w-[1300px]"><PageHeader eyebrow="مساحة المدرّس · مدير الأكاديمية" title="صباح الخير، أستاذ أحمد" description="كل ما تحتاجه لفهم طلابك وتطوير محتواك في مكان واحد." action={<Link href="/teacher/content" data-testid="link-teacher-add-content"><ActionButton testId="button-dashboard-add"><Plus className="h-4 w-4" />إضافة محتوى</ActionButton></Link>} /><div className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-4"><MetricCard label="عدد الطلاب" value={dashboard.studentsCount} hint="طلاب مسجلون في أكاديميتك" icon={Users} accent /><MetricCard label="المشاهدات" value={dashboard.views} hint="خلال آخر ٣٠ يوماً" icon={Video} /><MetricCard label="المشتركون" value={dashboard.subscribersCount} hint="اشتراكات نشطة" icon={CheckCircle2} /><MetricCard label="متوسط الدرجات" value={`${dashboard.averageScore}%`} hint="متوسط نتائج طلابك" icon={BarChart3} /></div><div className="mt-5 grid gap-5 lg:grid-cols-[1.2fr_.8fr]"><section className="rounded-3xl border bg-card p-5 shadow-soft"><div className="mb-5 flex items-center justify-between"><h2 className="text-lg font-extrabold">أداء الأكاديمية</h2><span className="text-[10px] text-muted-foreground">آخر ٣٠ يوماً</span></div><div className="flex h-52 items-end gap-2 border-b border-dashed">{[42, 58, 48, 71, 65, 80, 66, 89, 78, 94, 82, 100, 86, 92].map((height, index) => <div key={index} className="group flex flex-1 flex-col justify-end"><div data-testid={`chart-bar-${index}`} style={{ height: `${10 + height * 0.42}px` }} className={`rounded-t-lg transition group-hover:bg-primary ${index % 4 === 3 ? "bg-accent" : "bg-primary/70"}`} /></div>)}</div><div className="mt-3 flex justify-between text-[9px] text-muted-foreground"><span>١ حزيران</span><span>٣٠ حزيران</span></div></section><section className="rounded-3xl border bg-card p-5 shadow-soft"><h2 className="text-lg font-extrabold">أكثر المواضيع التي يخطئ فيها الطلاب</h2><div className="mt-6 space-y-5">{dashboard.topMistakes.map((mistake) => <div key={mistake.topic} data-testid={`mistake-${mistake.topic}`}><div className="flex justify-between text-[10px]"><span>{mistake.topic}</span><b>{mistake.percentage}% · {mistake.errors} خطأ</b></div><div className="mt-2 h-2 rounded-full bg-muted"><div className="h-full rounded-full bg-accent" style={{ width: `${mistake.percentage * 2}%` }} /></div></div>)}</div></section></div><div className="mt-5 grid gap-5 lg:grid-cols-3"><MetricCard label="الطلاب النشطون" value={dashboard.activeStudents} hint="نشاط خلال آخر ٧ أيام" icon={Users} /><MetricCard label="إجمالي الإيرادات التجريبية" value={`${formatNumber(dashboard.revenue)} د.ع`} hint="بيانات تجريبية قابلة للربط ببوابة دفع لاحقاً" icon={WalletCards} /><MetricCard label="متوسط مشاهدة الدرس" value={`${dashboard.avgLessonWatch}%`} hint={`متوسط الاختبارات ${dashboard.avgQuizScore}/100`} icon={BarChart3} /></div><section className="mt-8"><div className="mb-5 flex items-center justify-between"><h2 className="text-lg font-extrabold">أكثر المحاضرات مشاهدة</h2><Link href="/teacher/content" className="text-xs font-bold text-primary" data-testid="link-dashboard-content">إدارة المحتوى <ArrowLeft className="mr-1 inline h-3 w-3" /></Link></div><div className="grid gap-3 md:grid-cols-2">{dashboard.topContent.slice(0, 4).map((item) => <ContentTableRow key={item.id} item={item} onEdit={() => undefined} onDelete={() => undefined} />)}</div></section></div>;
}

export function TeacherContentPage() {
  const cache = useQueryClient();
  const query = useListTeacherContent(TEACHER_ID);
  const create = useCreateContent();
  const update = useUpdateTeacherContent();
  const remove = useDeleteTeacherContent();
  const video = useCreateTeacherShortVideo();
  const [formOpen, setFormOpen] = useState(false);
  const [videoOpen, setVideoOpen] = useState(false);
  const [editing, setEditing] = useState<ContentItem | null>(null);
  const [title, setTitle] = useState("");
  const [type, setType] = useState<"lesson" | "short" | "assignment" | "post">("lesson");
  const [topic, setTopic] = useState("التفاضل");
  const [videoTitle, setVideoTitle] = useState("");
  const [items, setItems] = useState<ContentItem[]>([]);
  const content = items.length ? items : query.data ?? [];
  const refresh = () => { cache.invalidateQueries({ queryKey: getListTeacherContentQueryKey(TEACHER_ID) }); cache.invalidateQueries({ queryKey: getGetTeacherDashboardQueryKey(TEACHER_ID) }); };
  const save = () => {
    if (!title.trim()) return;
    const data = { title, type, subject: "الرياضيات", grade: "السادس الإعدادي", topic, duration: "٢٠ دقيقة" };
    if (editing) update.mutate({ teacherId: TEACHER_ID, contentId: editing.id, data }, { onSuccess: (saved) => { setItems((old) => old.map((item) => item.id === saved.id ? saved : item)); setEditing(null); setFormOpen(false); refresh(); } });
    else create.mutate({ teacherId: TEACHER_ID, data }, { onSuccess: (saved) => { setItems((old) => [saved, ...old]); setFormOpen(false); setTitle(""); refresh(); } });
  };
  const startEdit = (item: ContentItem) => { setEditing(item); setTitle(item.title); setType(item.type === "short" || item.type === "assignment" || item.type === "post" ? item.type : "lesson"); setTopic(item.topic); setFormOpen(true); };
  const deleteItem = (item: ContentItem) => { remove.mutate({ teacherId: TEACHER_ID, contentId: item.id }, { onSuccess: () => { setItems((old) => old.filter((current) => current.id !== item.id)); refresh(); } }); };
  const publishVideo = () => { if (!videoTitle.trim()) return; video.mutate({ teacherId: TEACHER_ID, data: { title: videoTitle, subject: "الرياضيات", topic, duration: "٠:٤٥" } }, { onSuccess: () => { setVideoOpen(false); setVideoTitle(""); } }); };
  return <div className="mx-auto max-w-[1100px]"><PageHeader eyebrow="إدارة الأكاديمية" title="محتواك لك" description="أنشئ محاضرات وواجبات وفيديوهات قصيرة، وتابع أثر كل قطعة محتوى." action={<div className="flex flex-wrap gap-2"><ActionButton onClick={() => { setEditing(null); setFormOpen(true); }} testId="button-create-content"><Plus className="h-4 w-4" />محتوى جديد</ActionButton><ActionButton onClick={() => setVideoOpen(true)} variant="soft" testId="button-create-short"><Video className="h-4 w-4" />فيديو قصير</ActionButton></div>} />{formOpen && <section className="mt-7 rounded-3xl border border-primary/25 bg-primary/5 p-5" data-testid="content-form"><div className="flex items-center justify-between"><h2 className="font-extrabold">{editing ? "تعديل المحتوى" : "إضافة محتوى"}</h2><button onClick={() => setFormOpen(false)} data-testid="button-close-content-form">×</button></div><div className="mt-5 grid gap-3 md:grid-cols-3"><label className="text-[10px] font-bold text-muted-foreground md:col-span-2">العنوان<input data-testid="input-content-title" value={title} onChange={(event) => setTitle(event.target.value)} className="mt-2 w-full rounded-xl border bg-card px-4 py-3 text-xs outline-none" placeholder="مثلاً: الاشتقاق من الصفر" /></label><label className="text-[10px] font-bold text-muted-foreground">النوع<select data-testid="select-content-type" value={type} onChange={(event) => setType(event.target.value as typeof type)} className="mt-2 w-full rounded-xl border bg-card px-4 py-3 text-xs outline-none"><option value="lesson">محاضرة</option><option value="short">فيديو قصير</option><option value="assignment">واجب</option><option value="post">منشور</option></select></label><label className="text-[10px] font-bold text-muted-foreground">الموضوع<input data-testid="input-content-topic" value={topic} onChange={(event) => setTopic(event.target.value)} className="mt-2 w-full rounded-xl border bg-card px-4 py-3 text-xs outline-none" /></label></div><ActionButton onClick={save} disabled={!title.trim() || create.isPending || update.isPending} testId="button-save-content" ><Check className="h-4 w-4" />{editing ? "حفظ التعديل" : "حفظ ونشر"}</ActionButton></section>}{videoOpen && <section className="mt-4 rounded-3xl border border-accent/25 bg-accent/5 p-5" data-testid="short-video-form"><h2 className="font-extrabold">نشر فيديو قصير في Feed الطلاب</h2><p className="mt-2 text-[10px] text-muted-foreground">سيُربط الفيديو تلقائياً بمدرس الرياضيات وموضوع {topic}.</p><input data-testid="input-short-title" value={videoTitle} onChange={(event) => setVideoTitle(event.target.value)} placeholder="عنوان الفيديو القصير" className="mt-4 w-full rounded-xl border bg-card px-4 py-3 text-xs outline-none" /><div className="mt-3 flex gap-2"><ActionButton onClick={publishVideo} disabled={!videoTitle.trim() || video.isPending} testId="button-publish-short"><Send className="h-4 w-4" />نشر الفيديو</ActionButton><ActionButton onClick={() => setVideoOpen(false)} variant="outline" testId="button-cancel-short">إلغاء</ActionButton></div></section>}<div className="mt-8 flex items-center justify-between"><h2 className="text-lg font-extrabold">مكتبة المحتوى <span className="text-sm text-muted-foreground">({content.length})</span></h2><span className="text-[10px] text-muted-foreground">المشاهدات ونسبة الإكمال ظاهرة لكل عنصر</span></div><div className="mt-4 grid gap-3">{content.map((item) => <ContentTableRow key={item.id} item={item} onEdit={() => startEdit(item)} onDelete={() => deleteItem(item)} />)}</div></div>;
}

export function TeacherStudentsPage() {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const list = useListTeacherStudents(TEACHER_ID);
  const detail = useGetTeacherStudent(TEACHER_ID, selectedId ?? "", { query: { enabled: Boolean(selectedId), queryKey: getGetTeacherStudentQueryKey(TEACHER_ID, selectedId ?? "") } });
  const students = list.data ?? [];
  return <div className="mx-auto max-w-[1200px]"><PageHeader eyebrow="علاقتك بطلابك" title="طلابي" description="اعرف من يتقدم، ومن يحتاج شرحاً إضافياً، قبل أن يتراكم عليه الدرس." action={<Link href="/teacher/community" data-testid="link-students-community"><ActionButton variant="soft" testId="button-open-community"><MessageCircle className="h-4 w-4" />مجتمع الأكاديمية</ActionButton></Link>} /><div className="mt-8 grid gap-5 lg:grid-cols-[1.25fr_.75fr]"><section className="space-y-3">{students.map((student) => <button key={student.id} onClick={() => setSelectedId(student.id)} data-testid={`row-student-${student.id}`} className={`grid w-full gap-3 rounded-2xl border bg-card p-4 text-right shadow-soft transition md:grid-cols-[1.2fr_.8fr_.8fr_.8fr] md:items-center ${selectedId === student.id ? "border-primary bg-primary/5" : "hover:-translate-y-0.5"}`}><div><p className="text-sm font-extrabold">{student.name}</p><p className="mt-1 text-[10px] text-muted-foreground">{student.level}</p></div><div><p className="text-[10px] text-muted-foreground">آخر نشاط</p><p className="mt-1 text-xs font-bold">{student.lastActivity}</p></div><div><p className="text-[10px] text-muted-foreground">متوسط الاختبارات</p><p className="mt-1 font-mono-latin text-sm font-bold text-primary">{student.averageScore}%</p></div><div><p className="text-[10px] text-muted-foreground">إكمال المحاضرات</p><p className="mt-1 font-mono-latin text-sm font-bold">{student.completion}%</p></div></button>)}</section><section className="rounded-3xl border bg-card p-5 shadow-soft" data-testid="student-detail-panel">{detail.data ? <><div className="flex items-start justify-between"><div><p className="text-[10px] font-bold tracking-[.16em] text-accent">تفاصيل الطالب</p><h2 className="mt-2 text-xl font-extrabold">{detail.data.name}</h2><p className="mt-1 text-xs text-muted-foreground">{detail.data.level} · {detail.data.completedLessons} درس مكتمل</p></div><div className="rounded-2xl bg-secondary/35 p-3 text-primary"><BarChart3 className="h-5 w-5" /></div></div><div className="mt-7 space-y-5">{detail.data.subjects.map((subject) => <div key={subject.name}><div className="flex justify-between text-[10px]"><span>{subject.name}</span><b>{subject.score}/100</b></div><div className="mt-2 h-2 rounded-full bg-muted"><div className="h-full rounded-full bg-primary" style={{ width: `${subject.progress}%` }} /></div></div>)}</div><div className="mt-7 border-t pt-5"><p className="text-xs font-extrabold">آخر محاولة اختبار</p><p className="mt-2 text-[10px] text-muted-foreground">{detail.data.recentAttempts[0]?.score}% · {detail.data.recentAttempts[0]?.completedAt ? "تم التسليم بنجاح" : "لا توجد محاولات"}</p></div></> : <div className="py-16 text-center"><Users className="mx-auto h-9 w-9 text-primary/40" /><h2 className="mt-4 font-extrabold">اختر طالباً</h2><p className="mt-2 text-xs text-muted-foreground">ستظهر تفاصيل تقدمه ونتائج مواده هنا.</p></div>}</section></div></div>;
}

const revenueFallback: TeacherRevenue = { totalSales: 14800000, netRevenue: 12450000, subscriptions: 732, activeSubscriptions: 620, transactions: [] };

export function TeacherRevenuePage() {
  const query = useGetTeacherRevenue(TEACHER_ID);
  const revenue = query.data ?? revenueFallback;
  return <div className="mx-auto max-w-[1150px]"><PageHeader eyebrow="مساحة المدرّس · بيانات تجريبية" title="الأرباح" description="أرقام MVP تجريبية جاهزة للربط مع بوابة دفع عراقية لاحقاً." action={<span className="rounded-full bg-secondary/45 px-3 py-2 text-[10px] font-bold text-primary">بوابة الدفع: غير مربوطة</span>} /><div className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-4"><MetricCard label="إجمالي المبيعات" value={`${formatNumber(revenue.totalSales)} د.ع`} hint="قبل خصم حصة المنصة" icon={WalletCards} accent /><MetricCard label="صافي أرباح المدرس" value={`${formatNumber(revenue.netRevenue)} د.ع`} hint="المبلغ التجريبي القابل للتحويل" icon={WalletCards} /><MetricCard label="عدد الاشتراكات" value={revenue.subscriptions} hint="كل الاشتراكات المسجلة" icon={Users} /><MetricCard label="اشتراكات نشطة" value={revenue.activeSubscriptions} hint="تجدد حالياً" icon={CheckCircle2} /></div><section className="mt-8 overflow-hidden rounded-3xl border bg-card shadow-soft"><div className="flex items-center justify-between border-b p-5"><h2 className="text-lg font-extrabold">سجل العمليات</h2><span className="text-[10px] text-muted-foreground">بيانات تجريبية فقط</span></div><div className="divide-y">{revenue.transactions.map((transaction) => <div key={transaction.id} className="grid gap-2 p-5 md:grid-cols-[1fr_1fr_auto_auto] md:items-center" data-testid={`row-transaction-${transaction.id}`}><div><p className="text-sm font-extrabold">{transaction.studentName}</p><p className="mt-1 text-[10px] text-muted-foreground">{transaction.date}</p></div><span className="text-xs text-muted-foreground">{transaction.plan}</span><b className="font-mono-latin text-sm">{formatNumber(transaction.amount)} د.ع</b><span className="rounded-full bg-primary/10 px-3 py-1 text-center text-[10px] font-bold text-primary">{transaction.status}</span></div>)}</div></section></div>;
}

export function TeacherCommunityPage() {
  const { teacherId = TEACHER_ID } = useParams<{ teacherId: string }>();
  const query = useListCommunityPosts(teacherId);
  const create = useCreateCommunityPost();
  const cache = useQueryClient();
  const [body, setBody] = useState("");
  const [kind, setKind] = useState("منشور");
  const posts = query.data ?? [];
  const publish = () => { if (!body.trim()) return; create.mutate({ teacherId, data: { body: `${kind}: ${body}` } }, { onSuccess: () => { setBody(""); cache.invalidateQueries({ queryKey: getListCommunityPostsQueryKey(teacherId) }); } }); };
  return <div className="mx-auto max-w-[900px]"><PageHeader eyebrow="مجتمع الأكاديمية" title="تواصل مع طلابك" description="انشر إعلاناً، ابدأ نقاشاً، وأجب عن الأسئلة في مساحتك الخاصة." /><section className="mt-8 rounded-3xl border bg-card p-5 shadow-soft"><div className="flex flex-wrap gap-2"><button onClick={() => setKind("إعلان")} data-testid="button-community-announcement" className={`rounded-full px-4 py-2 text-[10px] font-bold ${kind === "إعلان" ? "bg-primary text-primary-foreground" : "bg-muted"}`}>إعلان</button><button onClick={() => setKind("منشور")} data-testid="button-community-post" className={`rounded-full px-4 py-2 text-[10px] font-bold ${kind === "منشور" ? "bg-primary text-primary-foreground" : "bg-muted"}`}>منشور</button><button onClick={() => setKind("تنبيه")} data-testid="button-community-notification" className={`rounded-full px-4 py-2 text-[10px] font-bold ${kind === "تنبيه" ? "bg-primary text-primary-foreground" : "bg-muted"}`}>تنبيه</button></div><textarea data-testid="input-teacher-post" value={body} onChange={(event) => setBody(event.target.value)} placeholder="اكتب رسالة لطلابك..." className="mt-4 min-h-28 w-full resize-none rounded-2xl bg-muted/50 p-4 text-xs leading-7 outline-none" /><div className="mt-3 flex justify-end"><ActionButton onClick={publish} disabled={!body.trim() || create.isPending} testId="button-publish-teacher-post"><Send className="h-4 w-4" />نشر للطلاب</ActionButton></div></section><section className="mt-6 space-y-3">{posts.map((post) => <article key={post.id} className="rounded-3xl border bg-card p-5 shadow-soft" data-testid={`teacher-post-${post.id}`}><div className="flex items-center justify-between"><p className="text-xs font-extrabold">{post.authorName}</p><span className="text-[10px] text-muted-foreground">{post.createdAt}</span></div><p className="mt-4 text-xs leading-7">{post.body}</p><div className="mt-4 flex gap-4 border-t pt-3 text-[10px] text-muted-foreground"><span><MessageCircle className="ml-1 inline h-3.5 w-3.5" />{post.commentsCount} تعليقات</span><span>يمكن لطلابك التعليق وطرح الأسئلة</span></div></article>)}</section></div>;
}

export function TeacherAIPage() {
  const [selected, setSelected] = useState("تلخيص محاضرة");
  const tools = ["تلخيص محاضرة", "إنشاء أسئلة", "أفكار فيديوهات قصيرة", "تحويل المحتوى إلى أسئلة"];
  return <div className="mx-auto max-w-[1000px]"><PageHeader eyebrow="أدوات قادمة" title="مساعد AI للمدرس" description="واجهة تجريبية تساعدك على تصور الأدوات القادمة. لا يوجد اتصال AI حقيقي في هذه المرحلة." action={<span className="rounded-full bg-accent/10 px-3 py-2 text-[10px] font-bold text-accent">MVP · Placeholder</span>} /><div className="mt-8 grid gap-5 lg:grid-cols-[.8fr_1.2fr]"><section className="space-y-2">{tools.map((tool) => <button key={tool} onClick={() => setSelected(tool)} data-testid={`button-ai-${tool}`} className={`flex w-full items-center gap-3 rounded-2xl border p-4 text-right text-xs font-bold transition ${selected === tool ? "border-primary bg-primary/10 text-primary" : "bg-card hover:bg-muted"}`}><Lightbulb className="h-4 w-4" />{tool}</button>)}</section><section className="rounded-3xl border bg-card p-6 shadow-soft"><div className="flex items-center gap-3"><div className="rounded-2xl bg-secondary/45 p-3 text-primary"><Lightbulb className="h-5 w-5" /></div><div><h2 className="font-extrabold">{selected}</h2><p className="mt-1 text-[10px] text-muted-foreground">أداة تجريبية للمدرس</p></div></div><textarea data-testid="input-ai-content" placeholder="الصق محتوى المحاضرة هنا..." className="mt-7 min-h-44 w-full rounded-2xl bg-muted/50 p-4 text-xs leading-7 outline-none" /><ActionButton onClick={() => undefined} variant="soft" testId="button-ai-generate"><Lightbulb className="h-4 w-4" />تجهيز نتيجة تجريبية</ActionButton><p className="mt-5 rounded-2xl border border-dashed p-4 text-[10px] leading-6 text-muted-foreground">TODO: ربط هذه الواجهة بخدمة AI حقيقية بعد تحديد المزود والتكلفة وسياسة حفظ محتوى المدرس.</p></section></div></div>;
}