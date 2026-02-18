import { useState } from "react";
import { Scanner } from "@yudiel/react-qr-scanner";
import { useNavigate } from "react-router-dom";
import { ScanLine, ShieldCheck, Stethoscope, Wifi } from "lucide-react";

function Accueil() {
  const navigate = useNavigate();
  const [scanning, setScanning] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const onScan = (v: any) => {
    try {
      const value = v[0].rawValue;
      localStorage.setItem("patient", value);
      navigate("/meal");
    } catch {
      setError("Invalid QR code. Please try again.");
      setScanning(false);
    }
  };

  const onError = (err: any) => {
    console.error(err);
    setError("Camera access denied or unavailable.");
    setScanning(false);
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-[#f4f9fd] px-5 py-12 transition-colors duration-300 dark:bg-[#0a1520]">

      {/* ── Brand header ── */}
      <div className="mb-10 flex flex-col items-center text-center">
        <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl border border-[#bdd9ee] bg-[#eaf4fb] shadow-lg shadow-[#2a7db5]/10 dark:border-[#1e3d52] dark:bg-[#0e2233]">
          <Stethoscope size={28} className="text-[#2a7db5]" strokeWidth={1.6} />
        </div>
        <h1 className=" text-3xl font-bold leading-tight text-[#0d2233] dark:text-[#ddeef7] sm:text-4xl">
          Welcome to <em className="italic text-[#2a7db5]">MediMeal</em>
        </h1>
        <p className="mt-2 max-w-xs text-sm font-light leading-relaxed text-[#5c85a0] dark:text-[#7a9baf]">
          Scan your patient QR code to access your personalised meal menu
        </p>
        <div className="mt-4 h-0.5 w-10 rounded bg-[#2a7db5]" />
      </div>

      {/* ── Scanner card ── */}
      <div className="w-full max-w-sm">
        <div className="overflow-hidden rounded-2xl border border-[#ccdfe9] bg-white shadow-xl shadow-[#2a7db5]/5 dark:border-[#1a2d3e] dark:bg-[#0d1e2d]">
          {/* Top bar */}
          <div className="h-1 w-full bg-gradient-to-r from-[#bbfff8] via-[#2a7db5] to-[#05668d]" />

          {/* Card header */}
          <div className="px-6 pb-4 pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[0.58rem] font-semibold uppercase tracking-[0.18em] text-[#7a9baf]">
                  Patient identification
                </p>
                <h2 className=" text-lg font-bold text-[#0d2233] dark:text-[#ddeef7]">
                  Scan your QR code
                </h2>
              </div>
              <div className="flex h-9 w-9 items-center justify-center rounded-xl border border-[#ccdfe9] bg-[#f4f9fd] dark:border-[#1a2d3e] dark:bg-[#0a1520]">
                <ScanLine size={17} className="text-[#2a7db5]" strokeWidth={1.8} />
              </div>
            </div>
          </div>

          {/* Scanner viewport */}
          <div className="relative mx-6 mb-6 overflow-hidden rounded-xl border border-[#ccdfe9] bg-[#0a1520] dark:border-[#1a2d3e]">
            {!scanning ? (
              /* Idle state — prompt to start */
              <div
                className="flex h-64 cursor-pointer flex-col items-center justify-center gap-3 transition-all duration-200 hover:bg-[#0d1e2d]"
                onClick={() => { setError(null); setScanning(true); }}
              >
                {/* Animated scan frame */}
                <div className="relative flex h-32 w-32 items-center justify-center">
                  {/* Corner brackets */}
                  <span className="absolute left-0 top-0 h-6 w-6 rounded-tl-lg border-l-2 border-t-2 border-[#2a7db5]" />
                  <span className="absolute right-0 top-0 h-6 w-6 rounded-tr-lg border-r-2 border-t-2 border-[#2a7db5]" />
                  <span className="absolute bottom-0 left-0 h-6 w-6 rounded-bl-lg border-b-2 border-l-2 border-[#2a7db5]" />
                  <span className="absolute bottom-0 right-0 h-6 w-6 rounded-br-lg border-b-2 border-r-2 border-[#2a7db5]" />
                  <ScanLine size={36} className="text-[#2a7db5]/60" strokeWidth={1.4} />
                </div>
                <p className="text-xs font-medium text-[#7a9baf]">Tap to activate camera</p>
              </div>
            ) : (
              /* Active scanner */
              <div className="relative h-64">
                <Scanner
                  onScan={onScan}
                  onError={onError}
                  styles={{
                    container: { height: "100%", borderRadius: 0 },
                    video: { borderRadius: 0 },
                  }}
                />
                {/* Scan line animation overlay */}
                <div className="pointer-events-none absolute inset-0 overflow-hidden">
                  <div
                    className="absolute left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-[#02c39a] to-transparent opacity-80"
                    style={{ animation: "scanline 2s ease-in-out infinite" }}
                  />
                  {/* Corner brackets overlay */}
                  <span className="absolute left-4 top-4 h-7 w-7 rounded-tl-lg border-l-2 border-t-2 border-[#02c39a]" />
                  <span className="absolute right-4 top-4 h-7 w-7 rounded-tr-lg border-r-2 border-t-2 border-[#02c39a]" />
                  <span className="absolute bottom-4 left-4 h-7 w-7 rounded-bl-lg border-b-2 border-l-2 border-[#02c39a]" />
                  <span className="absolute bottom-4 right-4 h-7 w-7 rounded-br-lg border-b-2 border-r-2 border-[#02c39a]" />
                </div>
              </div>
            )}
          </div>

          {/* Error message */}
          {error && (
            <div className="mx-6 mb-4 rounded-xl border border-[#f0c0c0] bg-[#fdf0f0] px-4 py-3 dark:border-[#3d1515] dark:bg-[#2a0d0d]">
              <p className="text-xs font-medium text-[#b03a3a] dark:text-[#f08080]">{error}</p>
            </div>
          )}

          {/* Cancel button when scanning */}
          {scanning && (
            <div className="px-6 pb-5">
              <button
                onClick={() => setScanning(false)}
                className="w-full rounded-xl border border-[#ccdfe9] bg-[#f4f9fd] py-2.5 text-sm font-semibold text-[#5c85a0] transition-all duration-200 hover:border-[#2a7db5]/40 hover:bg-[#eaf4fb] dark:border-[#1a2d3e] dark:bg-[#0a1520] dark:text-[#7a9baf]"
              >
                Cancel
              </button>
            </div>
          )}

          {/* Footer */}
          <div className="border-t border-[#dde8f0] bg-[#f4f9fd] px-6 py-3.5 dark:border-[#1a2d3e] dark:bg-[#0a1520]">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <ShieldCheck size={12} className="text-[#02c39a]" strokeWidth={2} />
                <span className="text-[0.65rem] font-medium text-[#5c85a0] dark:text-[#7a9baf]">
                  Secure & private
                </span>
              </div>
              <div className="flex items-center gap-1.5">
                <Wifi size={12} className="text-[#2a7db5]" strokeWidth={2} />
                <span className="text-[0.65rem] font-medium text-[#5c85a0] dark:text-[#7a9baf]">
                  Local network
                </span>
              </div>
            </div>
          </div>
        </div>

        <p className="mt-5 text-center text-xs font-light text-[#7a9baf] dark:text-[#5c85a0]">
          Your QR code can be found on your patient wristband or admission form.
          <br />
          Contact the nursing station if you need assistance.
        </p>
      </div>
      <style>{`
        @keyframes scanline {
          0%   { top: 10%; }
          50%  { top: 85%; }
          100% { top: 10%; }
        }
      `}</style>
    </div>
  );
}

export default Accueil;