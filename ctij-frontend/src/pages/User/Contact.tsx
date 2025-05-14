import React from 'react';

export default function ContactPage() {
  return (
    <div className="font-sans text-gray-800">
      {/* Navigation Bar */}
      <header className="bg-white shadow-md">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <nav className="space-x-6">
            <a href="#" className="hover:text-blue-600">Accueil</a>
            <a href="#" className="hover:text-blue-600">À propos</a>
            <a href="#" className="hover:text-blue-600">Services</a>
            <a href="#" className="hover:text-blue-600">Contact</a>
            <a href="#" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">Obtenir un devis</a>
          </nav>
          <div className="space-x-4">
            <button className="hover:underline">Anglais</button>
            <button className="hover:underline">Français</button>
          </div>
        </div>
      </header>

      {/* Contact Section */}
      <section className="container mx-auto px-4 py-12">
        <h2 className="text-3xl font-bold mb-4">Contactez-nous dès maintenant</h2>
        <p className="mb-6">
          Pour plus d’informations merci de prendre contact avec nous via l’adresse mail : 
          <a href="mailto:contact@cabinet-tij.com" className="text-blue-600 hover:underline ml-1">contact@cabinet-tij.com</a> 
          ou via le formulaire ci-dessous.
        </p>
        <p className="mb-10">
          Si vous êtes un professionnel traducteur ou interprète et vous souhaitez rejoindre notre équipe, merci de bien vouloir soumettre votre candidature en ligne via le 
          <a href="#" className="text-blue-600 hover:underline ml-1">Formulaire de candidature</a>.
        </p>

        {/* Contact Form */}
        <form className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-white p-8 shadow rounded-lg">
          <div className="flex flex-col">
            <label htmlFor="name" className="mb-1 font-medium">Nom et prénom *</label>
            <input id="name" type="text" required className="border px-4 py-2 rounded" />
          </div>

          <div className="flex flex-col">
            <label htmlFor="email" className="mb-1 font-medium">E-mail *</label>
            <input id="email" type="email" required className="border px-4 py-2 rounded" />
          </div>

          <div className="flex flex-col md:col-span-2">
            <label htmlFor="subject" className="mb-1 font-medium">Objet *</label>
            <input id="subject" type="text" required className="border px-4 py-2 rounded" />
          </div>

          <div className="flex flex-col md:col-span-2">
            <label htmlFor="message" className="mb-1 font-medium">Notes *</label>
            <textarea id="message"  required className="border px-4 py-2 rounded"></textarea>
          </div>

          <div className="md:col-span-2">
            <label className="block mb-2 font-medium">Ajouter un fichier</label>
            <input type="file" className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100" />
          </div>

          <div className="md:col-span-2">
            <button type="submit" className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700">
              Envoyer
            </button>
          </div>
        </form>
      </section>

      {/* Contact Info */}
      <section className="bg-gray-100 py-12">
        <div className="container mx-auto px-4 grid md:grid-cols-2 gap-8">
          <div>
            <h3 className="text-xl font-semibold mb-2">Nous contacter</h3>
            <p><a href="mailto:contact@cabinet-tij.com" className="text-blue-600 hover:underline">contact@cabinet-tij.com</a></p>
            <p>+33 1 53 67 44 72</p>
            <p>+33 6 99 08 64 91</p>
          </div>
          <div>
            <h3 className="text-xl font-semibold mb-2">Nous trouver</h3>
            <p>42 Avenue Montaigne, 75008 Paris.</p>
          </div>
        </div>
      </section>

      {/* Call To Action */}
      <section className="py-12 bg-white">
        <div className="container mx-auto px-4 text-center">
          <h4 className="text-2xl font-semibold mb-4">Besoin d’aide ?</h4>
          <p className="mb-6">
            Nous proposons à nos clients un devis personnalisé en fonction de la nature et du volume du document à traduire.
            Nous réalisons des traductions correspondant à différents types de documents qu’ils soient techniques ou assermentés.
            N’hésitez pas à nous contacter pour obtenir un devis personnalisé.
          </p>
          <a href="#" className="bg-blue-600 text-white px-6 py-3 rounded hover:bg-blue-700">
            Demander un devis
          </a>
        </div>
      </section>
    </div>
  );
}
