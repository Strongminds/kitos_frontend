export function verifyClickAndOpenNewTab(event: MouseEvent, url: string): boolean {
  if (!event.ctrlKey && event.button !== 1) return false;

  window.open(url, '_blank');
  event.preventDefault();
  event.stopImmediatePropagation();
  return true;
}
