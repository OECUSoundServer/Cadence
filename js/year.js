(function () {
  var y = new Date().getFullYear();
  var range = y === 2022 ? "2022" : "2022 - " + y;
  var el = document.getElementById("year-range");
  if (el) el.textContent = range;

  var btn = document.getElementById("hamburger");
  var nav = document.getElementById("primary-nav");
  if (btn && nav) {
    btn.addEventListener("click", function () {
      var expanded = this.getAttribute("aria-expanded") === "true";
      this.setAttribute("aria-expanded", String(!expanded));
      document.body.classList.toggle("nav-open");
    });
  }
})();
