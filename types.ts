
import type React from 'react';

export interface ChatMessage {
  id: number;
  sender: 'user' | 'bot';
  content: React.ReactNode;
  timestamp: string;
}

export interface CabOption {
  serviceName: 'Uber' | 'Ola' | 'inDrive' | string;
  carType: string;
  price: number;
  etaMinutes: number;
  deepLinkUrl: string;
  seats: number;
  features?: string[];
}

export enum ChatFlowState {
  AWAITING_PICKUP,
  AWAITING_DROPOFF,
  AWAITING_SEATS,
  FETCHING_CABS,
  SHOWING_RESULTS,
  ERROR,
}