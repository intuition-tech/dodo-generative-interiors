import {R} from './helpers.js'

export function makeRectangleComposition(PARAMS) {
  const {size, shapesNumber} = PARAMS
  const shapes = []

  // Initialize parameters from PARAMS or use defaults
  const PROBABILITY = PARAMS.shapeProbability
  const OFFSET_Y_K = PARAMS.shapesVertAmp
  const MIN_WIDTH = PARAMS.shapeSizeMin.x
  const MAX_WIDTH_K = PARAMS.shapeSizeMax.x
  const MIN_HEIGHT_K = PARAMS.shapeSizeMin.y
  const MAX_HEIGHT_K = PARAMS.shapeSizeMax.y
  const FREQ = PARAMS.shapesFreq
  const OVERLAP_K = 1.2

  const offset = R() * Math.PI * 2 // Random offset for sine wave

  function getShapeHeight(x, minHeightK, maxHeightK, freq) {
    let n = Math.asin(Math.sin((x / 100) * freq + offset))
    let y = map(n, 0, Math.PI, size.y * minHeightK, size.y * maxHeightK)
    return Math.abs(y)
  }

  function map(x, in_min, in_max, out_min, out_max) {
    return ((x - in_min) * (out_max - out_min)) / (in_max - in_min) + out_min
  }

  let i = 0
  while (i < size.x) {
    let h = getShapeHeight(i, MIN_HEIGHT_K, MAX_HEIGHT_K, FREQ)
    let from = size.y * MIN_WIDTH
    let to = h * MAX_WIDTH_K
    let w = R() * (to - from) + from
    if (w < 1) w = 1

    let dh = h * OFFSET_Y_K
    console.log('OFFSET_Y_K:', OFFSET_Y_K)
    let offsetY = (R() * 2 - 1) * dh

    if (R() < PROBABILITY) {
      let y = size.y / 2 + offsetY
      console.log('offsetY:', offsetY)
      let x = i
      w *= OVERLAP_K // Apply overlap factor

      let poly = [
        [x, y - h / 2],
        [x, y + h / 2],
        [x + w, y + h / 2],
        [x + w, y - h / 2],
      ]
      let shape = [poly]
      shape.type = 'rect'
      shapes.push(shape)
    }
    i += w
  }

  // Shuffle the shapes array
  for (let i = shapes.length - 1; i > 0; i--) {
    const j = Math.floor(R() * (i + 1))
    ;[shapes[i], shapes[j]] = [shapes[j], shapes[i]]
  }

  return shapes
}
