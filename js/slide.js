import element from 'ol-ext/util/element'

const slide = document.getElementById('slide');

/** Show a record fullscreen 
*/
function showSlide(rec) {
  slide.innerHTML = '';
  element.create('IMG', {
    src: rec.thumb.replace(/thumbnail$/, "highres"),
    parent: slide
  });
  element.create('P', {
    html: rec.title+"<br/>"+rec.desc+"<br/>"+rec.type,
    parent: slide
  });
  slide.style.display = 'block';
  setTimeout (function() { slide.className = "visible"; }, 100);
}

/** Hide fullscreen slide on click
*/
slide.addEventListener('click', (e) => {
  slide.className = '';
  setTimeout (function() { slide.style.display = 'none'; }, 500);
});

export default showSlide
