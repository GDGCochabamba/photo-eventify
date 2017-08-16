import { CanvasOutput } from '../canvas-output/canvas-output';
import { Button } from '../button/button';
import { readFile } from '../../lib/file-reader';
import { SnackBar } from '../snackbar/snackbar';

export class WorkArea {
  elem: HTMLElement;

  // config
  minWidth = 200;
  minHeight = 200;
  frame = '/assets/startup-weekend-consciencia-verde-2017.png';
  filename = 'startup-weekend-frame.png';

  // UI
  private canvas: CanvasOutput;
  private askFileButton: Button;
  private saveFileButton: Button;
  private actionArea: HTMLDivElement;

  // helper
  fileInput: HTMLInputElement;
  image: HTMLImageElement;

  constructor() {
    this.elem = document.createElement('div');
    this.elem.classList.add('gdg-work-area');

    // canvas
    this.canvas = new CanvasOutput(800);
    this.canvas.loadFrameByUrl(this.frame).then(()=>{
      this.askFileButton.disabled = false;
    })

    // File input
    this.fileInput = document.createElement('input');
    this.fileInput.type = 'file';
    this.fileInput.accept = 'image/*';
    this.fileInput.addEventListener('change', this.fileSelected.bind(this));

    // Action area
    this.actionArea = document.createElement('div');
    this.actionArea.classList.add('action-area');
    this.actionArea.classList.add('initial');


    this.askFileButton = new Button('Selecciona una foto');
    this.saveFileButton = new Button('Guardar');
    this.saveFileButton.elem.classList.add('save-button');
    this.actionArea.appendChild(this.askFileButton.elem);
    this.actionArea.appendChild(this.saveFileButton.elem);

    this.askFileButton.addEventListener('click', this.openFile.bind(this));

    // build work-area
    this.elem.appendChild(this.canvas.elem);
    this.elem.appendChild(this.actionArea);
    //set button to charge on disabled
    this.askFileButton.disabled = true;
  }

  openFile() {
    this.fileInput.click();
  }

  async fileSelected() {
    this.image = new Image();
    this.image.src = await readFile(this.fileInput.files[0]);
    this.fileInput.value = '';
    this.image.addEventListener('load', this.validateImage.bind(this));
  }

  validateImage() {
    const image = this.image;
    if (image.width < this.minWidth  || image.height < this.minHeight) {
        SnackBar.showSnackBar('La imagen es muy pequeña', 'OK');
    } else {
      this.actionArea.classList.remove('initial');
      this.canvas.setPhoto(this.image);
      this.saveFileButton.setDownload(this.filename, this.canvas);
    }
  }
}
