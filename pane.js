export function Pane(PARAMS, seedStringCallback) {
  const pane = new Tweakpane.Pane()
  pane.secretElements = []

  pane.addInput(PARAMS, 'zoomSpeed', {
    min: 0.0,
    max: 0.1,
    label: 'zoomSpeed',
  })

  let seedString = pane.addInput(PARAMS, 'seedString', {label: 'Слово'})
  seedString.element
    .querySelector('input')
    .addEventListener('input', seedStringCallback)

  // let debug = pane.addInput(PARAMS, 'debug', {label: 'Отладка'})
  // pane.secretElements.push(debug)

  let colorsSmall = pane.addInput(PARAMS, 'colorsSmall', {label: 'Цвета мелких'})

  pane.secretElements.push(colorsSmall)
  let colorsBig = pane.addInput(PARAMS, 'colorsBig', {
    label: 'Цвета больших',
  })
  pane.secretElements.push(colorsBig)
  let colorsBgFg = pane.addInput(PARAMS, 'colorsBgFg', {
    label: 'Фон и градиенты',
  })
  pane.secretElements.push(colorsBgFg)

  let wall = pane.addFolder({title: 'Обои'})

  // let gradient1 = wall.addInput(PARAMS, 'gradient1', {
  //   label: 'Градиент 1',
  // })
  // pane.secretElements.push(gradient1)
  // let gradient2 = wall.addInput(PARAMS, 'gradient2', {
  //   label: 'Градиент 2',
  // })
  // pane.secretElements.push(gradient2)

  let scale = wall.addInput(PARAMS, 'scale', {
    min: 1,
    max: 30,
    label: 'Сжатие',
  })
  pane.secretElements.push(scale)

  // pane.addInput(PARAMS, 'size', {
  //   x: {min: 1, max: 10000},
  //   y: {min: 1, max: 10000},
  //   label: 'Размер, мм',
  // })
  let sizeX = wall.addInput(PARAMS, 'sizeX', {
    min: 1,
    max: 20000,
    label: 'Ширина, мм',
  })
  let sizeY = wall.addInput(PARAMS, 'sizeY', {
    min: 1,
    max: 10000,
    label: 'Высота, мм',
  })

  let shapesFolder = wall.addFolder({title: 'Фигуры', expanded: true})
  pane.secretElements.push(shapesFolder)

  shapesFolder.addInput(PARAMS, 'shapesVertAmp', {
    min: 0,
    max: 1,
    step: 0.01,
    label: 'Вертикальная амплитуда',
  })
  shapesFolder.addInput(PARAMS, 'shapeSmallSizeMin', {
    x: {min: 0.01, max: 0.5},
    y: {min: 0, max: 5},
    label: 'Мин. размер мелких',
  })
  shapesFolder.addInput(PARAMS, 'shapeSmallSizeMax', {
    x: {min: 0.01, max: 1},
    y: {min: 0.1, max: 5},
    label: 'Макс. размер мелких',
  })
  shapesFolder.addInput(PARAMS, 'shapeBigSizeMin', {
    x: {min: 0.01, max: 0.5},
    y: {min: 0, max: 5},
    label: 'Мин. размер крупных',
  })
  shapesFolder.addInput(PARAMS, 'shapeBigSizeMax', {
    x: {min: 0.01, max: 1},
    y: {min: 0.1, max: 5},
    label: 'Макс. размер крупных',
  })
  shapesFolder.addInput(PARAMS, 'shapeSpaceMin', {
    min: 0,
    max: 1,
    label: 'Мин пробел',
  })
  shapesFolder.addInput(PARAMS, 'shapeSpaceMax', {
    min: 0,
    max: 1,
    label: 'Макс пробел',
  })
  shapesFolder.addInput(PARAMS, 'shapesRadius', {
    min: 0,
    max: 1500,
    label: 'Радиус',
  })
  shapesFolder.addInput(PARAMS, 'shapesOverlap', {
    min: -0.1,
    max: 0.1,
    label: 'Нахлёст',
  })

  pane.secretElements.forEach(el => {
    el.hidden = true
  })

  let panel = pane.addFolder({title: 'Панно'})
  panel.addInput(PARAMS, 'panelWidth', {
    label: 'Ширина, мм',
    min: 1,
    max: 10000,
  })
  panel.addInput(PARAMS, 'panelHeight', {
    label: 'Высота, мм',
    min: 1,
    max: 10000,
  })
  panel.addInput(PARAMS, 'panelOffset', {
    label: 'Смещение',
    min: -1,
    max: 1,
  })

  return pane
}
