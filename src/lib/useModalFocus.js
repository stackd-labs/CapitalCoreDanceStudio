import { useEffect, useRef } from "react";
export function useModalFocus(open, onClose) {
  const panel = useRef(null);
  const close = useRef(onClose);
  useEffect(() => { close.current = onClose; });
  useEffect(() => {
    if (!open || !panel.current) return;
    const node = panel.current;
    const previous = document.activeElement;
    const hidden = [];
    let branch = node;
    while (branch.parentElement && branch !== document.body) {
      for (const sibling of Array.from(branch.parentElement.children)) {
        if (sibling instanceof HTMLElement && sibling !== branch && !sibling.hasAttribute("data-modal-backdrop") && !sibling.contains(node)) {
          hidden.push([sibling, sibling.inert]); sibling.inert = true;
        }
      }
      branch = branch.parentElement;
    }
    const focusable = () => Array.from(node.querySelectorAll('a[href],button:not([disabled]),input:not([disabled]),select:not([disabled]),textarea:not([disabled]),[tabindex="0"]')).filter(el => el.tabIndex >= 0 && el.getClientRects().length > 0);
    (focusable()[0] || node).focus();
    const onKey = (event) => {
      if (event.key === "Escape") { event.preventDefault(); close.current(); }
      if (event.key !== "Tab") return;
      const list = focusable(), first = list[0], last = list[list.length - 1];
      if (!first) { event.preventDefault(); node.focus(); return; }
      if (event.shiftKey && (document.activeElement === first || document.activeElement === node)) { event.preventDefault(); last.focus(); }
      else if (!event.shiftKey && (document.activeElement === last || !node.contains(document.activeElement))) { event.preventDefault(); first.focus(); }
    };
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("keydown", onKey);
      hidden.forEach(([element, inert]) => { element.inert = inert; });
      if (previous?.isConnected) previous.focus({ preventScroll: true });
    };
  }, [open]);
  return panel;
}
