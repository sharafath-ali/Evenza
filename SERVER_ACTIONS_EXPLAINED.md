# Next.js Server Actions vs Server Functions

In Next.js (App Router) 14+, there are multiple ways to handle server-side logic. Here is a brief look at the two defining concepts for writing server-side interactions:

## 1. Server Functions (Route Handlers)
A **Server Function** typically refers to defining logic in a dedicated API endpoint using `route.ts`.

- **How it works:** You export standard HTTP methods (`export async function GET()`, `POST()`, etc.) inside an `app/api/.../route.ts` file. You use standard `fetch` syntax in your components to interface with them.
- **When to use:** 
  - Creating a public/external API that third-party apps or mobile apps might consume.
  - Setting up webhooks (e.g. for Stripe or GitHub).
  - Building endpoints that negotiate various Content-Types.
- **Example in this project:** Our `app/api/events/route.ts` file correctly serves as a Server Function/Endpoint. We explicitly `fetch('/api/events')` from the client components.

## 2. Server Actions
A **Server Action** is an asynchronous function that executes directly on the server but is called seamlessly from Server or Client Components. Next.js creates the "invisible API endpoint" behind the scenes for you automatically.

- **How it works:** You use the `"use server"` directive at the top of an `async` function (or at the top of a file). You can pass this function directly to the `action={...}` attribute of a `form`.
- **When to use:** 
  - Handling form submissions or minor data mutations.
  - Keeping your codebase lean (you don't manually write `fetch` boilerplate or manage URLs).
  - You want to utilize React's `useFormStatus` or `useFormState` hooks for great UX.
- **Benefits:** Automatic network request handling and works even if JavaScript fails to load on the client (Progressive Enhancement).

### Quick Example of a Server Action

```tsx
"use server"

import db from "@/lib/db";
import { revalidatePath } from "next/cache";

// This is a Server Action!
export async function addEventAction(formData: FormData) {
  // Logic runs completely on the server
  const title = formData.get("title");
  
  await db("events").insert({ title, ...otherFields });
  
  // Clears the cache so the homepage shows the new event
  revalidatePath("/");
}
```

You would call it in your component like this:
```tsx
import { addEventAction } from "@/app/actions/events"

export default function MyForm() {
  // Next.js handles the POST request and payload under the hood!
  return <form action={addEventAction}>...</form>
}
```

## Summary
- Use **Server Functions (API Routes)** when you need a pure HTTP interface or are talking to non-React sources.
- Use **Server Actions** to deeply integrate server mutations seamlessly inside your React UI, massively cutting down on `fetch()` boilerplate!
