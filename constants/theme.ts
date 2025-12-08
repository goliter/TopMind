/**
 * Below are the colors that are used in the app. The colors are defined in the light and dark mode.
 */

import { Platform } from 'react-native';

// 主题颜色选项
export type ThemeColorId = 'blue' | 'green' | 'purple' | 'pink' | 'orange' | 'red' | 'yellow' | 'gray';

// 主题颜色映射
export const themeColors: Record<ThemeColorId, { name: string; color: string }> = {
  blue: { name: '蓝色', color: '#4A90E2' },
  green: { name: '绿色', color: '#20B2AA' },
  purple: { name: '紫色', color: '#9370DB' },
  pink: { name: '粉色', color: '#FF69B4' },
  orange: { name: '橙色', color: '#FF8C00' },
  red: { name: '红色', color: '#FF4444' },
  yellow: { name: '黄色', color: '#FFD700' },
  gray: { name: '灰色', color: '#808080' },
};

// 基础主题颜色
export const baseColors = {
  background: '#f5f5f5',
  white: '#ffffff',
  textPrimary: '#333333',
  textSecondary: '#666666',
  border: '#e0e0e0',
  buttonPrimary: '#007AFF',
  buttonDanger: '#ff4444',
};

const tintColorLight = '#0a7ea4';
const tintColorDark = '#fff';

export const Colors = {
  light: {
    text: '#11181C',
    background: baseColors.background,
    tint: tintColorLight,
    icon: '#687076',
    tabIconDefault: '#687076',
    tabIconSelected: tintColorLight,
  },
  dark: {
    text: '#ECEDEE',
    background: '#151718',
    tint: tintColorDark,
    icon: '#9BA1A6',
    tabIconDefault: '#9BA1A6',
    tabIconSelected: tintColorDark,
  },
};

export const Fonts = Platform.select({
  ios: {
    sans: 'system-ui',
    serif: 'ui-serif',
    rounded: 'ui-rounded',
    mono: 'ui-monospace',
  },
  default: {
    sans: 'normal',
    serif: 'serif',
    rounded: 'normal',
    mono: 'monospace',
  },
  web: {
    sans: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
    serif: "Georgia, 'Times New Roman', serif",
    rounded: "'SF Pro Rounded', 'Hiragino Maru Gothic ProN', Meiryo, 'MS PGothic', sans-serif",
    mono: "SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace",
  },
});