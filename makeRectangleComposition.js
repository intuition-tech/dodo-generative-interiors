import {R, map} from './helpers.js'
import {parseColors} from './helpers.js'
import {splitmix32, stringHash} from './helpers.js'

function* genRect() {
  while (true) {
    let N = R() < 0.5 ? 2 : 3
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
  let paletteSmall = parseColors(PARAMS.colorsSmall)
  let paletteBig = parseColors(PARAMS.colorsBig)

  // FIXME
  // Добавить функцию для определения перспективы
  // FIXME
  // Разделять: палитры, параметры прямоугольников, параметры пробелов, число штук в группе
  // FIXME сделать больше крутилок для каждого слоя. В принципе, это как большие и маленькие, только надо три группы теперь. Можно их сворачивать в аккордиончики
  fillLayerWithShapes(PARAMS, shapes, paletteBig, colorRandom)

  return shapes
}

// gets a value between 0 and 1
// koeff is between 0 and 1 and usef for shapes scaling
function getPerspectiveKoeff(x) {
  return x * 0.5 + 0.5
}

function fillLayerWithShapes(PARAMS, shapes, palette, colorRandom) {
  const SMALL_MIN_WIDTH_K = PARAMS.shapeSmallSizeMin.x
  const SMALL_MAX_WIDTH_K = PARAMS.shapeSmallSizeMax.x
  const SMALL_MIN_HEIGHT_K = PARAMS.shapeSmallSizeMin.y
  const SMALL_MAX_HEIGHT_K = PARAMS.shapeSmallSizeMax.y
  const BIG_MIN_WIDTH_K = PARAMS.shapeBigSizeMin.x
  const BIG_MAX_WIDTH_K = PARAMS.shapeBigSizeMax.x
  const BIG_MIN_HEIGHT_K = PARAMS.shapeBigSizeMin.y
  const BIG_MAX_HEIGHT_K = PARAMS.shapeBigSizeMax.y
  const SPACE_MIN_K = PARAMS.shapeSpaceMin
  const SPACE_MAX_K = PARAMS.shapeSpaceMax
  const OVERLAP_K = PARAMS.shapesOverlap
  const OFFSET_Y_K = PARAMS.shapesVertAmp
  const sizeX = PARAMS.sizeXRounded
  const sizeY = PARAMS.sizeY
  const FAV_COLOR_PERIOD_K = 1 // how many heights between fav colors
  let genRectIterator = genRect()
  // FIXME set a proper left margin
  for (let x = -1 * sizeY; ; ) {
    let shape = {}
    let bigOrSmall = genRectIterator.next().value
    // FIXME, remove big
    if (bigOrSmall === 'none') {
      let spaceWidth = map(R(), 0, 1, SPACE_MIN_K, SPACE_MAX_K) * sizeY
      x += spaceWidth
      continue
    }
    let [w, h] = getRectWH('small')
    if (x - w / 2 > sizeX) {
      break
    }
    let overlap = OVERLAP_K * sizeY // Apply overlap factor
    let dh = sizeY * OFFSET_Y_K
    let offsetY = (R() * 2 - 1) * dh
    let y = sizeY / 2 - h / 2 + offsetY

    let poly = [
      [x - overlap, y],
      [x + overlap + w, y],
      [x + overlap + w, y + h],
      [x - overlap, y + h],
    ]
    shape = [poly]
    shape.type = 'rect'

    shape.fill = palette[(colorRandom() * palette.length) | 0]

    shapes.push(shape)

    x += w
  }

  function getRectWH(bigOrSmall = 'small') {
    let w, h
    if (bigOrSmall === 'small') {
      w = map(R(), 0, 1, SMALL_MIN_WIDTH_K, SMALL_MAX_WIDTH_K) * sizeY
      h = map(R(), 0, 1, SMALL_MIN_HEIGHT_K, SMALL_MAX_HEIGHT_K) * sizeY
      // w = map(R(), 0, 1, 0.2, 0.2) * sizeY
      // h = map(R(), 0, 1, 0.2, 0.2) * sizeY
    } else {
      w = map(R(), 0, 1, BIG_MIN_WIDTH_K, BIG_MAX_WIDTH_K) * sizeY
      h = map(R(), 0, 1, BIG_MIN_HEIGHT_K, BIG_MAX_HEIGHT_K) * sizeY
      // w = map(R(), 0, 1, 0.2, 0.2) * sizeY
      // h = map(R(), 0, 1, 0.4, 0.4) * sizeY
    }

    return [w, h]
  }
}
