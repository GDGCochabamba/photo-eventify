// ported from: https://codepen.io/reza-h/pen/ORQjbp
export class SnackBar {
  // config
  ttl = 5000;

  public static showSnackBar(message: string, actionText?: string, action?: EventListenerOrEventListenerObject) {
    SnackBar.previous = new SnackBar(message, actionText, action);
  }

  private static previous: SnackBar = null;

  // UI
  private snackbar: HTMLElement;
  private text: Text;
  private actionButton: HTMLButtonElement;

  private constructor(message: string, actionText?: string, action?: EventListenerOrEventListenerObject) {
    if (SnackBar.previous) {
      SnackBar.previous.dismiss();
    }
    this.snackbar = document.createElement('div');
    this.snackbar.className = 'paper-snackbar';
    this.text = document.createTextNode(message);
    this.snackbar.appendChild(this.text);
    if (actionText) {
      if (!action) {
        action = this.dismiss.bind(this);
      }
      this.actionButton = document.createElement('button');
      this.actionButton.className = 'action';
      this.actionButton.innerHTML = actionText;
      this.actionButton.addEventListener('click', action);
      this.snackbar.appendChild(this.actionButton);
    } else {
      setTimeout(() => {
        if (SnackBar.previous === this) {
          SnackBar.previous.dismiss();
        }
      }, this.ttl);
    }

    this.snackbar.addEventListener('transitionend', (event) => {
      if (event['propertyName'] === 'opacity' && this.snackbar.style.opacity === '0') {
        document.body.removeChild(this.snackbar);
        if (SnackBar.previous === this) {
          SnackBar.previous = null;
        }
      }
    });

    document.body.appendChild(this.snackbar);
    // In order for the animations to trigger, I have to force the original style to be computed, and then change it.
    getComputedStyle(this.snackbar).bottom;
    this.snackbar.style.bottom = '0px';
    this.snackbar.style.opacity = '1';
  }

  private dismiss() {
    this.snackbar.style.opacity = '0';
  }
}

var createSnackbar = (function() {

  return function(message, actionText, action) {









  };
})();
