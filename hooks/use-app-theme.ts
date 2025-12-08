import { useState, useEffect } from 'react';
import { getUserSettings, updateThemeColor } from '@/database/userSettings';
import { themeColors, ThemeColorId } from '@/constants/theme';


// 主题接口
export interface AppTheme {
  currentColorId: ThemeColorId;
  currentColor: string;
  changeThemeColor: (colorId: ThemeColorId) => Promise<void>;
  isLoading: boolean;
}

export function useAppTheme(): AppTheme {
  const [currentColorId, setCurrentColorId] = useState<ThemeColorId>('blue');
  const [isLoading, setIsLoading] = useState(true);
  
  // 计算当前主题颜色
  const currentColor = themeColors[currentColorId].color;
  
  // 加载用户设置的主题颜色
  useEffect(() => {
    const loadThemeColor = async () => {
      try {
        const settings = await getUserSettings();
        if (settings?.themeColor && settings.themeColor in themeColors) {
          setCurrentColorId(settings.themeColor as ThemeColorId);
        }
      } catch (error) {
        console.error('加载主题颜色失败:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    loadThemeColor();
  }, []);
  
  // 切换主题颜色
  const changeThemeColor = async (colorId: ThemeColorId) => {
    try {
      setIsLoading(true);
      setCurrentColorId(colorId);
      await updateThemeColor(colorId);
      console.log('主题颜色已切换为:', colorId);
    } catch (error) {
      console.error('保存主题颜色失败:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };
  
  return {
    currentColorId,
    currentColor,
    changeThemeColor,
    isLoading,
  };
}