import img from "../img/image.png";
import trofeu from "../img/trofeu.png";
import backgroundImage from "../img/fundo.png"; 

export default function Player() {
  return (
    <div className="relative p-10 font-bold overflow-hidden">
      {/* Imagem de fundo */}
      <img
        src={backgroundImage}
        alt="Fundo"
        className="absolute inset-0 w-full h-full object-cover "
      />

      {/* Conteúdo */}
      <div className="relative z-10 bg-white p-6 rounded-lg shadow-md">
        <h1 className="text-lg mb-4">Informações do jogador</h1>

        <div className="flex flex-col md:flex-row items-center gap-60">
          {/* Avatar + Nome */}
          <div className="flex items-center gap-4">
            <img src={img} alt="icon" className="w-16 h-16" />
            <div>
              <h1 className="text-xl font-bold">Iso</h1>
              <p className="text-sm text-purple-700 font-normal">#2GGP982PP</p>
            </div>
          </div>

          {/* Vitórias */}
          <div className="text-center">
            <p className="text-sm font-bold text-black">Total de vitórias</p>
            <p className="text-purple-700 font-normal">2.5419</p>
          </div>

          {/* Derrotas */}
          <div className="text-center">
            <p className="text-sm font-bold text-black">Total de derrotas</p>
            <p className="text-purple-700 font-normal">2.2012</p>
          </div>

          {/* Troféus */}
          <div className="flex items-center text-center">
            <img src={trofeu} alt="Troféu" className="w-6 h-6" />
            <div className="ml-2">
              <p className="text-sm ffont-bold text-black">Troféus</p>
              <p className="text-purple-700 font-normal">8.379</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
