import {R} from './helpers.js'

export function makeRectangleComposition(PARAMS) {
  const {size, shapesNumber} = PARAMS
  const shapes = []
  let wMin = PARAMS.shapeSizeMin.x * size.x,
    wMax = PARAMS.shapeSizeMax.x * size.x
  console.log('wMin:', wMin)
  let hMin = PARAMS.shapeSizeMin.y * size.y,
    hMax = PARAMS.shapeSizeMax.y * size.y
  console.log('hMin:', hMin)
  ;[wMin, wMax] = [Math.min(wMin, wMax), Math.max(wMin, wMax)]
  ;[hMin, hMax] = [Math.min(hMin, hMax), Math.max(hMin, hMax)]
  console.log('hMax:', hMax)
  // const wMin = 2,
  //   wMax = 6
  // const hMin = 3,
  //   hMax = 8

  let ceil = (x, m) => {
    return Math.ceil(x / m) * m
  }

  for (let i = 0; i < shapesNumber; i++) {
    if (R() > PARAMS.shapeProbability) continue

    const step = PARAMS.shapesStep

    let w = Math.floor(wMin + (wMax - wMin) * R())
    let h = Math.floor(hMin + (hMax - hMin) * R())
    let centerX = (i / (shapesNumber - 1)) * size.x
    let centerY = (0.5 + (R() - 0.5) * PARAMS.shapesVertAmp) * size.y

    w = ceil(w, step)
    h = ceil(h, step)
    centerX = ceil(centerX - step / 2, step)
    centerY = ceil(centerY - step / 2, step)

    let x1 = centerX - w / 2
    let y1 = centerY - h / 2
    let x2 = centerX + w / 2
    let y2 = centerY + h / 2

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
