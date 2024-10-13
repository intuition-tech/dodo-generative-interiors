import {intersect} from './intersect.js'
import {union} from './union.js'
const EPS = 0.000001
const stripeWidth = 30 // 3 cm
export function sliceWallpaperShapes(PARAMS, shapes) {
  console.time('wallpaper: makeRectangleComposition')
  let slicesNumber = Math.ceil(PARAMS.sizeX / stripeWidth) // 3 cm
  let w = PARAMS.sizeX
  let h = PARAMS.sizeY
  let sliceWidth = stripeWidth // 3 cm

  let newShapes = []
  shapes.forEach(shape => {
    console.log('shape.type:', shape.type)
    let newShape = {
      type: shape.type,
      fill: shape.fill,
      polys: [],
    }

    console.time('create')
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
    console.timeEnd('create')

    console.time('union')
    newShape.polys = union(newShape.polys)
    console.timeEnd('union')
    newShapes.push(newShape)
  })
  console.timeEnd('wallpaper: makeRectangleComposition')
  return newShapes
}
