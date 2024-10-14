import {Pane} from './pane.js'
import {
  saveSVG,
  setSeed,
  stringHash,
  parseColors,
  splitmix32,
  map,
} from './helpers.js'
import {makeSvg} from './makeSvg.js'
import {makeWallpaperShapes} from './makeWallpaperShapes.js'
import {
  sliceWallpaperShapes,
  sliceWallpaperShape,
} from './sliceWallpaperShapes.js'
import {makePanel} from './makePanel.js'
import {makeRectangleComposition} from './makeRectangleComposition.js'
import {zoomAndPan} from './zoomAndPan.js'
const svgNS = 'http://www.w3.org/2000/svg'

let svgInputElement

// the object to store the data for continious rendering
// it is used to fill variables progressively. The most heavy procedure is slicing shapes
// therefore we make it one shape at a frame
let STATE
function resetState() {
  STATE = {}
  STATE.rectangleComposition = []
  STATE.wallpaperShapes = []
  STATE.wallpaperShapesSliced = []
  STATE.isDone = false
}
resetState()

let PARAMS = {
  debug: false,
  seedString: 'DODO',
  colors:
    '#03BB8F,#07939B,#252525,#3E1D15,#810F00,#909DC5,#D04102,#D0D6EF,#D8E302,#EFE0D9,#F283AD,#F9E7CE,#FFB07F,#FE1F00,#FF6D03,#FF9A00',
  colorsFav: `#FE1F00,#FF6D03,#FF9A00`,
  gradient1: '#F6ECEC',
  gradient2: '#CCD8E4',
  gradientsEnabled: true,
  scale: 8,
  sizeX: 6000,
  sizeY: 3000,
  shapesVertAmp: 0.37,
  shapeSmallSizeMin: {x: 0.1, y: 0.3},
  shapeSmallSizeMax: {x: 0.2, y: 0.6},
  shapeBigSizeMin: {x: 0.3, y: 1},
  shapeBigSizeMax: {x: 0.5, y: 1.5},
  shapeSpaceMin: 0.1,
  shapeSpaceMax: 0.3,
  shapesRadius: 200,
  shapesOverlap: 0.01,
  panelWidth: 1000,
  panelHeight: 500,
  panelOffset: -0.04,
  zoomSpeed: 0.05,
}

let pane = Pane(PARAMS, seedStringCallback)
pane.on('change', e => {
  if (e.presetKey.includes('panel')) {
    // update panel only
    STATE.isDone = false
  } else {
    // update everything
    resetState()
  }
})

let constantSizeElements = document.querySelectorAll('.title')
// constantSizeElements = []
zoomAndPan(PARAMS, '#workspace-wrapper', '#workspace', {
  scale: 0.2,
  constantSizeElements,
})

function seedStringCallback(ev) {
  PARAMS.seedString = ev.target.value
  console.log('ev.target.value:', ev.target.value)
  // update everything
  resetState()
  if (
    ev.target.value.toLowerCase() == 'pass' ||
    ev.target.value.toLowerCase() == 'password'
  ) {
    revealSecretPane()
  }
}

function revealSecretPane() {
  pane.secretElements.forEach(el => {
    el.hidden = false
  })
}

// load svg
pane.addButton({title: 'Load SVG'}).on('click', () => {
  openFileDialog(fileLoadedCallback)
})
// save button
pane.addButton({title: 'Save assets'}).on('click', () => {
  saveSVG(PARAMS)
})

function updateWallpaperSvg() {
  // setSeed(stringHash(PARAMS.seedString) + 2)
  // // shape is made of polys
  // let rectangleComposition = makeRectangleComposition(PARAMS)
  // // used for panel generation
  // wallpaperShapes = makeWallpaperShapes(PARAMS, rectangleComposition)
  // wallpaperShapes = sliceWallpaperShapes(PARAMS, wallpaperShapes)
  // let container = document.getElementById('wallpaper')
  // container.innerHTML = ''
  // let svg = makeSvg(PARAMS, wallpaperShapes)
  // svg.setAttribute('width', PARAMS.sizeX)
  // svg.setAttribute('height', PARAMS.sizeY)
  // container.appendChild(svg)
}

async function updatePanelSvg() {
  let container = document.getElementById('panel')
  container.innerHTML = ''
  let svg = await makePanelSvg(PARAMS, STATE.rectangleComposition)
  container.appendChild(svg)
}

