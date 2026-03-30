
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
  updateFieldsByClass("available-wood", parseInt(boardData.wood) - parseInt(buildData.costwood))
  updateFieldsByClass("available-stone", parseInt(boardData.stone) - parseInt(buildData.coststone))

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
  boardData.wood = parseInt(boardData.wood) - parseInt(buildData.costwood)
  boardData.stone = parseInt(boardData.stone) - parseInt(buildData.coststone)


  console.log(buildData)
  console.log(logData)

  updateLogFields()
  
  // reset build vars
  buildData.builders = 0
  buildData.shack = 0
  buildData.house = 0
  buildData.manor = 0
  buildData.costwood = 0
  buildData.coststone = 0
  

  


  // TODO: ADD UPDATE INFO




}

function incBuilding(building) {
    let wood = parseInt(boardData.wood)
    let stone = parseInt(boardData.stone)
    let workers = parseInt(workerData.workers)
  switch (building) {
    case "shack":

      let shackCost = parseInt(buildData.shackwood)
      let woodSpent = parseInt(buildData.costwood)
      let shackBuilder = parseInt(buildData.shackbuilder)

      // check avaiable resources
     if ((woodSpent+shackCost) > wood) {break;}
     if (shackBuilder > workers) {break;}

      // inc building
      buildData.shack = parseInt(buildData.shack) + 1

      console.log(buildData.shack)
       
      // dec resources - update things
      buildData.costwood = parseInt(buildData.costwood) + shackCost

      // dec workers - update builders
      workerData.workers = parseInt(workerData.workers) - shackBuilder
      buildData.builders = parseInt(buildData.builders) + shackBuilder
      
      // update display
      updateFieldsByClass("build-shack", buildData.shack)
      updateWorkerDisplays(workerData.workers)
      updateFieldsByClass("info-builders", buildData.builders)
      

      


    case "house":
      // check wood and workers - break if not
      
      // inc buildings 
      
      // dec resources - update things

      // dec workers - update builders 

      // update display

    case "manor":
      // check wood and workers - break if not
      
      // inc buildings 
      
      // dec resources - update things

      // dec workers - update builders 

      // update display



  }
  updateFieldsByClass("available-wood", parseInt(boardData.wood) - parseInt(buildData.costwood))
  updateFieldsByClass("available-stone", parseInt(boardData.stone) - parseInt(buildData.coststone))
}

function decBuilding(building) {
  //let wood = parseInt(boardData.wood)
  //let stone = parseInt(boardData.stone)
  //let workers = parseInt(workerData.workers)

  switch (building) {
    case "shack":
      let shackCost = parseInt(buildData.shackwood)
      let shackBuilder = parseInt(buildData.shackbuilder)

      // check building is > 0 - break if not
      if (buildData.shack <= 0) {break}

      // dec buildings 
      buildData.shack = parseInt(buildData.shack) - 1
      
      // inc resources - update things
      buildData.costwood = parseInt(buildData.costwood) - shackCost

      // inc workers - update builders
      workerData.workers = parseInt(workerData.workers) + shackBuilder



      // update display
      updateFieldsByClass("build-shack", buildData.shack)
      updateWorkerDisplays(workerData.workers)
      updateFieldsByClass("info-builders", buildData.builders)

      

    case "house":
      // check building is > 0 - break if not 

      // dec buildings 
      
      // inc resources - update things

      // inc workers - update builders 

      // update display


    case "manor":
      // check building is > 0 - break if not 

      // dec buildings 
      
      // inc resources - update things

      // inc workers - update builders 

      // update display



  }
  updateFieldsByClass("available-wood", parseInt(boardData.wood) - parseInt(buildData.costwood))
  updateFieldsByClass("available-stone", parseInt(boardData.stone) - parseInt(buildData.coststone))
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

 
  // jump to the logs 
  document.getElementById("bookmark-log").scrollIntoView()

}


// TEST:

