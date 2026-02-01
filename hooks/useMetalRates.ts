'use client';

import { useEffect, useCallback, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch } from '../redux/store';
import { fetchRatesAsync, setAutoRefresh } from '../redux/metalRatesSlice';
import { selectMetalRates, selectRatesLoading, selectRatesError } from '../redux/metalRatesSlice';
import { RootState } from '../redux/store';

// Custom hook for metal rates functionality
export function useMetalRates() {
  const dispatch = useDispatch<AppDispatch>();
  const rates = useSelector((state: RootState) => selectMetalRates(state));
  const loading = useSelector((state: RootState) => selectRatesLoading(state));
  const error = useSelector((state: RootState) => selectRatesError(state));
  
  const refreshIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const lastFetchRef = useRef<number>(0);

  // Fetch rates function
  const refreshRates = useCallback(() => {
    void dispatch(fetchRatesAsync());
    lastFetchRef.current = Date.now();
  }, [dispatch]);

  // Auto-refresh setup
  useEffect(() => {
    // Initial fetch
    refreshRates();

    // Set up auto-refresh every 60 seconds
    refreshIntervalRef.current = setInterval(() => {
      refreshRates();
    }, 60000); // 60 seconds

    // Cleanup on unmount
    return () => {
      if (refreshIntervalRef.current) {
        clearInterval(refreshIntervalRef.current);
      }
    };
  }, [refreshRates]);

  // Toggle auto-refresh
  const toggleAutoRefresh = useCallback(() => {
    if (refreshIntervalRef.current) {
      clearInterval(refreshIntervalRef.current);
      refreshIntervalRef.current = null;
      dispatch(setAutoRefresh(false));
    } else {
      refreshRates();
      refreshIntervalRef.current = setInterval(refreshRates, 60000);
      dispatch(setAutoRefresh(true));
    }
  }, [dispatch, refreshRates]);

  // Format last updated time
  const getLastUpdatedText = useCallback(() => {
    if (!rates.lastUpdated) return 'Never';
    
    const date = new Date(rates.lastUpdated);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    
    if (diffMins < 1) return 'Just now';
    if (diffMins === 1) return '1 minute ago';
    if (diffMins < 60) return `${diffMins} minutes ago`;
    
    const diffHours = Math.floor(diffMins / 60);
    if (diffHours === 1) return '1 hour ago';
    if (diffHours < 24) return `${diffHours} hours ago`;
    
    return date.toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit',
    });
  }, [rates.lastUpdated]);

  // Get change indicator
  const getChangeInfo = useCallback((type: 'gold' | 'silver') => {
    const metal = rates[type];
    return {
      change: metal.change,
      changePercent: metal.changePercent,
      direction: metal.change > 0 ? 'up' : metal.change < 0 ? 'down' : 'neutral',
    };
  }, [rates]);

  return {
    rates,
    loading,
    error,
    refreshRates,
    toggleAutoRefresh,
    getLastUpdatedText,
    getChangeInfo,
  };
}

// Hook for getting rates formatted for billing
export function useRatesForBilling() {
  const { rates, getChangeInfo } = useMetalRates();
  
  const getRateForItem = useCallback((metalType: string) => {
    if (metalType === 'gold') {
      return rates.gold.local;
    } else if (metalType === 'silver') {
      return rates.silver.local;
    }
    return 0;
  }, [rates]);

  return {
    goldRate: rates.gold.local,
    silverRate: rates.silver.local,
    getRateForItem,
    getChangeInfo,
  };
}

// Hook for getting rates formatted for inventory
export function useRatesForInventory() {
  const { rates, getChangeInfo } = useMetalRates();
  
  const getMCXRate = useCallback((metalType: string) => {
    if (metalType === 'gold') {
      return rates.gold.mcx;
    } else if (metalType === 'silver') {
      return rates.silver.mcx;
    }
    return 0;
  }, [rates]);

  const getLocalRate = useCallback((metalType: string) => {
    if (metalType === 'gold') {
      return rates.gold.local;
    } else if (metalType === 'silver') {
      return rates.silver.local;
    }
    return 0;
  }, [rates]);

  return {
    goldMCX: rates.gold.mcx,
    goldLocal: rates.gold.local,
    silverMCX: rates.silver.mcx,
    silverLocal: rates.silver.local,
    getMCXRate,
    getLocalRate,
    getChangeInfo,
  };
}

