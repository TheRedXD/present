class Presentation {
    constructor() {
        this.slides = [];
    }
    loadSlidesFromJSON(json) {
        let slides = JSON.parse(json);
        for (let i = 0; i < slides.length; i++) {
            this.addSlide(new Slide(slides[i]));
        }
    }
    addSlide(slide) {
        this.slides.push(slide);
    }
    getSlide(index) {
        return this.slides[index];
    }
    getSlideCount() {
        return this.slides.length;
    }
    getSlideIndex(slide) {
        return this.slides.indexOf(slide);
    }
    getElement() {
        // create a new div element with class presentation, then add all the html of the slides to it
        let presentation = document.createElement("div");
        presentation.classList.add("presentation");
        for (let i = 0; i < this.getSlideCount(); i++) {
            presentation.innerHTML += this.getSlide(i).getHtml();
        }
        return presentation;
    }
}

// a slide is an html string, which is rendered by the browser
class Slide {
    constructor(html) {
        this.html = html;
    }
    setHtml(html) {
        this.html = html;
    }
    getHtml() {
        return this.html;
    }
}

class SlideRenderer {
    constructor(presentation) {
        this.presentation = presentation;
        this.currentSlideIndex = 0;
        this.previousSlideIndex = 0;
    }
    render() {
        if (this.presentation.getSlideCount() === 0) return null;
        if (document.getElementsByClassName("animation-circle").length > 0) {
            document.getElementsByClassName("animation-circle").forEach((element) => {
                element.remove();
            });
        }
        let slide = this.presentation.getSlide(this.currentSlideIndex);
        let slideElement = document.createElement("div");
        slideElement.innerHTML = slide.getHtml();
        // make a little animation
        slideElement.classList.add("slide");
        if(this.currentSlideIndex === this.previousSlideIndex) return slideElement;
        if(this.currentSlideIndex > this.previousSlideIndex) {
            slideElement.classList.add("slide-in-right");
            // add an extra slide to the left to make the animation look better
            let previousSlide = this.presentation.getSlide(this.previousSlideIndex);
            let previousSlideElement = document.createElement("div");
            previousSlideElement.innerHTML = previousSlide.getHtml();
            previousSlideElement.classList.add("slide");
            previousSlideElement.classList.add("slide-in-right");
            previousSlideElement.style.left = "-100%";
            document.body.appendChild(previousSlideElement);
        } else {
            slideElement.classList.add("slide-in-left");
            // add an extra slide to the right to make the animation look better
            let previousSlide = this.presentation.getSlide(this.previousSlideIndex);
            let previousSlideElement = document.createElement("div");
            previousSlideElement.innerHTML = previousSlide.getHtml();
            previousSlideElement.classList.add("slide");
            previousSlideElement.classList.add("slide-in-left");
            previousSlideElement.style.left = "100%";
            document.body.appendChild(previousSlideElement);
        }
        // create forwards/backwards animation circle
        let circle = document.createElement("div");
        circle.classList.add("animation-circle");
        if(this.currentSlideIndex > this.previousSlideIndex) {
            circle.classList.add("forwards-animation-circle");
            circle.innerHTML = "<i class=\"fa-solid fa-arrow-right\"></i>";
        } else {
            circle.classList.add("backwards-animation-circle");
            circle.innerHTML = "<i class=\"fa-solid fa-arrow-left\"></i>";
        }
        document.body.appendChild(circle);
        return slideElement;
    }
    next() {
        this.previousSlideIndex = this.currentSlideIndex;
        if (this.currentSlideIndex < this.presentation.getSlideCount() - 1) {
            this.currentSlideIndex++;
        }
    }
    previous() {
        this.previousSlideIndex = this.currentSlideIndex;
        if (this.currentSlideIndex > 0) {
            this.currentSlideIndex--;
        }
    }
}

let presentation = new Presentation();

// add slides to the presentation

function getJSONFromURL(url) {
    let request = new XMLHttpRequest();
    request.open("GET", url, false);
    request.send(null);
    return request.responseText;
}

// presentation.loadSlidesFromJSON(getJSONFromURL("/slides.json"));

let slide_renderer = new SlideRenderer(presentation);

// detect up/down or left/right arrow keys to navigate the presentation
document.addEventListener("keydown", (event) => {
    if (event.key === "ArrowDown" || event.key === "ArrowLeft") {
        slide_renderer.previous();
        document.body.innerHTML = "";
        document.body.appendChild(slide_renderer.render());
    } else if (event.key === "ArrowUp" || event.key === "ArrowRight") {
        slide_renderer.next();
        document.body.innerHTML = "";
        document.body.appendChild(slide_renderer.render());
    }
});

// any selection or dragging of images shall be ignored, links should be allowed though
document.addEventListener("mousedown", (event) => {
    if (event.target.tagName !== "IMG" && event.target.tagName !== "A") {
        event.preventDefault();
    }
});

// if fullscreen, disable mouse cursor, otherwise, have it enabled
document.addEventListener("keydown", (event) => {
    if (event.key === "f") {
        if (document.fullscreenElement) {
            document.exitFullscreen();
            document.body.style.cursor = "default";
        } else {
            document.body.requestFullscreen();
            document.body.style.cursor = "none";
        }
    }
});

// get the slides from the textarea
const slides = document.getElementById("slides").value;
presentation.loadSlidesFromJSON(slides);
// render the presentation
document.body.appendChild(slide_renderer.render());