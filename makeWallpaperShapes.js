import {chaikinSmooth} from './chaikinSmooth.js'
import {parseColors} from './helpers.js'
import {splitmix32, stringHash} from './helpers.js'

export function makeWallpaperShapes(PARAMS, rectangleComposition) {
  let colorRandom = splitmix32(stringHash(PARAMS.seedString) + 8)
  let tiltRandom = splitmix32(stringHash(PARAMS.seedString) + 10)
  let shapes = rectangleComposition.map((rect, i) => {
    let polys = rect.map(poly => {
      // two random numbers to set the tilt
      poly = tiltRect(poly, tiltRandom(), tiltRandom())
      poly = subdivide3(poly, PARAMS.shapesRadius)
      poly = chaikinSmooth(poly, 4)
      return poly
    })

    let palette = parseColors(PARAMS.colors)
    let color = palette[(colorRandom() * palette.length) | 0]
    if (i == 0) {
      console.log(color)
    }

    let shape = {
      type: rect.type,
      polys: polys,
      fill: color,
    }
    return shape
  })

  if (PARAMS.gradientsEnabled) {
    // shapes = addForegroundShapes(PARAMS, shapes) // FIXME
  }

  return shapes
}

function addForegroundShapes(PARAMS, shapes) {
  console.log('PARAMS:', PARAMS)
  let h = PARAMS.sizeY
  let number = Math.ceil(PARAMS.sizeX / 1000) + 1
  let period = PARAMS.sizeX / (number - 1)
  let grades = 8
  for (let w = period / grades; w < period; w += period / grades) {
    let shape = {}
    shape.type = 'foreground'
    shape.polys = []
    for (let i = 0; i < number; i++) {
      let cx = i * period
      let poly = [
        [cx - w / 2, 0],
        [cx + w / 2, 0],
        [cx + w / 2, h],
        [cx - w / 2, h],
      ]
      shape.polys.push(poly)
    }
    shapes.push(shape)
  }
  return shapes
}

function tiltRect(poly, r1, r2) {
  // expect poly is a rectangle
  let bb = getBoundingRect(poly)
  let width = bb[2] - bb[0]
  let height = bb[3] - bb[1]
  let cx = bb[0] + width / 2
  let cy = bb[1] + height / 2
  let tiltKoeff = 0.25
  let tiltT = ((r1 * 6 - 3) | 0) * tiltKoeff
  let tiltB = ((r2 * 6 - 3) | 0) * tiltKoeff
  let pLT = [cx - width / 2, cy - height / 2]
  let pRT = [cx + width / 2, cy - height / 2]
  let pLB = [cx - width / 2, cy + height / 2]
  let pRB = [cx + width / 2, cy + height / 2]
  pLT[1] -= (tiltT * width) / 2
  pRT[1] += (tiltT * width) / 2
  pLB[1] -= (tiltB * width) / 2
  pRB[1] += (tiltB * width) / 2
  let newPoly = [pLT, pRT, pRB, pLB]
  return newPoly
}

function getBoundingRect(poly) {
  let minX = Infinity
  let minY = Infinity
  let maxX = -Infinity
  let maxY = -Infinity
  poly.forEach(point => {
    minX = Math.min(minX, point[0])
    minY = Math.min(minY, point[1])
    maxX = Math.max(maxX, point[0])
    maxY = Math.max(maxY, point[1])
  })
  return [minX, minY, maxX, maxY]
}

function subdivide2(poly) {
  let newPoly = []
  for (let i = 0; i < poly.length - 1; i++) {
    let id1 = i
    let id2 = (i + 1) % poly.length
    let p1 = poly[id1]
    let p2 = poly[id2]
    let k = 0.5
    newPoly.push(p1)
    newPoly.push([p1[0] * k + p2[0] * (1 - k), p1[1] * k + p2[1] * (1 - k)])
  }
  newPoly.push(poly[poly.length - 1])
  return newPoly
}

// FIXME use radius
function subdivide3(poly, radius) {
  let newPoly = []

  for (let i = 0; i < poly.length; i++) {
    let prevIndex = (i - 1 + poly.length) % poly.length
    let currIndex = i
    let nextIndex = (i + 1) % poly.length
    let nextNextIndex = (i + 2) % poly.length

    let prevPoint = poly[prevIndex]
    let currPoint = poly[currIndex]
    let nextPoint = poly[nextIndex]
    let nextNextPoint = poly[nextNextIndex]

    let prevLen = Math.hypot(
      prevPoint[0] - currPoint[0],
      prevPoint[1] - currPoint[1],
    )
    let currLen = Math.hypot(
      currPoint[0] - nextPoint[0],
      currPoint[1] - nextPoint[1],
    )
    let nextLen = Math.hypot(
      nextPoint[0] - nextNextPoint[0],
      nextPoint[1] - nextNextPoint[1],
    )
    if (nextLen > radius) {
      nextLen = radius
    }
    if (prevLen > radius) {
      prevLen = radius
    }

    newPoly.push(currPoint)

    if (prevLen < currLen / 2) {
      let k = prevLen / currLen
      let midPoint = [
        currPoint[0] * (1 - k) + nextPoint[0] * k,
        currPoint[1] * (1 - k) + nextPoint[1] * k,
      ]
      newPoly.push(midPoint)
    }

    if (nextLen < currLen / 2) {
      let k = (currLen - nextLen) / currLen
      let midPoint = [
        currPoint[0] * (1 - k) + nextPoint[0] * k,
        currPoint[1] * (1 - k) + nextPoint[1] * k,
      ]
      newPoly.push(midPoint)
    }
  }

  return newPoly
}

// }
// }
// if (len < cornerRadius * 2) {
// let k = 0.5
// newPoly.push(p1)
// newPoly.push([p1[0] * k + p2[0] * k, p1[1] * k + p2[1] * k])
// } else {

function rombus(x, y, r) {
  let poly = []
  poly.push([x - r, y])
  poly.push([x, y + r])
  poly.push([x + r, y])
  poly.push([x, y - r])
  poly = chaikinSmooth(poly, 4)
  return poly
}
