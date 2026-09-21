# أكاديميتي

منصة تعليمية عراقية تمكّن المدرسين من إنشاء أكاديمياتهم الخاصة وتساعد الطلاب على التعلم والمتابعة والاختبار.

## Run & Operate

- `pnpm --filter @workspace/api-server run dev` — run the API server (port 5000)
- `pnpm run typecheck` — full typecheck across all packages
- `pnpm run build` — typecheck + build all packages
- `pnpm --filter @workspace/api-spec run codegen` — regenerate API hooks and Zod schemas from the OpenAPI spec
- `pnpm --filter @workspace/db run push` — push DB schema changes (dev only)
- Required env: `DATABASE_URL` — Postgres connection string

## Stack

- pnpm workspaces, Node.js 24, TypeScript 5.9
- API: Express 5
- DB: PostgreSQL + Drizzle ORM
- Validation: Zod (`zod/v4`), `drizzle-zod`
- API codegen: Orval (from OpenAPI spec)
- Build: esbuild (CJS bundle)

## Where things live

- `artifacts/akademiyati` — تطبيق الويب العربي RTL وتجربة الطالب والمدرس وAdmin.
- `artifacts/api-server/src/routes/academiyati.ts` — مسارات الـ API ونموذج بيانات MVP التجريبي.
- `lib/api-spec/openapi.yaml` — المصدر الوحيد لعقد API؛ شغّل codegen بعد أي تعديل.
- `lib/db/src/schema/akademiyati.ts` — جداول Drizzle الأساسية القابلة للتوسعة.

## Architecture decisions

- واجهة MVP تستخدم hooks مولدة من OpenAPI مع adapter تجريبي معزول حتى تبقى التجربة قابلة للمشاهدة قبل اكتمال التخزين الدائم.
- الاشتراكات تبدأ بخطتي Free وPremium مع مسار Admin لتغيير الخطة يدويًا، دون ربط بوابة دفع في المرحلة الأولى.
- المحتوى موحّد عبر أنواع lesson وshort وpdf وquiz وassignment وpost ويرتبط بالمدرس والمادة والصف والموضوع.
- التصميم mobile-first وRTL من الجذر، مع تجربة سطح مكتب ذات تنقل جانبي للطالب والمدرس.

## Product

- موجز طالب للمقاطع القصيرة، الدروس المستمرة، المدرسين المتابَعين، والإنجاز.
- اكتشاف أكاديميات المدرسين، صفحة أكاديمية عامة، محتوى، اختبارات، مجتمع، وقياس التقدم.
- لوحة مدرس لإدارة المحتوى والاختبارات ومتابعة مؤشرات الطلاب.
- لوحة Admin أولية لإحصاءات المنصة والاشتراكات التجريبية.

## User preferences

_Populate as you build — explicit user instructions worth remembering across sessions._

## Gotchas

- أمر بناء Vite اليدوي يحتاج `PORT` و`BASE_PATH`; سير العمل يحقنهما تلقائيًا.
- بعد تعديل `lib/api-spec/openapi.yaml` شغّل `pnpm --filter @workspace/api-spec run codegen` قبل typecheck.

## Pointers

- See the `pnpm-workspace` skill for workspace structure, TypeScript setup, and package details
