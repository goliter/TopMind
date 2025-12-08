import { Stack } from "expo-router";
import { useEffect } from "react";
import { initDatabase } from "../database/index";

export const unstable_settings = {
  anchor: "(tabs)",
};

export default function RootLayout() {
  // 应用启动时初始化数据库
  useEffect(() => {
    const initializeApp = async () => {
      try {
        await initDatabase();
        console.log("数据库初始化成功");
      } catch (error) {
        console.error("数据库初始化失败:", error);
      }
    };
    
    initializeApp();
  }, []);

  return (
    <Stack>
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen 
        name="FocusDetailScreen" 
        options={{ 
          headerShown: false,
          presentation: "modal" 
        }} 
      />
    </Stack>
  );
}
