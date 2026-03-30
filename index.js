
// get habitat variables
let fullurl = window.location.href
let params = new URLSearchParams(new URL(fullurl).search)
let habitat = Object.fromEntries(params)

// window elements
let boardEl = document.getElementById("board")
let logEl = document.getElementById("log")
let workerEl = document.getElementById("info-workers")
let workerDisplayEl = document.getElementById("worker-visual-display")
let buildEl = document.getElementById("info-build")

// element data
let boardData = boardEl.dataset
let logData = logEl.dataset
let workerData = workerEl.dataset
let buildData = buildEl.dataset

// other game variables
let maxPopulation = 50
let maxFrames = 25
let workerDisplay = []


// TEST: vvv
boardData.wood = 60
boardData.stone = 120
// TEST: ^^^



// initial game setup
// INFO: this function should only be called once
function setup() {
  // set title and colours
  let title = document.getElementById("habitat-title")
  let className = `${habitat.name.toLowerCase()}`
  title.classList.add(className)
  title.children[0].innerText = habitat.name
  document.getElementById("bookmark-log").classList.add(className)
  document.getElementById("evaluate-year").classList.add(className)

  // colour buttons
  let buttons = document.getElementsByClassName("inc-dec")
  for (let i = 0; i < buttons.length; i++) {
    buttons[i].classList.add(className)
  }

  // fill worker string with visual display of max posible workers
  for (let i = 0; i < maxPopulation; i++) {
    workerDisplay.push("𖨆")
  }

  // display building cost
  document.getElementById("cost-shackwood").textContent = buildData.shackwood
  document.getElementById("cost-housestone").textContent = buildData.housestone
  document.getElementById("cost-manorwood").textContent = buildData.manorwood
  document.getElementById("cost-manorstone").textContent = buildData.manorstone
  document.getElementById("cost-shackbuilder").textContent = buildData.shackbuilder
  document.getElementById("cost-housebuilder").textContent = buildData.housebuilder
  document.getElementById("cost-manorbuilder").textContent = buildData.manorbuilder
  updateFieldsByClass("available-wood", parseInt(boardData.wood) - parseInt(buildData.woodspent))
  updateFieldsByClass("available-stone", parseInt(boardData.stone) - parseInt(buildData.stonespent))

  // calculate and display workers
  workerData.workers = calclulateWorkers()
  updateWorkerDisplays(workerData.workers)


  
  // display info and logs
  updateBasicInfoFields()
  updateLogFields()

}
setup()



// runs calculations and updates fields across all fields
function update() {
  boardData.frames++

  // calculate and display workers
  workerData.workers = calclulateWorkers()
  updateWorkerDisplays(workerData.workers)


  // add buildings built
  // add to shelter
  let shackBuilt = parseInt(buildData.shack)*parseInt(buildData.shackshelter)
  let houseBuilt = parseInt(buildData.house)*parseInt(buildData.houseshelter)
  let manorBuilt = parseInt(buildData.manor)*parseInt(buildData.manorshelter)
  let shelterGained = shackBuilt + houseBuilt + manorBuilt
  boardData.shelter = parseInt(boardData.shelter) + shelterGained
  logData.shelter = shelterGained

  // remove resources
  boardData.wood = parseInt(boardData.wood) - parseInt(buildData.woodspent)
  boardData.stone = parseInt(boardData.stone) - parseInt(buildData.stonespent)





  updateLogFields()
  
  // reset build vars
  buildData.builders = 0
  buildData.shack = 0
  buildData.house = 0
  buildData.manor = 0
  buildData.woodspent = 0
  buildData.stonespent = 0
  

  


  // TODO: ADD UPDATE INFO




}