async function makePanelSvg(PARAMS, rectangleComposition) {
  const panelSvgWidth = PARAMS.panelWidth * Math.sqrt(2)
  const panelSvgHeight = PARAMS.panelHeight

  // A prism is a 3d element the panel is made of
  // A prism consists of two stripes for each side
  const panelPrismWidthFrontalProjection = 50 // FIXME adjust
  // Number of prisms
  const N = (PARAMS.panelWidth / panelPrismWidthFrontalProjection) | 0

  // Fetch the SVG file
  if (!svgInputElement) {
    const response = await fetch('dodo.svg')
    const svgText = await response.text()
    const parser = new DOMParser()
    const svgDoc = parser.parseFromString(svgText, 'image/svg+xml')
    svgInputElement = svgDoc.documentElement
  }

  // Get the viewBox values
  const viewBox = svgInputElement.getAttribute('viewBox')
  const [minXOrig, minYOrig, widthOrig, heightOrig] = viewBox
    .split(' ')
    .map(Number)

  // Create a new SVG element
  const newSvg = document.createElementNS(svgNS, 'svg')
  newSvg.setAttribute('xmlns', svgNS)
  newSvg.setAttribute('viewBox', `${0} ${0} ${panelSvgWidth} ${panelSvgHeight}`)
  newSvg.setAttribute('width', panelSvgWidth)
  newSvg.setAttribute('height', panelSvgHeight)

  // Add a defs section
  const defs = document.createElementNS(svgNS, 'defs')
  newSvg.appendChild(defs)

  // Create N symbols, each with a different mask
  for (let i = 0; i < N; i++) {
    const symbol = document.createElementNS(svgNS, 'g')
    symbol.id = `dodo-segment-${i}`
    symbol.setAttribute('viewBox', viewBox)

    const mask = document.createElementNS(svgNS, 'mask')
    mask.id = `mask-${i}`
    mask.style = 'mask-type:alpha'
    mask.setAttribute('maskUnits', 'userSpaceOnUse')
    mask.setAttribute('x', (i * panelSvgWidth) / N)
    mask.setAttribute('y', 0)
    mask.setAttribute('width', panelSvgWidth / N / 2)
    mask.setAttribute('height', panelSvgHeight)

    const maskRect = document.createElementNS(svgNS, 'rect')
    maskRect.setAttribute('x', (i * panelSvgWidth) / N)
    maskRect.setAttribute('y', 0)
    maskRect.setAttribute('width', panelSvgWidth / N / 2)
    maskRect.setAttribute('height', panelSvgHeight)
    maskRect.setAttribute('fill', 'white')
    mask.appendChild(maskRect)

    const useElementWrapper = document.createElementNS(svgNS, 'g')
    const useElement = document.createElementNS(svgNS, 'use')
    useElement.setAttribute('href', '#dodo-original')
    let scale = panelSvgHeight / heightOrig
    const offset = widthOrig * scale * PARAMS.panelOffset
    useElement.setAttribute(
      'transform',
      `translate(${(i * panelSvgWidth) / N / 2 + offset} 0) scale(${scale})`,
    )
    useElementWrapper.setAttribute('mask', `url(#mask-${i})`)

    symbol.appendChild(mask)
    useElementWrapper.appendChild(useElement)
    symbol.appendChild(useElementWrapper)

    newSvg.appendChild(symbol)
  }

  // Add the original SVG content as a symbol
  const originalSymbol = document.createElementNS(svgNS, 'symbol')
  originalSymbol.id = 'dodo-original'
  // originalSymbol.setAttribute('viewBox', viewBox)
  originalSymbol.innerHTML = svgInputElement.innerHTML
  defs.appendChild(originalSymbol)

  // Create N use elements, each referencing a different segment
  // for (let i = 0; i < N; i++) {
  //   const use = document.createElementNS(svgNS, 'use')
  //   use.setAttribute('href', `#dodo-segment-${i}`)
  //   use.setAttribute('x', ((i * widthOrig) / N) * 2)
  //   use.setAttribute('width', widthOrig)
  //   use.setAttribute('height', heightOrig)
  //   newSvg.appendChild(use)
  // }

  setSeed(stringHash(PARAMS.seedString) + 2)
  for (let i = 0; i < N; i++) {
    const rect = document.createElementNS(svgNS, 'rect')
    rect.setAttribute('x', ((i + 0.5) * panelSvgWidth) / N)
    rect.setAttribute('width', panelSvgWidth / N / 2)
    rect.setAttribute('height', panelSvgHeight)
    let index =
      map(
        i,
        0,
        N,
        0,
        STATE.wallpaperShapes.filter(d => d.type == 'rect').length,
      ) | 0
    let color = STATE.wallpaperShapes[index].fill
    rect.setAttribute('fill', color)
    newSvg.appendChild(rect)
  }

  return newSvg
}

function openFileDialog() {
  const input = document.createElement('input')
  input.type = 'file'
  input.accept = '*/*'
  input.style.display = 'none'

  input.onchange = event => {
    const file = event.target.files[0]
    console.log('file:', file)
    if (file) {
      const reader = new FileReader()
      reader.readAsText(file)
      reader.onload = e => {
        const content = e.target.result
        const filetype = file.type
        fileLoadedCallback(content, filetype)
      }
    }
  }

  document.body.appendChild(input)
  input.click()
  console.log('input:', input)
  document.body.removeChild(input)
}

function fileLoadedCallback(content, filetype) {
  console.log('content:', content)
  if (filetype !== 'image/svg+xml') return
  let svgStr = content

  // make an svg element
  const parser = new DOMParser()
  const svgDoc = parser.parseFromString(svgStr, 'image/svg+xml')
  svgInputElement = svgDoc.documentElement

  updatePanelSvg()
}

function updateSvgsProgressively() {
  if (STATE.isDone) return
  if (STATE.rectangleComposition.length == 0) {
    // инициализация
    setSeed(stringHash(PARAMS.seedString) + 2)
    STATE.rectangleComposition = makeRectangleComposition(PARAMS)
    STATE.wallpaperShapes = makeWallpaperShapes(
      PARAMS,
      STATE.rectangleComposition,
    )
    STATE.wallpaperShapesSliced = []
  }

  // progressive slicing
  let shapesNum = STATE.wallpaperShapes.length
  let shapesSlicedNum = STATE.wallpaperShapesSliced.length
  if (shapesSlicedNum < shapesNum) {
    let shape = STATE.wallpaperShapes[shapesSlicedNum]
    let shapeSliced = sliceWallpaperShape(PARAMS, shape)
    STATE.wallpaperShapesSliced.push(shapeSliced)
  } else {
    updatePanelSvg()
    STATE.isDone = true
  }

  let container = document.getElementById('wallpaper')
  container.innerHTML = ''
  let svg = makeSvg(PARAMS, STATE.wallpaperShapesSliced)
  svg.setAttribute('width', PARAMS.sizeX)
  svg.setAttribute('height', PARAMS.sizeY)
  container.appendChild(svg)
}

function frame() {
  requestAnimationFrame(frame)
  updateSvgsProgressively()
}
frame()
