import { Router, type IRouter } from "express";
import {
  AdminOverview,
  CreateCommunityPostBody,
  CreateCommunityPostParams,
  CreateCommunityPostResponse,
  CreateContentBody,
  CreateContentParams,
  CreateContentResponse,
  CreateQuizBody,
  CreateQuizResponse,
  CreateTeacherBody,
  CreateTeacherResponse,
  EnrollInAcademyParams,
  EnrollInAcademyResponse,
  GetAdminOverviewResponse,
  GetQuizParams,
  GetQuizResponse,
  GetStudentOverviewResponse,
  GetStudentProgressParams,
  GetStudentProgressResponse,
  GetStudentFeedQueryParams,
  GetStudentFeedResponse,
  GetTeacherDashboardParams,
  GetTeacherDashboardResponse,
  GetTeacherParams,
  GetTeacherResponse,
  ListCommunityPostsParams,
  ListCommunityPostsResponse,
  ListQuizzesResponse,
  ListTeacherContentParams,
  ListTeacherContentResponse,
  ListTeachersQueryParams,
  ListTeachersResponse,
  SubmitQuizAttemptBody,
  SubmitQuizAttemptParams,
  SubmitQuizAttemptResponse,
  UpdateStudentSubscriptionBody,
  UpdateStudentSubscriptionParams,
  UpdateStudentSubscriptionResponse,
} from "@workspace/api-zod";

type Teacher = {
  id: string;
  name: string;
  subject: string;
  grades: string[];
  bio: string;
  studentsCount: number;
  rating: number;
  avatar: string;
  verified: boolean;
};

type Content = {
  id: string;
  title: string;
  type: "lesson" | "short" | "pdf" | "quiz" | "assignment" | "post";
  subject: string;
  grade: string;
  topic: string;
  publishedAt: string;
  views: number;
  duration: string | null;
  thumbnail: string | null;
};

type Question = {
  id: string;
  text: string;
  options: string[];
  correctOption: number;
  explanation: string;
};

type Quiz = {
  id: string;
  title: string;
  subject: string;
  teacherName: string;
  questionCount: number;
  duration: number;
  bestScore: number | null;
  questions: Question[];
};

const teachers: Teacher[] = [
  {
    id: "teacher-ahmed",
    name: "أحمد الساعدي",
    subject: "الرياضيات",
    grades: ["السادس الإعدادي", "الخامس الإعدادي"],
    bio: "مدرس رياضيات أساعدك تفهم الفكرة قبل ما تحفظ القاعدة.",
    studentsCount: 2840,
    rating: 4.9,
    avatar: "أ",
    verified: true,
  },
  {
    id: "teacher-sarah",
    name: "سارة عبد الحسين",
    subject: "اللغة العربية",
    grades: ["السادس الإعدادي"],
    bio: "نبسط الأدب والنحو بخطوات واضحة وأمثلة من المنهج العراقي.",
    studentsCount: 1920,
    rating: 4.8,
    avatar: "س",
    verified: true,
  },
  {
    id: "teacher-ali",
    name: "علي كريم",
    subject: "الفيزياء",
    grades: ["السادس الإعدادي"],
    bio: "فيزياء السادس الإعدادي بطريقة تربط القانون بالحياة اليومية.",
    studentsCount: 1460,
    rating: 4.7,
    avatar: "ع",
    verified: false,
  },
];

const content: Content[] = [
  {
    id: "lesson-1",
    title: "الاشتقاق: الفكرة من البداية",
    type: "lesson",
    subject: "الرياضيات",
    grade: "السادس الإعدادي",
    topic: "التفاضل",
    publishedAt: "منذ ساعتين",
    views: 1204,
    duration: "38 دقيقة",
    thumbnail: null,
  },
  {
    id: "lesson-2",
    title: "المتجهات وحل المسائل الوزارية",
    type: "lesson",
    subject: "الفيزياء",
    grade: "السادس الإعدادي",
    topic: "المتجهات",
    publishedAt: "أمس",
    views: 980,
    duration: "42 دقيقة",
    thumbnail: null,
  },
  {
    id: "pdf-1",
    title: "ملزمة مراجعة التفاضل",
    type: "pdf",
    subject: "الرياضيات",
    grade: "السادس الإعدادي",
    topic: "التفاضل",
    publishedAt: "منذ 3 أيام",
    views: 743,
    duration: null,
    thumbnail: null,
  },
  {
    id: "short-1",
    title: "كيف تحفظ قوانين الاشتقاق بثلاث دقائق؟",
    type: "short",
    subject: "الرياضيات",
    grade: "السادس الإعدادي",
    topic: "التفاضل",
    publishedAt: "منذ 4 ساعات",
    views: 3420,
    duration: "0:58",
    thumbnail: null,
  },
];

