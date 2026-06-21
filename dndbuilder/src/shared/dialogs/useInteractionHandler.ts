import { useState, useRef, useCallback, useEffect } from "react";
import { useIsTouchDevice } from "../touch/useDelayedTap";

/**
 * ============================================================================
 * useInteractionHandler — 统一管理"显示提示 / 打开对话框"交互逻辑
 * ============================================================================
 *
 * 规则:
 *   - 触摸屏（手机/平板）：单击（单指轻触）显示提示（Tooltip/Tip），双击打开对话框
 *   - 键鼠：悬停（mouseenter）显示提示，单击（click）打开对话框
 *   - isAddButton 模式：单击直接打开对话框，不显示提示（用于 + 号空行等）
 *
 * 用法:
 * ```tsx
 * const { tipVisible, onMouseEnter, onMouseLeave, onClick, onTipMouseEnter, onTipMouseLeave } =
 *   useInteractionHandler({
 *     onOpenDialog: () => setIsDialogOpen(true),
 *     onShowTip: (pos) => setTipPos(pos),
 *     onHideTip: () => setHoveredIndex(null),
 *   });
 * ```
 */

// ═══ 类型 ═══════════════════════════════════════════════════════════════════

export interface TipPosition {
  mouseY: number;
  cardLeft: number;
  cardWidth?: number;
  cardBottom?: number;
}

export interface UseInteractionHandlerOptions {
  /** 打开对话框的回调 */
  onOpenDialog?: () => void;
  /** 显示提示的回调（接收鼠标位置） */
  onShowTip?: (pos: TipPosition) => void;
  /** 隐藏提示的回调 */
  onHideTip?: () => void;
  /** 是否为"添加"按钮（单击即开对话框，不显示提示） */
  isAddButton?: boolean;
  /** 交互是否启用（拖拽中可禁用） */
  enabled?: boolean;
  /** 悬停后显示提示的延迟(ms)，0 = 立即显示 */
  tipDelay?: number;
  /** 离开后隐藏提示的延迟(ms) */
  hideDelay?: number;
}

export interface UseInteractionHandlerReturn {
  /** 提示是否可见 */
  tipVisible: boolean;
  /** 手动设置提示可见性 */
  setTipVisible: (v: boolean) => void;
  /** 鼠标/触摸进入元素 */
  onMouseEnter: (e: React.MouseEvent) => void;
  /** 鼠标/触摸离开元素 */
  onMouseLeave: () => void;
  /** 点击/轻触（处理单击/双击差异） */
  onClick: () => void;
  /** 鼠标进入提示区域（取消隐藏计时器） */
  onTipMouseEnter: () => void;
  /** 鼠标离开提示区域（重新调度隐藏） */
  onTipMouseLeave: () => void;
  /** 锁定隐藏（输入框聚焦时防止提示消失） */
  lockHide: () => void;
  /** 解锁隐藏 */
  unlockHide: () => void;
  /** 取消隐藏调度 */
  cancelHide: () => void;
  /** 调度隐藏 */
  scheduleHide: () => void;
}

// ═══ Hook ═══════════════════════════════════════════════════════════════════

