import { WorkArea } from './ui/work-area/work-area';

export function initialize() {
  const page = document.querySelector('.gdg-page');
  const workArea = new WorkArea();
  page.appendChild(workArea.elem);
}
