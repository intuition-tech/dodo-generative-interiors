import {Pane} from './pane.js'
import {sliceWallpaperShapes} from './sliceWallpaperShapes.js'
import {
  saveSVG,
  setSeed,
  stringHash,
  parseColors,
  R,
  makeColorsSequence,
} from './helpers.js'
import {makeSvg} from './makeSvg.js'
import {makeWallpaperShapes} from './makeWallpaperShapes.js'
import {makePano} from './makePano.js'
import {makeRectangleComposition} from './makeRectangleComposition.js'

let colorsSequence = []

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
  updateWallpaperSvg()
})
console.log('pane:', pane)

// const textInput = pane.addInput(PARAMS, 'seedString', {label: 'Слово'})
// textInput.element.querySelector('input').addEventListener('input', ev => {
//   PARAMS.seedString = ev.target.value
//   if (ev.target.value == 'password') {
//     revealSecretPane()
//   }
//   updateWallpaperSvg()
// })

const textInput = pane
  .addInput(PARAMS, 'seedString', {label: 'Слово'})
  .on('change', ev => {
    PARAMS.seedString = ev.value
    console.log('ev.value:', ev.value)
    if (ev.value == 'password') {
      revealSecretPane()
    }
    updateWallpaperSvg()
  })

function revealSecretPane() {
  pane.secretElements.forEach(el => {
    el.hidden = false
  })
}

// save button
pane.addButton({title: 'Save SVG'}).on('click', saveSVG)

function updateWallpaperSvg() {
  setSeed(stringHash(PARAMS.seedString) + 2)
  // shape is made of polys

  let rectangleComposition = makeRectangleComposition(PARAMS)
  let wallpaperShapes = makeWallpaperShapes(PARAMS, rectangleComposition)

  wallpaperShapes = sliceWallpaperShapes(PARAMS, wallpaperShapes)

  let container = document.getElementById('wallpaper')
  container.innerHTML = ''
  let svg = makeSvg(PARAMS, wallpaperShapes)
  container.appendChild(svg)
}

async function updatePanoSvg() {
  let container = document.getElementById('pano')
  container.innerHTML = ''
  let rectangleComposition = makeRectangleComposition(PARAMS) // FIXME reuse one from wallpaper
  let svg = await makePanoSvg(PARAMS, rectangleComposition)
  container.appendChild(svg)
}

async function makePanoSvg(PARAMS, rectangleComposition) {
  // Fetch the SVG file
  const response = await fetch('dodo.svg')
  const svgText = await response.text()

  // Parse the SVG
  const parser = new DOMParser()
  const svgDoc = parser.parseFromString(svgText, 'image/svg+xml')
  const svgElement = svgDoc.documentElement

  // Get the viewBox values
  const viewBox = svgElement.getAttribute('viewBox')
  const [, , width, height] = viewBox.split(' ').map(Number)

  // Create a new SVG element
  const newSvg = document.createElementNS('http://www.w3.org/2000/svg', 'svg')

  newSvg.setAttribute('xmlns', 'http://www.w3.org/2000/svg')
  newSvg.setAttribute('viewBox', `0 0 ${width * 3} ${height}`)

  // Add a defs section with the original SVG content
  const defs = document.createElementNS('http://www.w3.org/2000/svg', 'defs')
  const symbol = document.createElementNS('http://www.w3.org/2000/svg', 'symbol')
  symbol.id = 'dodo'
  symbol.setAttribute('viewBox', viewBox)
  symbol.innerHTML = svgElement.innerHTML
  defs.appendChild(symbol)
  newSvg.appendChild(defs)

  // Create three use elements
  for (let i = 0; i < 1; i++) {
    const use = document.createElementNS('http://www.w3.org/2000/svg', 'use')
    use.setAttribute('href', '#dodo')
    use.setAttribute('x', i * width)
    newSvg.appendChild(use)
  }

  return newSvg
}

updatePanoSvg()
updateWallpaperSvg()
