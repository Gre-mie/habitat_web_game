console.log(window.location.href)

// pull varabiles from URL
let params = new URLSearchParams(new URL(window.location.href).search)
let endData = Object.fromEntries(params)

// elements
let infoEl = document.querySelector("#end-basic-info")
let infoData = infoEl.dataset

console.log(endData) //

transalteData(endData)
updateElements(infoData)

console.log(infoData) //


// sets page data
function updateElements(infoData) {
  // styles elements with habitat colours
  let habitat = infoData.habitat
  if (habitat === "") {
    console.log("%c WARNING:", "color:yellow", `endData has unrecognised habitat: ${habitat}`)
  }
  if (habitat.length > 0) {
    document.getElementById("end-status").classList.add(habitat)
    document.getElementById("new-game-button").classList.add(habitat)
    document.querySelector("hr").classList.add(habitat)
  }

  // sets element text
  document.getElementById("end-status").innerText += `You ${infoData.status}`
  document.querySelector("#end-condition").innerText = getConditionMessage(endData.stat, endData.cond)
  document.querySelector("#end-frames").innerText = `Year: ${infoData.frames}`
  document.querySelector("#end-population").innerText = `Population: ${infoData.population}`
  document.querySelector("#end-food").innerText = `Food: ${infoData.food}`
  document.querySelector("#end-wood").innerText = `Wood: ${infoData.wood}`
  document.querySelector("#end-stone").innerText = `Stone: ${infoData.stone}`

}


function getConditionMessage(status, condition) {
  if (status.length < 1 || condition.length < 1) {
    console.log("%c WARNING: ", "color:yellow", `An input isn't set: status: ${status}, condition: ${condition}`)
  }

  if (status === "w") {
    if (condition === "f") {
      return `Your settelment survived ${infoData.frames} years and can now funciton on its own.
Max years: ${endData.maxf}`
    } else if (condition === "p")
      return `Your settelment population reached max capacity and can now function on its own.
Max capacity: ${endData.maxp}
Population: ${infoData.population}`
  } else if (status === "l") {
    if (condition === "p") {
      return `Your settlement survived ${infoData.frames} years before dieing out`
    }
  }

  return ""
}


// updates html data with URL varibles
function transalteData(data) {
  let endhabitat = endData.hab
  let endStatus = endData.stat
  let endCondition = endData.cond

  // update html element data
  updateHabitat(endhabitat)
  updateStatus(endStatus)
  updateCondition(endCondition)
  infoData.frames = endData.fr
  infoData.population = endData.pop
  infoData.food = endData.food
  infoData.wood = endData.wood
  infoData.stone = endData.stone
}


// updates html data condition
function updateCondition(condition) {
  switch (condition) {
    case "p":
      infoData.condition = "population"
      break;
    case "f":
      infoData.condition = "frames"
      break;
    default:
    console.log("%c WARNING:", "color:yellow", `endData has unrecognised condition: ${condition}`)
  }
}


// updates the html data status
function updateStatus(status) {
  switch (status) {
    case "w":
      infoData.status = "Won"
    break;
    case "l":
      infoData.status = "Lost"
    break;
    default:
      console.log("%c WARNING:", "color:yellow", `endData has unrecognised status: ${status}`)
  }
}


// updates html data habitat
function updateHabitat(habitat) {
  switch (habitat) {
    case "S":
      infoData.habitat = "swamp"
      break;
    case "M": 
      infoData.habitat = "mountain"
      break;
    case "D":
      infoData.habitat = "desert"
      break;
    case "F":
      infoData.habitat = "forest"
      break;
  }
}
