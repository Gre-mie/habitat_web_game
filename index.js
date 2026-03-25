
// get habitat variables
let fullurl = window.location.href
let params = new URLSearchParams(new URL(fullurl).search)
let habitat = Object.fromEntries(params)

// window elements
let boardEl = document.getElementById("board")
let infoEl = document.getElementById("basic-info")
let frameEl = document.getElementById("frames")


// initial game setup
// INFO: this function should only be called once
function setup() {
  // set title and colours
  let title = document.getElementById("habitat-title")
  let className = `${habitat.name.toLowerCase()}`
  title.classList.add(className)
  title.children[0].innerText = habitat.name
  document.getElementById("hr").classList.add(className)

  updateBasicInfoFields() 



}
setup()

// update fields to display game state
function updateBasicInfoFields() {
  let boardData = board.dataset

  // INFO: update frame info
  frameEl.children[0].innerText = boardData.frames

  // INFO: update basic informatnion
  // basic info population - bip
  let bip = document.getElementById("basic-info-population").children
  let bipChildren = bip[0].children[0]
  bipChildren.innerText = boardData.children
  let bipAdults = bip[1].children[0]
  bipAdults.innerText = boardData.adults
  let bipOld = bip[2].children[0]
  bipOld.innerText = boardData.old

  // basic info resources - bir
  let bir = document.getElementById("basic-info-resources").children
  let birFood = bir[0].children[0]
  birFood.innerText = boardData.food
  let birWood = bir[1].children[0]
  birWood.innerText = boardData.wood
  let birStone = bir[2].children[0]
  birStone.innerText = boardData.stone

}

//
// INFO: this function should be called when the done button is pressed
function updateWhenDone() {}

//
// INFO: this function should be called when the done button is pressed
function displayWhenDone() {}


// TEST:

