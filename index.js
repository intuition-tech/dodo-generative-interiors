import {Pane} from './pane.js'
import {chaikinSmooth} from './chaikinSmooth.js'
import {sliceShapes} from './sliceShapes.js'
import {saveSVG, R, setSeed, stringHash} from './helpers.js'
import {makeSvg} from './makeSvg.js'
import {makeShapes} from './makeShapes.js'

let PARAMS = {
  seedString: 'Dodo',
  colors: '#CC4817 #D6DB0D #CA97E4 #F29F2B #D71D01 #F47401 #E31C33',
  gradient1: '#F6ECEC',
  gradient2: '#CCD8E4',
  scale: 4,
  slicesNumber: 40, // remove, calc from size
  // shapesNumber: 23,
  // shapeRadius: 1500,
  // shapeProbability: 0.2,
  // shapeSizeMin: {x: 0.1, y: 0.5},
  // shapeSizeMax: {x: 0.3, y: 0.7},
  // shapesVertAmp: 0.5,
  // shapesStep: 0.001,
  size: {x: 4000, y: 1000},
  debug: false,
  shapeProbability: 0.77,
  shapesVertAmp: 0.67,
  shapeSizeMin: {x: 0.05, y: 0.5},
  shapeSizeMax: {x: 0.1, y: 2.8},
  shapesFreq: 0.3,
  shapesOverlap: 10,
  shapesDistribution: 1,
}

let pane = Pane(PARAMS)
pane.on('change', e => {
  updateSvg()
})
console.log('pane:', pane)

// const textInput = pane.addInput(PARAMS, 'seedString', {label: 'Слово'})
// textInput.element.querySelector('input').addEventListener('input', ev => {
//   PARAMS.seedString = ev.target.value
//   if (ev.target.value == 'password') {
//     revealSecretPane()
//   }
//   updateSvg()
// })

const textInput = pane
  .addInput(PARAMS, 'seedString', {label: 'Слово'})
  .on('change', ev => {
    PARAMS.seedString = ev.value
    console.log('ev.value:', ev.value)
    if (ev.value == 'password') {
      revealSecretPane()
    }
    updateSvg()
  })

function revealSecretPane() {
  pane.secretElements.forEach(el => {
    el.hidden = false
  })
}

// save button
pane.addButton({title: 'Save SVG'}).on('click', saveSVG)

function updateSvg() {
  setSeed(stringHash(PARAMS.seedString) + 2)
  // shape is made of polys
  let shapes = makeShapes(PARAMS)

  shapes = sliceShapes(PARAMS, shapes)
  shapes.forEach(shape => {
    console.log('shape:', shape.type)
  })

  let container = document.getElementById('container')
  container.innerHTML = ''
  let svg = makeSvg(PARAMS, shapes)
  container.appendChild(svg)
}
updateSvg()
