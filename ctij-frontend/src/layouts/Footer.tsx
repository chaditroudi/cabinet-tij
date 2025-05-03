const Footer = () => {
  return (
    <footer className="bg-gray-800 text-white py-6">
      <div className="container mx-auto px-4">
        <div className="border-t border-gray-700 mt-8 pt-6 text-center text-gray-400">
          <p>
            &copy; {new Date().getFullYear()} Cabinet TIJ. Tous droits
            réservés.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