function incBuilding(building) {
    let wood = parseInt(boardData.wood)
    let stone = parseInt(boardData.stone)
    let workers = parseInt(workerData.workers)
    let woodSpent = parseInt(buildData.woodspent)
    let stoneSpent = parseInt(buildData.stonespent)

  switch (building) {
    case "shack":

      let shackWoodCost = parseInt(buildData.shackwood)
      let shackBuilder = parseInt(buildData.shackbuilder)

      // check avaiable resources
     if ((woodSpent+shackWoodCost) > wood) {break;}
     if (shackBuilder > workers) {break;}

      // inc building
      buildData.shack = parseInt(buildData.shack) + 1

      // dec resources
      buildData.woodspent = parseInt(buildData.woodspent) + shackWoodCost

      // dec workers
      workerData.workers = parseInt(workerData.workers) - shackBuilder
      buildData.builders = parseInt(buildData.builders) + shackBuilder

      // update fields
      updateFieldsByClass("build-shack", buildData.shack)
      break

    case "house":
      let houseStoneCost = parseInt(buildData.housestone)
      let houseBuilder = parseInt(buildData.housebuilder)

      // check wood and workers
      if ((stoneSpent+houseStoneCost) > stone) {break;}
      if (houseBuilder > workers) {break;}
      
      // inc buildings 
      buildData.house = parseInt(buildData.house) + 1
      
      // dec resources
      buildData.stonespent = parseInt(buildData.stonespent) + houseStoneCost

      // dec workers 
      workerData.workers = parseInt(workerData.workers) - houseBuilder
      buildData.builders = parseInt(buildData.builders) + houseBuilder

      // update fields
      updateFieldsByClass("build-house", buildData.house)
      break

    case "manor":
      let manorWoodCost = parseInt(buildData.manorwood)
      let manorStoneCost = parseInt(buildData.manorstone)
      let manorBuilder = parseInt(buildData.manorbuilder)

      // check wood and workers
      if ((woodSpent+manorWoodCost) > wood) {break;}
      if ((stoneSpent+manorStoneCost) > stone) {break;}
      if (manorBuilder > workers) {break;} 

      // inc buildings 
      buildData.manor = parseInt(buildData.manor) + 1
      
      // dec resources - update things
      buildData.woodspent = parseInt(buildData.woodspent) + manorWoodCost
      buildData.stonespent = parseInt(buildData.stonespent) + manorStoneCost

      // dec workers
      workerData.workers = parseInt(workerData.workers) - manorBuilder
      buildData.builders = parseInt(buildData.builders) + manorBuilder

      // update fields
      updateFieldsByClass("build-manor", buildData.manor)
      break
  }
  // update display
  updateWorkerDisplays(workerData.workers)
  updateFieldsByClass("info-builders", buildData.builders)
  updateFieldsByClass("available-wood", parseInt(boardData.wood) - parseInt(buildData.woodspent))
  updateFieldsByClass("available-stone", parseInt(boardData.stone) - parseInt(buildData.stonespent))

}

function decBuilding(building) {
  switch (building) {
    case "shack":
      let shackWoodCost = parseInt(buildData.shackwood)
      let shackBuilder = parseInt(buildData.shackbuilder)

      // check building is > 0 - break if not
      if (buildData.shack <= 0) {break}

      // dec buildings 
      buildData.shack = parseInt(buildData.shack) - 1

      // inc resources
      buildData.woodspent = parseInt(buildData.woodspent) - shackWoodCost

      // inc workers
      workerData.workers = parseInt(workerData.workers) + shackBuilder

      // dec builders
      buildData.builders = parseInt(buildData.builders) - shackBuilder

      // update display
      updateFieldsByClass("build-shack", buildData.shack) 
      break


    case "house":
      let houseStoneCost = parseInt(buildData.housestone)
      let houseBuilder = parseInt(buildData.housebuilder)

      // check building is > 0 
      if (buildData.house <= 0) {break}

      // dec buildings
      buildData.house = parseInt(buildData.house) - 1

      // inc resources
      buildData.stonespent = parseInt(buildData.stonespent) - houseStoneCost

      // inc workers 
      workerData.workers = parseInt(workerData.workers) + houseBuilder

      // dec builders
      buildData.builders = parseInt(buildData.builders) - houseBuilder

      // update display
      updateFieldsByClass("build-house", buildData.house)
      break

    case "manor":
      let manorWoodCost = parseInt(buildData.manorwood)
      let manorStoneCost = parseInt(buildData.manorstone)
      let manorBuilder = parseInt(buildData.manorbuilder)

      // check building is > 0
      if (buildData.manor <= 0) {break}

      // dec buildings 
      buildData.manor = parseInt(buildData.manor) - 1

      // inc resources
      buildData.woodspent = parseInt(buildData.woodspent) - manorWoodCost
      buildData.stonespent = parseInt(buildData.stonespent) - manorStoneCost

      // inc workers
      workerData.workers = parseInt(workerData.workers) + manorBuilder

      // dec builders
      buildData.builders = parseInt(buildData.builders) - manorBuilder

      // update display
      updateFieldsByClass("build-manor", buildData.manor)
      break

  }

  updateWorkerDisplays(workerData.workers)
  updateFieldsByClass("info-builders", buildData.builders)
  updateFieldsByClass("available-wood", parseInt(boardData.wood) - parseInt(buildData.woodspent))
  updateFieldsByClass("available-stone", parseInt(boardData.stone) - parseInt(buildData.stonespent))
}


