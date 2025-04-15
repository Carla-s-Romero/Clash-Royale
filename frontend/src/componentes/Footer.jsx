import { FaLinkedin, FaInstagram, FaArrowUp } from "react-icons/fa";

const Footer = () => {
  const scrollToTop = () => window.scrollTo({ top: 0, behavior: "smooth" });

  return (
    <footer className="w-full relative bg-[linear-gradient(135deg,_#36383B,_#36383B,_#474D54,_#545B65,_#36383B,_#36383B)] text-white mt-40 h-[350px] ">

      
      <div className=" mx-auto flex flex-col md:flex-row justify-between items-start gap-4 m-0 pl-10">

        <div className="p-10">
          <h4 className="text-2xl font-bold mb-2">Criadores</h4>
          <ul className="space-y-1 text-sm text-gray-200">
            <li>Alexandre Machado</li>
            <li>Carla Romero</li>
            <li>Mário Beltrão</li>
            <li>Sabrina Vidal</li>
            <li>Khyra Oliveira</li>
          </ul>
        </div>
      </div>

      {/* Linha divisória */}
      <hr className="border-white-500 my-2 opacity-40 mt-10" />
      <div className="flex items-center gap-4 mt-4 md:mt-0 pl-20">
          <a href="#" aria-label="LinkedIn">
            <FaLinkedin className="w-10 h-10 text-white  rounded-full p-1 hover:text-purple-400" />
          </a>
          <a href="#" aria-label="Instagram">
            <FaInstagram className="w-10 h-10 text-white  rounded-full p-1 hover:text-purple-400" />
          </a>
        </div>

      {/* Scroll to top */}
      <div className=" absolute right-6 bottom-6 flex flex-col items-center cursor-pointer" onClick={scrollToTop}>
        <div className="bg-purple-400 hover:bg-purple-500 shadow-lg text-white rounded-full p-7">
          <FaArrowUp className="text-4xl" />
        </div>
      </div>
    </footer>
  );
};

export default Footer;
