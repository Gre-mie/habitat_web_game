
// get habitat variables
let fullurl = window.location.href
let params = new URLSearchParams(new URL(fullurl).search)
let habitat = Object.fromEntries(params)
let board = document.getElementById("board")


console.log(habitat) //

// add styles and info to elements
let title = document.getElementById("habitat-title")
let className = `${habitat.name.toLowerCase()}`
title.innerText = habitat.name
title.classList.add(className)
document.getElementById("hr").classList.add(className)





// TEST:
let data = board.dataset
console.log(`frames: ${data.frames}`)
data.frames++
console.log(`frames: ${data.frames}`)


console.log(`population: 
children: ${data.children}
adults: ${data.adults}
elderly: ${data.old}

resources:
food: ${data.food}
wood: ${data.wood}
stone: ${data.stone}
`)



