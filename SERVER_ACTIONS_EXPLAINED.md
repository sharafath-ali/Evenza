# Next.js: Server Actions vs Route Handlers (App Router 14+)

In **Next.js App Router (v14+)**, there are two primary ways to handle server-side logic:

* **Route Handlers** → HTTP-based APIs
* **Server Actions** → Direct server function calls (RPC-like)

Understanding when to use each is critical for building scalable apps.

---

## 1. Route Handlers (API Layer)

Route Handlers are the official way to define backend endpoints in the App Router.

### How it works

* Defined inside:

  ```
  app/api/.../route.ts
  ```
* You export HTTP methods:

  ```ts
  export async function GET() {}
  export async function POST() {}
  ```
* Accessed using `fetch()` from client or server

### When to use

Use Route Handlers when you need a **real HTTP interface**:

* Public/external APIs (mobile apps, third-party clients)
* Webhooks (Stripe, GitHub, etc.)
* Content-type handling (JSON, FormData, streams)
* Authentication endpoints

### Example

```ts
// app/api/events/route.ts
export async function GET() {
  const events = await db("events").select("*");
  return Response.json(events);
}
```

```ts
// Client Component
const res = await fetch("/api/events");
```

### Key idea

👉 This is a **traditional REST-style backend**

---

## 2. Server Actions (UI-integrated Server Logic)

Server Actions are async functions that run on the server but are **invoked directly from your React components**.

### How it works

* Add `"use server"` inside a function or file
* Call it:

  * via `<form action={...}>`
  * via event handlers (Client Components)
  * from Server Components

```ts
"use server";

export async function addEventAction(formData: FormData) {
  const title = formData.get("title");

  await db("events").insert({ title });
}
```

```tsx
<form action={addEventAction}>
  <input name="title" />
  <button type="submit">Add</button>
</form>
```

### When to use

Best for **UI-driven mutations**:

* Form submissions
* Create / update / delete actions
* Simple server-side logic tied to UI

### Benefits

* No manual `fetch()` or API routes
* Less boilerplate
* Built-in integration with React features:

  * `useFormStatus`
  * `useFormState`
* Cleaner codebase

### Important clarifications

* Not a traditional API → behaves like **RPC (function call over network)**
* Runs **only on the server**
* Database logic stays secure
* Progressive enhancement works **only with forms** (no JS required)

---

## 🔥 Core Difference

| Aspect      | Route Handlers                     | Server Actions           |
| ----------- | ---------------------------------- | ------------------------ |
| Type        | HTTP API (REST)                    | Function call (RPC-like) |
| Access      | Any client (web, mobile, external) | Only your React app      |
| Usage       | `fetch()`                          | Direct function call     |
| Boilerplate | Higher                             | Minimal                  |
| Best for    | APIs, webhooks, integrations       | UI mutations             |

---

## 🧠 Mental Model

* **Route Handlers** → “I am building an API”
* **Server Actions** → “I just want to run server code from my UI”

---

## ✅ When to choose what

### Use Route Handlers if:

* You need external access (mobile app, third-party)
* You are building a proper backend API
* You need full HTTP control

### Use Server Actions if:

* Logic is tightly coupled to UI
* You want less boilerplate
* You’re handling forms or simple mutations

---

## 🚀 Final Summary

* Route Handlers = **public backend (HTTP layer)**
* Server Actions = **private server logic (UI-driven)**

👉 If your logic needs to be reused outside your React app → use Route Handlers
👉 If it’s purely for your UI → use Server Actions

---

## 📌 Important Note on `"use server"`

In Next.js App Router, any function can become a Server Action by adding the `"use server"` directive inside it. Once marked, that function will always run on the server, and you can call it directly from forms or client components. You don't have to place Server Actions in a specific folder; they can be defined alongside your components or wherever it makes sense in your code. The key is that `"use server"` ensures server-side execution without needing a separate API route.

In practice, `"use server"` is specifically for Server Actions. It ensures that a function executes on the server when triggered from a client or form. Outside of that, you don’t really use it for other contexts. For broader server-only code—like in API routes or Server Components—you don’t need `"use server"`. So its key importance is really tied to Server Actions.
