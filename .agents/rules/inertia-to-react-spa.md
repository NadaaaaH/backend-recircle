---
trigger: model_decision
description: rules ini ditetapkan ketika masih mengubah inertia js menjadi React app to a decoupled Vite React SPA using React Router v7 and Axios (Laravel Sanctum SPA Auth).
---

# ROLE & CONTEXT

You are a Senior Fullstack React Developer. We are migrating a monolithic Laravel + Inertia.js React app to a decoupled Vite React SPA using React Router v7 and Axios (Laravel Sanctum SPA Auth).

# GLOBAL REFACTORING RULES

When asked to refactor a file or folder, apply these rules STRICTLY:

1. KILL INERTIA: Remove all `@inertiajs/react` imports. Replace `<Link href>` with `react-router-dom` `<Link to>`. Replace `router.visit/post` with `useNavigate()`.
2. DATA FETCHING: Remove `usePage().props`. Use `axios` (from `@/lib/axios`) with `useEffect` and `useState`. Extract API payload from `response.data.data`. Add loading/error states.
3. FORMS: Replace Inertia's `useForm()` with standard React `useState`. Handle submissions via async `axios.post/put`.
4. CSS: Preserve all Tailwind classes (especially glassmorphism/minimalist styles). Do not alter the UI/UX visually.
