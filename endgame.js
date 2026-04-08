console.log(window.location.href)

// pull varabiles
let params = new URLSearchParams(new URL(window.location.href).search)
let endData = Object.fromEntries(params)

console.log(endData) //
transalteAndSetData(endData)





// translate and set data
function transalteAndSetData(data) {
  let habitat = endData.hab
  let endStatus = endData.stat
  let endCondition = endData.cond

  // set and style elements
  setHabitatStyle(habitat)
  setStatusElement(endStatus)

  // check data



  // populate variables with relevent data



  console.log(`end Data:
habitat: ${habitat}
end status: ${endStatus}
end condition met: ${endCondition}
`)
}


// sets the heading to the win/loose
function setStatusElement(status) {
  switch (status) {
    case "w":
      document.getElementById("end-status").innerText += " Won"
    break;
    case "l":
      document.getElementById("end-status").innerText += " Lost"
    break;
    default:
      console.log("%c WARNING:", "color:yellow", `endData has unrecognised status: ${status}`)
    break;
  }



}


// sets the style according to the habitat
function setHabitatStyle(habitat) {
  let style = ""
  switch (habitat) {
    case "S":
      style = "swamp"
      break;
    case "M": 
      style = "mountain"
      break;
    case "D":
      style = "desert"
      break;
    case "F":
      style = "forest"
      break;
  }
  if (style === "") {
    console.log("%c WARNING:", "color:yellow", `endData has unrecognised habitat: ${habitat}`)
  }
  if (style.length > 0) {
    document.getElementById("end-status").classList.add(style)
    document.getElementById("new-game-button").classList.add(style)
  }
}
