import Footer from "@/layouts/Footer";
import Header from "@/layouts/Header";
import { Outlet } from "react-router-dom";

export default function UserLayout() {
  return (
    <div className="flex flex-col min-h-screen ">
      <Header />
      <main className="flex-grow container mx-auto px-5 md:px-40 py-8 mt-16">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}
