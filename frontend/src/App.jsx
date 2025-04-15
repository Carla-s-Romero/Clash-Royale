import WinrateChart from './componentes/WinrateChart';
import DeckChart from './componentes/DeckChart';
import Header from './componentes/Header';
import PlayerInformatio from './componentes/PlayerInformation';
import DerrotasComboChart from './componentes/ComboDerrota';
import VitoriasValkyrie from './componentes/VitoriasValkyrie';
import Decks from './componentes/Decks';
import AnaliseCartas from './componentes/AnaliseCartas';
import TresCoroas from './componentes/TresCoroas';
import VitoriasComTrofeusAltos from './componentes/VitoriasTrofeusAltos';
import Footer from './componentes/Footer';
function App() {
  return (
    <div className="min-h-screen bg-neutral-50 p-0">
      <Header />
      <PlayerInformatio />

      <div className='ml-10 mt-20'>
        <h1 className='font-bold text-2xl mb-10'>Dashboard</h1>

        <div className='flex flex-col md:flex-row gap-10 mt-10'>
        <WinrateChart />
        <DeckChart />

        <div>
        <DerrotasComboChart />
        <VitoriasValkyrie />
        </div>
       
        <Decks />
        </div>

        <div className='mt-10'>
        <AnaliseCartas />
        </div>

        <div className='flex flex-col md:flex-row gap-10 mt-10 mr-4'>
        <TresCoroas />
        <VitoriasComTrofeusAltos />
        </div>
      </div>

        <Footer />

    </div>
  );
}

export default App;
