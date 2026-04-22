import Form from "next/form";

export function SearchForm({ defaultValue }: { defaultValue: string }) {
  return (
    <Form
      action="/"
      className="mt-2 flex w-full max-w-xl items-center gap-3 rounded-full border border-white/10 bg-white/5 px-5 py-3 backdrop-blur-lg shadow-[0_0_40px_rgba(89,222,202,0.08)] self-center"
    >
      <svg className="size-4 text-[#bdbdbd] shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
        <circle cx="11" cy="11" r="8" />
        <path d="m21 21-4.35-4.35" />
      </svg>
      <input
        name="q"
        type="text"
        defaultValue={defaultValue}
        placeholder="Search events, artists, venues…"
        className="flex-1 bg-transparent text-sm text-white placeholder:text-[#bdbdbd] outline-none"
      />
      {defaultValue && (
        <a
          href="/"
          className="text-[#bdbdbd] hover:text-white transition-colors text-xs"
        >
          ✕
        </a>
      )}
      <button
        type="submit"
        className="rounded-full bg-[#59deca] px-5 py-1.5 text-sm font-semibold text-black hover:bg-[#59deca]/80 transition-colors cursor-pointer"
      >
        Search
      </button>
    </Form>
  );
}
