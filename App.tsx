import React from 'react';
import ChatInterface from './components/ChatInterface';
import { RideGuideLogo } from './components/icons/RideGuideLogo';

const App: React.FC = () => {
  return (
    <div className="min-h-screen bg-slate-900 text-white flex flex-col items-center justify-center p-4 font-sans">
       <div className="w-full max-w-2xl mx-auto">
        <header className="text-center mb-8 flex flex-col items-center">
          <div className="flex items-center gap-3">
            <RideGuideLogo className="w-12 h-12 md:w-14 md:h-14" />
            <h1 className="text-4xl md:text-5xl font-bold text-gray-100">
              RideGuide
            </h1>
          </div>
          <p className="text-gray-400 mt-2">Your AI assistant for finding the best ride prices.</p>
        </header>
        <main>
          <ChatInterface />
        </main>
      </div>
    </div>
  );
};

export default App;