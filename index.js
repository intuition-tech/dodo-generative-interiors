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
  seedString: 'DODO12',
  colors:
    '#0096F4; #028688; #03BB8F; #40976A; #62B58B; #88BFEB; #B2C400; #B3B9BD; #B4D9E1; #D55792; #DBE036; #DEA6F9;',
  colorsFav:
    '#75191A; #8C2E03; #964101; #A5000F; #B25340; #D04102; #D0681F; #E81C34; #E94C09; #EF549D; #F283AD; #F69FD5; #FE7801; #FF5602; #FF6201; #FF8147; #FF9A00; #FFCC89;',
  colorsBgFg: '#D0E4FF; #ECEDAC; #EFE0D9; #EFE7E7; #F9E7CE; #FFF8F1;',

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
  panelWidth: 2500,
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
  let svg = await makePanelSvg(PARAMS, STATE, svgInputElement)
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
    let shapeSliced = sliceWallpaperShape(PARAMS, shape)
    STATE.wallpaperShapesSliced.push(shapeSliced)
  } else {
    updatePanelSvg()
    STATE.isDone = true

    // update svg in the end
    let container = document.getElementById('wallpaper')
    container.innerHTML = ''
    let svg = makeSvg(PARAMS, STATE.wallpaperShapesSliced)
    svg.setAttribute('width', PARAMS.sizeX)
    svg.setAttribute('height', PARAMS.sizeY)
    container.appendChild(svg)
  }
}

function frame() {
  requestAnimationFrame(frame)
  updateSvgsProgressively()
}
frame()
