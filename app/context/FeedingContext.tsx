import React, { createContext, useContext, useState, useCallback } from 'react';
import { FeedingEntry, FeedingSchedule, FoodIntroduction } from '../types/feeding';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface FeedingContextType {
  feedings: FeedingEntry[];
  schedules: FeedingSchedule[];
  foodIntroductions: FoodIntroduction[];
  addFeeding: (feeding: Omit<FeedingEntry, 'id'>) => Promise<void>;
  updateFeeding: (feeding: FeedingEntry) => Promise<void>;
  deleteFeeding: (id: string) => Promise<void>;
  addSchedule: (schedule: Omit<FeedingSchedule, 'id'>) => Promise<void>;
  updateSchedule: (schedule: FeedingSchedule) => Promise<void>;
  deleteSchedule: (id: string) => Promise<void>;
  addFoodIntroduction: (food: Omit<FoodIntroduction, 'id'>) => Promise<void>;
}

const FeedingContext = createContext<FeedingContextType | undefined>(undefined);

export const FeedingProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [feedings, setFeedings] = useState<FeedingEntry[]>([]);
  const [schedules, setSchedules] = useState<FeedingSchedule[]>([]);
  const [foodIntroductions, setFoodIntroductions] = useState<FoodIntroduction[]>([]);

  // Load data from AsyncStorage on mount
  React.useEffect(() => {
    const loadData = async () => {
      try {
        const storedFeedings = await AsyncStorage.getItem('feedings');
        if (storedFeedings) setFeedings(JSON.parse(storedFeedings));
        
        const storedSchedules = await AsyncStorage.getItem('schedules');
        if (storedSchedules) setSchedules(JSON.parse(storedSchedules));
        
        const storedFoodIntros = await AsyncStorage.getItem('foodIntroductions');
        if (storedFoodIntros) setFoodIntroductions(JSON.parse(storedFoodIntros));
      } catch (error) {
        console.error('Error loading feeding data:', error);
      }
    };
    loadData();
  }, []);

  const addFeeding = useCallback(async (feedingData: Omit<FeedingEntry, 'id'>) => {
    const newFeeding: FeedingEntry = {
      ...feedingData,
      id: Date.now().toString(),
    };
    const updatedFeedings = [...feedings, newFeeding];
    setFeedings(updatedFeedings);
    await AsyncStorage.setItem('feedings', JSON.stringify(updatedFeedings));
  }, [feedings]);

  const updateFeeding = useCallback(async (updatedFeeding: FeedingEntry) => {
    const updatedFeedings = feedings.map(f => 
      f.id === updatedFeeding.id ? updatedFeeding : f
    );
    setFeedings(updatedFeedings);
    await AsyncStorage.setItem('feedings', JSON.stringify(updatedFeedings));
  }, [feedings]);

  const deleteFeeding = useCallback(async (id: string) => {
    const updatedFeedings = feedings.filter(f => f.id !== id);
    setFeedings(updatedFeedings);
    await AsyncStorage.setItem('feedings', JSON.stringify(updatedFeedings));
  }, [feedings]);

  const addSchedule = useCallback(async (scheduleData: Omit<FeedingSchedule, 'id'>) => {
    const newSchedule: FeedingSchedule = {
      ...scheduleData,
      id: Date.now().toString(),
    };
    const updatedSchedules = [...schedules, newSchedule];
    setSchedules(updatedSchedules);
    await AsyncStorage.setItem('schedules', JSON.stringify(updatedSchedules));
  }, [schedules]);

  const updateSchedule = useCallback(async (updatedSchedule: FeedingSchedule) => {
    const updatedSchedules = schedules.map(s => 
      s.id === updatedSchedule.id ? updatedSchedule : s
    );
    setSchedules(updatedSchedules);
    await AsyncStorage.setItem('schedules', JSON.stringify(updatedSchedules));
  }, [schedules]);

  const deleteSchedule = useCallback(async (id: string) => {
    const updatedSchedules = schedules.filter(s => s.id !== id);
    setSchedules(updatedSchedules);
    await AsyncStorage.setItem('schedules', JSON.stringify(updatedSchedules));
  }, [schedules]);

  const addFoodIntroduction = useCallback(async (foodData: Omit<FoodIntroduction, 'id'>) => {
    const newFood: FoodIntroduction = {
      ...foodData,
      id: Date.now().toString(),
    };
    const updatedFoods = [...foodIntroductions, newFood];
    setFoodIntroductions(updatedFoods);
    await AsyncStorage.setItem('foodIntroductions', JSON.stringify(updatedFoods));
  }, [foodIntroductions]);

  const value = {
    feedings,
    schedules,
    foodIntroductions,
    addFeeding,
    updateFeeding,
    deleteFeeding,
    addSchedule,
    updateSchedule,
    deleteSchedule,
    addFoodIntroduction,
  };

  return (
    <FeedingContext.Provider value={value}>
      {children}
    </FeedingContext.Provider>
  );
};

export const useFeeding = () => {
  const context = useContext(FeedingContext);
  if (context === undefined) {
    throw new Error('useFeeding must be used within a FeedingProvider');
  }
  return context;
};
