//hero section
let slideIndex = 0;

const slide = document.querySelectorAll('.slider > div');
const dot = document.querySelectorAll('.dot');

function showslide(index){
    slideIndex = index;
    const offset = -100.15 * slideIndex;
    document.getElementById('slider').style.transform = `translatex(${offset}%)`;
    updatesdots();
}

function nextSlide(){
    slideIndex = (slideIndex + 1) % slide.length;
    showslide(slideIndex);
}

function prevSlide(){
    slideIndex = (slideIndex - 1 + slide.length) % slide.length;
    showslide(slideIndex);
}

function currentslide(index){
    showslide(index-1);
}

function updatesdots(){
    dot.forEach((dot,index) => {
        dot.classList.toggle('active',index == slideIndex);
    });
}

showslide(0);

setInterval(() => {
    nextSlide();
},10000);



//showside bar
function showsidebar() {
    const Sidebar = document.getElementById("sidebar");
    Sidebar.style.display = 'flex';
}
function hidesidebar() {
    const Sidebar = document.getElementById("sidebar");
    Sidebar.style.display = 'none';   
}




