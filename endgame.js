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
  }

  // sets element text
  document.getElementById("end-status").innerText += `You ${infoData.status}`




}


// updates html data with URL varibles
function transalteData(data) {
  let endhabitat = endData.hab
  let endStatus = endData.stat
  let endCondition = endData.cond

  // set and style elements
  updateHabitat(endhabitat)
  updateStatus(endStatus)

  // check data



  // populate variables with relevent data



  console.log(`end Data:
habitat: ${endhabitat}
end status: ${endStatus}
end condition met: ${endCondition}
`)
}

function setConditionMessage(endStatus, condition) {
  //
}


// sets the heading to the win/loose
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
    break;
  }
}


// sets the style according to the habitat
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
