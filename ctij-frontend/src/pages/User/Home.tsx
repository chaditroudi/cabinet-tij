import { Link } from "react-router-dom";

export default function Home() {

  return (
    <>
      <div className="relative h-screen w-full overflow-hidden">
        <video
          className="absolute top-0 left-0 w-full h-full object-cover z-0"
          src="/video.12f51e17669cd803fd67.mp4" // ← Replace this with your actual video path
          autoPlay
          loop
          muted
          playsInline
        />
        <div className="absolute inset-0 bg-black bg-opacity-50 z-10 flex flex-col justify-center items-center text-center text-white p-4">
          <h1 className="text-5xl font-bold mb-4">
            Bienvenue sur notre plateforme
          </h1>
          <p className="text-xl max-w-xl mb-6">
            Trouvez rapidement des traducteurs disponibles selon vos besoins
            linguistiques.
          </p>
          <Link to="/recherche" className="bg-blue-800 hover:bg-blue-600 text-white px-6 py-2 rounded-lg shadow-lg">
            Commencer la recherche
          </Link>
        </div>
      </div>
    </>
  );
}
