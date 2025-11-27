import React from 'react';
import { GameState } from '../types';
import { WORLD_MAP } from '../constants';
import { Heart, Map, Skull } from 'lucide-react';

interface UIProps {
  state: GameState;
  onRestart: () => void;
  onExitSelect: (nodeId: string) => void;
  availableExits: string[];
}

const UIOverlay: React.FC<UIProps> = ({ state, onRestart }) => {
  const location = WORLD_MAP[state.currentLocationId];

  // Win/Loss Screen
  if (state.status === 'LOST' || state.status === 'WON') {
    return (
      <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
        <div className="bg-[#fef3c7] p-8 rounded-lg shadow-2xl max-w-2xl w-full border-4 border-[#8b5cf6] font-hand text-center">
          <h1 className="text-4xl font-bold mb-4 text-[#4c1d95]">
            {state.status === 'WON' ? 'Légende Découverte !' : 'Voyage Terminé'}
          </h1>
          
          {state.status === 'WON' ? (
            <div className="space-y-4">
              <p className="text-2xl text-green-700 font-bold">{location.legend}</p>
              <p className="text-xl italic">{location.theme}</p>
              <p className="text-lg">Score Final: {state.score}</p>
            </div>
          ) : (
            <div className="space-y-4">
              <Skull className="w-16 h-16 mx-auto text-gray-500" />
              <p className="text-xl">Marinette est trop fatiguée pour continuer.</p>
              <p className="text-lg">Score Final: {state.score}</p>
            </div>
          )}

          <button 
            onClick={onRestart}
            className="mt-8 px-8 py-3 bg-[#ec4899] text-white rounded-full font-bold text-xl hover:bg-[#db2777] transition-transform hover:scale-105"
          >
            Retourner à Coulon
          </button>
        </div>
      </div>
    );
  }

  // Main HUD
  return (
    <>
      {/* Top Bar: Health & Score */}
      <div className="absolute top-0 left-0 right-0 p-4 flex justify-between items-start z-10 pointer-events-none">
        <div className="flex space-x-2 bg-white/80 p-2 rounded-full backdrop-blur shadow-lg">
          {[...Array(3)].map((_, i) => (
            <Heart 
              key={i} 
              className={`w-8 h-8 ${i < state.lives ? 'fill-[#ec4899] text-[#ec4899]' : 'fill-gray-300 text-gray-300'}`} 
            />
          ))}
        </div>
        
        <div className="bg-white/80 px-6 py-2 rounded-full backdrop-blur shadow-lg">
           <span className="text-2xl font-bold text-[#4c1d95]">Score: {state.score}</span>
        </div>
      </div>

      {/* Right Side: Explorer's Notebook (Context) */}
      <div className="absolute top-20 right-4 w-64 h-[calc(100%-6rem)] bg-[#fef3c7] rounded-lg shadow-xl border-l-8 border-[#92400e] transform rotate-1 origin-top-right hidden md:block overflow-y-auto font-hand p-4">
        <h3 className="text-xl font-bold border-b-2 border-[#92400e] mb-2 pb-1 text-[#92400e] flex items-center gap-2">
          <Map className="w-5 h-5" />
          {location.name}
        </h3>
        <p className="text-sm text-gray-700 leading-relaxed mb-4">
          Trouvez la sortie vers votre prochaine destination.
        </p>
        
        <div className="mt-4 border-t-2 border-[#92400e] pt-2">
          {/* Legend: Font Arial, Color Black */}
          <h4 className="font-bold text-sm text-black mb-2" style={{ fontFamily: 'Arial, sans-serif' }}>Sorties (Légende):</h4>
          <ul className="text-sm space-y-2 text-black" style={{ fontFamily: 'Arial, sans-serif' }}>
            {state.levelExits.map((exit, idx) => {
                const destName = WORLD_MAP[exit.destinationId]?.name || 'Inconnu';
                return (
                    <li key={idx} className="flex items-center gap-2">
                        <span className="w-4 h-4 rounded-full border border-gray-600 shadow-sm" style={{ backgroundColor: exit.color }}></span>
                        <span>{destName}</span>
                    </li>
                );
            })}
          </ul>
        </div>

        <div className="mt-6 border-t-2 border-[#92400e] pt-2">
          <h4 className="font-bold text-sm text-[#92400e] mb-2">Guide:</h4>
          <ul className="text-sm space-y-1 list-disc pl-4 text-gray-700">
            <li><span className="text-blue-600 font-bold">Eau:</span> +Vitesse</li>
            <li><span className="text-green-700 font-bold">Angélique:</span> +Vie</li>
            <li><span className="text-red-600 font-bold">Ennemis:</span> Dangers</li>
          </ul>
        </div>

        <div className="mt-8 text-xs text-gray-500 text-center">
          Dernière connexion: {state.history[state.history.length - 2] ? WORLD_MAP[state.history[state.history.length - 2]].name : 'Départ'}
        </div>
      </div>

      {/* Mobile Controls Overlay */}
      <div className="absolute bottom-4 left-4 right-4 md:hidden pointer-events-none text-center text-white/50 text-sm">
        Swipe pour bouger • Tap pour langue
      </div>
    </>
  );
};

export default UIOverlay;