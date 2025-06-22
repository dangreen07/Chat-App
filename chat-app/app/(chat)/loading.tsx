"use client";

import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <>
        {/* Chat area skeleton */}
        <div className="flex flex-1 flex-col p-4 max-w-3xl mx-auto gap-4">
          <div className="flex flex-col gap-2 flex-1">
            {Array.from({ length: 8 }).map((_, idx) => (
              <Skeleton
                key={idx}
                className={
                  (idx % 2 === 0 ? "self-end" : "self-start") +
                  " h-6 w-3/4 max-w-full"
                }
              />
            ))}
          </div>
          {/* Input bar skeleton */}
            <div className="flex gap-2 mt-auto">
            <Skeleton className="h-10 flex-1" />
            <Skeleton className="h-10 w-24" />
            </div>
        </div>
    </>
  );
}