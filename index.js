
// get habitat variables
let fullurl = window.location.href
let params = new URLSearchParams(new URL(fullurl).search)
let habitat = Object.fromEntries(params)

// window elements
let boardEl = document.getElementById("board")
let logEl = document.getElementById("log")


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
  updateLogFields() 

  


}
setup()

function updateFieldsByClass(className, data) {
  let fields = document.getElementsByClassName(className)
  for (let i = 0; i < fields.length; i++) {
    fields[i].innerText = data
  }
}

// update fields to display game state
function updateBasicInfoFields() {
  let boardData = boardEl.dataset
  updateFieldsByClass("info-frames", boardData.frames)
  updateFieldsByClass("info-children", boardData.children)
  updateFieldsByClass("info-adults", boardData.adults)
  updateFieldsByClass("info-old", boardData.old)
  updateFieldsByClass("info-food", boardData.food)
  updateFieldsByClass("info-wood", boardData.wood)
  updateFieldsByClass("info-stone", boardData.stone)
}

function updateLogFields() {
  let log = logEl.dataset
  updateFieldsByClass("log-food", log.food)
  updateFieldsByClass("log-gather-meat", log.meat)
  updateFieldsByClass("log-gather-forage", log.forage)
  updateFieldsByClass("log-wood", log.wood)
  updateFieldsByClass("log-stone", log.stone)

  updateFieldsByClass("log-sic:whenk", log.sick)
  updateFieldsByClass("log-born", log.born)
  updateFieldsByClass("log-grew", log.grew)
  updateFieldsByClass("log-deaths", log.deaths)
  updateFieldsByClass("log-sickness", log.sickness)
  updateFieldsByClass("log-oldage", log.oldage)
}

//
// INFO: this function should be called when the done button is pressed
function updateWhenDone() {}

//
// INFO: this function should be called when the done button is pressed
function displayWhenDone() {}


// TEST:

