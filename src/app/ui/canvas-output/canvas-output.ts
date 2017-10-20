import * as EXIF from 'exif-js';
// declare var EXIF: any;

function base64ToArrayBuffer (base64) {
  base64 = base64.replace(/^data\:([^\;]+)\;base64,/gmi, '');
  var binaryString = atob(base64);
  var len = binaryString.length;
  var bytes = new Uint8Array(len);
  for (var i = 0; i < len; i++) {
      bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes.buffer;
}

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
    private frame: HTMLImageElement[];
    private loaded = true;
    private selected: number;

    constructor(
        private size: number
    ) {
        this.canvas = document.createElement('canvas');
        this.canvas.classList.add('gdg-canvas-output');
        this.ctx = this.canvas.getContext('2d');
        this.resetCanvas();
        this.elem = this.canvas;
        this.selected = 0
        this.frame = [];
    }

    setPhoto(image: HTMLImageElement) {
      let exif = EXIF.readFromBinaryFile(base64ToArrayBuffer(image.src));
      if ( !this.loaded ) {
        return false;
      }
      this.photo = image;
      const photoSize = Math.min(this.photo.width, this.photo.height);
      const x = (this.photo.width - photoSize) / 2;
      const y = (this.photo.height - photoSize) / 2;
      switch(exif.Orientation){
        case 2:
            // horizontal flip
            this.ctx.translate(this.size, 0);
            this.ctx.scale(-1, 1);
            break;
        case 3:
            // 180° rotate left
            this.ctx.translate(this.size, this.size);
            this.ctx.rotate(Math.PI);
            break;
        case 4:
            // vertical flip
            this.ctx.translate(0, this.size);
            this.ctx.scale(1, -1);
            break;
        case 5:
            // vertical flip + 90 rotate right
            this.ctx.rotate(0.5 * Math.PI);
            this.ctx.scale(1, -1);
            break;
        case 6:
            // 90° rotate right
            this.ctx.rotate(0.5 * Math.PI);
            this.ctx.translate(0, -this.size);
            break;
        case 7:
            // horizontal flip + 90 rotate right
            this.ctx.rotate(0.5 * Math.PI);
            this.ctx.translate(this.size, -this.size);
            this.ctx.scale(-1, 1);
            break;
        case 8:
            // 90° rotate left
            this.ctx.rotate(-0.5 * Math.PI);
            this.ctx.translate(-this.size, 0);
            break;
      }
      this.ctx.drawImage(
        this.photo,
        x, y, photoSize, photoSize,
        0, 0, this.size, this.size
      );
      this.ctx.setTransform(1, 0, 0, 1, 0, 0);
      const frame = this.frame[this.selected]
      this.ctx.drawImage(
        frame,
        0, 0, frame.width, frame.height,
        0, 0, this.size, this.size
      );
      this._url = undefined;
      this._blob = undefined;

      return true;
    }

    loadFrameByUrl(url: string): Promise<{}> {
      return new Promise((fulfill, reject) => {
        this.loaded = false;
        const img = new Image();
        img.src = url;
        img.addEventListener('load', () => {
          this.loaded = true;
          fulfill();
        })
        this.frame.push(img)
      });
    }

    nextFrame() {
      this.selected = (this.selected + 1) % this.frame.length;
    }

    private resetCanvas() {
        this.canvas.width = this.size;
        this.canvas.height = this.size;
        this.ctx.fillStyle = this.fillColor;
        this.ctx.fillRect(0, 0, this.size, this.size);
    }
}
