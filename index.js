import {Pane} from './pane.js'
import {makePanelSvg} from './makePanelSvg.js'
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
import {sliceWallpaperShape} from './sliceWallpaperShapes.js'
import {roundWallpaperShape} from './roundWallpaperShapes.js'
import {makePanel} from './makePanel.js'
import {makeRectangleComposition} from './makeRectangleComposition.js'
import {zoomAndPan} from './zoomAndPan.js'

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
  zoomSpeed: 0.05,
  seedString: 'Тамбов',
  colorsBgFg: '#FFFFFF, #EEEEEE',
  gradientsEnabled: true,
  scale: 12,
  sizeX: 6000,
  sizeXRounded: 6000,
  sizeY: 3000,
  shapesVertAmp: 0.07,

  perspectiveValueLeft: 1,
  perspectiveValueCenter: 1,
  perspectiveValueRight: 0.5,

  // back
  colorsBack: '#0096e0,#006db9,#03bb8f,#258682,#ced2d5,#b3b9bd,#9fa7ac',
  shapeBackSizeMin: {x: 0.5, y: 3},
  shapeBackSizeMax: {x: 0.5, y: 3},
  shapeBackSpaceMin: 0.1,
  shapeBackSpaceMax: 0.12,

  // middle
  colorsMiddle:
    '#f3fd36,#d6e036,#e81c34,#ff415e,#ed4897,#f283bf,#f6b8e2,#ff5602,#ff8147,#ffcc89',
  shapeMiddleSizeMin: {x: 0.3, y: 0.5},
  shapeMiddleSizeMax: {x: 0.2, y: 0.8},
  shapeMiddleSpaceMin: 0.1,
  shapeMiddleSpaceMax: 0.12,

  // front
  colorsFront: '#0096e0,#006db9,#03bb8f,#258682,#ced2d5,#b3b9bd,#9fa7ac',
  shapeFrontSizeMin: {x: 0.02, y: 3},
  shapeFrontSizeMax: {x: 0.05, y: 3},
  shapeFrontSpaceMin: 0.1,
  shapeFrontSpaceMax: 0.5,

  shapesRadius: 1000,
  shapesOverlap: 0.01,
  panelWidth: 2500,
  panelWidthRounded: 2500,
  panelHeight: 500,
  panelOffset: 0,
  panelWidthRoundSize: 50,
}

let pane = Pane(PARAMS, seedStringCallback)
pane.on('change', e => {
  if (e.presetKey == 'sizeX') {
    let roundSize = 30
    PARAMS.sizeXRounded =
      PARAMS.sizeX + roundSize / 2 - ((PARAMS.sizeX + roundSize / 2) % roundSize)
  }

  if (e.presetKey == 'panelWidth') {
    let roundSize = PARAMS.panelWidthRoundSize
    PARAMS.panelWidthRounded =
      PARAMS.panelWidth +
      roundSize / 2 -
      ((PARAMS.panelWidth + roundSize / 2) % roundSize)
  }

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

let resetStateTimeout
function seedStringCallback(ev) {
  PARAMS.seedString = ev.target.value

  // set delay before updating
  if (resetStateTimeout) {
    clearTimeout(resetStateTimeout)
  }
  resetStateTimeout = setTimeout(resetState, 1000)
}

// load svg
pane.addButton({title: 'Загрузить .svg для панно'}).on('click', () => {
  openFileDialog(fileLoadedCallback)
})

// save button
pane.addButton({title: 'Скачать обои и панно'}).on('click', () => {
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
  // svg.setAttribute('width', PARAMS.sizeXRounded)
  // svg.setAttribute('height', PARAMS.sizeY)
  // container.appendChild(svg)
}

async function updatePanelSvg() {
  let container = document.getElementById('panel')
  let svg = await makePanelSvg(PARAMS, STATE, svgInputElement)
  container.innerHTML = ''
  container.appendChild(svg)
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
    shape = sliceWallpaperShape(PARAMS, shape)
    shape = roundWallpaperShape(PARAMS, shape)
    STATE.wallpaperShapesSliced.push(shape)
  } else {
    // slicing is done, make the panel
    updatePanelSvg()
    STATE.isDone = true

    // update svg in the end
    let container = document.getElementById('wallpaper')
    container.innerHTML = ''
    let svg = makeSvg(PARAMS, STATE.wallpaperShapesSliced)
    svg.setAttribute('width', PARAMS.sizeXRounded)
    svg.setAttribute('height', PARAMS.sizeY)
    container.appendChild(svg)
  }
}

function frame() {
  requestAnimationFrame(frame)
  updateSvgsProgressively()
}
frame()
