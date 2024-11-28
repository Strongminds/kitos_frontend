import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ClipboardService {

  public copyContentToClipBoardById(contentRootId: string) {
    const currentWindow = window.getSelection();
    if (!currentWindow) return;
    window.getSelection()?.selectAllChildren(document.getElementById(contentRootId) as Node);
    document.execCommand('copy');
    window.getSelection()?.removeAllRanges();
  }
}
