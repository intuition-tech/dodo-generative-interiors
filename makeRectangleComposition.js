import {R, map} from './helpers.js'
import {parseColors} from './helpers.js'
import {splitmix32, stringHash} from './helpers.js'

function* genRect(groupSizes) {
  while (true) {
    let N = groupSizes[(R() * groupSizes.length) | 0]
    let bigId = (N * R()) | 0
    for (let i = 0; i < N; i++) {
      yield i == bigId ? 'big' : 'small'
    }
    yield 'none'
  }
}

// let debugFill = ''

export function makeRectangleComposition(PARAMS) {
  const shapes = []

  // let x = 0//{{{
  // let rectsInGroup = 0 // groups are separated with spaces
  // while (x < sizeX) {
  //   let h = getShapeHeight(x, MIN_HEIGHT_K, MAX_HEIGHT_K, FREQ)
  //   let minWidth = sizeY * MIN_WIDTH_K
  //   let maxWidth = h * MAX_WIDTH_K
  //   let r = R()
  //   r = r ** PARAMS.shapesDistribution
  //   let w = r * (maxWidth - minWidth) + minWidth
  //   if (w < 1) w = 1

  // let dh = h * OFFSET_Y_K
  // let offsetY = (R() * 2 - 1) * dh

  // if (R() < PROBABILITY) {
  //   let y = sizeY / 2 + offsetY
  //   let wOverlap = w + OVERLAP_K // Apply overlap factor
  //   let poly = [
  //     [x + w / 2 - wOverlap / 2, y - h / 2],
  //     [x + w / 2 - wOverlap / 2, y + h / 2],
  //     [x + w / 2 + wOverlap / 2, y + h / 2],
  //     [x + w / 2 + wOverlap / 2, y - h / 2],
  //   ]
  //   let shape.polys = [poly]
  //   shape.type = 'rect'
  //   shapes.push(shape)
  // }
  // x += w
  // }

  // Shuffle the shapes array
  // for (let i = shapes.length - 1; i > 0; i--) {
  //   const j = Math.floor(R() * (i + 1))
  //   ;[shapes[i], shapes[j]] = [shapes[j], shapes[i]]
  // }//}}}

  let colorRandom = splitmix32(stringHash(PARAMS.seedString) + 8)

  let paletteFront = parseColors(PARAMS.colorsFront)
  let paletteMiddle = parseColors(PARAMS.colorsMiddle)
  let paletteBack = parseColors(PARAMS.colorsBack)

  const OVERLAP_K = PARAMS.shapesOverlap
  const OFFSET_Y_K = PARAMS.shapesVertAmp

  // FIXME правильно панно раскрашивать. Брать все шейпы: фронт, бэк, мид, — и сортировать по координате

  fillLayerWithShapes(
    PARAMS,
    shapes,
    'rect',
    paletteBack,
    colorRandom,
    PARAMS.shapeBackSizeMin.x,
    PARAMS.shapeBackSizeMax.x,
    PARAMS.shapeBackSizeMin.y,
    PARAMS.shapeBackSizeMax.y,
    PARAMS.shapeBackSpaceMin,
    PARAMS.shapeBackSpaceMax,
    PARAMS.shapeBackTreshold,
    OVERLAP_K,
    OFFSET_Y_K,
    [1], // groupSizes
  )

  fillLayerWithShapes(
    PARAMS,
    shapes,
    'rect',
    paletteMiddle,
    colorRandom,
    PARAMS.shapeMiddleSizeMin.x,
    PARAMS.shapeMiddleSizeMax.x,
    PARAMS.shapeMiddleSizeMin.y,
    PARAMS.shapeMiddleSizeMax.y,
    PARAMS.shapeMiddleSpaceMin,
    PARAMS.shapeMiddleSpaceMax,
    PARAMS.shapeMiddleTreshold,
    OVERLAP_K,
    OFFSET_Y_K,
    [2, 3], // groupSizes
  )

  fillLayerWithShapes(
    PARAMS,
    shapes,
    'rect',
    paletteFront,
    colorRandom,
    PARAMS.shapeFrontSizeMin.x,
    PARAMS.shapeFrontSizeMax.x,
    PARAMS.shapeFrontSizeMin.y,
    PARAMS.shapeFrontSizeMax.y,
    PARAMS.shapeFrontSpaceMin,
    PARAMS.shapeFrontSpaceMax,
    PARAMS.shapeFrontTreshold,
    OVERLAP_K,
    OFFSET_Y_K,
    [1], // groupSizes
  )

  return shapes
}

// gets a value between 0 and 1
// koeff is between 0 and 1 and usef for shapes scaling
function getPerspectiveValue(PARAMS, x) {
  x = Math.min(Math.max(x, 0), 1)

  if (x <= 0.5) {
    // Interpolate between left and center
    return map(
      x,
      0,
      0.5,
      PARAMS.perspectiveValueLeft,
      PARAMS.perspectiveValueCenter,
    )
  } else {
    // Interpolate between center and right
    return map(
      x,
      0.5,
      1,
      PARAMS.perspectiveValueCenter,
      PARAMS.perspectiveValueRight,
    )
  }
}

function fillLayerWithShapes(
  PARAMS,
  shapes,
  shapeType,
  palette,
  colorRandom,
  MIN_WIDTH_K,
  MAX_WIDTH_K,
  MIN_HEIGHT_K,
  MAX_HEIGHT_K,
  SPACE_MIN_K,
  SPACE_MAX_K,
  TRESHOLD,
  OVERLAP_K,
  OFFSET_Y_K,
  groupSizes,
) {
  const sizeX = PARAMS.sizeXRounded
  const sizeY = PARAMS.sizeY
  let genRectIterator = genRect(groupSizes)
  // FIXME set a proper left margin
  for (let x = -1 * sizeY; ; ) {
    let shape = {}
    let bigOrSmall = genRectIterator.next().value
    if (bigOrSmall === 'none') {
      let spaceWidth = map(R(), 0, 1, SPACE_MIN_K, SPACE_MAX_K) * sizeY
      x += spaceWidth
      continue
    }
    let [w, h] = getRectWH()
    let progress = (x + w / 2) / sizeX // ~ [0, 1]
    let scale = getPerspectiveValue(PARAMS, progress)
    w *= scale
    h *= scale
    if (x > sizeX) {
      break
    }
    if (scale > TRESHOLD) {
      let overlap = OVERLAP_K * sizeY // Apply overlap factor
      let dh = sizeY * OFFSET_Y_K * scale
      let offsetY = (R() * 2 - 1) * dh
      let y = sizeY / 2 - h / 2 + offsetY

      let poly = [
        [x - overlap, y],
        [x + overlap + w, y],
        [x + overlap + w, y + h],
        [x - overlap, y + h],
      ]
      shape = [poly]
      shape.type = shapeType

      shape.fill = palette[(colorRandom() * palette.length) | 0]

      shapes.push(shape)
    }

    if (w < 10) w = 10 // prevent too small steps
    x += w
  }

  function getRectWH() {
    let w, h
    w = map(R(), 0, 1, MIN_WIDTH_K, MAX_WIDTH_K) * sizeY
    h = map(R(), 0, 1, MIN_HEIGHT_K, MAX_HEIGHT_K) * sizeY
    return [w, h]
  }
}
