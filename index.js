// This project was created to explore what it would be like saveing
// most of a games state data onto HTML elements rather than using 
// objects.
// I dont recomend this way of doing things in any serious way.

// get habitat variables
let fullurl = window.location.href
let params = new URLSearchParams(new URL(fullurl).search)
let habitatData = Object.fromEntries(params)

// INFO: these three parts are concatinated to form the entire
// url to the endscreen with all its information

let endGameURL = "endgame.html?"
let endGameHabitat= `` // habitat information is appended
// habitat data structure, [name, meat, plants, wood, stone, grow, oldage, fertility, sickness]
let endGameStatus = "" // end condition status is appended
let endGameHistory = "" // yearly information is appended 
// each year starts with 'y' followed by commer sepperated list of numbers
// format example: y2,5,8,3,5y4,3,6,2,4
// to pull information split by 'y' into an array of years, then each by ',' to get data 

console.log(habitatData)

// window elements
let boardEl = document.getElementById("board")
let logEl = document.getElementById("log")
let workerEl = document.getElementById("info-workers")
let workerDisplayEl = document.getElementById("worker-visual-display")
let buildEl = document.getElementById("info-build")
let jobEl = document.getElementById("info-jobs")

// element data
let boardData = boardEl.dataset
let logData = logEl.dataset
let workerData = workerEl.dataset
let buildData = buildEl.dataset
let jobData = jobEl.dataset

// other game variables
let maxPopulation = 50 // win condition
let maxFrames = 25     // win condition
let workerDisplay = []


// TEST: vvv

boardData.adults = 1

// TEST: ^^^


// initial game setup
// INFO: this function should only be called once
function setup() {
  // set title and colours
  let title = document.getElementById("habitat-title")
  let className = `${habitatData.name.toLowerCase()}`
  title.classList.add(className)
  title.children[0].innerText = habitatData.name
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

  // calculate resources gained from jobs
  // add food gained
  let plantsGained = calculateResources(jobData.forager, jobData.plants, habitatData.plants)
  // special possiblity for double resources on foraging
  // INFO: THIS GETS A LITTLE CRAZY... but in a fun way
  if (determineSuccess(5)) {plantsGained = plantsGained * 2}
  logData.forage = plantsGained
  let meatGained = calculateResources(jobData.hunter, jobData.meat, habitatData.meat)
  logData.meat = meatGained
  logData.food = plantsGained + meatGained
  boardData.food = parseInt(boardData.food) + plantsGained + meatGained
  
  // add build materiels gained from jobs 
  let woodGained = calculateResources(jobData.woodcutter, jobData.wood, habitatData.wood)
  let stoneGained = calculateResources(jobData.miner, jobData.stone, habitatData.stone)
  logData.wood = woodGained
  logData.stone = stoneGained
  boardData.wood = parseInt(boardData.wood) + woodGained
  boardData.stone = parseInt(boardData.stone) + stoneGained

  // food consumption and deaths from starvation
  consumeFood()
  // determine how many citizens die from sickness or become healthy
  deathFromSickness()
  // determine how many old people die from old age
  deathFromOldage()
  // calculate adults becoming old
  adultsAge()
  // calculate children growing
  childrenGrow()
  // calculate births
  reproduction()
  
 
  // INFO: my need moving ?
  // calculate new sick ppl (old sick ppl have already been handled)
  // take shelter into account
  gottenSick()
  



  // calculate and display workers
  workerData.workers = calclulateWorkers()
  updateWorkerDisplays(workerData.workers)

  updateLogFields()
  
  // reset build vars
  buildData.builders = 0
  buildData.shack = 0
  buildData.house = 0
  buildData.manor = 0
  buildData.woodspent = 0
  buildData.stonespent = 0

  // reset job vars
  jobData.jobs = 0
  jobData.forager = 0
  jobData.hunter = 0
  jobData.woodcutter = 0
  jobData.miner = 0

  // reset population vars
  logData.deaths = 0
}


// calculates who becomes sick, takes shelter into account
function gottenSick() {
  let sick = 0
  let sickness = parseInt(habitatData.sickness)
  
  let population = calculatePopulation()
  let shelter = parseInt(boardData.shelter)
  let unsheltered = population - shelter
  for (let i = 0; i < unsheltered; i++) {
    if (determineSuccess(sickness)) {sick++}
  }

  // set variables
  boardData.sick = sick
  logData.sick = sick
}


