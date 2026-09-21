const slides=[...document.querySelectorAll('.carousel-slide')];
const dotsBox=document.querySelector('.carousel-dots');
let currentSlide=0;
let touchStart=0;

slides.forEach((_,i)=>{
  const dot=document.createElement('button');
  dot.className='carousel-dot'+(i===0?' active':'');
  dot.type='button';
  dot.setAttribute('aria-label','Mostrar foto '+(i+1));
  dot.addEventListener('click',()=>showSlide(i));
  dotsBox.appendChild(dot);
});

function showSlide(i){
  currentSlide=(i+slides.length)%slides.length;
  slides.forEach((slide,n)=>slide.classList.toggle('active',n===currentSlide));
  [...dotsBox.children].forEach((dot,n)=>dot.classList.toggle('active',n===currentSlide));
}

document.querySelector('.carousel-button.prev').addEventListener('click',()=>showSlide(currentSlide-1));
document.querySelector('.carousel-button.next').addEventListener('click',()=>showSlide(currentSlide+1));
const track=document.querySelector('.carousel-track');
track.addEventListener('touchstart',e=>touchStart=e.changedTouches[0].clientX,{passive:true});
track.addEventListener('touchend',e=>{
  const distance=e.changedTouches[0].clientX-touchStart;
  if(Math.abs(distance)>45)showSlide(currentSlide+(distance<0?1:-1));
},{passive:true});
