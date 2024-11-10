import {setSeed, stringHash, map, mod, splitmix32} from './helpers.js'
const svgNS = 'http://www.w3.org/2000/svg'
export async function makePanelSvg(PARAMS, STATE, svgInputElement) {
  const panelSvgWidth = PARAMS.panelWidthRounded * Math.sqrt(2)
  const panelSvgHeight = PARAMS.panelHeight

  // A prism is a 3d element the panel is made of
  // A prism consists of two stripes for each side
  const panelPrismWidthFrontalProjection = PARAMS.panelWidthRoundSize
  // Number of prisms
  const N = (PARAMS.panelWidthRounded / panelPrismWidthFrontalProjection) | 0

  // Fetch the SVG file
  if (!svgInputElement) {
    const response = await fetch('dodo.svg')
    const svgText = await response.text()
    const parser = new DOMParser()
    const svgDoc = parser.parseFromString(svgText, 'image/svg+xml')
    svgInputElement = svgDoc.documentElement
  }

  // Get the viewBox values
  const viewBox = svgInputElement.getAttribute('viewBox')
  const [minXOrig, minYOrig, widthOrig, heightOrig] = viewBox
    .split(' ')
    .map(Number)

  // Create a new SVG element
  const newSvg = document.createElementNS(svgNS, 'svg')
  newSvg.setAttribute('xmlns', svgNS)
  newSvg.setAttribute('viewBox', `${0} ${0} ${panelSvgWidth} ${panelSvgHeight}`)
  newSvg.setAttribute('width', panelSvgWidth)
  newSvg.setAttribute('height', panelSvgHeight)

  // Add a defs section
  const defs = document.createElementNS(svgNS, 'defs')
  newSvg.appendChild(defs)

  // Create N symbols, each with a different mask
  for (let i = 0; i < N; i++) {
    const g = document.createElementNS(svgNS, 'g')
    g.id = `dodo-segment-${i}`
    // g.setAttribute('viewBox', viewBox)

    const mask = document.createElementNS(svgNS, 'mask')
    mask.id = `mask-${i}`
    mask.style = 'mask-type:alpha'
    mask.setAttribute('maskUnits', 'userSpaceOnUse')
    mask.setAttribute('x', (i * panelSvgWidth) / N)
    mask.setAttribute('y', 0)
    mask.setAttribute('width', panelSvgWidth / N / 2)
    mask.setAttribute('height', panelSvgHeight)

    const maskRect = document.createElementNS(svgNS, 'rect')
    maskRect.setAttribute('x', (i * panelSvgWidth) / N)
    maskRect.setAttribute('y', 0)
    maskRect.setAttribute('width', panelSvgWidth / N / 2)
    maskRect.setAttribute('height', panelSvgHeight)
    maskRect.setAttribute('fill', 'white')
    mask.appendChild(maskRect)

    const useElementWrapper = document.createElementNS(svgNS, 'g')
    let scale = panelSvgHeight / heightOrig
    let offset = widthOrig * scale * PARAMS.panelOffset
    let maskLeftX = (i * panelSvgWidth) / N
    let maskRightX = maskLeftX + panelSvgWidth / N / 2

    // find mod
    let useLeftX = (i * panelSvgWidth) / N / 2 + offset
    useLeftX -= maskLeftX
    useLeftX = mod(useLeftX, widthOrig * scale) - widthOrig * scale
    useLeftX += maskLeftX
    let useRightX = useLeftX + widthOrig * scale

    let makeUseElement = (dx, id) => {
      const useElement = document.createElementNS(svgNS, 'use')
      useElement.setAttribute('href', '#dodo-original')
      useElement.setAttribute('id', 'use-' + id)
      useElement.setAttribute(
        'transform',
        `translate(${useLeftX - dx} 0) scale(${scale})`,
      )
      return useElement
    }

    useElementWrapper.appendChild(makeUseElement(0, 'center'))
    // FIXME походу модуль надо включить и может даже заработает. Может визуальный дебаг какой-нибудь выводить? Например, чтобы при наведении на прямоугольник показывалось его содержимое. Или
    if (useLeftX > maskLeftX) {
      // если в маске виден левый край
      useElementWrapper.appendChild(makeUseElement(widthOrig * scale, 'left'))
    } else if (useRightX < maskRightX) {
      // если в маске виден правый край
      useElementWrapper.appendChild(makeUseElement(-widthOrig * scale, 'right'))
      // console.log('NEVER HAPPENS')
    }

    g.appendChild(mask)
    useElementWrapper.setAttribute('mask', `url(#mask-${i})`)
    g.appendChild(useElementWrapper)

    newSvg.appendChild(g)
  }

  // Add the original SVG content as a symbol
  const originalSymbol = document.createElementNS(svgNS, 'symbol')
  originalSymbol.id = 'dodo-original'
  originalSymbol.setAttribute('viewBox', viewBox)
  originalSymbol.setAttribute('width', widthOrig)
  originalSymbol.setAttribute('height', heightOrig)
  originalSymbol.innerHTML = svgInputElement.innerHTML
  // console.log('svgInputElement:', svgInputElement.innerHTML)
  defs.appendChild(originalSymbol)

  // Create N use elements, each referencing a different segment
  // for (let i = 0; i < N; i++) {
  //   const use = document.createElementNS(svgNS, 'use')
  //   use.setAttribute('href', `#dodo-segment-${i}`)
  //   use.setAttribute('x', ((i * widthOrig) / N) * 2)
  //   use.setAttribute('width', widthOrig)
  //   use.setAttribute('height', heightOrig)
  //   newSvg.appendChild(use)
  // }

  setSeed(stringHash(PARAMS.seedString) + 2)
  let shiftRandom = splitmix32(100)
  for (let i = 0; i < N; i++) {
    const rect = document.createElementNS(svgNS, 'rect')
    rect.setAttribute('x', ((i + 0.5) * panelSvgWidth) / N)
    rect.setAttribute('width', panelSvgWidth / N / 2)
    rect.setAttribute('height', panelSvgHeight)
    let rectShapes = STATE.wallpaperShapes.filter(d => d.type == 'rect')
    // let index = map(i + 10 * shiftRandom() - 5, 0, N, 0, rectShapes.length) | 0
    // let index = map(i, 0, N, 0, rectShapes.length) | 0
    let index =
      map(i + N * 0.5 * shiftRandom() - N * 0.25, 0, N, 0, rectShapes.length) | 0
    if (index >= rectShapes.length) index = rectShapes.length - 1
    if (index < 0) index = 0
    let color = STATE.wallpaperShapes[index].fill
    rect.setAttribute('fill', color)
    newSvg.appendChild(rect)
  }

  return newSvg
}