// determine how many adults become old
 function adultsAge() {
  let aged = 0
  let ageChance = parseInt(habitatData.grow)

  let adults = parseInt(boardData.adults) 
  for (let i = 0; i < adults; i++) { 
    if (determineSuccess(ageChance)) {aged++}
  }
  
  // set variables
  boardData.adults = parseInt(boardData.adults) - aged
  boardData.old = parseInt(boardData.old) + aged
  logData.aged = aged

}


// determine how many children grow into adults
// chance is increased by the number of elderly
function childrenGrow() {
  let grow = 0
  let growChance = parseInt(habitatData.grow) + parseInt(boardData.old)
  if (growChance > 10) {growChance = 10}

  let children = parseInt(boardData.children)
  for (let i = 0; i < children; i++) {
    if (determineSuccess(growChance)) {grow++}
  }

  // set variables
  boardData.adults = parseInt(boardData.adults) + grow
  boardData.children = parseInt(boardData.children) - grow
  logData.grew = grow
}


// determine number of offspring from unasigned workers
// shelter increases chance of success
// game was to difficult with pairs of breeders, so now their all asexual
function reproduction() {
  let births = 0
  let unassigned = parseInt(workerData.workers)
  let fertility = parseInt(habitatData.fertility)
  let shelter = parseInt(boardData.shelter)

  let pairs = 0
  while (pairs < unassigned) { // Math.floor(unassigned/2)) {
    pairs++
    if (shelter >= 2) {
      let improvedFertility = fertility + 2
      if (improvedFertility > 10) {
        improvedFertility = 10
      }
        // chance of twins
        if (determineSuccess(improvedFertility)) {births++}
        if (determineSuccess(improvedFertility)) {births++}
        shelter -= 3 // 2 adults and one child

    } else {
      if (determineSuccess(fertility)) {births++}
    }
  }

  // set variables
  boardData.children = parseInt(boardData.children) + births
  logData.born = births
}


// determines the number of old citizens that die from old age
function deathFromOldage() {
  let oldage = 0
  let oldageChance = parseInt(habitatData.oldage)

  let oldPeople = parseInt(boardData.old)
  for (let i = 0; i < oldPeople; i++) {
    if (determineSuccess(oldageChance)) {oldage++}
  }

  // set variables
  updateDeaths(oldage)
  
  //boardData.old = parseInt(boardData.old) - oldage
  logData.deaths = parseInt(logData.deaths) + oldage
  logData.oldage = oldage
}


// determins if a sick citizen dies or becomes healthy
function deathFromSickness() {
  let deathsBySickness = 0
  let healthy = 0

  let sickPeople = parseInt(boardData.sick)
  for (let i = 0; i < sickPeople; i++) {
  
    let recoveryChance = 10 - parseInt(habitatData.sickness)
    if (determineSuccess(recoveryChance)) {
      healthy++
    } else {
      deathsBySickness++
    }
  }

  // update healthy
  boardData.sick = parseInt(boardData.sick) - healthy

  // update deaths from sickness
  updateDeaths(deathsBySickness)
  boardData.sick = 0 // all the sick either die or get better
  logData.deaths = parseInt(logData.deaths) + deathsBySickness
  logData.sickness = deathsBySickness
}


