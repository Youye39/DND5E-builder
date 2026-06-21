import { useRef, useCallback } from "react";

/** 是否触摸屏设备 */
export function useIsTouchDevice(): boolean {
  const ref = useRef(
    typeof window !== "undefined" &&
    ("ontouchstart" in window || navigator.maxTouchPoints > 0)
  );
  return ref.current;
}

/**
 * 触摸设备上：第一次点击只展示 Tooltip，第二次才执行回调
 * 鼠标设备上：直接执行回调
 */
export function useDelayedTap(onClick: () => void): () => void {
  const isTouch = useIsTouchDevice();
  const tapCount = useRef(0);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  return useCallback(() => {
    if (!isTouch) {
      onClick();
      return;
    }
    tapCount.current++;
    if (tapCount.current >= 2) {
      // 第二次轻触 → 执行（打开对话框）
      tapCount.current = 0;
      clearTimeout(timerRef.current ?? undefined);
      onClick();
    } else {
      // 第一次轻触 → 等待 500ms，超时后重置
      clearTimeout(timerRef.current ?? undefined);
      timerRef.current = setTimeout(() => {
        tapCount.current = 0;
      }, 500);
    }
  }, [onClick, isTouch]);
}
