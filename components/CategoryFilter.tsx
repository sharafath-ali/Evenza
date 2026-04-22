import Link from "next/link";

const CATEGORIES = ["All", "Music", "Tech", "Art", "Food", "Comedy", "Sports", "Other"];

export function CategoryFilter({
  activeCategory,
  currentQuery,
}: {
  activeCategory: string;
  currentQuery: string;
}) {
  return (
    <div className="flex flex-wrap justify-center gap-2 mt-2">
      {CATEGORIES.map((cat) => {
        // Construct the href. If category is "All", we omit it from the URL.
        const searchParams = new URLSearchParams();
        if (currentQuery) searchParams.set("q", currentQuery);
        if (cat !== "All") searchParams.set("category", cat);
        
        const href = `/?${searchParams.toString()}`;

        return (
          <Link
            key={cat}
            href={href}
            prefetch={true}
            className={`rounded-full border px-5 py-1.5 text-xs font-semibold transition-all duration-200 cursor-pointer ${
              activeCategory === cat
                ? "border-[#59deca] bg-[#59deca]/15 text-[#59deca]"
                : "border-white/10 bg-white/5 text-[#bdbdbd] hover:border-white/20 hover:text-white"
            }`}
          >
            {cat}
          </Link>
        );
      })}
    </div>
  );
}
