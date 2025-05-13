import Footer from "@/layouts/Footer";
import Header from "@/layouts/Header";
import { Outlet } from "react-router-dom";

export default function UserLayout({ pd }: any) {
  return (
    <div className="flex flex-col min-h-screen ">
      <Header />
      <main
        className={` ${pd ? "  mx-auto px-5 md:px-20 py-8 mt-20" : ""} `}
      >
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}
