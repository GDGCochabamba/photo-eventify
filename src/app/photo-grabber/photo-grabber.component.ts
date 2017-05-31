import {
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  ViewChild
} from '@angular/core';

import {
  MdSnackBar
} from '@angular/material';

@Component({
  selector: 'gdg-photo-grabber',
  templateUrl: './photo-grabber.component.html',
  styleUrls: ['./photo-grabber.component.scss']
})
export class PhotoGrabberComponent implements OnInit {

  @Output() imageSelect: EventEmitter<HTMLImageElement>;

  @Input() minWidth: number;
  @Input() minHeight: number;

  @ViewChild('canvas') canvasRef: {nativeElement: HTMLCanvasElement};

  imageUrl: string;
  image: HTMLImageElement;
  context: CanvasRenderingContext2D;
  error = false;

  canvasSize = 700;

  constructor(
    private snackBar: MdSnackBar,
  ) { }

  ngOnInit() {
    const canvas = this.canvasRef.nativeElement;
    this.context = canvas.getContext('2d');
    canvas.width = this.canvasSize;
    canvas.height = this.canvasSize;
    this.context.fillStyle = '#bbb';
    this.context.fillRect(0, 0, this.canvasSize, this.canvasSize);

    this.imageSelect = new EventEmitter<HTMLImageElement>();
  }

  async loadImage(event: HTMLInputElement) {
    this.imageUrl = await this.readFile(event.files[0]);
    const rawImage = await this.generateImage(this.imageUrl);
    if (rawImage.error) {
      this.snackBar.open(rawImage.error);
    } else {
      this.error = false;
      this.image = rawImage.image;
      await this.eventify();
      this.imageSelect.emit(this.image);
    }
  }

  saveImage(button: HTMLLinkElement) {
    const link = document.createElement('a');
    link.href = this.canvasRef.nativeElement.toDataURL();
    link.target = 'about:blank';
    link.download = 'io-photo';
    link.type = 'image/png';
    link.click();
  }

  private readFile(file): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        resolve(reader.result);
      };
    });
  }

  private generateImage(sourceImage: string): Promise<{
    error?: string,
    image?: HTMLImageElement
  }> {
    return new Promise((fulfill, reject) => {
      const image = new Image();
      image.src = sourceImage;
      image.onload = () => {
          if (image.width < this.minWidth  || image.height < this.minHeight) {
            fulfill({
              error: 'La imagen es muy pequeña'
            });
          } else {
            fulfill({ image });
          }
      };
    });
  }

  private eventify(): Promise<{}> {
    return new Promise((fulfill, reject) => {
      const frame = new Image();
      frame.src = '/assets/frame-IO17-Cochabamba.png';
      frame.onload = () => {
        const photoSize = Math.min(this.image.width, this.image.height);
        const x = (this.image.width - photoSize) / 2;
        const y = (this.image.height - photoSize) / 2;
        this.context.drawImage(
          this.image,
          x, y, photoSize, photoSize,
          0, 0, this.canvasSize, this.canvasSize
        );
        this.context.drawImage(
          frame,
          0, 0, frame.width, frame.height,
          0, 0, this.canvasSize, this.canvasSize
        );
        fulfill();
      };
    });
  }

}
