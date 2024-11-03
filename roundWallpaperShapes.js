import {map} from './helpers.js'

const roundSize = 10 // 1 cm
export function roundWallpaperShapes(PARAMS, shapes) {
  let newShapes = []
  shapes.forEach(shape => {
    let newShape = roundWallpaperShape(PARAMS, shape)
    newShapes.push(newShape)
  })
  return newShapes
}

export function roundWallpaperShape(PARAMS, shape) {
  if (shape.type === 'foreground') return shape

  let newShape = {
    type: shape.type,
    fill: shape.fill,
    polys: [],
  }

  let newPolys = []
  shape.polys.forEach(poly => {
    // find the most left and the most right coords
    let minX = Infinity
    let maxX = -Infinity
    poly.forEach(point => {
      let [x, y] = point

      minX = Math.min(minX, x)
      maxX = Math.max(maxX, x)
    })

    if (minX === maxX) {
      console.log('minX === maxX')
      return
    }

    // round them to roundSize
    // use map() to lerp from left and right to rounded
    let minXround = minX + roundSize / 2 - (minX % roundSize) - roundSize / 2
    let maxXround = maxX - roundSize / 2 - (maxX % roundSize) + roundSize / 2

    let newPoly = []
    poly.forEach(point => {
      let [x, y] = point
      x = map(x, minX, maxX, minXround, maxXround)
      newPoly.push([x, y])
    })

    newPolys.push(newPoly)
  })

  newShape.polys = newPolys
  return newShape
}
