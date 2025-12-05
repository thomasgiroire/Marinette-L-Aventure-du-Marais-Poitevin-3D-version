import React from 'react';
import { GameState, CameraMode } from '../types';
import { WORLD_MAP } from '../constants';
import { Heart, Map, Skull, Share2, RotateCcw, Eye } from 'lucide-react';

interface UIProps {
  state: GameState;
  onRestart: () => void;
  onExitSelect: (nodeId: string) => void;
  availableExits: string[];
  cameraMode: CameraMode;
  onToggleCamera: () => void;
}

const UIOverlay: React.FC<UIProps> = ({ state, onRestart, cameraMode, onToggleCamera }) => {
  const location = WORLD_MAP[state.currentLocationId];

  const handleShare = async () => {
    const shareData = {
      title: "Marinette: L'Aventure du Marais Poitevin",
      text: `J'ai découvert la légende "${location.legend}" à ${location.name} avec un score de ${state.score} ! 🐸✨ #MaraisPoitevin`,
      url: window.location.href
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch (err) {
        // Share cancelled
      }
    } else {
       // Fallback
       try {
        await navigator.clipboard.writeText(`${shareData.text} ${shareData.url}`);
        alert("Résultat copié dans le presse-papier !");
       } catch (e) {
        alert("Partage non supporté sur cet appareil.");
       }
    }
  };

  // Win/Loss Screen
  if (state.status === 'LOST' || state.status === 'WON') {
    return (
      <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm p-4">
        {/* Victory/Loss Modal matching the visual design of the screenshot */}
        <div className="relative bg-[#fffac8] p-8 rounded-xl shadow-[0_0_20px_rgba(0,0,0,0.3)] max-w-lg w-full border-[6px] border-[#a855f7] flex flex-col items-center text-center">
          
          <h1 className="font-hand text-4xl font-bold mb-6 text-[#7e22ce]">
            {state.status === 'WON' ? 'Légende Découverte !' : 'Voyage Terminé'}
          </h1>
          
          {state.status === 'WON' ? (
            <div className="space-y-4 mb-8 w-full">
              <p className="font-hand text-3xl font-bold text-[#15803d]">
                {location.legend}
              </p>
              {/* Added drop-shadow to white text to ensure readability on light background as requested by 'On arrive pas à lire' */}
              <p className="font-hand text-xl italic text-white drop-shadow-[0_2px_2px_rgba(0,0,0,0.8)] px-4 leading-relaxed">
                {location.theme}
              </p>
              <p className="font-hand text-lg text-white font-bold drop-shadow-[0_2px_2px_rgba(0,0,0,0.8)] mt-4">
                Score Final: {state.score}
              </p>
            </div>
          ) : (
            <div className="space-y-4 mb-8">
              <Skull className="w-20 h-20 mx-auto text-gray-500 mb-4" />
              <p className="font-hand text-2xl text-gray-700">Marinette est trop fatiguée.</p>
              <p className="font-hand text-lg text-gray-600">Score Final: {state.score}</p>
            </div>
          )}

          <div className="flex flex-col sm:flex-row gap-4 w-full justify-center">
            <button 
              onClick={onRestart}
              className="flex items-center justify-center gap-2 px-8 py-3 bg-[#ec4899] text-white rounded-full font-hand font-bold text-xl shadow-lg hover:bg-[#db2777] transition-transform hover:scale-105 active:scale-95"
            >
              <RotateCcw size={24} />
              Rejouer
            </button>
            
            {state.status === 'WON' && (
              <button 
                onClick={handleShare}
                className="flex items-center justify-center gap-2 px-8 py-3 bg-[#3b82f6] text-white rounded-full font-hand font-bold text-xl shadow-lg hover:bg-[#2563eb] transition-transform hover:scale-105 active:scale-95"
              >
                <Share2 size={24} />
                Partager
              </button>
            )}
          </div>
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
      <div className="absolute top-20 right-4 w-64 h-[calc(100%-6rem)] bg-[#fef3c7] rounded-lg shadow-xl border-l-8 border-[#92400e] transform rotate-1 origin-top-right hidden md:block overflow-y-auto font-hand p-4 pointer-events-auto">
        <h3 className="text-xl font-bold border-b-2 border-[#92400e] mb-2 pb-1 text-[#92400e] flex items-center gap-2">
          <Map className="w-5 h-5" />
          {location.name}
        </h3>
        <p className="text-sm text-gray-700 leading-relaxed mb-4">
          Trouvez la sortie vers votre prochaine destination.
        </p>
        
        {/* Camera Toggle Button */}
        <button 
            onClick={onToggleCamera}
            className="w-full flex items-center justify-center gap-2 bg-[#92400e] text-white py-2 rounded mb-4 shadow hover:bg-[#78350f] transition-colors font-bold text-sm"
        >
            <Eye size={16} />
            Vue: {cameraMode === 'FPS' ? '1ère Personne' : '3ème Personne'}
        </button>
        
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