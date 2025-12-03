import { useEffect } from 'react';
import { useBlocker } from 'react-router-dom';

/**
 * 當條件 (when) 為真時，攔截導航並顯示確認視窗
 * @param message 顯示給使用者的訊息
 * @param when 是否啟用攔截
 */
export function usePrompt(message: string, when: boolean) {
  // 1. 處理 React Router 內部的導航 (點擊連結、上一頁)
  const blocker = useBlocker(
    ({ currentLocation, nextLocation }) =>
      when && currentLocation.pathname !== nextLocation.pathname
  );

  useEffect(() => {
    if (blocker.state === "blocked") {
      const proceed = window.confirm(message);
      if (proceed) {
        blocker.proceed();
      } else {
        blocker.reset();
      }
    }
  }, [blocker, message]);

  // 2. 處理瀏覽器層級的導航 (重新整理、關閉分頁)
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (when) {
        e.preventDefault();
        e.returnValue = message; // 現代瀏覽器可能會忽略自定義訊息，但這是標準寫法
        return message;
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [when, message]);
}
