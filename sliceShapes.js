import {intersect} from './intersect.js'
import {union} from './union.js'
const EPS = 0.000001
const stripeWidth = 30 // 3 cm
export function sliceShapes(PARAMS, shapes) {
  let slicesNumber = Math.ceil(PARAMS.size.x / stripeWidth) // 3 cm
  let w = PARAMS.size.x
  let h = PARAMS.size.y
  let sliceWidth = stripeWidth // 3 cm

  let newShapes = []
  shapes.forEach(shape => {
    let newShape = []
    newShape.type = shape.type
    shape.forEach(poly => {
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

        // intersect may return multiple polygons
        newShape.push(...intersect(newPoly, rectPoly))
      }
      newShape = union(newShape)
    })
    newShapes.push(newShape)
  })
  return newShapes
}
