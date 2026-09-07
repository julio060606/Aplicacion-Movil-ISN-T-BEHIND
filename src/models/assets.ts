// src/models/assets.ts
import React from 'react';

export type AssetCategory = 'CHARACTERS' | 'DOCUMENTS' | 'TOOLS' | 'BACKGROUNDS' | 'UI_ICONS';

export interface IAssetDefinition {
  id: string;
  category: AssetCategory;
  mockColor: string;
  mockLabel: string;
  realSource?: number | string; // require('...') or URI
  svgComponent?: React.ComponentType<any>;
  dimensions: { width: number | string; height: number | string };
}

export interface IAssetConfig {
  useMockAssets: boolean;
  categoryOverrides?: Partial<Record<AssetCategory, boolean>>;
}
