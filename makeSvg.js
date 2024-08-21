import {round, mod, vmul, vadd} from './helpers.js'
import {saveSVG, R, stringHash} from './helpers.js'
import {parseColors} from './helpers.js'

let svgNS = 'http://www.w3.org/2000/svg'

export function makeSvg(PARAMS, shapes) {
  const svg = document.createElementNS(svgNS, 'svg')
  svg.setAttribute('xmlns', svgNS)
  let viewBox = [0, 0, PARAMS.size.x, PARAMS.size.y]
  svg.setAttribute(
    'viewBox',
    `${viewBox[0]} ${viewBox[1]} ${viewBox[2]} ${viewBox[3]}`,
  )
  svg.setAttribute('width', PARAMS.size.x)
  svg.setAttribute('height', PARAMS.size.y)

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
  rect.setAttribute('fill', '#FDF9F8')
  svg.appendChild(rect)

  let colors = parseColors(PARAMS.colors)
  shapes.forEach(shape => {
    let polys = shape
    let fill = colors[(R() * colors.length) | 0]
    let pathD = ''
    polys.forEach(poly => {
      pathD += getPolyPath(poly, PARAMS)
      if (PARAMS.debug) svg.appendChild(drawPointsSVG(poly, PARAMS))
    })
    const path = document.createElementNS(svgNS, 'path')
    path.setAttribute('d', pathD)
    path.setAttribute('fill-rule', 'evenodd')
    // path.setAttribute('opacity', '0.5')
    path.setAttribute('fill', fill)
    if (PARAMS.debug) {
      path.setAttribute('fill', 'none')
      path.setAttribute('stroke', 'black')
    }
    svg.appendChild(path)
  })

  return svg
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
    let radius = 2
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

export function getPolyPath(c, PARAMS) {
  let sq = ``
  let path = sq
  for (let i = 0; i < c.length; i++) {
    let i0 = mod(i, c.length)
    let p0 = c[i0]
    let i1 = mod(i + 1, c.length)
    let p1 = c[i1]
    if (i0 == 0) {
      path += `M ${round(p0[0])} ${round(p0[1])} `
    } else {
      path += `L ${round(p0[0])} ${round(p0[1])} `
    }
  }
  path += 'Z'
  return path
}
