import logo from "@/assets/images/logo.png";

const Footer = () => {
  return (
    <footer className="bg-slate-100 py-16">
      <div className="max-w-5xl mx-auto px-6">
        {/* Card */}
        <div className=" rounded-3xl  p-10 flex flex-col items-center text-center">
          {/* Logo */}
          <img src={logo} alt="Cabinet TIJ Logo" className="h-16 mb-4" />

          {/* Short Description */}
          <p className="text-gray-600 max-w-md mb-6">
            Cabinet TIJ vous accompagne avec expertise et innovation dans vos démarches juridiques et stratégiques.
          </p>

          {/* Social Icons */}
          <div className="flex justify-center space-x-5 mb-6">
            <a
              href="https://goo.gl/maps/7SrAawYYk3GdMg2u6"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:scale-110 transition-transform"
            >
              <img
                src="https://img.icons8.com/fluency/48/google-maps-new.png"
                alt="Google Maps"
                className="h-6"
              />
            </a>
            <a href="https://www.linkedin.com/company/cabinet-tij" className="hover:scale-110 transition-transform">
              <img
                src="https://img.icons8.com/color/48/linkedin.png"
                alt="LinkedIn"
                className="h-6"
              />
            </a>
            <a href="#" className="hover:scale-110 transition-transform">
              <img
                src="https://img.icons8.com/color/48/facebook-new.png"
                alt="Facebook"
                className="h-6"
              />
            </a>
            <a href="#" className="hover:scale-110 transition-transform">
              <img
                src="https://img.icons8.com/color/48/instagram-new--v1.png"
                alt="Instagram"
                className="h-6"
              />
            </a>
          </div>

          {/* Optional Footer Info */}
          <div className="text-xs text-gray-400">
            <p>&copy; {new Date().getFullYear()} Cabinet TIJ. Tous droits réservés.</p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
