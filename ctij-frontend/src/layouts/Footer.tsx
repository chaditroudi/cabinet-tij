import logo from "@/assets/images/logo.png";

const Footer = () => {
  return (
    <footer className="bg-[#fdf5f5] text-gray-800 border-t mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Grid container */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
          {/* Logo & description */}
          <div>
            <img src={logo} alt="Cabinet TIJ Logo" className="h-14 mb-4" />
            <p className="text-sm leading-relaxed">
              Expert en traduction et interprétariat, Cabinet TIJ vous accompagne dans vos besoins linguistiques spécialisés.
            </p>
            {/* Social media icons */}
            <div className="flex items-center gap-4 mt-6">
              {[
                {
                  href: "https://www.linkedin.com/company/cabinet-tij/posts/?feedView=all",
                  img: "https://img.icons8.com/color/48/linkedin.png",
                  alt: "LinkedIn",
                },
                {
                  href: "https://www.instagram.com/cabinet_tij_de_france/",
                  img: "https://img.icons8.com/color/48/instagram-new--v1.png",
                  alt: "Instagram",
                },
                   {
                  href: "https://www.forbes.fr/brandvoice/cabinet-tij-la-confidentialite-et-lhumain-au-coeur-de-la-linguistique/",
                  img: "/forbes.svg", // <-- Forbes icon in public folder
                  alt: "Forbes",
                  
                },
              ].map(({ href, img, alt }) => (
                <a
                  key={alt}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={alt}
                >
                  <img
                    src={img}
                    alt={alt}
                    className="h-6 w-6 sm:h-8 sm:w-8 hover:scale-110 transition-transform duration-300"
                  />
                </a>
              ))}
            </div>
          </div>

          {/* À propos */}
          <div>
            <h3 className="text-base font-semibold mb-4 text-gray-900">À propos</h3>
            <p className="text-sm leading-relaxed mb-3">
              Cabinet TIJ est un cabinet de traduction et d’interprétariat spécialisé dans les prestations à forte valeur ajoutée : administratives, techniques et judiciaires.
            </p>
            <p className="text-sm leading-relaxed">
              Nous fédérons un réseau de professionnels qualifiés, expérimentés et indépendants, mobilisables sur tout le territoire national.
            </p>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-base font-semibold mb-4 text-gray-900">
              Vous êtes un professionnel linguistique ?
            </h3>
            <p className="text-sm mb-4">
              Rejoignez notre réseau :<br />
              <span className="font-bold">annuaire@cabinet-tij.fr</span>
            </p>
            <p className="text-sm">
              Vous ne trouvez pas votre langue ?<br />
              Écrivez-nous :<br />
              <span className="font-bold">contact@cabinet-tij.com</span>
            </p>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-gray-200 mt-10 pt-6 text-xs text-center text-gray-600">
          &copy; {new Date().getFullYear()} Cabinet TIJ. Tous droits réservés.
        </div>
      </div>
    </footer>
  );
};

export default Footer;
