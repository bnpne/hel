// import "./utils/polyfill";
import "./utils/scroll";
// import "./utils/sw";

import AutoBind from "auto-bind";
import each from "lodash/each";

import Detection from "./classes/Detection";

import Home from "./pages/Home";

import Canvas from "./components/Canvas";

import "../styles/index.scss";

class App {
  constructor() {
    this.url = window.location.pathname;
    this.mouse = {
      x: window.innerWidth / 2,
      y: window.innerHeight / 2,
    };

    AutoBind(this);

    // this.createPreloader();s
    this.createCanvas();

    this.createHome();

    this.pages = {
      "/": this.home,
    };

    this.page = this.pages[this.url];
    this.page.create();
    this.page.show();

    this.addEventListeners();
    this.addLinksEventsListeners();
  }

  createCanvas() {
    this.canvas = new Canvas({
      url: this.url,
    });
  }

  createNavigation() {
    this.navigation = new Navigation({
      canvas: this.canvas,
      url: this.url,
    });
  }

  createHome() {
    this.home = new Home();
  }

  async onChange({ push = !IS_DEVELOPMENT, url = null }) {
    url = url.replace(window.location.origin, "");

    if (this.isLoading || this.url === url) return;

    this.isLoading = true;

    this.url = url;

    if (this.canvas) {
      this.canvas.onChange(this.url);
    }

    await this.page.hide();

    if (push) {
      window.history.pushState({}, document.title, url);
    }

    this.navigation.onChange(this.url);

    this.page = this.pages[this.url];
    this.page.create();
    await this.page.show(this.url);

    this.isLoading = false;
  }

  update() {
    if (this.page) {
      this.page.update();
    }

    if (this.canvas && this.canvas.update) {
      this.canvas.update(this.case.scroll ? this.case.scroll.current : 0);
    }

    window.requestAnimationFrame(this.update);
  }

  onContextMenu(event) {
    event.preventDefault();
    event.stopPropagation();

    return false;
  }

  onPopState() {
    this.onChange({
      url: window.location.pathname,
      push: false,
    });
  }

  onResize() {
    if (this.home) {
      this.home.onResize();
    }

    if (this.canvas && this.canvas.onResize) {
      this.canvas.onResize();
    }
  }

  onTouchDown(event) {
    event.stopPropagation();

    if (!Detection.isMobile() && event.target.tagName === "A") return;

    this.mouse.x = event.touches ? event.touches[0].clientX : event.clientX;
    this.mouse.y = event.touches ? event.touches[0].clientY : event.clientY;

    if (this.page && this.page.onTouchDown) {
      this.page.onTouchDown(event);
    }

    if (this.canvas && this.canvas.onTouchDown) {
      this.canvas.onTouchDown(this.mouse);
    }
  }

  onTouchMove(event) {
    event.stopPropagation();

    this.mouse.x = event.touches ? event.touches[0].clientX : event.clientX;
    this.mouse.y = event.touches ? event.touches[0].clientY : event.clientY;

    if (this.page && this.page.onTouchMove) {
      this.page.onTouchMove(event);
    }

    if (this.canvas && this.canvas.onTouchMove) {
      this.canvas.onTouchMove(this.mouse);
    }
  }

  onTouchUp(event) {
    event.stopPropagation();

    this.mouse.x = event.changedTouches
      ? event.changedTouches[0].clientX
      : event.clientX;
    this.mouse.y = event.changedTouches
      ? event.changedTouches[0].clientY
      : event.clientY;

    if (this.page && this.page.onTouchUp) {
      this.page.onTouchUp(event);
    }

    if (this.canvas && this.canvas.onTouchUp) {
      this.canvas.onTouchUp(this.mouse);
    }
  }

  onWheel(event) {
    if (this.page && this.page.onWheel) {
      this.page.onWheel(event);
    }

    if (this.canvas && this.canvas.onWheel) {
      this.canvas.onWheel(event);
    }
  }

  onInteract() {
    window.removeEventListener("mousemove", this.onInteract);
    window.removeEventListener("touchstart", this.onInteract);

    this.update();
  }

  addEventListeners() {
    window.addEventListener("mousemove", this.onInteract, { passive: true });
    window.addEventListener("touchstart", this.onInteract, { passive: true });

    window.addEventListener("popstate", this.onPopState, { passive: true });
    window.addEventListener("resize", this.onResize, { passive: true });

    window.addEventListener("mousedown", this.onTouchDown, { passive: true });
    window.addEventListener("mousemove", this.onTouchMove, { passive: true });
    window.addEventListener("mouseup", this.onTouchUp, { passive: true });

    window.addEventListener("touchstart", this.onTouchDown, { passive: true });
    window.addEventListener("touchmove", this.onTouchMove, { passive: true });
    window.addEventListener("touchend", this.onTouchUp, { passive: true });

    window.addEventListener("mousewheel", this.onWheel, { passive: true });
    window.addEventListener("wheel", this.onWheel, { passive: true });

    window.oncontextmenu = this.onContextMenu;
  }

  addLinksEventsListeners() {
    const links = document.querySelectorAll("a");

    each(links, (link) => {
      const isLocal = link.href.indexOf(window.location.origin) > -1;

      if (isLocal) {
        link.onclick = (event) => {
          event.preventDefault();

          this.onChange({
            url: link.href,
          });
        };
      } else if (
        link.href.indexOf("mailto") === -1 &&
        link.href.indexOf("tel") === -1
      ) {
        link.rel = "noopener";
        link.target = "_blank";
      }
    });
  }
}

new App();
