import { useEffect, useState } from "react";
import { useAppSelector } from "../hooks";
import { ProgressSpinner } from "primereact/progressspinner";
export default function LoadingPage() {
  const { error } = useAppSelector((state) => state.authentication) as any;

  const [delay, setDelay] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDelay(true);
    }, 15000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 fixed w-full">
      <div className="flex flex-col items-center gap-8">
        <ProgressSpinner />
        <div className="font-medium">Loading...</div>
        <p className="text-red-700 text-sm mb-2 h-6">
          {delay &&
            (error ? (
              error
            ) : (
              <div>This is taking longer than expected, please wait...!</div>
            ))}
        </p>
      </div>
    </div>
  );
}
