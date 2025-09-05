import React, { useState, useMemo } from 'react';
import { CabOption } from '../types';
import { UberIcon } from './icons/UberIcon';
import { OlaIcon } from './icons/OlaIcon';
import { InDriveIcon } from './icons/InDriveIcon';
import { CarIcon } from './icons/CarIcon';
import { PersonIcon } from './icons/PersonIcon';
import { BikeIcon } from './icons/BikeIcon';

interface CabOptionsDisplayProps {
  options: CabOption[];
}

// A more robust function to get the correct icon based on service name
const getServiceIcon = (serviceName: string, carType: string): React.FC<React.SVGProps<SVGSVGElement>> => {
  const lowerCaseServiceName = serviceName.toLowerCase();
  const lowerCaseCarType = carType.toLowerCase();

  if (lowerCaseCarType.includes('bike') || lowerCaseCarType.includes('moto') || lowerCaseServiceName.includes('rapido')) {
    return BikeIcon;
  }
  if (lowerCaseServiceName.includes('uber')) {
    return UberIcon;
  }
  if (lowerCaseServiceName.includes('ola')) {
    return OlaIcon;
  }
  if (lowerCaseServiceName.includes('indrive')) {
    return InDriveIcon;
  }
  return CarIcon; // Default icon
};

const CAR_CLASS_FEATURES = ['SUV', 'Sedan', 'Hatchback', 'Compact', 'Electric', 'Carpool'];

