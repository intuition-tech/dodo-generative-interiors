import {R, stringHash} from './helpers.js'
import {chaikinSmooth} from './chaikinSmooth.js'

let grid = []
const N = 30
const M = 16
const cellSize = 10
const wMin = 2,
  wMax = 6
const hMin = 3, //8,
  hMax = 8 //15
let shapes = []
let width, height
let floor = x => Math.floor(x)
let ceil = x => Math.ceil(x)

let colors = [
  '#CC4817',
  '#D6DB0D',
  '#CA97E4',
  '#F29F2B',
  '#F29F2B',
  '#CA97E4',
  '#D71D01',
  '#F47401',
  '#E31C33',
]

export function makeRectangleComposition(PARAMS) {
  width = PARAMS.size.x
  height = PARAMS.size.y
  console.log('shapes rombus:', shapes)
  shapes = []
  initializeGrid()
  drawRectangles(PARAMS)
  console.log('shapes:', shapes)
  return shapes
}

function draw() {
  background(220)
  drawGrid()
  drawBlackAndWhiteVersion()
  drawVerticalDistribution()
  drawHorizontalDistribution()
  fill(0)
  text('filled/total: ' + calculateProportion().toFixed(2), 320, 20)
}

function initializeGrid() {
  for (let i = 0; i < M; i++) {
    grid[i] = []
    for (let j = 0; j < N; j++) {
      grid[i][j] = -1
    }
  }
}

function gridXYToSVGXY(PARAMS, [x, y]) {
  return [(x / N) * PARAMS.size.x, (y / M) * PARAMS.size.y]
}

function drawRectangles(PARAMS) {
  let prevColor = -1
  for (let r = 0; r < PARAMS.shapesNumber; r++) {
    if (R() < 0.2) continue
    const w = floor(wMin + (wMax + 1 - wMin) * R())
    const h = floor(hMin + (hMax + 1 - hMin) * R())
    const centerX = floor(((r + 0.5) / PARAMS.shapesNumber) * N)
    const centerY = floor(M / 2 - M / 4 + (M / 2 + M / 4 - (M / 2 - M / 4)) * R())
    shapes.push([
      [
        gridXYToSVGXY(PARAMS, [centerX - w / 2, centerY - h / 2]),
        gridXYToSVGXY(PARAMS, [centerX - w / 2, centerY + h / 2]),
        gridXYToSVGXY(PARAMS, [centerX + w / 2, centerY + h / 2]),
        gridXYToSVGXY(PARAMS, [centerX + w / 2, centerY - h / 2]),
      ],
    ])

    let color
    // do {
    color = floor(R() * colors.length)
    // } while (color == prevColor)

    for (let i = centerY - floor(h / 2); i < centerY + ceil(h / 2); i++) {
      for (let j = centerX - floor(w / 2); j < centerX + ceil(w / 2); j++) {
        if (i >= 0 && i < M && j >= 0 && j < N) {
          grid[i][j] = color
        }
      }
    }
    prevColor = color
  }
}

function drawGrid() {
  for (let i = 0; i < M; i++) {
    for (let j = 0; j < N; j++) {
      if (grid[i][j] === -1) {
        fill(255)
      } else {
        colorMode(HSB)
        fill(colors[grid[i][j]])
        colorMode(RGB)
      }
      rect(j * cellSize, i * cellSize, cellSize, cellSize)
    }
  }
}

function drawBlackAndWhiteVersion() {
  push()
  translate(0, (M + 2) * cellSize)
  for (let i = 0; i < M; i++) {
    for (let j = 0; j < N; j++) {
      fill(grid[i][j] === -1 ? 255 : 0)
      rect(j * cellSize, i * cellSize, cellSize, cellSize)
    }
  }
  pop()
}

function drawVerticalDistribution() {
  push()
  translate((N + 2) * cellSize, (M + 2) * cellSize)
  let distribution = calculateVerticalDistribution()
  let maxCount = max(distribution)
  for (let i = 0; i < M; i++) {
    let count = distribution[i]
    fill(0)
    rect(0, i * cellSize, map(count, 0, maxCount, 0, 100), cellSize)
  }
  let stats = calculateStats(distribution)
  textAlign(LEFT, TOP)
  text(
    `Mean: ${stats.mean.toFixed(2)}\nVariance: ${stats.variance.toFixed(2)}`,
    110,
    0,
  )
  pop()
}

function drawHorizontalDistribution() {
  push()
  translate(0, (2 * M + 4) * cellSize)
  let distribution = calculateHorizontalDistribution()
  let maxCount = max(distribution)
  for (let j = 0; j < N; j++) {
    let count = distribution[j]
    fill(0)
    rect(j * cellSize, 0, cellSize, map(count, 0, maxCount, 0, 100))
  }
  let stats = calculateStats(distribution)
  textAlign(LEFT, TOP)
  text(
    `Mean: ${stats.mean.toFixed(2)}\nVariance: ${stats.variance.toFixed(2)}`,
    0,
    110,
  )
  pop()
}

function calculateProportion() {
  let total = 0
  let filled = 0
  for (let i = 0; i < M; i++) {
    for (let j = 0; j < N; j++) {
      total++
      if (grid[i][j] !== -1) filled++
    }
  }
  return filled / total
}

function calculateVerticalDistribution() {
  let distribution = new Array(M).fill(0)
  for (let i = 0; i < M; i++) {
    for (let j = 0; j < N; j++) {
      if (grid[i][j] === -1) distribution[i]++
    }
  }
  return distribution
}

function calculateHorizontalDistribution() {
  let distribution = new Array(N).fill(0)
  for (let j = 0; j < N; j++) {
    for (let i = 0; i < M; i++) {
      if (grid[i][j] === -1) distribution[j]++
    }
  }
  return distribution
}

function calculateStats(arr) {
  let sum = arr.reduce((a, b) => a + b, 0)
  let mean = sum / arr.length
  let variance = arr.reduce((a, b) => a + Math.pow(b - mean, 2), 0) / arr.length
  return {mean, variance}
}
