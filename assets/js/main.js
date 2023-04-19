import { Masonry } from "./masonry.js";



(async function () {
    const data = await fetchData('./fonts.json');
    for(const font of data) {
        await createPreviewItem(font.image, font.name, font.link);
    }
    // masonry
    const parent = document.querySelector('#preview-list');
    const items = document.querySelectorAll('.preview-list__item');
    // let resizeTimeout;
    const masonry = new Masonry(parent, items);
    await masonry.init();
    document.querySelector('#preloader').classList.add('ready');

    // setTimeout(async () => {
    //     await createPreviewItem(data[0].image, data[0].name, data[0].link);
    // }, 5000);

    // await setMasonryHeight(parent, items);
    // window.onresize = function () {
    //     clearTimeout(resizeTimeout);
    //     resizeTimeout = setTimeout(function () {
    //         setMasonryHeight(parent, items);
    //     }, 100);
    // };
})();


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
    return new Promise((resolve, reject) =>  {
        const item = document.createElement('a');
        item.href = link;
        item.className = 'preview-list__item';
        item.target = '_blank';
        item.rel = "noopener";
        let imageElm = new Image(900);
        // imageElm.setAttribute('data-src', image);
        imageElm.src = image;
        // imageElm.loading = 'lazy';
        item.appendChild(imageElm);
        item.insertAdjacentHTML(
            'beforeend',
            `<h2 class="visually-hidden">${name}</h2>`
        );
        const observer = new IntersectionObserver((entries, observer) =>  {
            for(const entry of entries) {
                if (entry.isIntersecting) {
                    let image = entry.target;
                    // image.classList.add('animate-in');
                    // image.src = image.dataset.src;
                    observer.unobserve(image);
                }
            }
        })
        observer.observe(imageElm);
        // document.querySelector('#preview-list').appendChild(item);

        imageElm.onload = () => {
            document.querySelector('#preview-list').appendChild(item);
            resolve();
        }
    })
}


(function () {
    const lenis = new Lenis()
    function raf(time) {
        lenis.raf(time)
        requestAnimationFrame(raf)
    }
    requestAnimationFrame(raf)
})();