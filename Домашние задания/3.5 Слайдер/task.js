const slides = Array.from(document.querySelectorAll(".slider__item"));
const prevBtn = document.querySelector(".slider__arrow_prev");
const nextBtn = document.querySelector(".slider__arrow_next");
const dots = Array.from(document.querySelectorAll(".slider__dot"));

let current = slides.findIndex((s) => s.classList.contains("slider__item_active"));
if (current < 0) current = 0;

function setActiveSlide(index) {
  slides.forEach((slide, i) => {
    slide.classList.toggle("slider__item_active", i === index);
  });
  dots.forEach((dot, i) => {
    dot.classList.toggle("slider__dot_active", i === index);
  });
}

function goPrev() {
  current = current === 0 ? slides.length - 1 : current - 1;
  setActiveSlide(current);
}

function goNext() {
  current = current === slides.length - 1 ? 0 : current + 1;
  setActiveSlide(current);
}

function registerArrowHandlers() {
  prevBtn.addEventListener("click", goPrev);
  nextBtn.addEventListener("click", goNext);
}

function registerDotHandlers() {
  dots.forEach((dot, i) => {
    dot.addEventListener("click", () => {
      current = i;
      setActiveSlide(current);
    });
  });
}

registerArrowHandlers();
registerDotHandlers();
setActiveSlide(current);
