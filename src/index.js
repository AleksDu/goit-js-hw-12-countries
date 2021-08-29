import { getPictures } from "./js/apiService.js";
import cardTmp from "./partials/cardTmp.hbs";
import * as basicLightbox from "basiclightbox";

const options = {
  root: null,
  rootMargin: "0px",
  threshold: 0.5,
};


const refs = {
  form: document.querySelector("#search-form"),
  gallery: document.querySelector(".gallery"),
  loadMore: document.querySelector("#load-more"),
};

const status = { page: 1, value: "" };
refs.loadMore.style.visibility = "hidden";

refs.form.addEventListener("submit", onSearch);
refs.loadMore.addEventListener("click", onLoadMore);

async function onSearch(e) {
  e.preventDefault();
  getPictures.query = e.currentTarget.elements.query.value
  if (getPictures.query = '') {
    'write anything'
  }  refs.loadMore.style.visibility = "hidden";
  if (!e.currentTarget.elements.query.value.trim()) {
    return;
  }
  try {
    status.value = e.currentTarget.elements.query.value;
    const pictures = await getPictures(status.value, status.page);
    refs.gallery.innerHTML = cardTmp(pictures);
    if (pictures.length > 11) {
      refs.loadMore.style.visibility = "visible";
    }
    if (!pictures.length) {
      console.log("Nothing find");

    }
  } catch (error) {
    console.log(error.message);
  }
}


async function onLoadMore() {
  status.page += 1;
  const pictures = await getPictures(status.value, status.page);
  refs.gallery.insertAdjacentHTML("beforeend", cardTmp(pictures));
  if (status.page === 2) {
    const observer = new IntersectionObserver(onLoadMore, options);
    observer.observe(refs.loadMore);
  }
  
}


refs.gallery.addEventListener("click", onOpenGallery);

function onOpenGallery(e) {
  if (e.target.nodeName !== "IMG") {
    return;
  }

  basicLightbox
    .create(
      `
    <img src="${e.target.dataset.source}" width="800" height="600">
`
    )
    .show();
}