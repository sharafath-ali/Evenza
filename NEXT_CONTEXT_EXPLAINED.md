# React Context in Next.js App Router

In the Next.js App Router, you typically wrap your global context provider inside a layout or root server component. The context itself only provides state to client-side components. 

So, you define it at the top level (like in your `layout.tsx`), but only client components will consume or update that context state using `useContext`.

### Example Pattern
1. Create a Client Component `ThemeProvider` with `"use client"` that uses `createContext`.
2. Wrap your `children` in your Server Component `layout.tsx` with `<ThemeProvider>`.
3. Use the context within deeply nested Client Components simply by calling `useContext(ThemeContext)`.

## Caching & Dynamic Rendering in Next.js

It is important to understand how Next.js caching works by default:
- **Dynamic Data**: Middleware, dynamic routes, and layouts that rely on things like cookies or user-specific logic **won't be automatically cached**. They run per request, ensuring fresh data.
- **Route Handlers**: API routes won't be cached automatically when using dynamic functions like `cookies()` or reading the `Request` object.
- **Force Dynamic**: If you explicitly set a page or route to use dynamic rendering (e.g., `export const dynamic = "force-dynamic"`), that ensures it won't be cached either.
- **Static vs Dynamic**: On the other hand, purely static pages (like prerendered content) are cached by default. Essentially, anything tied to real-time data, user state, or request-time checks will remain dynamic. If you want something cached in those scenarios, you have to opt in or configure it explicitly.
