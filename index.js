import {Pane} from './pane.js'
import {chaikinSmooth} from './chaikinSmooth.js'
import {sliceShapes} from './sliceShapes.js'
import {saveSVG, R, setSeed, stringHash} from './helpers.js'
import {makeSvg} from './makeSvg.js'
import {makeShapes} from './makeShapes.js'

let PARAMS = {
  debug: false,
  seedString: 'Dodo',
  colors:
    '#03BB8F,#07939B,#252525,#3E1D15,#810F00,#909DC5,#D04102,#D0D6EF,#D8E302,#EFE0D9,#F283AD,#F9E7CE,#FE1F00,#FF6D03,#FF9A00,#FFB07F',
  gradient1: '#F6ECEC',
  gradient2: '#CCD8E4',
  scale: 8, //4,
  sizeX: 3000,
  sizeY: 1000,
  shapeProbability: 0.7,
  shapesVertAmp: 0.37,
  shapeSizeMin: {x: 0.05, y: 0.3},
  shapeSizeMax: {x: 0.25, y: 3},
  shapesRadius: 100,
  shapesFreq: 2.9,
  shapesOverlap: 0,
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
  shapes.forEach(shape => {})

  let container = document.getElementById('container')
  container.innerHTML = ''
  let svg = makeSvg(PARAMS, shapes)
  container.appendChild(svg)
}
updateSvg()
