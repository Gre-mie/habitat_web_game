let fullurl = window.location.href
let habitat = new URLSearchParams(new URL(fullurl).search)

console.log(`habitat:`)

for (const [key, value] of habitat) {
  console.log(`${key}: ${value}`)
  // TODO: may need to put these in an object (hard coded)
  // use parseInt to convert string to num


}

