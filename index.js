import {Pane} from './pane.js'
import {sliceWallpaperShapes} from './sliceWallpaperShapes.js'
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
import {makePanel} from './makePanel.js'
import {makeRectangleComposition} from './makeRectangleComposition.js'
import {zoomAndPan} from './zoomAndPan.js'
zoomAndPan('#workspace-wrapper', '#workspace', {scale: 0.4})

let svgInputElement
let wallpaperShapes

let PARAMS = {
  debug: false,
  seedString: 'Dodo',
  colors:
    '#03BB8F,#07939B,#252525,#3E1D15,#810F00,#909DC5,#D04102,#D0D6EF,#D8E302,#EFE0D9,#F283AD,#F9E7CE,#FE1F00,#FF6D03,#FF9A00,#FFB07F',
  gradient1: '#F6ECEC',
  gradient2: '#CCD8E4',
  gradientsEnabled: true,
  scale: 8,
  sizeX: 2000,
  sizeY: 1000,
  shapeProbability: 0.7,
  shapesVertAmp: 0.37,
  shapeSizeMin: {x: 0.05, y: 0.3},
  shapeSizeMax: {x: 0.25, y: 3},
  shapesRadius: 100,
  shapesFreq: 2.9,
  shapesOverlap: 0,
  shapesDistribution: 1,
  panelWidth: 1000,
  panelHeight: 500,
  panelOffset: -0.04,
}

let pane = Pane(PARAMS)
pane.on('change', e => {
  // console.log('e:', e)
  if (e.presetKey == 'seedString') {
    PARAMS.seedString = e.value
    if (e.value == 'password') {
      revealSecretPane()
    }
    updateWallpaperSvg()
    updatePanelSvg()
  } else if (e.presetKey == 'colors') {
    updateWallpaperSvg()
    updatePanelSvg()
  } else if (e.presetKey.includes('panel')) {
    updatePanelSvg()
  } else {
    updateWallpaperSvg()
    updatePanelSvg() // panel needs to update colors as well
  }
})

// const textInput = pane.addInput(PARAMS, 'seedString', {label: 'Слово'})
// textInput.element.querySelector('input').addEventListener('input', ev => {
//   PARAMS.seedString = ev.target.value
//   if (ev.target.value == 'password') {
//     revealSecretPane()
//   }
//   updateWallpaperSvg()
// })

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
pane.addButton({title: 'Save wallpaper'}).on('click', () => {
  saveSVG('#wallpaper svg', 'wallpaper.svg')
})
pane.addButton({title: 'Save panel'}).on('click', () => {
  saveSVG('#panel svg', 'panel.svg')
})

function updateWallpaperSvg() {
  setSeed(stringHash(PARAMS.seedString) + 2)
  // shape is made of polys

  let rectangleComposition = makeRectangleComposition(PARAMS)
  // used for panel generation
  wallpaperShapes = makeWallpaperShapes(PARAMS, rectangleComposition)
  console.log('rectangleComposition:', rectangleComposition)
  console.log('wallpaperShapes:', wallpaperShapes[0])

  wallpaperShapes = sliceWallpaperShapes(PARAMS, wallpaperShapes)

  let container = document.getElementById('wallpaper')
  container.innerHTML = ''
  let svg = makeSvg(PARAMS, wallpaperShapes)
  svg.setAttribute('width', PARAMS.sizeX)
  svg.setAttribute('height', PARAMS.sizeY)
  container.appendChild(svg)
}

async function updatePanelSvg() {
  let container = document.getElementById('panel')
  container.innerHTML = ''
  let rectangleComposition = makeRectangleComposition(PARAMS) // FIXME reuse one from wallpaper
  let svg = await makePanelSvg(PARAMS, rectangleComposition)
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
  const svgNS = 'http://www.w3.org/2000/svg'
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
    console.log('wallpaperShapes:', wallpaperShapes)
    let index =
      map(i, 0, N, 0, wallpaperShapes.filter(d => d.type == 'rect').length) | 0
    console.log('index:', index)
    let color = wallpaperShapes[index].fill
    console.log('color:', color)
    rect.setAttribute('fill', color)
    newSvg.appendChild(rect)
  }

  return newSvg
}

updateWallpaperSvg()
updatePanelSvg()

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
