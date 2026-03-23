export default function SkeletonCard() {
  return (
    <div className="animate-pulse overflow-hidden rounded-2xl border border-[#ccdfe9] bg-white dark:border-[#1a2d3e] dark:bg-[#0d1e2d]">
      <div className="h-0.5 w-full bg-[#dde8f0] dark:bg-[#1a2d3e]" />
      <div className="flex items-center gap-3 p-5">
        <div className="h-10 w-10 rounded-xl bg-[#e6f0f8] dark:bg-[#0e1e2d]" />
        <div className="flex-1 space-y-2">
          <div className="h-4 w-1/3 rounded bg-[#e6f0f8] dark:bg-[#0e1e2d]" />
          <div className="h-3 w-1/2 rounded bg-[#e6f0f8] dark:bg-[#0e1e2d]" />
        </div>
        <div className="h-6 w-20 rounded-full bg-[#e6f0f8] dark:bg-[#0e1e2d]" />
      </div>
    </div>
  )
}
