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
pane.addButton({title: 'Save SVG'}).on('click', () => {
  saveSVG('#pano svg', 'pano.svg')
})

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
  const svgNS = 'http://www.w3.org/2000/svg'
  // Fetch the SVG file
  const response = await fetch('dodo.svg')
  const svgText = await response.text()

  // Parse the SVG
  const parser = new DOMParser()
  const svgDoc = parser.parseFromString(svgText, 'image/svg+xml')
  const svgElement = svgDoc.documentElement

  // Get the viewBox values
  const viewBox = svgElement.getAttribute('viewBox')
  const [minX, minY, width, height] = viewBox.split(' ').map(Number)

  // Number of segments
  const N = PARAMS.panoSegments || 20

  // Create a new SVG element
  const newSvg = document.createElementNS(svgNS, 'svg')
  newSvg.setAttribute('xmlns', svgNS)
  newSvg.setAttribute('viewBox', `${minX} ${minY} ${width * 2} ${height}`)

  // Add a defs section
  const defs = document.createElementNS(svgNS, 'defs')
  newSvg.appendChild(defs)

  // Create N symbols, each with a different mask
  for (let i = 0; i < N; i++) {
    const symbol = document.createElementNS(svgNS, 'symbol')
    symbol.id = `dodo-segment-${i}`
    symbol.setAttribute('viewBox', viewBox)

    const mask = document.createElementNS(svgNS, 'mask')
    mask.id = `mask-${i}`
    mask.style = 'mask-type:alpha'
    mask.setAttribute('maskUnits', 'userSpaceOnUse')
    mask.setAttribute('x', minX + (i * width) / N)
    mask.setAttribute('y', minY)
    mask.setAttribute('width', width / N)
    mask.setAttribute('height', height)

    const maskRect = document.createElementNS(svgNS, 'rect')
    maskRect.setAttribute('x', minX + (i * width) / N)
    maskRect.setAttribute('y', minY)
    maskRect.setAttribute('width', width / N)
    maskRect.setAttribute('height', height)
    maskRect.setAttribute('fill', 'white')

    mask.appendChild(maskRect)

    const useElement = document.createElementNS(svgNS, 'use')
    useElement.setAttribute('href', '#dodo-original')
    useElement.setAttribute('x', -(i * width) / N) // works O_o
    useElement.setAttribute('mask', `url(#mask-${i})`)

    symbol.appendChild(mask)
    symbol.appendChild(useElement)

    defs.appendChild(symbol)
  }

  // Add the original SVG content as a symbol
  const originalSymbol = document.createElementNS(svgNS, 'symbol')
  originalSymbol.id = 'dodo-original'
  originalSymbol.setAttribute('viewBox', viewBox)
  originalSymbol.innerHTML = svgElement.innerHTML
  defs.appendChild(originalSymbol)

  // Create N use elements, each referencing a different segment
  for (let i = 0; i < N; i++) {
    const use = document.createElementNS(svgNS, 'use')
    use.setAttribute('href', `#dodo-segment-${i}`)
    use.setAttribute('x', ((i * width) / N) * 2)
    use.setAttribute('width', width)
    use.setAttribute('height', height)
    newSvg.appendChild(use)
  }

  for (let i = 0; i < N; i++) {
    const rect = document.createElementNS(svgNS, 'rect')
    rect.setAttribute('x', (((i + 0.5) * width) / N) * 2)
    rect.setAttribute('width', width / N)
    rect.setAttribute('height', height)
    rect.setAttribute(
      'fill',
      `rgb(${Math.floor(Math.random() * 256)},${Math.floor(Math.random() * 256)},128)`,
    )
    newSvg.appendChild(rect)
  }

  return newSvg
}

updatePanoSvg()
updateWallpaperSvg()
