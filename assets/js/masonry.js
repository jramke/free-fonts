export class Masonry {

    constructor(parent, childs) {
        this.parent = parent;
        this.childs = childs || parent.children;
    }

    async init() {
        await this.setMasonryHeight(this.parent, this.childs);
        const observer = this.mutationObserver();
    }

    handlers() {
        let resizeTimeout;
        window.onresize = function () {
            clearTimeout(resizeTimeout);
            resizeTimeout = setTimeout(function () {
                this.setMasonryHeight(this.parent, this.childs);
            }, 100);
        };
    }

    mutationObserver() {
        const observer = new MutationObserver(async (mutationList) => {
            for (const mutation of mutationList) {
                if (mutation.type === "childList") {
                    console.log('set masonry height because of mutation');
                    await this.setMasonryHeight(this.parent, this.parent.children);
                    console.log(mutation);
                }
            }
        });
        observer.observe(this.parent, { attributes: true, childList: true, subtree: true });
        return observer;
    }

    setMasonryHeight(parent, childs) {
        return new Promise ((resolve, reject) => {
            parent.classList.add('masonry-calculating');
            let realMansoryHeight = 0;
            let parentRect = parent.getBoundingClientRect();
            for (let index = 0; index < childs.length; index++) {
                const rect = childs[index].getBoundingClientRect();
                console.log(rect, childs[index]);
                let overlap = (
                    parentRect.right <= rect.left ||
                    parentRect.left >= rect.right || 
                    parentRect.bottom <= rect.top || 
                    parentRect.top >= rect.bottom
                )
                // add height to parent for each item
                if (overlap) {
                    const masonryHeight = getComputedStyle(parent).getPropertyValue('--masonry-height').slice(0, -2);
                    parent.style.setProperty('--masonry-height', parseInt(masonryHeight) + Math.round(rect.height) + 'px');
                    console.log(parseInt(masonryHeight) + Math.round(rect.height) + 'px');
                }
                // get the offset height of the lowest item and update masonry parent height
                let newMansoryHeight = childs[index].offsetTop + childs[index].offsetHeight + 2; // dont know why 2 is needed, maybe the top and bottom border of parent?
                if (newMansoryHeight > realMansoryHeight) {
                    realMansoryHeight = newMansoryHeight;
                }
            }
            parent.style.setProperty('--masonry-height', realMansoryHeight + 'px');
            parent.classList.remove('masonry-calculating');
            resolve(true);
        })
    }
}