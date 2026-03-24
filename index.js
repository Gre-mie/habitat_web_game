
// get habitat variables
let fullurl = window.location.href
let params = new URLSearchParams(new URL(fullurl).search)

let habitat = Object.fromEntries(params)

console.log(habitat)

console.log(habitat.name)