export function useInteractionHandler({
  onOpenDialog,
  onShowTip,
  onHideTip,
  isAddButton = false,
  enabled = true,
  tipDelay = 150,
  hideDelay = 100,
}: UseInteractionHandlerOptions): UseInteractionHandlerReturn {
  const isTouch = useIsTouchDevice();
  const [tipVisible, setTipVisible] = useState(false);
  const tipTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const hideTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const tapTimestampRef = useRef(0);
  const hideLockedRef = useRef(false);
  const triggerRef = useRef<Element | null>(null);
  const touchHandlerRef = useRef<EventListener | null>(null);

  // ── 清除提示延迟定时器 ──
  const clearTipTimer = useCallback(() => {
    if (tipTimerRef.current) {
      clearTimeout(tipTimerRef.current);
      tipTimerRef.current = null;
    }
  }, []);

  // ── 取消隐藏调度 ──
  const cancelHide = useCallback(() => {
    if (hideTimerRef.current) {
      clearTimeout(hideTimerRef.current);
      hideTimerRef.current = null;
    }
  }, []);

  // ── 调度隐藏 ──
  const scheduleHide = useCallback(() => {
    if (hideLockedRef.current) return;
    if (hideTimerRef.current) clearTimeout(hideTimerRef.current);
    hideTimerRef.current = setTimeout(() => {
      setTipVisible(false);
      onHideTip?.();
      unregisterTouchDismiss();
    }, hideDelay);
  }, [hideDelay, onHideTip]);

  // ── 触摸点击外部消失（仅在触摸屏下注册） ──
  const registerTouchDismiss = useCallback(() => {
    unregisterTouchDismiss();
    const handler: EventListener = (e: Event) => {
      const touch = e as TouchEvent;
      const target = touch.target as Node | null;
      // 如果点击在触发元素内部 → 不处理（让双击逻辑走）
      if (target && triggerRef.current?.contains(target)) return;
      // 点击在外部 → 关 tip
      setTipVisible(false);
      onHideTip?.();
      document.removeEventListener('touchstart', handler);
      touchHandlerRef.current = null;
    };
    touchHandlerRef.current = handler;
    document.addEventListener('touchstart', handler, { passive: true });
  }, [onHideTip]);

  const unregisterTouchDismiss = useCallback(() => {
    if (touchHandlerRef.current) {
      document.removeEventListener('touchstart', touchHandlerRef.current);
      touchHandlerRef.current = null;
    }
  }, []);

  // ── 鼠标进入元素 ──
  const handleMouseEnter = useCallback(
    (e: React.MouseEvent) => {
      if (!enabled) return;
      // 保存触发元素引用（click-outside 用）
      triggerRef.current = e.currentTarget;
      cancelHide();
      clearTipTimer();
      // 同步获取位置，避免 async 事件池回收
      const rect = e.currentTarget.getBoundingClientRect();
      const pos: TipPosition = {
        mouseY: e.clientY,
        cardLeft: rect.left,
        cardWidth: rect.width,
        cardBottom: rect.bottom,
      };
      const show = () => {
        setTipVisible(true);
        onShowTip?.(pos);
      };
      if (tipDelay <= 0) {
        show();
      } else {
        tipTimerRef.current = setTimeout(show, tipDelay);
      }
    },
    [enabled, cancelHide, clearTipTimer, tipDelay, onShowTip],
  );

  // ── 鼠标离开元素 ──
  const handleMouseLeave = useCallback(() => {
    clearTipTimer();
    scheduleHide();
  }, [clearTipTimer, scheduleHide]);

  // ── 鼠标进入提示区域 ──
  const handleTipMouseEnter = useCallback(() => {
    cancelHide();
  }, [cancelHide]);

  // ── 鼠标离开提示区域 ──
  const handleTipMouseLeave = useCallback(() => {
    scheduleHide();
  }, [scheduleHide]);

  // ── 点击/轻触 ──
  const handleClick = useCallback(() => {
    if (!enabled) return;

    // 添加按钮：单击即开对话框
    if (isAddButton) {
      setTipVisible(false);
      unregisterTouchDismiss();
      onOpenDialog?.();
      return;
    }

    // 统一：所有设备双击打开对话框
    const now = Date.now();
    if (now - tapTimestampRef.current < 500) {
      // 第二次点击 → 双击 → 打开对话框
      tapTimestampRef.current = 0;
      setTipVisible(false);
      unregisterTouchDismiss();
      onOpenDialog?.();
    } else {
      // 第一次点击 → 记录时间戳
      tapTimestampRef.current = now;
      if (isTouch) registerTouchDismiss();
    }
  }, [enabled, isAddButton, isTouch, onOpenDialog, registerTouchDismiss]);

  // ── 锁定/解锁隐藏 ──
  const lockHide = useCallback(() => {
    hideLockedRef.current = true;
  }, []);
  const unlockHide = useCallback(() => {
    hideLockedRef.current = false;
  }, []);

  // ── 组件卸载时清理 ──
  useEffect(() => {
    return () => {
      clearTipTimer();
      if (hideTimerRef.current) clearTimeout(hideTimerRef.current);
      unregisterTouchDismiss();
    };
  }, [clearTipTimer, unregisterTouchDismiss]);

  return {
    tipVisible,
    setTipVisible,
    onMouseEnter: handleMouseEnter,
    onMouseLeave: handleMouseLeave,
    onClick: handleClick,
    onTipMouseEnter: handleTipMouseEnter,
    onTipMouseLeave: handleTipMouseLeave,
    lockHide,
    unlockHide,
    cancelHide,
    scheduleHide,
  };
}
