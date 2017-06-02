export class CanvasOutput {
    elem: HTMLCanvasElement;

    // config
    private fillColor = '#bbb';

    // accessors
    private _url: string;
    get url() {
      if (!this._url) {
        this._url = this.elem.toDataURL();
      }
      return this._url;
    }

    private _blob: Blob;
    async getBlob(): Promise<Blob> {
      if (this.elem.msToBlob) {
        this._blob = this.elem.msToBlob();
      } else {
        this._blob = await new Promise<Blob>((fulfill, reject) => {
          this.elem.toBlob(fulfill);
        });
      }
      return this._blob;
    }


    // helper
    private canvas: HTMLCanvasElement;
    private ctx: CanvasRenderingContext2D;
    private photo: HTMLImageElement;
    private frame: HTMLImageElement;
    private loaded = true;

    constructor(
        private size: number
    ) {
        this.canvas = document.createElement('canvas');
        this.canvas.classList.add('gdg-canvas-output');
        this.ctx = this.canvas.getContext('2d');
        this.resetCanvas();
        this.elem = this.canvas;
    }

    setPhoto(image: HTMLImageElement) {
      if ( !this.loaded ) {
        return false;
      }
      this.photo = image;
      const photoSize = Math.min(this.photo.width, this.photo.height);
      const x = (this.photo.width - photoSize) / 2;
      const y = (this.photo.height - photoSize) / 2;
      this.ctx.drawImage(
        this.photo,
        x, y, photoSize, photoSize,
        0, 0, this.size, this.size
      );
      this.ctx.drawImage(
        this.frame,
        0, 0, this.frame.width, this.frame.height,
        0, 0, this.size, this.size
      );
      this._url = undefined;
      this._blob = undefined;

      return true;
    }

    loadFrameByUrl(url: string): Promise<{}> {
      return new Promise((fulfill, reject) => {
        this.loaded = false;
        this.frame = new Image();
        this.frame.src = '/assets/frame-IO17-Cochabamba.png';
        this.frame.addEventListener('load', () => {
          this.loaded = true;
          fulfill();
        })
      });
    }

    private resetCanvas() {
        this.canvas.width = this.size;
        this.canvas.height = this.size;
        this.ctx.fillStyle = this.fillColor;
        this.ctx.fillRect(0, 0, this.size, this.size);
    }
}
