const roundSize = 5 // 1 cm
export function roundWallpaperShapes(PARAMS, shapes) {
  let newShapes = []
  shapes.forEach(shape => {
    let newShape = roundWallpaperShape(PARAMS, shape)
    newShapes.push(newShape)
  })
  return newShapes
}

export function roundWallpaperShape(PARAMS, shape) {
  // return shape
  let newShape = {
    type: shape.type,
    fill: shape.fill,
    polys: [],
  }

  let newPolys = []
  shape.polys.forEach(poly => {
    let newPoly = []
    poly.forEach(point => {
      let [x, y] = point
      x += roundSize / 2
      x -= x % roundSize
      x -= roundSize / 2
      newPoly.push([x, y])
    })
    newPolys.push(newPoly)
  })

  newShape.polys = newPolys
  return newShape
}
