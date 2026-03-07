const slider = document.querySelector('[data-slider]');
const sliderTrack = document.querySelector('[data-slider-track]');
const slides = Array.from(document.querySelectorAll('.hero-slide'));
const dots = Array.from(document.querySelectorAll('.hero-slider-dot'));

if (slider && sliderTrack && slides.length > 0) {
  let currentIndex = 0;

  const renderSlide = (index) => {
    currentIndex = index;
    sliderTrack.style.transform = `translateX(-${index * 100}%)`;

    slides.forEach((slide, slideIndex) => {
      slide.classList.toggle('is-active', slideIndex === index);
    });

    dots.forEach((dot, dotIndex) => {
      dot.classList.toggle('is-active', dotIndex === index);
    });
  };

  const moveToNext = () => {
    const nextIndex = (currentIndex + 1) % slides.length;
    renderSlide(nextIndex);
  };

  dots.forEach((dot, index) => {
    dot.addEventListener('click', () => {
      renderSlide(index);
    });
  });

  renderSlide(0);
  window.setInterval(moveToNext, 5000);
}
