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

let audioContext;
let musicTimer;
let musicPlaying=false;
let noteIndex=0;
const melody=[261.63,329.63,392,493.88,440,329.63,349.23,293.66,261.63,392,329.63,293.66];

function playNote(frequency){
  if(!audioContext)return;
  const now=audioContext.currentTime;
  const oscillator=audioContext.createOscillator();
  const gain=audioContext.createGain();
  oscillator.type='triangle';
  oscillator.frequency.setValueAtTime(frequency,now);
  gain.gain.setValueAtTime(.0001,now);
  gain.gain.exponentialRampToValueAtTime(.055,now+.08);
  gain.gain.exponentialRampToValueAtTime(.0001,now+1.35);
  oscillator.connect(gain).connect(audioContext.destination);
  oscillator.start(now);
  oscillator.stop(now+1.4);
}

function musicStep(){
  if(!musicPlaying)return;
  playNote(melody[noteIndex%melody.length]);
  if(noteIndex%3===0)playNote(melody[(noteIndex+4)%melody.length]/2);
  noteIndex++;
  musicTimer=setTimeout(musicStep,720);
}

function startMusic(){
  if(!audioContext)audioContext=new (window.AudioContext||window.webkitAudioContext)();
  audioContext.resume();
  if(musicPlaying)return;
  musicPlaying=true;
  musicStep();
  const button=document.querySelector('#musicToggle');
  button.textContent='⏸ Pausar música';
  button.setAttribute('aria-pressed','true');
}

function pauseMusic(){
  musicPlaying=false;
  clearTimeout(musicTimer);
  const button=document.querySelector('#musicToggle');
  button.textContent='▶ Reproducir música';
  button.setAttribute('aria-pressed','false');
}

document.querySelector('#openGift').addEventListener('click',startMusic);
document.querySelector('#musicToggle').addEventListener('click',()=>musicPlaying?pauseMusic():startMusic());
