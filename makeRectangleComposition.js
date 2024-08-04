import {R} from './helpers.js'

export function makeRectangleComposition(PARAMS) {
  const {size, shapesNumber} = PARAMS
  const shapes = []
  let wMin = PARAMS.shapeSizeMin.x * size.x,
    wMax = PARAMS.shapeSizeMax.x * size.x
  let hMin = PARAMS.shapeSizeMin.y * size.y,
    hMax = PARAMS.shapeSizeMax.y * size.y
  ;[wMin, wMax] = [Math.min(wMin, wMax), Math.max(wMin, wMax)]
  ;[hMin, hMax] = [Math.min(hMin, hMax), Math.max(hMin, hMax)]
  // const wMin = 2,
  //   wMax = 6
  // const hMin = 3,
  //   hMax = 8

  for (let i = 0; i < shapesNumber; i++) {
    if (R() > PARAMS.shapeProbability) continue

    debugger
    const w = Math.floor(wMin + (wMax - wMin) * R())
    const h = Math.floor(hMin + (hMax - hMin) * R())
    const centerX = ((i + 0.5) / shapesNumber) * size.x
    const centerY = (0.5 + (R() - 0.5) * PARAMS.shapesVertAmp) * size.y

    const x1 = centerX - w / 2
    const y1 = centerY - h / 2
    const x2 = centerX + w / 2
    const y2 = centerY + h / 2

    let poly = [
      [x1, y1],
      [x1, y2],
      [x2, y2],
      [x2, y1],
    ]
    let shape = [poly]
    shapes.push(shape)
  }
  console.log('shapes:', shapes)

  return shapes
}
