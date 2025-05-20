import logo from "@/assets/images/logo.png";

const Footer = () => {
  return (
    <footer className="bg-[#fdf5f5] text-gray-800 py-16 mt-24 border-t">
      <div className="container mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-12">
        
        {/* Logo & Description */}
        <div>
          <img src={logo} alt="Cabinet TIJ Logo" className="h-14 mb-4" />
          <p className="text-sm leading-relaxed">
            Expert en traduction et interprétariat, Cabinet TIJ vous accompagne dans vos besoins linguistiques spécialisés.
          </p>

          {/* Socials */}
          <div className="flex items-center gap-3 mt-6">
            {[
              {
                href: "https://goo.gl/maps/7SrAawYYk3GdMg2u6",
                img: "https://img.icons8.com/fluency/48/google-maps-new.png",
                alt: "Google Maps",
              },
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
                  className="h-6 w-6 hover:scale-110 transition-transform duration-300"
                />
              </a>
            ))}
          </div>
        </div>

        {/* À propos */}
        <div>
          <h3 className="text-base font-semibold mb-4 text-gray-900">À propos</h3>
          <p className="text-sm leading-relaxed">
            Cabinet TIJ est un cabinet de traduction et d’interprétariat spécialisé dans les prestations à forte valeur ajoutée : administratives, techniques et judiciaires.
          </p>
          <p className="text-sm leading-relaxed mt-3">
            Nous fédérons un réseau de professionnels qualifiés, expérimentés et indépendants, mobilisables sur tout le territoire national.
          </p>
        </div>

        {/* Contact & Join */}
        <div>
          <h3 className="text-base font-semibold mb-4 text-gray-900">Professionnels linguistiques</h3>

          <div className="mb-4">
            <p className="font-medium text-sm">Vous êtes un professionnel linguistique ?</p>
            <p className="text-sm">
              Rejoignez notre réseau : <br />
              <span className="font-bold">annuaire@cabinet-tij.fr</span>
            </p>
          </div>

          <div>
            <p className="font-medium text-sm">Vous ne trouvez pas votre langue ?</p>
            <p className="text-sm">
              Écrivez-nous, nous vous accompagnerons : <br />
              <span className="font-bold">contact@cabinet-tij.com</span>
            </p>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="container mx-auto px-6 mt-12">
        <div className="flex flex-col md:flex-row justify-between items-center border-t pt-6 text-xs text-gray-600 space-y-2 md:space-y-0">
          <p>&copy; {new Date().getFullYear()} Cabinet TIJ. Tous droits réservés.</p>
          <div className="flex space-x-4">
            <a href="#" className="hover:underline transition-colors">Mentions légales</a>
            <span>|</span>
            <a href="#" className="hover:underline transition-colors">Confidentialité</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
