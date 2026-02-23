import { AlertTriangle } from "lucide-react";

interface ErrorProps {
    msg: string;
}

function ErrorComponent({ msg }: ErrorProps) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-[#f4f9fd] p-4 dark:bg-[#0a1520]">
      <div className="flex max-w-md flex-col items-center rounded-2xl border border-[#f0c0c0] bg-white p-8 text-center shadow-sm dark:border-[#3d1515] dark:bg-[#0d1e2d]">
        <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl border border-[#f0c0c0] bg-[#fdf0f0] dark:border-[#3d1515] dark:bg-[#2a0d0d]">
          <AlertTriangle size={30} className="text-[#b03a3a] dark:text-[#f08080]" strokeWidth={1.8} />
        </div>
        <h2 className="mb-1 text-lg font-bold text-[#0d2233] dark:text-[#ddeef7]">
          Something went wrong
        </h2>
        <p className="mb-3 text-sm text-[#b03a3a] dark:text-[#f08080]">{msg}</p>
        <p className="text-xs font-medium text-[#5c85a0] dark:text-[#7a9baf]">
          Please contact the{' '}
          <span className="font-bold text-[#2a7db5]">direction</span>{' '}
          if the problem persists.
        </p>
      </div>
    </div>
  );
}
export default ErrorComponent;