const videos = [
  {
    id: "video-1",
    title: "قاعدة السلسلة بطريقة ما تنساها",
    teacher: teachers[0],
    subject: "الرياضيات",
    topic: "التفاضل",
    thumbnail: "",
    duration: "0:42",
    views: 3420,
    likes: 287,
    saved: false,
  },
  {
    id: "video-2",
    title: "الفرق بين المفعول به والحال",
    teacher: teachers[1],
    subject: "اللغة العربية",
    topic: "النحو",
    thumbnail: "",
    duration: "0:54",
    views: 2180,
    likes: 164,
    saved: true,
  },
  {
    id: "video-3",
    title: "ليش الجسم يستمر بالحركة؟",
    teacher: teachers[2],
    subject: "الفيزياء",
    topic: "الحركة",
    thumbnail: "",
    duration: "0:38",
    views: 1870,
    likes: 123,
    saved: false,
  },
];

const quizzes: Quiz[] = [
  {
    id: "quiz-1",
    title: "اختبار سريع: أساسيات التفاضل",
    subject: "الرياضيات",
    teacherName: teachers[0].name,
    questionCount: 8,
    duration: 10,
    bestScore: 88,
    questions: [
      {
        id: "q-1",
        text: "ما قيمة مشتقة الدالة الثابتة؟",
        options: ["1", "0", "x", "لا يمكن تحديدها"],
        correctOption: 1,
        explanation: "مشتقة أي مقدار ثابت تساوي صفراً.",
      },
      {
        id: "q-2",
        text: "مشتقة x² تساوي:",
        options: ["x", "2", "2x", "x²"],
        correctOption: 2,
        explanation: "باستخدام قاعدة القوة، نضرب بالأس ثم ننقصه واحداً.",
      },
      {
        id: "q-3",
        text: "ما اسم النقطة التي تتغير عندها إشارة الميل؟",
        options: ["نقطة الأصل", "نقطة الانقلاب", "نقطة التقاطع", "نقطة التماس"],
        correctOption: 1,
        explanation: "نقطة الانقلاب هي التي يتغير عندها تقعر المنحني.",
      },
    ],
  },
  {
    id: "quiz-2",
    title: "مراجعة الفصل الأول في الفيزياء",
    subject: "الفيزياء",
    teacherName: teachers[2].name,
    questionCount: 12,
    duration: 15,
    bestScore: null,
    questions: [],
  },
];

const posts = [
  {
    id: "post-1",
    authorName: teachers[0].name,
    authorRole: "مدرس",
    body: "نزلت اليوم محاضرة جديدة عن تطبيقات الاشتقاق. إذا عندك سؤال اكتبه هنا وسأجاوب عليه.",
    createdAt: "منذ ساعتين",
    likes: 42,
    commentsCount: 8,
    pinned: true,
  },
  {
    id: "post-2",
    authorName: "نور الهدى",
    authorRole: "طالبة",
    body: "أستاذ، ممكن تنزل حل أسئلة المراجعة الوزارية؟",
    createdAt: "منذ 45 دقيقة",
    likes: 7,
    commentsCount: 2,
    pinned: false,
  },
];

const id = (prefix: string) => `${prefix}-${Date.now()}-${Math.round(Math.random() * 1000)}`;

const toSummary = (quiz: Quiz) => ({
  id: quiz.id,
  title: quiz.title,
  subject: quiz.subject,
  teacherName: quiz.teacherName,
  questionCount: quiz.questionCount,
  duration: quiz.duration,
  bestScore: quiz.bestScore,
});

