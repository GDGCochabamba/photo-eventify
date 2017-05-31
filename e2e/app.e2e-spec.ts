import { PhotoEventifyPage } from './app.po';

describe('photo-eventify App', () => {
  let page: PhotoEventifyPage;

  beforeEach(() => {
    page = new PhotoEventifyPage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('gdg works!');
  });
});
