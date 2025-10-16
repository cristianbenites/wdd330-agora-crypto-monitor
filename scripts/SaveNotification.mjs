import { qs } from "./utils.mjs";

const NOTIFICATION_ELEMENT = "#save-notification";

export default class SaveNotification {
  constructor() {}

  show(callback) {
    this.resetState();
    this.restartProgressBarAnimation();
    this.runAnimation(callback);
  }

  runAnimation(callback) {
    const notification = qs(NOTIFICATION_ELEMENT);
    setTimeout(() => {
      notification.classList.add("hide");
      notification.classList.remove("show");
      setTimeout(() => {
        notification.classList.add("hidden");
        callback && callback();
      }, 500); // fade-out duration
    }, 3000);
  }

  restartProgressBarAnimation() {
    const bar = qs(NOTIFICATION_ELEMENT).querySelector(".progress-bar");
    bar.style.animation = "none";
    bar.offsetHeight;
    bar.style.animation = null;
  }

  resetState() {
    const notification = qs(NOTIFICATION_ELEMENT);
    notification.classList.remove("hidden", "hide");
    notification.classList.add("show");
  }
}