const router: IRouter = Router();

router.get("/student/overview", (_req, res) => {
  res.json(
    GetStudentOverviewResponse.parse({
      studentName: "نور الهدى",
      streak: 6,
      completedLessons: 18,
      averageScore: 87,
      enrolledTeachers: [teachers[0], teachers[2]],
      continueLearning: content.slice(0, 3),
    }),
  );
});

router.get("/student/feed", (req, res) => {
  const parsed = GetStudentFeedQueryParams.safeParse(req.query);
  const limit = parsed.success && parsed.data.limit ? parsed.data.limit : 10;
  res.json(GetStudentFeedResponse.parse(videos.slice(0, limit)));
});

router.get("/teachers", (req, res) => {
  const parsed = ListTeachersQueryParams.safeParse(req.query);
  const search = parsed.success ? parsed.data.search?.toLowerCase() : undefined;
  const subject = parsed.success ? parsed.data.subject : undefined;
  const filtered = teachers.filter(
    (teacher) =>
      (!search ||
        teacher.name.toLowerCase().includes(search) ||
        teacher.subject.toLowerCase().includes(search)) &&
      (!subject || teacher.subject === subject),
  );
  res.json(ListTeachersResponse.parse(filtered));
});

router.post("/teachers", (req, res) => {
  const parsed = CreateTeacherBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }
  const teacher = {
    id: id("teacher"),
    name: parsed.data.name,
    subject: parsed.data.subject,
    grades: ["السادس الإعدادي"],
    bio: parsed.data.bio,
    studentsCount: 0,
    rating: 5,
    avatar: parsed.data.name.slice(0, 1),
    verified: false,
  };
  teachers.unshift(teacher);
  res.status(201).json(CreateTeacherResponse.parse(teacher));
});

router.get("/teachers/:teacherId", (req, res) => {
  const params = GetTeacherParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }
  const teacher = teachers.find((item) => item.id === params.data.teacherId);
  if (!teacher) {
    res.status(404).json({ error: "Teacher not found" });
    return;
  }
  res.json(GetTeacherResponse.parse(teacher));
});

router.get("/teachers/:teacherId/dashboard", (req, res) => {
  const params = GetTeacherDashboardParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }
  const teacher = teachers.find((item) => item.id === params.data.teacherId);
  if (!teacher) {
    res.status(404).json({ error: "Teacher not found" });
    return;
  }
  res.json(
    GetTeacherDashboardResponse.parse({
      studentsCount: teacher.studentsCount,
      views: 28400,
      subscribersCount: 620,
      avgLessonWatch: 76,
      avgQuizScore: 84,
      activeStudents: 1840,
      topContent: content.slice(0, 3),
    }),
  );
});

router.get("/teachers/:teacherId/content", (req, res) => {
  const params = ListTeacherContentParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }
  res.json(ListTeacherContentResponse.parse(content));
});

router.post("/teachers/:teacherId/content", (req, res) => {
  const params = CreateContentParams.safeParse(req.params);
  const body = CreateContentBody.safeParse(req.body);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }
  if (!body.success) {
    res.status(400).json({ error: body.error.message });
    return;
  }
  const item = {
    id: id("content"),
    ...body.data,
    publishedAt: "الآن",
    views: 0,
    duration: body.data.duration ?? null,
    thumbnail: null,
  };
  content.unshift(item);
  res.status(201).json(CreateContentResponse.parse(item));
});

router.post("/academies/:teacherId/enroll", (req, res) => {
  const params = EnrollInAcademyParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }
  const teacher = teachers.find((item) => item.id === params.data.teacherId);
  if (!teacher) {
    res.status(404).json({ error: "Teacher not found" });
    return;
  }
  teacher.studentsCount += 1;
  res.json(
    EnrollInAcademyResponse.parse({
      id: id("enrollment"),
      teacherId: teacher.id,
      teacherName: teacher.name,
      progress: 0,
      enrolledAt: new Date().toISOString(),
    }),
  );
});

router.get("/quizzes", (_req, res) => {
  res.json(ListQuizzesResponse.parse(quizzes.map(toSummary)));
});

