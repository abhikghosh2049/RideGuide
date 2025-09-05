import React, { useState, useRef, useEffect, useCallback } from 'react';
import { ChatMessage, ChatFlowState } from '../types';
import ChatMessageBubble from './ChatMessageBubble';
import LoadingSpinner from './LoadingSpinner';
import { findCabs } from '../services/geminiService';
import CabOptionsDisplay from './CabOptionsDisplay';
import { SendIcon } from './icons/SendIcon';

const isLocationValid = (location: string): { isValid: boolean; message: string } => {
    const trimmedLocation = location.trim();
    if (trimmedLocation.length < 3) {
        return { isValid: false, message: 'Please enter a more specific location (at least 3 characters).' };
    }
    if (!/[a-zA-Z]/.test(trimmedLocation)) {
        return { isValid: false, message: 'That doesn\'t look like a valid location. Please avoid using only numbers or special characters.' };
    }
    return { isValid: true, message: '' };
};

const ChatInterface: React.FC = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [flowState, setFlowState] = useState<ChatFlowState>(ChatFlowState.AWAITING_PICKUP);
  const [pickupLocation, setPickupLocation] = useState('');
  const [dropoffLocation, setDropoffLocation] = useState('');
  const [seats, setSeats] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);
  
  const addMessage = useCallback((sender: 'user' | 'bot', content: React.ReactNode) => {
    const newMessage: ChatMessage = {
      id: Date.now(),
      sender,
      content,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };
    setMessages(prev => [...prev, newMessage]);
  }, []);

  useEffect(() => {
    addMessage('bot', "Hi there! I'm RideGuide. I can help you find the best cab prices. Where is your pickup location?");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleUserInput = async () => {
    if (inputValue.trim() === '') return;

    addMessage('user', inputValue);
    const userInput = inputValue;
    setInputValue('');

    switch (flowState) {
      case ChatFlowState.AWAITING_PICKUP: {
        const validation = isLocationValid(userInput);
        if (!validation.isValid) {
          addMessage('bot', validation.message);
          break;
        }
        setPickupLocation(userInput);
        setFlowState(ChatFlowState.AWAITING_DROPOFF);
        addMessage('bot', `Great! And where are you heading to from "${userInput}"?`);
        break;
      }
      
      case ChatFlowState.AWAITING_DROPOFF: {
        const validation = isLocationValid(userInput);
        if (!validation.isValid) {
            addMessage('bot', validation.message);
            break;
        }
        setDropoffLocation(userInput);
        setFlowState(ChatFlowState.AWAITING_SEATS);
        addMessage('bot', `Got it. How many seats do you need for your ride?`);
        break;
      }

      case ChatFlowState.AWAITING_SEATS: {
        const numSeats = parseInt(userInput, 10);
        if (isNaN(numSeats) || numSeats <= 0) {
            addMessage('bot', 'That doesn\'t seem like a valid number. Please enter how many seats you need.');
            break;
        }
        setSeats(numSeats);
        setFlowState(ChatFlowState.FETCHING_CABS);
        setIsLoading(true);
        
        const loadingMessage = `Searching for ${numSeats === 1 ? 'rides and bikes' : 'rides'} from "${pickupLocation}" to "${dropoffLocation}" for ${numSeats} ${numSeats === 1 ? 'person' : 'people'}...`;
        addMessage('bot', <LoadingSpinner message={loadingMessage} />);
        
        try {
            const cabs = await findCabs(pickupLocation, dropoffLocation, numSeats);
            setIsLoading(false);
            setMessages(prev => prev.slice(0, -1)); // Remove loading message
            
            if (cabs.length === 0) {
                 const noCabsMessage = `Sorry, I couldn't find any cabs that fit your criteria.`;
                addMessage('bot', noCabsMessage);
                addMessage('bot', "You can start a new search below.");
                setFlowState(ChatFlowState.SHOWING_RESULTS);
            } else {
                addMessage('bot', <CabOptionsDisplay options={cabs} />);
                addMessage('bot', "Here are the best options I found. Tap one to open the app, or book another ride below.");
                setFlowState(ChatFlowState.SHOWING_RESULTS);
            }
        } catch (error) {
            console.error("Failed to fetch cab options:", error);
            setIsLoading(false);
            setMessages(prev => prev.slice(0, -1));
            addMessage('bot', "I'm sorry, I couldn't search for rides right now. Please check your internet connection and try again shortly. To restart, please enter your pickup location.");
            setFlowState(ChatFlowState.AWAITING_PICKUP);
        }
        break;
      }

      default:
        // Default behavior if state is somehow lost, restart the flow.
        addMessage('bot', "Let's start over. Where is your pickup location?");
        setFlowState(ChatFlowState.AWAITING_PICKUP);
        break;
    }
  };

  const getPlaceholderText = () => {
    switch (flowState) {
        case ChatFlowState.AWAITING_PICKUP:
        case ChatFlowState.AWAITING_DROPOFF:
            return "Type your location...";
        case ChatFlowState.AWAITING_SEATS:
            return "Enter number of seats (e.g., 4)...";
        default:
            return "Type your message...";
    }
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isLoading) {
      handleUserInput();
    }
  };
  
  const handleBookAgain = () => {
    setPickupLocation('');
    setDropoffLocation('');
    setSeats(null);
    setFlowState(ChatFlowState.AWAITING_PICKUP);
    addMessage('bot', "Let's find another ride! What's the new pickup location?");
  };

  return (
    <div className="bg-gray-800 rounded-2xl shadow-2xl overflow-hidden border border-gray-700 h-[70vh] flex flex-col">
      <div className="p-4 border-b border-gray-700 text-center">
        <h2 className="text-xl font-semibold">RideGuide</h2>
      </div>
      <div className="flex-1 p-4 md:p-6 space-y-4 overflow-y-auto">
        {messages.map((msg) => (
          <ChatMessageBubble key={msg.id} message={msg} />
        ))}
        <div ref={messagesEndRef} />
      </div>
      <div className="p-4 border-t border-gray-700 bg-gray-800">
        {flowState === ChatFlowState.SHOWING_RESULTS ? (
          <button
            onClick={handleBookAgain}
            className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-full py-3 px-5 font-semibold hover:from-purple-600 hover:to-pink-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-pink-500 transition duration-300 transform hover:scale-105"
          >
            Book Another Ride
          </button>
        ) : (
          <form onSubmit={handleFormSubmit} className="flex items-center space-x-3">
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder={isLoading ? "Please wait..." : getPlaceholderText()}
              disabled={isLoading}
              className="flex-1 bg-gray-700 border border-gray-600 rounded-full py-3 px-5 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 transition duration-300"
              autoFocus
            />
            <button
              type="submit"
              disabled={isLoading || inputValue.trim() === ''}
              className="bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-full p-3 disabled:opacity-50 disabled:cursor-not-allowed hover:from-purple-600 hover:to-pink-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-pink-500 transition duration-300 transform hover:scale-105"
            >
              <SendIcon />
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default ChatInterface;