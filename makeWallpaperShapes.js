import {chaikinSmooth} from './chaikinSmooth.js'
import {parseColors} from './helpers.js'
import {splitmix32, stringHash} from './helpers.js'

export function makeWallpaperShapes(PARAMS, rectangleComposition) {
  let tiltRandom = splitmix32(stringHash(PARAMS.seedString) + 10)
  let shapes = rectangleComposition.map((rect, i) => {
    let polys = rect.map(poly => {
      // two random numbers to set the tilt
      poly = tiltRect(poly, tiltRandom(), tiltRandom())
      poly = subdivide3(poly, PARAMS.shapesRadius)
      poly = chaikinSmooth(poly, 4)
      return poly
    })

    let shape = {
      type: rect.type,
      polys: polys,
      fill: rect.fill,
    }
    return shape
  })

  if (PARAMS.gradientsEnabled) {
    shapes = addForegroundShapes(PARAMS, shapes)
  }

  return shapes
}

function addForegroundShapes(PARAMS, shapes) {
  let h = PARAMS.sizeY
  let number = Math.ceil(PARAMS.sizeX / 1000) + 1
  let period = PARAMS.sizeX / (number - 1)
  let grades = 40

  let colorRandom = splitmix32(stringHash(PARAMS.seedString) + 3343)
  let palette = parseColors(PARAMS.colorsBgFg)
  let grad1Index = (palette.length * colorRandom()) | 0
  let grad2Index =
    (grad1Index + 1 + (((palette.length - 1) * colorRandom()) | 0)) %
    palette.length
  let gradient1Fill = palette[grad1Index]
  let gradient2Fill = palette[grad2Index]

  for (let i = 0; i < grades; i++) {
    let w = (period / grades) * (grades - i)

    let mix = i / (grades - 1)
    let fill = interpolateColor(gradient1Fill, gradient2Fill, mix)

    let shape = {}
    shape.type = 'foreground'
    shape.fill = fill
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

// function findOpacity(currentOpacity, targetOpacity) {
// 	if (currentOpacity < 0 || currentOpacity > 1 || targetOpacity < 0 || targetOpacity > 1) {
// 		return null;
// 	}
// 	if (currentOpacity > targetOpacity) {
// 		return null;
// 	}
// 	return (targetOpacity - currentOpacity) / (1 - currentOpacity);
// }

function interpolateColor(color1, color2, fraction) {
  // Parse colors and ensure the fraction is within the range [0, 1]
  const f = Math.max(0, Math.min(1, fraction))
  const c1 = parseInt(color1.slice(1), 16)
  const c2 = parseInt(color2.slice(1), 16)

  // Extract RGB components of both colors
  const r1 = (c1 >> 16) & 0xff
  const g1 = (c1 >> 8) & 0xff
  const b1 = c1 & 0xff

  const r2 = (c2 >> 16) & 0xff
  const g2 = (c2 >> 8) & 0xff
  const b2 = c2 & 0xff

  // Interpolate each RGB component separately
  const r = Math.round(r1 + f * (r2 - r1))
  const g = Math.round(g1 + f * (g2 - g1))
  const b = Math.round(b1 + f * (b2 - b1))

  // Convert interpolated RGB values back to hex and return the result
  return `#${((r << 16) | (g << 8) | b).toString(16).padStart(6, '0')}`
}

function tiltRect(poly, r1, r2) {
  // expect poly is a rectangle
  let bb = getBoundingRect(poly)
  let width = bb[2] - bb[0]
  let height = bb[3] - bb[1]
  let cx = bb[0] + width / 2
  let cy = bb[1] + height / 2
  // let tiltKoeff = 0.25
  // let tiltT = ((r1 * 6 - 3) | 0) * tiltKoeff
  // let tiltB = ((r2 * 6 - 3) | 0) * tiltKoeff
  let tiltKoeff = 0.3
  let tiltT = (Math.round(r1 * 5 - 3) + 0.5) * tiltKoeff
  let tiltB = (Math.round(r2 * 5 - 3) + 0.5) * tiltKoeff
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
