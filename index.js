let habitat = {}

function setHabitat(el) {

  console.log(el)
  console.log(el.dataset)

  let t = "-"


  console.log(`habitat: ${el.name}
chance modifyers:
- hunt: ${el.dataset.hunt}
- forage: ${el.dataset.forage}
- wood: ${el.dataset.wood}
- stone: ${el.dataset.stone}

- fertility: ${el.dataset.grow}
- sickness: ${el.dataset.oldage}

- grow: ${el.dataset.fertility}
- oldage: ${el.dataset.sickness}
`)

  //window.location.href = "./game.html"
 // let board = document.getElementById("game")

  //console.log(board)

}

