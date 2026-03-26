
// get habitat variables
let fullurl = window.location.href
let params = new URLSearchParams(new URL(fullurl).search)
let habitat = Object.fromEntries(params)

// window elements
let boardEl = document.getElementById("board")
let logEl = document.getElementById("log")
let workerEl = document.getElementById("var-workers")
let workerDisplayEl = document.getElementById("worker-visual-display")

// other game variables
let maxPopulation = 50
let maxFrames = 25
let workerDisplay = []

// initial game setup
// INFO: this function should only be called once
function setup() {
  // set title and colours
  let title = document.getElementById("habitat-title")
  let className = `${habitat.name.toLowerCase()}`
  title.classList.add(className)
  title.children[0].innerText = habitat.name
  document.getElementById("hr").classList.add(className)
  document.getElementById("evaluate-year").classList.add(className)

  // set visual display elements to reflect starting state of the game
  updateBasicInfoFields()
  updateLogFields()

  // fill worker string with visual display of max posible workers
  for (let i = 0; i < maxPopulation; i++) {
    workerDisplay.push("𖨆")
  }
  
  // calculate and display starting workers
  workerEl.dataset.workers = calclulateWorkers()
  updateWorkerDisplays(workerEl.dataset.workers)

  


}
setup()


// updates all elements with className to display data
function updateFieldsByClass(className, data) {
  let fields = document.getElementsByClassName(className)
  for (let i = 0; i < fields.length; i++) {
    fields[i].innerText = data
  }
}

// update fields to display game state from board element
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

// update fields to display game state from logs element
function updateLogFields() {
  let log = logEl.dataset
  updateFieldsByClass("log-food", log.food)
  updateFieldsByClass("log-gather-meat", log.meat)
  updateFieldsByClass("log-gather-forage", log.forage)
  updateFieldsByClass("log-wood", log.wood)
  updateFieldsByClass("log-stone", log.stone)

  updateFieldsByClass("log-sick", log.sick)
  updateFieldsByClass("log-born", log.born)
  updateFieldsByClass("log-grew", log.grew)
  updateFieldsByClass("log-deaths", log.deaths)
  updateFieldsByClass("log-sickness", log.sickness)
  updateFieldsByClass("log-oldage", log.oldage)
}

// calculates number of workers
function calclulateWorkers() {
  let data = boardEl.dataset
  let workers = parseInt(data.adults)
  let notWorkers = parseInt(data.children) + parseInt(data.old)
  let sick = parseInt(logEl.dataset.sick)

  if (sick > notWorkers) {
    workers -= sick
  }
  if (workers < 0) {workers = 0}
  return workers
}

// updates worker display elements
function updateWorkerDisplays(workers) {
  workerEl.innerText = workers
  workerDisplayEl.textContent = workerDisplay.slice(0, workers).join("")
}


// this function will be called by the "continue" button
function evaluateYear() {
  console.log("evaluating Year...") // TEST:


// do these last
// TODO: CHECK FOR WIN CONDITION 
// population >= maxPopulation || frames >= maxFrames (years)

// TODO: CHECK FOR LOOSE CONDITION
// population <= 0

}


// TEST:

