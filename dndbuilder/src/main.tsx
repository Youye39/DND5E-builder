import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'

// 请求持久存储权限 — 降低浏览器在存储压力下自动清除数据的风险
(async () => {
  if (!navigator.storage?.persist) return;

  // 先查当前是否已是持久存储
  const alreadyPersisted = await navigator.storage.persisted();
  if (alreadyPersisted) {
    console.log('✅ 存储已处于持久模式');
    return;
  }

  // 请求持久权限（现代 Chrome 可能自动管理，此调用不一定成功）
  const granted = await navigator.storage.persist();
  if (granted) {
    console.log('✅ 持久存储权限已授予');
  } else {
    console.log('ℹ️ 持久存储权限未显式授予，但现代浏览器会自动保护频繁使用的站点数据，正常使用不容易丢失');
  }
})();

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
