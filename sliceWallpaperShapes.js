import {intersect} from './intersect.js'
import {union} from './union.js'
const EPS = 0.000001
const stripeWidth = 60 // 6 cm
export function sliceWallpaperShapes(PARAMS, shapes) {
  let newShapes = []
  shapes.forEach(shape => {
    let newShape = sliceWallpaperShape(PARAMS, shape)
    newShapes.push(newShape)
  })
  return newShapes
}

export function sliceWallpaperShape(PARAMS, shape) {
  let slicesNumber = Math.ceil(PARAMS.sizeX / stripeWidth) // 3 cm
  let w = PARAMS.sizeX
  let h = PARAMS.sizeY
  let sliceWidth = stripeWidth // 3 cm

  let newShape = {
    type: shape.type,
    fill: shape.fill,
    polys: [],
  }

  shape.polys.forEach(poly => {
    for (let i = 0; i < slicesNumber; i++) {
      let rectPoly = []
      rectPoly.push([i * sliceWidth - EPS, 0])
      rectPoly.push([i * sliceWidth - EPS, h])
      rectPoly.push([(i + 1) * sliceWidth + EPS, h])
      rectPoly.push([(i + 1) * sliceWidth + EPS, 0])

      let newPoly = []
      poly.forEach(point => {
        let [x, y] = point

        let sliceCenterX = sliceWidth / 2 + i * sliceWidth
        x -= sliceCenterX
        x /= PARAMS.scale
        x += sliceCenterX
        newPoly.push([x, y])
      })

      // intersect may return several polys
      newShape.polys.push(...intersect(newPoly, rectPoly))
    }
  })

  newShape.polys = union(newShape.polys)
  return newShape
}
