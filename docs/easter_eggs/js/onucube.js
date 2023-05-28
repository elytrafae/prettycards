
var freeBird = document.getElementById("free_bird");
var cube = document.getElementById("cube");

configureStartButton(freeBird, 5, () => {cube.classList.add("cube");});