import {chaikinSmooth} from './chaikinSmooth.js'
import {R, stringHash, mod, shuffleArray} from './helpers.js'
import {makeRectangleComposition} from './makeRectangleComposition.js'

export function makeShapes(PARAMS) {
  let w = PARAMS.size.x
  let h = PARAMS.size.y

  let shapes = makeRectangleComposition(PARAMS)

  shapes = shuffleArray(shapes)

  shapes = shapes.map(shape => {
    return shape.map(poly => {
      poly = tiltRect(poly)
      poly = subdivide3(poly)
      poly = chaikinSmooth(poly, 4)
      return poly
    })
  })

  return shapes
}

function tiltRect(poly) {
  console.log('poly:', poly)
  // expect poly is a rectangle
  let bb = getBoundingRect(poly)
  let width = bb[2] - bb[0]
  let height = bb[3] - bb[1]
  let cx = bb[0] + width / 2
  let cy = bb[1] + height / 2
  let tiltKoeff = 0.25
  let tiltT = ((R() * 6 - 3) | 0) * tiltKoeff
  let tiltB = ((R() * 6 - 3) | 0) * tiltKoeff
  let pLT = [cx - width / 2, cy - height / 2]
  let pRT = [cx + width / 2, cy - height / 2]
  let pLB = [cx - width / 2, cy + height / 2]
  let pRB = [cx + width / 2, cy + height / 2]
  pLT[1] -= (tiltT * width) / 2
  pRT[1] += (tiltT * width) / 2
  pLB[1] -= (tiltB * width) / 2
  pRB[1] += (tiltB * width) / 2
  let newPoly = [pLT, pRT, pRB, pLB]
  console.log('newPoly:', newPoly)
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

function subdivide3(poly, cornerRadius = 800) {
  let newPoly = []
  // make radius fit the smallest segment
  for (let i = 0; i < poly.length; i++) {
    let id1 = i
    let id2 = (i + 1) % poly.length
    let p1 = poly[id1]
    let p2 = poly[id2]
    let len = Math.hypot(p1[0] - p2[0], p1[1] - p2[1])
    if (cornerRadius * 2 > len) {
      cornerRadius = len / 2
    }
  }

  for (let i = 0; i < poly.length; i++) {
    let id1 = i
    let id2 = (i + 1) % poly.length
    let p1 = poly[id1]
    let p2 = poly[id2]

    let len = Math.hypot(p1[0] - p2[0], p1[1] - p2[1])
    // if (len < cornerRadius * 2) {
    // let k = 0.5
    // newPoly.push(p1)
    // newPoly.push([p1[0] * k + p2[0] * k, p1[1] * k + p2[1] * k])
    // } else {
    let k1 = cornerRadius / len
    let k2 = 1 - k1
    newPoly.push(p1)
    newPoly.push([p1[0] * k2 + p2[0] * k1, p1[1] * k2 + p2[1] * k1])
    newPoly.push([p1[0] * k1 + p2[0] * k2, p1[1] * k1 + p2[1] * k2])
    // }
  }
  return newPoly
}

function rombus(x, y, r) {
  let poly = []
  poly.push([x - r, y])
  poly.push([x, y + r])
  poly.push([x + r, y])
  poly.push([x, y - r])
  poly = chaikinSmooth(poly, 4)
  return poly
}
