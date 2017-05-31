import { browser, element, by } from 'protractor';

export class PhotoEventifyPage {
  navigateTo() {
    return browser.get('/');
  }

  getParagraphText() {
    return element(by.css('gdg-root h1')).getText();
  }
}
