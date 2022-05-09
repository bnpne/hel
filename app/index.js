import Home from "pages/Home";

class App {
  constructor() {
    this.url = window.location.pathname;

    // CREATE PRELOADER
    this.createPreloader();
    // CREATE NAV
    // CREATE PAGES
    this.createPages();
  }

  createPages() {
    // CREATE PAGES BASED OFF ROUTE
    this.pages = { "/": new Home() };
    // SET CURRENT PAGE
    this.page = this.pages[this.url];

    this.page.create();
  }
}

new App();
