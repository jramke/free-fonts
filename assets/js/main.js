import Masonry from "./masonry.js";
import MouseFollower from "./mouseFollower.js";


(function () {

    MouseFollower.registerGSAP(gsap);
    const cursor = new MouseFollower({
        skewing: 1,
    });

})();


(async function () {
    const data = await fetchData('./fonts.json');
    for(const font of data) {
        createPreviewItem(font.image, font.name, font.link);
    }
    // masonry
    const parent = document.querySelector('#preview-list');
    const items = document.querySelectorAll('.preview-list__item');
    const masonry = new Masonry(parent, items);
    await masonry.init();
    document.querySelector('#preloader').classList.add('ready');

    async function fetchData(url) {
        try {
            const response = await fetch(url);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();
            return data;
        } catch (error) {
            console.error(error);
        }
    }
    
    function createPreviewItem(image, name, link) {
        const item = document.createElement('a');
        item.href = link;
        item.className = 'preview-list__item';
        item.target = '_blank';
        item.rel = "noopener noreferrer";
        // item.setAttribute('data-cursor', '-inverse');
        item.setAttribute('data-cursor-text', name);
        // item.setAttribute('data-cursor-img', image);
        let imageElm = new Image(900);
        imageElm.src = image;
        item.appendChild(imageElm);
        item.insertAdjacentHTML(
            'beforeend',
            `<h2 class="visually-hidden">${name}</h2>`
        );
    
        imageElm.onload = () => {
            document.querySelector('#preview-list').appendChild(item);
            // resolve();
        }
    }

})();





(function () {
    const lenis = new Lenis()
    function raf(time) {
        lenis.raf(time)
        requestAnimationFrame(raf)
    }
    requestAnimationFrame(raf)
})();