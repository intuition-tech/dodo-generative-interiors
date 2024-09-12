import {R} from './helpers.js'

export function makeRectangleComposition(PARAMS) {
  const shapes = []

  // Initialize parameters from PARAMS or use defaults
  const PROBABILITY = PARAMS.shapeProbability
  const OFFSET_Y_K = PARAMS.shapesVertAmp
  const MIN_WIDTH_K = PARAMS.shapeSizeMin.x
  const MAX_WIDTH_K = PARAMS.shapeSizeMax.x
  const MIN_HEIGHT_K = PARAMS.shapeSizeMin.y
  const MAX_HEIGHT_K = PARAMS.shapeSizeMax.y
  const FREQ = PARAMS.shapesFreq
  const OVERLAP_K = PARAMS.shapesOverlap
  const sizeX = PARAMS.sizeX
  const sizeY = PARAMS.sizeY

  const offset = R() * Math.PI * 2 // Random offset for sine wave

  function getShapeHeight(x, minHeightK, maxHeightK, freq) {
    let n = Math.asin(Math.sin((x / 100) * freq + offset))
    n = (n + Math.PI / 2) / Math.PI
    // console.log('n:', n)
    n = n ** PARAMS.shapesDistribution
    let y = map(n, 0, 1, sizeY * minHeightK, sizeY * maxHeightK)
    return y
  }

  function map(x, in_min, in_max, out_min, out_max) {
    return ((x - in_min) / (in_max - in_min)) * (out_max - out_min) + out_min
  }

  let i = 0
  while (i < sizeX) {
    let h = getShapeHeight(i, MIN_HEIGHT_K, MAX_HEIGHT_K, FREQ)
    let minWidth = sizeY * MIN_WIDTH_K
    let maxWidth = h * MAX_WIDTH_K
    let r = R()
    r = r ** PARAMS.shapesDistribution
    let w = r * (maxWidth - minWidth) + minWidth
    if (w < 1) w = 1

    let dh = h * OFFSET_Y_K
    let offsetY = (R() * 2 - 1) * dh

    if (R() < PROBABILITY) {
      let y = sizeY / 2 + offsetY
      let x = i
      let wOverlap = w + OVERLAP_K // Apply overlap factor
      let poly = [
        [x + w / 2 - wOverlap / 2, y - h / 2],
        [x + w / 2 - wOverlap / 2, y + h / 2],
        [x + w / 2 + wOverlap / 2, y + h / 2],
        [x + w / 2 + wOverlap / 2, y - h / 2],
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