// calculates and sets food consumption and deaths from starvation
function consumeFood() {
  let starvation = 0
  // calculate adult consumption
  let adultEat = parseInt(boardData.adultconsumes)
  let adultCitizens = parseInt(boardData.adults)
  for (let i = 0; i < adultCitizens; i++) {

    if (boardData.food >= adultEat) {
      // consume food
      boardData.food = parseInt(boardData.food) - adultEat
    } else {
      starvation++
    }
  }
  // calculate child consumption
  let childEat = parseInt(boardData.childconsumes)
  let childCitizens = parseInt(boardData.children)
  for (let i = 0; i < childCitizens; i++) {

    if (boardData.food >= childEat) {
      // consume food
      boardData.food = parseInt(boardData.food) - childEat
    } else {
      starvation++
    }
  }
  // calculate elderly consumption
  let oldEat = parseInt(boardData.oldconsumes)
  let oldCitizens = parseInt(boardData.old)
  for (let i = 0; i < oldCitizens; i++) {

    if (boardData.food >= oldEat) {
      // consume food
      boardData.food = parseInt(boardData.food) - oldEat
    } else {
      starvation++
    }
  }

  // update and acton starvation deaths 
  updateDeaths(starvation)
  logData.starvation = starvation
  logData.deaths = parseInt(logData.deaths) + starvation

  // update display
  updateFieldsByClass("info-children", boardData.children)
  updateFieldsByClass("info-adults", boardData.adults)
  updateFieldsByClass("info.old", boardData.old)
  updateFieldsByClass("info-food", boardData.food)
}


// sets deaths by order: elderly -> children -> adults
function updateDeaths(deaths) {
  deaths = parseInt(deaths)

  for (let i = 0; i < deaths; i++) {
    if (parseInt(boardData.old) > 0) {
      boardData.old = parseInt(boardData.old) - 1

    } else if (parseInt(boardData.children)) {
      boardData.children = parseInt(boardData.children) - 1

    } else if (parseInt(boardData.adults)) {
      boardData.adults = parseInt(boardData.adults) - 1

    }
  }

  console.log(`children: ${boardData.children}, adult: ${boardData.adults}, elderly: ${boardData.old}`)
}


// building increment buttons
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

      buildData.shack = parseInt(buildData.shack) + 1
      buildData.woodspent = parseInt(buildData.woodspent) + shackWoodCost
      workerData.workers = parseInt(workerData.workers) - shackBuilder
      buildData.builders = parseInt(buildData.builders) + shackBuilder

      // update fields
      updateFieldsByClass("build-shack", buildData.shack)
      break

    case "house":
      let houseStoneCost = parseInt(buildData.housestone)
      let houseBuilder = parseInt(buildData.housebuilder)

      if ((stoneSpent+houseStoneCost) > stone) {break;}
      if (houseBuilder > workers) {break;}
      
      buildData.house = parseInt(buildData.house) + 1
      buildData.stonespent = parseInt(buildData.stonespent) + houseStoneCost
      workerData.workers = parseInt(workerData.workers) - houseBuilder
      buildData.builders = parseInt(buildData.builders) + houseBuilder

      // update fields
      updateFieldsByClass("build-house", buildData.house)
      break

    case "manor":
      let manorWoodCost = parseInt(buildData.manorwood)
      let manorStoneCost = parseInt(buildData.manorstone)
      let manorBuilder = parseInt(buildData.manorbuilder)

      if ((woodSpent+manorWoodCost) > wood) {break;}
      if ((stoneSpent+manorStoneCost) > stone) {break;}
      if (manorBuilder > workers) {break;} 

      buildData.manor = parseInt(buildData.manor) + 1
      buildData.woodspent = parseInt(buildData.woodspent) + manorWoodCost
      buildData.stonespent = parseInt(buildData.stonespent) + manorStoneCost
      workerData.workers = parseInt(workerData.workers) - manorBuilder
      buildData.builders = parseInt(buildData.builders) + manorBuilder

      // update fields
      updateFieldsByClass("build-manor", buildData.manor)
      break
  }
  updateWorkerDisplays(workerData.workers)
  updateFieldsByClass("info-builders", buildData.builders)
  updateFieldsByClass("available-wood", parseInt(boardData.wood) - parseInt(buildData.woodspent))
  updateFieldsByClass("available-stone", parseInt(boardData.stone) - parseInt(buildData.stonespent))
}


