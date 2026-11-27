"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function BlogsIndexPage() {
  const router = useRouter();

  useEffect(() => {
    router.replace("/dashboard/blogs/articles");
  }, [router]);

  return (
    <div className="p-12 text-center text-xs text-[#687378]">
      Redirecting to Blogs &amp; Articles...
    </div>
  );
}