router.post("/quizzes", (req, res) => {
  const body = CreateQuizBody.safeParse(req.body);
  if (!body.success) {
    res.status(400).json({ error: body.error.message });
    return;
  }
  const quiz = {
    id: id("quiz"),
    ...body.data,
    questions: body.data.questions.map((question) => ({ ...question, id: id("question") })),
    questionCount: body.data.questions.length,
    bestScore: null,
  };
  quizzes.unshift(quiz);
  res.status(201).json(CreateQuizResponse.parse(quiz));
});

router.get("/quizzes/:quizId", (req, res) => {
  const params = GetQuizParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }
  const quiz = quizzes.find((item) => item.id === params.data.quizId);
  if (!quiz) {
    res.status(404).json({ error: "Quiz not found" });
    return;
  }
  res.json(GetQuizResponse.parse(quiz));
});

router.post("/quizzes/:quizId/attempts", (req, res) => {
  const params = SubmitQuizAttemptParams.safeParse(req.params);
  const body = SubmitQuizAttemptBody.safeParse(req.body);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }
  if (!body.success) {
    res.status(400).json({ error: body.error.message });
    return;
  }
  const quiz = quizzes.find((item) => item.id === params.data.quizId);
  if (!quiz) {
    res.status(404).json({ error: "Quiz not found" });
    return;
  }
  const correctCount = body.data.answers.reduce(
    (total, answer, index) => total + (quiz.questions[index]?.correctOption === answer ? 1 : 0),
    0,
  );
  const totalCount = quiz.questions.length;
  const score = totalCount ? Math.round((correctCount / totalCount) * 100) : 0;
  quiz.bestScore = Math.max(quiz.bestScore ?? 0, score);
  res.json(
    SubmitQuizAttemptResponse.parse({
      id: id("attempt"),
      quizId: quiz.id,
      score,
      correctCount,
      totalCount,
      answers: body.data.answers,
      completedAt: new Date().toISOString(),
    }),
  );
});

router.get("/students/:studentId/progress", (req, res) => {
  const params = GetStudentProgressParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }
  res.json(
    GetStudentProgressResponse.parse({
      studentId: params.data.studentId,
      overall: 68,
      subjects: [
        { name: "الرياضيات", progress: 78, score: 88 },
        { name: "الفيزياء", progress: 61, score: 82 },
        { name: "اللغة العربية", progress: 54, score: 91 },
      ],
      recentAttempts: [],
    }),
  );
});

router.get("/community/:teacherId/posts", (req, res) => {
  const params = ListCommunityPostsParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }
  res.json(ListCommunityPostsResponse.parse(posts));
});

router.post("/community/:teacherId/posts", (req, res) => {
  const params = CreateCommunityPostParams.safeParse(req.params);
  const body = CreateCommunityPostBody.safeParse(req.body);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }
  if (!body.success) {
    res.status(400).json({ error: body.error.message });
    return;
  }
  const post = {
    id: id("post"),
    authorName: "نور الهدى",
    authorRole: "طالبة",
    body: body.data.body,
    createdAt: "الآن",
    likes: 0,
    commentsCount: 0,
    pinned: false,
  };
  posts.unshift(post);
  res.status(201).json(CreateCommunityPostResponse.parse(post));
});

router.get("/admin/overview", (_req, res) => {
  res.json(
    GetAdminOverviewResponse.parse({
      students: 8420,
      teachers: teachers.length,
      pendingTeachers: 4,
      content: 128,
      reports: 3,
      premiumSubscriptions: 1840,
    }),
  );
});

router.patch("/admin/subscriptions/:studentId", (req, res) => {
  const params = UpdateStudentSubscriptionParams.safeParse(req.params);
  const body = UpdateStudentSubscriptionBody.safeParse(req.body);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }
  if (!body.success) {
    res.status(400).json({ error: body.error.message });
    return;
  }
  res.json(
    UpdateStudentSubscriptionResponse.parse({
      studentId: params.data.studentId,
      plan: body.data.plan,
      status: "active",
      expiresAt: body.data.plan === "premium" ? "2027-09-21T00:00:00.000Z" : null,
    }),
  );
});

export default router;