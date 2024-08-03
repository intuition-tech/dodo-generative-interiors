import {round, mod, vmul, vadd} from './helpers.js'
import {saveSVG, R, setSeed, stringHash} from './helpers.js'

let svgNS = 'http://www.w3.org/2000/svg'

export function makeSvg(PARAMS, polys) {
  setSeed(stringHash(PARAMS.seedString))
  const svg = document.createElementNS(svgNS, 'svg')
  svg.setAttribute('xmlns', svgNS)
  let viewBox = [0, 0, 256, 256]
  svg.setAttribute(
    'viewBox',
    `${viewBox[0]} ${viewBox[1]} ${viewBox[2]} ${viewBox[3]}`,
  )

  // Clear existing SVG elements
  while (svg.firstChild) {
    svg.removeChild(svg.firstChild)
  }

  // bg
  const rect = document.createElementNS(svgNS, 'rect')
  rect.setAttribute('x', viewBox[0])
  rect.setAttribute('y', viewBox[1])
  rect.setAttribute('width', viewBox[2])
  rect.setAttribute('height', viewBox[3])
  rect.setAttribute('fill', 'ivory')
  rect.setAttribute('stroke', 'silver')
  rect.setAttribute('stroke-width', '30')
  svg.appendChild(rect)

  polys.forEach(poly => {
    let pathD = ``
    pathD += getPolyPathCurved(poly, PARAMS)
    console.log('pathD:', pathD)
    const path = document.createElementNS(svgNS, 'path')
    path.setAttribute('d', pathD)
    path.setAttribute('fill-rule', 'evenodd')
    path.setAttribute(
      'fill',
      `rgb(${(R() * 255) | 0}, ${(R() * 255) | 0}, ${(R() * 255) | 0})`,
    )
    svg.appendChild(path)
  })
  // const balls = drawBallsSVG(bouncyBalls, PARAMS)
  // svg.appendChild(balls)

  // if (PARAMS.isDebug) {
  //   polys.forEach(poly => {
  //     let points = drawPointsSVG(poly, PARAMS)
  //     svg.appendChild(points)
  //   })
  // }

  return svg
}

function drawBallsSVG(balls, PARAMS) {
  const group = document.createElementNS(svgNS, 'g')
  balls.forEach(ball => {
    const circle = document.createElementNS(svgNS, 'circle')
    circle.setAttribute('cx', ball.position.x)
    circle.setAttribute('cy', ball.position.y)
    circle.setAttribute('r', PARAMS.ballsRadius)
    circle.setAttribute('fill', PARAMS.ballsColor)
    group.appendChild(circle)
  })
  return group
}

function drawPathCurvedSVG(contour, PARAMS) {
  let path = document.createElementNS(svgNS, 'path')

  let d = getPolyPathCurved(contour, PARAMS)

  path.setAttribute('d', d)
  // fill rule
  path.setAttribute('fill-rule', 'evenodd')

  return path
}

export function drawPointsSVG(polylines, PARAMS) {
  let group = document.createElementNS(svgNS, 'g')
  let contour = polylines

  for (let i = 0; i < contour.length; i++) {
    let x = contour[i][0]
    let y = contour[i][1]

    let circle = document.createElementNS(svgNS, 'circle')
    circle.setAttribute('cx', x)
    circle.setAttribute('cy', y)
    let radius =
      (PARAMS.contourStepSize / 2) *
      PARAMS.letterScale *
      PARAMS.contourCircleScale
    circle.setAttribute('r', radius)

    group.appendChild(circle)
    group.setAttribute('stroke', 'red')
    group.setAttribute('fill', 'none')
    group.setAttribute('stroke-width', '5')
  }

  return group
}

export function getPolyPathCurved(c, PARAMS) {
  // outer square

  // let sq = `M 0 0 l 0 ${simulationHeight} l ${simulationWidth} 0 l 0 -${simulationHeight} l -${simulationWidth} 0 Z`
  let sq = ``
  let path = sq
  for (let i = 0; i < c.length; i++) {
    let i0 = mod(i, c.length)
    let p0 = c[i0]
    let i1 = mod(i + 1, c.length)
    let p1 = c[i1]
    let m01 = vmul(vadd(p0, p1), 0.5)
    let i2, p2
    if (i == 0) {
      path += `M ${round(m01[0])} ${round(m01[1])} `
    }

    i2 = mod(i + 2, c.length)
    p2 = c[i2]
    let k = 0.68 // 0 moves to m01, 1 moves to p1
    let h01 = vadd(vmul(m01, 1 - k), vmul(p1, k))
    let m12 = vmul(vadd(p1, p2), 0.5)
    let h12 = vadd(vmul(m12, 1 - k), vmul(p1, k))

    path += `C ${round(h01[0])} ${round(h01[1])} ${round(h12[0])} ${round(h12[1])} ${round(m12[0])} ${round(m12[1])} `
  }
  path += 'Z'
  return path
}
