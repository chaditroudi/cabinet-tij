import { useEffect } from "react";
import { RejoindreReseauSection } from "@/pages/User/RejoindreReseauSection";

export const JOIN_PAGE_PATH = "/rejoignez-nous";

export function RejoindreReseau() {
  useEffect(() => {
    window.scrollTo({ top: 0 });
  }, []);

  return (
    <div className="motion-safe:animate-page-in">
      <RejoindreReseauSection />
    </div>
  );
}
