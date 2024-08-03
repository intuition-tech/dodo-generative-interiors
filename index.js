import {getPolyPathCurved, drawPointsSVG} from './makeSvg.js'
import {Pane} from './pane.js'
import {saveSVG, R, setSeed} from './helpers.js'
import {makeSvg} from './makeSvg.js'

let PARAMS = {
  seedString: 'Dodo',
  text: 'Dodo',
  size: {x: 800, y: 800},
}

let pane = Pane(PARAMS)
pane.on('input', e => {
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
  let polys = [
    [
      [0, 0],
      [100, 0],
      [100, 100],
      [0, 100],
    ],
    [
      [50, 50],
      [150, 50],
      [150, 150],
      [50, 150],
    ],
  ]
  let container = document.getElementById('container')
  container.innerHTML = ''
  let svg = makeSvg(PARAMS, polys)
  container.appendChild(svg)
}
updateSvg()
