import data from "/data.js";

const catsData = data.map((cat) => {
  return { ...cat, id: cat.image };
});

const emotionRadios = document.getElementById("emotion-radios");
const getImageBtn = document.getElementById("get-image-btn");
const gifsOnlyOption = document.getElementById("gifs-only-option");
const memeModalInner = document.getElementById("meme-modal-inner");
const modalThumbnails = document.querySelector("#thumbnails");
const memeModal = document.getElementById("meme-modal");
const memeModalCloseBtn = document.getElementById("meme-modal-close-btn");

emotionRadios.addEventListener("change", highlightCheckedOption);

memeModalCloseBtn.addEventListener("click", closeModal);

getImageBtn.addEventListener("click", renderCats);

document.addEventListener("click", (e) => {
  if (e.target.id || e.target.id === "get-image-btn") return;
  closeModal();
});

function highlightCheckedOption(e) {
  const radios = document.getElementsByClassName("radio");
  for (let radio of radios) {
    radio.classList.remove("highlight");
  }
  document.getElementById(e.target.id).parentElement.classList.add("highlight");
}

function closeModal() {
  memeModal.style.display = "none";
}

function renderCats() {
  const index = getRandomCatIndex();
  const catsArray = getMatchingCatsArray();
  const mainCat = catsArray[index];
  const secondaryCats = catsArray.filter((cat) => cat.image !== mainCat.image);

  if (!mainCat || !secondaryCats) return;

  renderNewCats(mainCat, secondaryCats, catsArray);
  catsOnclick(catsArray);
}

function catsOnclick(catsArray) {
  catsArray.forEach((cat) => {
    const catEl = document.getElementById(cat.id);
    const newMainCat = catsArray.filter((item) => item.image === cat.id)[0];
    const newSecondaryCats = catsArray.filter((item) => item.image !== cat.id);

    const catsOnclick = () => {
      renderNewCats(newMainCat, newSecondaryCats, catsArray);
      catEl.removeEventListener("click", catsOnclick);
    };
    catEl.addEventListener("click", catsOnclick);
  });
}

function renderNewCats(main, secondary, catsArray) {
  if (!main || !secondary) return;

  memeModalInner.innerHTML = `
              <img 
              id=${main.image}
              class="cat-img" 
              src="images/${main.image}"
              alt="${main.alt}"
              >
              `;

  modalThumbnails.innerHTML = secondary
    .map((cat) => {
      return `
                  <img 
                  id=${cat.image}
                  class="cat-img" 
                  src="images/${cat.image}"
                  alt="${cat.alt}"
                  >
                  `;
    })
    .join("");
  memeModal.style.display = "flex";
  catsOnclick(catsArray);
}

function getRandomCatIndex() {
  const catsArray = getMatchingCatsArray();
  if (!catsArray || !catsArray.length) return;
  if (catsArray.length === 1) {
    return 0;
  } else {
    return Math.floor(Math.random() * catsArray.length);
  }
}

function getMatchingCatsArray() {
  if (document.querySelector('input[type="radio"]:checked')) {
    const selectedEmotion = document.querySelector(
      'input[type="radio"]:checked'
    ).value;
    const isGif = gifsOnlyOption.checked;

    const matchingCatsArray = catsData.filter(function (cat) {
      if (isGif) {
        return cat.emotionTags.includes(selectedEmotion) && cat.isGif;
      } else {
        return cat.emotionTags.includes(selectedEmotion);
      }
    });
    return matchingCatsArray;
  }
}

function getEmotionsArray(cats) {
  const emotionsArray = [];
  for (let cat of cats) {
    for (let emotion of cat.emotionTags) {
      if (!emotionsArray.includes(emotion)) {
        emotionsArray.push(emotion);
      }
    }
  }
  return emotionsArray;
}

function renderEmotionsRadios(cats) {
  let radioItems = ``;
  const emotions = getEmotionsArray(cats);
  for (let emotion of emotions) {
    radioItems += `
        <div class="radio">
            <label for="${emotion}">${emotion}</label>
            <input
            type="radio"
            id="${emotion}"
            value="${emotion}"
            name="emotions"
            >
        </div>`;
  }
  emotionRadios.innerHTML = radioItems;
}

renderEmotionsRadios(catsData);
