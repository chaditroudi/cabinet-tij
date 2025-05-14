import logo from "@/assets/images/logo.png";

const Footer = () => {
  return (
    <footer className="bg-[#fdf5f5] text-black py-12 text-sm">
      <div className="container mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-8">
        {/* Logo + Socials */}
        <div>
          <img src={logo} alt="Cabinet TIJ Logo" className="h-16 mb-4" />
          <div className="flex space-x-3 mt-4">
            <img src="/icons/maps.png" alt="Maps" className="h-6" />
            <img src="/icons/linkedin.png" alt="LinkedIn" className="h-6" />
            <img src="/icons/facebook.png" alt="Facebook" className="h-6" />
            <img src="/icons/instagram.png" alt="Instagram" className="h-6" />
          </div>
        </div>

        {/* À propos */}
        <div>
          <h3 className="text-lg font-bold mb-2">→ À propos</h3>
          <p>
            Nous sommes un Cabinet de traduction et d’interprétariat spécialisé
            dans les traductions administratives, techniques et judiciaires.
          </p>
        </div>

        {/* Services */}
        <div>
          <h3 className="text-lg font-bold mb-2">→ Services</h3>
          <ul className="space-y-1">
            <li>Interprétariat</li>
            <li>Traduction</li>
            <li>Traduction assermentée</li>
            <li>Services aux entreprises</li>
            <li>Particuliers</li>
          </ul>
        </div>

        {/* Informations */}
        <div>
          <h3 className="text-lg font-bold mb-2">→ Informations</h3>
          <ul className="space-y-1">
            <li>contact@cabinet-tij.com</li>
            <li>+33 1 53 67 44 72</li>
            <li>+33 6 99 08 64 91</li>
            <li>
              42 Avenue Montaigne, <br />
              75008 Paris.
            </li>
          </ul>
        </div>
      </div>

      {/* Help & bottom line */}
      <div className="container mx-auto px-6 mt-10">
        <div className="flex flex-col md:flex-row justify-between items-center text-center text-xs text-gray-700 border-t border-gray-300 pt-6">
          <div className="mb-2 md:mb-0">
            <span className="font-bold">→ Aide</span> : Contactez-nous
          </div>
          <div className="flex space-x-2">
            <a href="#" className="hover:underline">
              Mentions légales
            </a>
            <span>|</span>
            <a href="#" className="hover:underline">
              Politique de Confidentialité
            </a>
          </div>
          <div>&copy; {new Date().getFullYear()} Tous droits © réservés</div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
