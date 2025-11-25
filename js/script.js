// index Js
function toggleDropdown() {
  const dropdownMenu = document.getElementById("dropdownMenu");
  if (dropdownMenu.style.display === "block") {
    dropdownMenu.style.display = "none";
  } else {
    dropdownMenu.style.display = "block";
  }
}
function logout() {
  sessionStorage.removeItem("userEmail");
  sessionStorage.removeItem("userProfilePic");
  window.location.href = "index.html";
}
window.onload = function () {
  let userEmail = sessionStorage.getItem("userEmail");
  let userProfilePic = sessionStorage.getItem("userProfilePic");
  if (userEmail) {
    document.getElementById("loginButton").style.display = "none";
    document.getElementById("userSection").style.display = "flex";
    document.getElementById("userEmail").textContent = userEmail;
    let namePart = userEmail.split("@")[0].replace(/[0-9]/g, "");
    let finalName = namePart.charAt(0).toUpperCase() + namePart.slice(1);
    document.getElementById("userName").textContent = finalName;
    if (userProfilePic) {
      document.getElementById("profileImage").src = userProfilePic;
    }
  } else {
    document.getElementById("loginButton").style.display = "inline-block";
    document.getElementById("userSection").style.display = "none";
  }
};
function triggerFileInput() {
  document.getElementById("imageUpload").click();
}
function previewImage(event) {
  const file = event.target.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = function (e) {
      const imageUrl = e.target.result;
      document.getElementById("profileImage").src = imageUrl;
      sessionStorage.setItem("userProfilePic", imageUrl);
    };
    reader.readAsDataURL(file);
  }
}
const images = document.querySelectorAll(".image-flip img");
let current = 0;
function flipImages() {
  images.forEach((img) => img.classList.remove("active"));
  images[current].classList.add("active");
  current = (current + 1) % images.length;
}
setInterval(flipImages, 1000);
flipImages();
const slider = document.querySelector(".slider");
const slides = Array.from(document.querySelectorAll(".slide"));
const slideCount = slides.length;
const slideWidthPercent = 20;
slides.forEach((slide) => {
  const clone = slide.cloneNode(true);
  slider.appendChild(clone);
});
let index = 0;
function moveSlide() {
  index++;
  slider.style.transition = "transform 0.5s linear";
  slider.style.transform = `translateX(-${index * slideWidthPercent}%)`;
  if (index >= slideCount) {
    setTimeout(() => {
      slider.style.transition = "none";
      slider.style.transform = `translateX(0)`;
      index = 0;
    }, 500);
  }
}
const dotsContainer = document.querySelector(".slider-dots");
const dotCount = slideCount;
const dots = [];
for (let i = 0; i < dotCount; i++) {
  const dot = document.createElement("span");
  if (i === 0) dot.classList.add("active");
  dot.addEventListener("click", () => {
    index = i;
    updateSlider();
    resetInterval();
  });
  dotsContainer.appendChild(dot);
  dots.push(dot);
}
function updateSlider() {
  slider.style.transition = "transform 0.5s linear";
  slider.style.transform = `translateX(-${index * slideWidthPercent}%)`;
  dots.forEach((d) => d.classList.remove("active"));
  dots[index % dotCount].classList.add("active");
}
function moveSlide() {
  index++;
  updateSlider();
  if (index >= slideCount) {
    setTimeout(() => {
      slider.style.transition = "none";
      slider.style.transform = `translateX(0)`;
      index = 0;
      updateSlider();
    }, 500);
  }
}
let interval = setInterval(moveSlide, 3000);
document.querySelector(".slider-btn.left").addEventListener("click", () => {
  index--;
  if (index < 0) {
    slider.style.transition = "none";
    slider.style.transform = `translateX(-${slideCount * slideWidthPercent}%)`;
    index = slideCount - 1;
    setTimeout(() => {
      slider.style.transition = "transform 0.5s linear";
      moveSlide();
    }, 10);
  } else {
    slider.style.transition = "transform 0.5s linear";
    slider.style.transform = `translateX(-${index * slideWidthPercent}%)`;
  }
  resetInterval();
});
document.querySelector(".slider-btn.right").addEventListener("click", () => {
  moveSlide();
  resetInterval();
});
function resetInterval() {
  clearInterval(interval);
  interval = setInterval(moveSlide, 3000);
}