// building decrement buttons 
function decBuilding(building) {
  switch (building) {
    case "shack":
      let shackWoodCost = parseInt(buildData.shackwood)
      let shackBuilder = parseInt(buildData.shackbuilder)

      if (buildData.shack <= 0) {break}

      buildData.shack = parseInt(buildData.shack) - 1
      buildData.woodspent = parseInt(buildData.woodspent) - shackWoodCost
      workerData.workers = parseInt(workerData.workers) + shackBuilder
      buildData.builders = parseInt(buildData.builders) - shackBuilder

      // update display
      updateFieldsByClass("build-shack", buildData.shack) 
      break

    case "house":
      let houseStoneCost = parseInt(buildData.housestone)
      let houseBuilder = parseInt(buildData.housebuilder)

      if (buildData.house <= 0) {break}
      buildData.house = parseInt(buildData.house) - 1
      buildData.stonespent = parseInt(buildData.stonespent) - houseStoneCost
      workerData.workers = parseInt(workerData.workers) + houseBuilder
      buildData.builders = parseInt(buildData.builders) - houseBuilder

      // update display
      updateFieldsByClass("build-house", buildData.house)
      break

    case "manor":
      let manorWoodCost = parseInt(buildData.manorwood)
      let manorStoneCost = parseInt(buildData.manorstone)
      let manorBuilder = parseInt(buildData.manorbuilder)

      if (buildData.manor <= 0) {break}

      buildData.manor = parseInt(buildData.manor) - 1
      buildData.woodspent = parseInt(buildData.woodspent) - manorWoodCost
      buildData.stonespent = parseInt(buildData.stonespent) - manorStoneCost
      workerData.workers = parseInt(workerData.workers) + manorBuilder
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


// jobs increment buttons 
function incJob(job) {
  switch (job) {
    case "forager":
      if (workerData.workers <= 0) {break}
      jobData.forager = parseInt(jobData.forager) + 1
      workerData.workers = parseInt(workerData.workers) - 1
      jobData.jobs = parseInt(jobData.jobs) + 1
      updateFieldsByClass("job-forager", jobData.forager)
      break
    case "hunter":
      if (workerData.workers <= 0) {break}
      jobData.hunter = parseInt(jobData.hunter) + 1
      workerData.workers = parseInt(workerData.workers) - 1
      jobData.jobs = parseInt(jobData.jobs) + 1

      updateFieldsByClass("job-hunter", jobData.hunter)
      break
    case "woodcutter":
      if (workerData.workers <= 0) {break}
      jobData.woodcutter = parseInt(jobData.woodcutter) + 1
      workerData.workers = parseInt(workerData.workers) - 1
      jobData.jobs = parseInt(jobData.jobs) + 1

      updateFieldsByClass("job-woodcutter", jobData.woodcutter)
      break
    case "miner":
      if (workerData.workers <= 0) {break}
      jobData.miner = parseInt(jobData.miner) + 1
      workerData.workers = parseInt(workerData.workers) - 1
      jobData.jobs = parseInt(jobData.jobs) + 1

      updateFieldsByClass("job-miner", jobData.miner)
      break
  }
  updateWorkerDisplays(workerData.workers)
  updateFieldsByClass("jobs-filled", jobData.jobs)
}


// jobs decrement buttons 
function decJob(job) {
  switch (job) {
    case "forager":
      if (jobData.forager <= 0) {break}
      jobData.forager = parseInt(jobData.forager) - 1
      workerData.workers = parseInt(workerData.workers) + 1
      jobData.jobs = parseInt(jobData.jobs) - 1
      updateFieldsByClass("job-forager", jobData.forager)
      break
    case "hunter":
      if (jobData.hunter <= 0) {break}
      jobData.hunter = parseInt(jobData.hunter) - 1
      workerData.workers = parseInt(workerData.workers) + 1
      jobData.jobs = parseInt(jobData.jobs) - 1
      updateFieldsByClass("job-hunter", jobData.hunter)
      break
    case "woodcutter":
      if (jobData.woodcutter <= 0) {break}
      jobData.woodcutter = parseInt(jobData.woodcutter) - 1
      workerData.workers = parseInt(workerData.workers) + 1
      jobData.jobs = parseInt(jobData.jobs) - 1
      updateFieldsByClass("job-woodcutter", jobData.woodcutter)
      break
    case "miner":
      if (jobData.miner <= 0) {break}
      jobData.miner = parseInt(jobData.miner) - 1
      workerData.workers = parseInt(workerData.workers) + 1
      jobData.jobs = parseInt(jobData.jobs) - 1
      updateFieldsByClass("job-miner", jobData.miner)
      break
  }
  updateWorkerDisplays(workerData.workers)
  updateFieldsByClass("jobs-filled", jobData.jobs)
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
  updateFieldsByClass("info-sick", boardData.sick)
  updateFieldsByClass("info-food", boardData.food)
  updateFieldsByClass("info-wood", boardData.wood)
  updateFieldsByClass("info-stone", boardData.stone)

  updateFieldsByClass("info-builders", buildData.builders)
  updateFieldsByClass("info-shelter", boardData.shelter)
  updateFieldsByClass("build-shack", buildData.shack)
  updateFieldsByClass("build-house", buildData.house)
  updateFieldsByClass("build-manor", buildData.manor)

  updateFieldsByClass("jobs-filled", jobData.jobs)
  updateFieldsByClass("job-forager", jobData.forager)
  updateFieldsByClass("job-hunter", jobData.hunter)
  updateFieldsByClass("job-woodcutter", jobData.woodcutter)
  updateFieldsByClass("job-miner", jobData.miner)
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
  updateFieldsByClass("log-aged", logData.aged)
  updateFieldsByClass("log-deaths", logData.deaths)
  updateFieldsByClass("log-sickness", logData.sickness)
  updateFieldsByClass("log-starvation", logData.starvation)
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
  let sickWorkers = parseInt(boardData.sick) - notWorkers

  if (sickWorkers > 0) {
    workers -= sickWorkers
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


// determine success/failior of a chance variable
// INFO: a chance variable is a habitat variable and is considered to be the chance percentage of success out of 10
// if chance is < random out of 10, condition is met (true)
// chance 5 will have a 50% chance of success, due to 0-10 being calculated
function determineSuccess(chance) {
  let random = Math.floor(Math.random() * 10) + 1
  if (!Number.isInteger(chance)) {console.log("%c WARNING:", "color:yellow", `Chance variable is: chance ${chance}, type: ${typeof chance}`)}

  if (random <= chance) {
    return true 
  }
  return false
}


// calculate the number of resources successfully collected
function calculateResources(workers, possibleResource, chance) {
  workers = parseInt(workers)
  possibleResource = parseInt(possibleResource)
  chance = parseInt(chance)
  
  let resources = 0
  for (i=0; i<workers; i++) {
    if (determineSuccess(chance)) {
      resources += possibleResource
    }
  }
  return resources
}


// this function will be called by the "continue" button
function evaluateYear() {
  // this function is where most of the logic should be 
  update()

  // display resources available
  updateFieldsByClass("available-wood", parseInt(boardData.wood) - parseInt(buildData.woodspent))
  updateFieldsByClass("available-stone", parseInt(boardData.stone) - parseInt(buildData.stonespent))




  console.log("evaluating Year...") // TEST:

// do these last
  let population = calculatePopulation()

// TODO: DISPLAY END GAME STATUS (WIN) BUTTON TO GO BACK TO index.html
  if (population >= maxPopulation) {
    console.log("Win condition met") // TEST: 

    endScreen("win", "population")

  }

// TODO: DISPLAY END GAME STATUS (WIN) BUTTON TO GO BACK TO index.html
  if (boardData.frames >= maxFrames) {
    console.log("Win condition met") // TEST: 

    endScreen("win", "frames")

  }


// TODO: DISPLAY END GAME STATUS (LOOSE) BUTTON TO GO BACK TO index.html
  if (population <= 0) {
    console.log("Loose condition met") // TEST: 

    endScreen("loose", "population")


  }

  // display info and logs
  updateBasicInfoFields()

  // jump to the logs on html page  
  document.getElementById("bookmark-log").scrollIntoView()

}

// responsible for handling the end screen setup 
function endScreen(status, condition) {
  redirectToEnd(status, condition)

  // display info to screen
  // win - you servived the <habitat name>
  // loose - you were defeated by the <habitat name>
  // reason

  // habitat data in logs 
  
  // split up year info
  // append year info to history log

}


// page redirect to end screen
function redirectToEnd(status, condition) {
  let url = endGameURL + endGameHabitat + endGameStatus + endGameHistory
  console.log(`url:     ${endGameURL}
habitat: ${endGameHabitat}
status:  ${endGameStatus}
history: ${endGameHistory}`)

  console.log(`redirect to: ${url}`)
}

