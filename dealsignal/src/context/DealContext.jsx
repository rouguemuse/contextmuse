import React, { createContext, useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { calculateDealScore } from '../utils/scoring';

export const DealContext = createContext();

export const DealProvider = ({ children }) => {
  const [deals, setDeals] = useState(() => {
    const savedDeals = localStorage.getItem('dealsignal_deals');
    return savedDeals ? JSON.parse(savedDeals) : [];
  });

  useEffect(() => {
    localStorage.setItem('dealsignal_deals', JSON.stringify(deals));
  }, [deals]);

  const addDeal = (dealData) => {
    const newDeal = {
      ...dealData,
      id: uuidv4(),
      dateFound: new Date().toISOString(),
      score: calculateDealScore(dealData),
      status: dealData.status || 'Needs manual review'
    };
    setDeals([newDeal, ...deals]);
  };

  const updateDeal = (id, updatedData) => {
    setDeals(deals.map(deal => {
      if (deal.id === id) {
        const merged = { ...deal, ...updatedData };
        merged.score = calculateDealScore(merged);
        return merged;
      }
      return deal;
    }));
  };

  const deleteDeal = (id) => {
    setDeals(deals.filter(deal => deal.id !== id));
  };

  return (
    <DealContext.Provider value={{ deals, addDeal, updateDeal, deleteDeal }}>
      {children}
    </DealContext.Provider>
  );
};
