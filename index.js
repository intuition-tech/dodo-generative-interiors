import {Pane} from './pane.js'
import {sliceWallpaperShapes} from './sliceWallpaperShapes.js'
import {saveSVG, setSeed, stringHash} from './helpers.js'
import {makeSvg} from './makeSvg.js'
import {makeWallpaperShapes} from './makeWallpaperShapes.js'
import {makePano} from './makePano.js'
import {makeRectangleComposition} from './makeRectangleComposition.js'

let PARAMS = {
  debug: false,
  seedString: 'Dodo',
  colors:
    '#03BB8F,#07939B,#252525,#3E1D15,#810F00,#909DC5,#D04102,#D0D6EF,#D8E302,#EFE0D9,#F283AD,#F9E7CE,#FE1F00,#FF6D03,#FF9A00,#FFB07F',
  gradient1: '#F6ECEC',
  gradient2: '#CCD8E4',
  gradientsEnabled: true,
  scale: 8,
  sizeX: 1000,
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

  let rectangleComposition = makeRectangleComposition(PARAMS)
  console.log('rectangleComposition:', rectangleComposition)
  let pano = makePano(PARAMS, rectangleComposition)
  let wallpaperShapes = makeWallpaperShapes(PARAMS, rectangleComposition)

  wallpaperShapes = sliceWallpaperShapes(PARAMS, wallpaperShapes)

  let container = document.getElementById('container')
  container.innerHTML = ''
  let svg = makeSvg(PARAMS, wallpaperShapes, pano)
  container.appendChild(svg)
}
updateSvg()