const CabOptionsDisplay: React.FC<CabOptionsDisplayProps> = ({ options }) => {
  const [confirmation, setConfirmation] = useState<{
    isOpen: boolean;
    option: CabOption | null;
  }>({ isOpen: false, option: null });
  const [sortBy, setSortBy] = useState<'price' | 'eta'>('price');

  if (!options || options.length === 0) {
    return <p>No cabs found at the moment.</p>;
  }
  
  const sortedOptions = useMemo(() => {
    return [...options].sort((a, b) => {
      if (sortBy === 'eta') {
        return a.etaMinutes - b.etaMinutes;
      }
      return a.price - b.price; // Default sort by price
    });
  }, [options, sortBy]);

  const etaInsight = useMemo(() => {
    if (options.length < 2) {
      return null;
    }
    const etas = options.map(opt => opt.etaMinutes);
    const minEta = Math.min(...etas);
    const maxEta = Math.max(...etas);
    const difference = maxEta - minEta;

    if (difference <= 1) { // Don't show if the difference is negligible
        return null;
    }

    return { difference };
  }, [options]);

  const sortDescription = useMemo(() => {
    switch(sortBy) {
        case 'price': return "Cheapest rides:";
        case 'eta': return "Fastest rides:";
        default: return "Available rides:";
    }
  }, [sortBy]);


  const handleCabClick = (option: CabOption) => {
    setConfirmation({ isOpen: true, option });
  };

  const handleConfirm = () => {
    if (confirmation.option) {
        window.open(confirmation.option.deepLinkUrl, '_blank', 'noopener,noreferrer');
    }
    handleCancel();
  };

  const handleCancel = () => {
    setConfirmation({ isOpen: false, option: null });
  };


  return (
    <div className="space-y-3">
        {etaInsight && (
            <div className="bg-gray-700/60 p-3 rounded-lg border border-gray-600 text-center mb-3">
                <p className="text-sm text-gray-300">
                    💡 <span className="font-semibold text-purple-300">Quick Tip:</span> The fastest ride is 
                    <span className="font-bold text-white"> {etaInsight.difference} min</span> quicker than the slowest option.
                </p>
            </div>
        )}
        <div className="flex items-center justify-between mb-3">
            <p className="text-base font-semibold text-gray-200">
                {sortDescription}
            </p>
            <div className="flex gap-1 rounded-lg bg-gray-900/50 p-1 border border-gray-600">
                <button
                    onClick={() => setSortBy('price')}
                    aria-pressed={sortBy === 'price'}
                    className={`px-3 py-1 rounded-md text-sm transition-all duration-200 ${
                        sortBy === 'price'
                        ? 'bg-purple-600 text-white font-semibold shadow-md'
                        : 'bg-transparent text-gray-400 hover:bg-gray-700/50'
                    }`}
                >
                    Price
                </button>
                <button
                    onClick={() => setSortBy('eta')}
                    aria-pressed={sortBy === 'eta'}
                    className={`px-3 py-1 rounded-md text-sm transition-all duration-200 ${
                        sortBy === 'eta'
                        ? 'bg-purple-600 text-white font-semibold shadow-md'
                        : 'bg-transparent text-gray-400 hover:bg-gray-700/50'
                    }`}
                >
                    ETA
                </button>
            </div>
        </div>
      {sortedOptions.map((option, index) => {
        const Icon = getServiceIcon(option.serviceName, option.carType);
        const carClass = option.features?.find(f => CAR_CLASS_FEATURES.includes(f));
        const otherFeatures = option.features?.filter(f => f !== carClass) ?? [];

        return (
          <button
            key={index}
            onClick={() => handleCabClick(option)}
            className="group w-full text-left block bg-gray-700/50 hover:bg-gray-600/70 p-4 rounded-lg transition-all duration-300 transform hover:scale-105 shadow-md border border-gray-600"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="bg-gray-800 p-2 rounded-full">
                    <Icon className="w-6 h-6" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <p className="font-bold text-white">
                        <span className="group-hover:underline">{option.serviceName}</span>
                        <span className="font-normal text-gray-300"> {option.carType}</span>
                    </p>
                    {option.seats >= 6 && (
                        <span className="text-xs font-semibold bg-indigo-500 text-indigo-100 px-2 py-0.5 rounded-full">XL</span>
                    )}
                  </div>
                  <div className="flex items-center gap-3 text-sm text-gray-400 mt-1 flex-wrap">
                    {carClass && (
                        <>
                            <span className="font-medium text-gray-300">{carClass}</span>
                            <span className="text-gray-500">•</span>
                        </>
                    )}
                    <span>{option.etaMinutes} min away</span>
                    <span className="text-gray-500">•</span>
                    <div className="flex items-center gap-1.5">
                        <PersonIcon className="w-4 h-4 text-gray-400" />
                        <span>{option.seats === 1 ? '1 Rider' : `${option.seats} seats`}</span>
                    </div>
                  </div>
                </div>
              </div>
              <div className="text-right">
                <p className="text-lg font-bold text-green-400">₹{option.price}</p>
                <p className="text-xs text-gray-500">Tap to book</p>
              </div>
            </div>

            {otherFeatures.length > 0 && (
                <div className="flex flex-wrap items-center gap-2 mt-3 pt-3 border-t border-gray-600/50">
                    {otherFeatures.map((feature, idx) => (
                        <span key={idx} className="text-xs font-medium bg-gray-600 text-gray-300 px-2.5 py-1 rounded-full">
                            {feature}
                        </span>
                    ))}
                </div>
            )}
          </button>
        );
      })}

      {confirmation.isOpen && confirmation.option && (
        <div 
            className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-4 transition-opacity duration-300"
            role="dialog"
            aria-modal="true"
            aria-labelledby="dialog-title"
            aria-describedby="dialog-description"
        >
            <div className="bg-gray-800 rounded-2xl p-6 shadow-xl border border-gray-700 max-w-sm w-full transition-transform transform scale-95 duration-300 scale-100">
                <h3 id="dialog-title" className="text-xl font-bold text-white mb-3">Confirm Navigation</h3>
                <p id="dialog-description" className="text-gray-300 mb-6">
                    Are you sure you want to open <span className="font-semibold text-purple-400">{confirmation.option.serviceName}</span>?
                </p>
                <div className="flex justify-end gap-4">
                    <button
                        onClick={handleCancel}
                        className="px-5 py-2 rounded-lg bg-gray-600 text-white font-semibold hover:bg-gray-500 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-gray-500"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleConfirm}
                        className="px-5 py-2 rounded-lg bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold hover:from-purple-600 hover:to-pink-600 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-pink-500"
                    >
                        Open App
                    </button>
                </div>
            </div>
        </div>
      )}
    </div>
  );
};

export default CabOptionsDisplay;