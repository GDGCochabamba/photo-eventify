import { CanvasOutput } from '../canvas-output/canvas-output';
export class Button {
    elem: HTMLElement;

    // UI
    button: HTMLAnchorElement;

    // helper
    msFixed = false;
    canvas: CanvasOutput;
    disabled: boolean;
    constructor(text: string) {
        const button = document.createElement('a');
        button.text = text;
        button.classList.add('gdg-raised-button');
        button.classList.add('disabled');
        this.disabled = true;
        this.button = button;
        this.elem = button;
    }

    addEventListener(event: 'click', cb: EventListenerOrEventListenerObject) {
        this.button.addEventListener(event, cb);
    }

    setDownload(filename: string, canvas: CanvasOutput) {
      this.button.href = canvas.url;
      this.button.download = filename;
      this.canvas = canvas;

      // IE compat
      if ('msSaveBlob' in navigator && !this.msFixed) {
        this.msFixed = true;
        this.button.addEventListener('click', async event => {
          event.preventDefault();
          const blob = await this.canvas.getBlob();
          navigator.msSaveBlob(blob, this.button.download);
        });
      }
    }
}