// updates all elements with className to display data
function updateFieldsByClass(className, data) {
  let fields = document.getElementsByClassName(className)
  for (let i = 0; i < fields.length; i++) {
    fields[i].innerText = data
  }
}

// update fields to display game state from board element
function updateBasicInfoFields() {
  updateFieldsByClass("info-population", calculatePopulation())
  updateFieldsByClass("info-frames", boardData.frames)
  updateFieldsByClass("info-children", boardData.children)
  updateFieldsByClass("info-adults", boardData.adults)
  updateFieldsByClass("info-old", boardData.old)
  updateFieldsByClass("info-food", boardData.food)
  updateFieldsByClass("info-wood", boardData.wood)
  updateFieldsByClass("info-stone", boardData.stone)

  updateFieldsByClass("info-builders", buildData.builders)
  updateFieldsByClass("info-shelter", boardData.shelter)
  updateFieldsByClass("build-shack", buildData.shack)
  updateFieldsByClass("build-house", buildData.house)
  updateFieldsByClass("build-manor", buildData.manor)
  

}

// update fields to display game state from logs element
function updateLogFields() {
  updateFieldsByClass("log-food", logData.food)
  updateFieldsByClass("log-gather-meat", logData.meat)
  updateFieldsByClass("log-gather-forage", logData.forage)
  updateFieldsByClass("log-wood", logData.wood)
  updateFieldsByClass("log-stone", logData.stone)

  updateFieldsByClass("log-sick", logData.sick)
  updateFieldsByClass("log-born", logData.born)
  updateFieldsByClass("log-grew", logData.grew)
  updateFieldsByClass("log-deaths", logData.deaths)
  updateFieldsByClass("log-sickness", logData.sickness)
  updateFieldsByClass("log-oldage", logData.oldage)

  updateFieldsByClass("log-shelter", logData.shelter)
  updateFieldsByClass("log-shack", buildData.shack)
  updateFieldsByClass("log-house", buildData.house)
  updateFieldsByClass("log-manor", buildData.manor)
  updateFieldsByClass("log-wood-spent", buildData.woodspent)
  updateFieldsByClass("log-stone-spent", buildData.stonespent)

}

// calculates number of workers 
function calclulateWorkers() {
  let workers = parseInt(boardData.adults)
  let notWorkers = parseInt(boardData.children) + parseInt(boardData.old)
  let sick = parseInt(logData.sick)

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

function calculatePopulation() {
  return parseInt(boardData.children) + parseInt(boardData.adults) + parseInt(boardData.old)
}



// this function will be called by the "continue" button
function evaluateYear() {
  // this function is where most of the logic should be 
  update()


  console.log("evaluating Year...") // TEST:

// do these last
  let population = calculatePopulation()

// TODO: DISPLAY END GAME STATUS (WIN) BUTTON TO GO BACK TO index.html
  if (population >= maxPopulation || boardData.frames >= maxFrames) {
    console.log("Win condition met") // TEST: 
  }

// TODO: DISPLAY END GAME STATUS (LOOSE) BUTTON TO GO BACK TO index.html
  if (population <= 0) {
    console.log("Loose condition met")
  }

  // display info and logs
  updateBasicInfoFields()

 
  // jump to the logs on html page  
  document.getElementById("bookmark-log").scrollIntoView()

}


// TEST:

