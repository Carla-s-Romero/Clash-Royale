export default function Header() {
    return (
      <header className="w-full bg-white drop-shadow-[0_4px_4px_rgba(0,0,0,0.25)]">
        <div className="w-full p-6 flex ">
          <h1 className="text-2xl font-bold p-0">Clash Royale</h1>
  
          <button className=" border-purple-700 text-md font-bold text-purple-600 hover:border-transparent hover:bg-purple-600 hover:text-white active:bg-purple-700 px-6 py-2 rounded-full ml-auto transition duration-300">
            Dashboard
          </button>
        </div>
      </header>
    );
  }
  