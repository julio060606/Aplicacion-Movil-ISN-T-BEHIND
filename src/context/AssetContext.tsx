// src/context/AssetContext.tsx
import React, { createContext, useContext, useState, ReactNode } from 'react';
import { IAssetConfig, AssetCategory } from '../models/assets';

interface AssetContextType extends IAssetConfig {
  setUseMockAssets: (useMocks: boolean) => void;
  setCategoryOverride: (category: AssetCategory, useMock: boolean) => void;
}

const defaultContext: AssetContextType = {
  useMockAssets: true,
  categoryOverrides: {},
  setUseMockAssets: () => {},
  setCategoryOverride: () => {},
};

const AssetContext = createContext<AssetContextType>(defaultContext);

export const AssetProvider = ({ children }: { children: ReactNode }) => {
  const [useMockAssets, setUseMockAssets] = useState<boolean>(true);
  const [categoryOverrides, setCategoryOverrides] = useState<Partial<Record<AssetCategory, boolean>>>({});

  const handleSetCategoryOverride = (category: AssetCategory, useMock: boolean) => {
    setCategoryOverrides(prev => ({ ...prev, [category]: useMock }));
  };

  return (
    <AssetContext.Provider value={{
      useMockAssets,
      categoryOverrides,
      setUseMockAssets,
      setCategoryOverride: handleSetCategoryOverride
    }}>
      {children}
    </AssetContext.Provider>
  );
};

export const useAssetSwitcher = () => useContext(AssetContext);
