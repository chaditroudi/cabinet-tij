import logo from "@/assets/images/logo.png";

const Footer = () => {
  return (
    <footer className="bg-[#fdf5f5] text-black py-16 text-sm mt-16">
      <div className="container mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-12">
        
        {/* Logo & Description */}
        <div>
          <img src={logo} alt="Cabinet TIJ Logo" className="h-16 mb-4" />
          <p className="text-gray-800 leading-relaxed text-justify">
            Expert en traduction et interprétariat, Cabinet TIJ vous accompagne dans vos besoins linguistiques spécialisés.
          </p>

          {/* Socials */}
          <div className="flex space-x-4 mt-6">
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
              // {
              //   href: "https://www.facebook.com",
              //   img: "https://img.icons8.com/color/48/facebook-new.png",
              //   alt: "Facebook",
              // },
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
<<<<<<< HEAD
          <h3 className="text-lg font-bold mb-2">→ À propos</h3>
          <p>
            Cabinet TIJ est un cabinet de traduction et d’interprétariat spécialisé dans les prestations à forte valeur ajoutée: administratives, techniques et judiciaires.

Nous fédérons un réseau de professionnels qualifiés, expérimentés et indépendants, mobilisables sur l’ensemble du territoire national.
          </p>
        </div>

 

        {/* Informations */}
        <div>
          <h3 className="text-lg font-bold mb-2">→ Informations</h3>
        
=======
          <h3 className="text-lg font-semibold text-gray-900 mb-4">À propos</h3>
          <p className="text-gray-800 leading-relaxed text-justify">
            Cabinet TIJ est un cabinet de traduction et d’interprétariat spécialisé dans les prestations à forte valeur ajoutée : administratives, techniques et judiciaires.
            <br /><br />
            Nous fédérons un réseau de professionnels qualifiés, expérimentés et indépendants, mobilisables sur l’ensemble du territoire national.
          </p>
        </div>

        {/* Contact & Rejoindre */}
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Professionnels linguistiques</h3>

          <p className="font-medium mb-1">Vous êtes un professionnel linguistique ?</p>
          <p className="text-gray-800 mb-4">
            Rejoignez notre réseau :
            <br />
            <span className="font-bold">annuaire@cabinet-tij.fr</span>
          </p>

          <p className="font-medium mb-1">Vous ne trouvez pas votre langue ?</p>
          <p className="text-gray-800">
            Écrivez-nous, nous vous accompagnerons :
            <br />
            <span className="font-bold">contact@cabinet-tij.com</span>
          </p>
>>>>>>> 06f5d7d67e138312b0243ff121edf56d330b929e
        </div>
      </div>

      {/* Bottom Footer */}
      <div className="container mx-auto px-6 mt-12">
        <div className="flex flex-col md:flex-row justify-between items-center border-t pt-6 text-xs text-gray-600">
          <p>&copy; {new Date().getFullYear()} Cabinet TIJ. Tous droits réservés.</p>
          <div className="flex space-x-4 mt-2 md:mt-0">
            <a href="#" className="hover:underline">Mentions légales</a>
            <span>|</span>
            <a href="#" className="hover:underline">Confidentialité</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
