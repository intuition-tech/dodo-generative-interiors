import {Pane} from './pane.js'
import {chaikinSmooth} from './chaikinSmooth.js'
import {sliceShapes} from './sliceShapes.js'
import {saveSVG, R, setSeed, stringHash} from './helpers.js'
import {makeSvg} from './makeSvg.js'

let PARAMS = {
  seedString: 'Dodo',
  scale: 3,
  slicesNumber: 20,
  size: {x: 800, y: 800},
}

let pane = Pane(PARAMS)
pane.on('change', e => {
  console.log('e:', e)
  updateSvg()
})

const textInput = pane.addInput(PARAMS, 'seedString', {label: 'Слово'})
textInput.element.querySelector('input').addEventListener('input', ev => {
  PARAMS.seedString = ev.target.value
  updateSvg()
})

// save button
pane.addButton({title: 'Save SVG'}).on('click', saveSVG)

function updateSvg() {
  let w = PARAMS.size.x
  let h = PARAMS.size.y
  setSeed(stringHash(PARAMS.seedString) + 35)
  // shape is made of polys
  let shapes = [
    // [rombus(w / 2 + 64 * R(), h / 2, 64 * R() + 20)],
    [rombus(w / 2 - (w / 2) * R(), h / 2, 64 * R() + 400)],
    [rombus(w / 2 + (w / 2) * R(), h / 2, 64 * R() + 400)],
    [rombus(w / 2 + (w / 2) * R(), h / 2, 64 * R() + 400)],
  ]

  shapes = sliceShapes(PARAMS, shapes)

  let container = document.getElementById('container')
  container.innerHTML = ''
  let svg = makeSvg(PARAMS, shapes)
  container.appendChild(svg)
}
updateSvg()

function rombus(x, y, r) {
  let poly = []
  poly.push([x - r, y])
  poly.push([x, y + r])
  poly.push([x + r, y])
  poly.push([x, y - r])
  poly = chaikinSmooth(poly, 4)
  return poly
}
