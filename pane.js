export function Pane(PARAMS, seedStringCallback) {
  const pane = new Tweakpane.Pane()

  let seedString = pane.addInput(PARAMS, 'seedString', {label: 'Слово'})
  seedString.element
    .querySelector('input')
    .addEventListener('input', seedStringCallback)

  // let debug = pane.addInput(PARAMS, 'debug', {label: 'Отладка'})

  let wall = pane.addFolder({title: 'Обои'})

  // let gradient1 = wall.addInput(PARAMS, 'gradient1', {
  //   label: 'Градиент 1',
  // })

  // let gradient2 = wall.addInput(PARAMS, 'gradient2', {
  //   label: 'Градиент 2',
  // })

  // pane.addInput(PARAMS, 'size', {
  //   x: {min: 1, max: 10000},
  //   y: {min: 1, max: 10000},
  //   label: 'Размер, мм',
  // })
  let sizeX = wall.addInput(PARAMS, 'sizeX', {
    step: 1,
    min: 1,
    // max: 20000,
    label: 'Ширина, мм',
  })
  // wall.addBlade({
  //   view: 'infodump',
  //   content: 'Округлено до XXXXXX',
  // })

  wall.addMonitor(PARAMS, 'sizeXRounded', {
    format: value => Math.round(value),
    label: 'Округлили до',
  })

  let sizeY = wall.addInput(PARAMS, 'sizeY', {
    step: 1,
    min: 1,
    // max: 10000,
    label: 'Высота, мм',
  })

  // let shapesFolder = advanced.addFolder({title: 'Фигуры', expanded: true})

  let panel = pane.addFolder({title: 'Панно'})
  panel.addInput(PARAMS, 'panelWidth', {
    step: 1,
    min: 1,
    // max: 10000,
    label: 'Ширина, мм',
  })
  panel.addMonitor(PARAMS, 'panelWidthRounded', {
    format: value => Math.round(value),
    label: 'Округлили до',
  })
  panel.addInput(PARAMS, 'panelHeight', {
    step: 1,
    min: 1,
    // max: 10000,
    label: 'Высота, мм',
  })
  panel.addInput(PARAMS, 'panelOffset', {
    label: 'Смещение',
  })

  let advanced = pane.addFolder({title: 'Больше настроек', expanded: true})

  let scale = advanced.addInput(PARAMS, 'scale', {
    min: 1,
    max: 30,
    label: 'Сжатие',
  })
  advanced.addInput(PARAMS, 'shapesRadius', {
    min: 0,
    max: 1500,
    label: 'Радиус',
  })
  advanced.addInput(PARAMS, 'shapesOverlap', {
    min: -0.1,
    max: 0.1,
    label: 'Нахлёст',
  })
  let colorsBgFg = advanced.addInput(PARAMS, 'colorsBgFg', {
    label: 'Фон и градиенты',
  })
  advanced.addInput(PARAMS, 'shapesVertAmp', {
    min: 0,
    max: 1,
    step: 0.01,
    label: 'Вертикальная амплитуда',
  })

  let shapesFront = advanced.addFolder({title: 'Верхний слой'})
  shapesFront.addInput(PARAMS, 'colorsFront', {
    label: 'Цвета больших',
  })
  shapesFront.addInput(PARAMS, 'shapeFrontSizeMin', {
    x: {min: 0.01, max: 0.5},
    y: {min: 0, max: 5},
    label: 'Мин. размер крупных',
  })
  shapesFront.addInput(PARAMS, 'shapeFrontSizeMax', {
    x: {min: 0.01, max: 1},
    y: {min: 0.1, max: 5},
    label: 'Макс. размер крупных',
  })
  shapesFront.addInput(PARAMS, 'shapeFrontSpaceMin', {
    min: 0,
    max: 1,
    label: 'Мин пробел',
  })
  shapesFront.addInput(PARAMS, 'shapeFrontSpaceMax', {
    min: 0,
    max: 1,
    label: 'Макс пробел',
  })

  let shapesMiddle = advanced.addFolder({title: 'Средний слой'})
  shapesMiddle.addInput(PARAMS, 'colorsMiddle', {
    label: 'Цвета мелких',
  })
  shapesMiddle.addInput(PARAMS, 'shapeMiddleSizeMin', {
    x: {min: 0.01, max: 0.5},
    y: {min: 0, max: 5},
    label: 'Мин. размер мелких',
  })
  shapesMiddle.addInput(PARAMS, 'shapeMiddleSizeMax', {
    x: {min: 0.01, max: 1},
    y: {min: 0.1, max: 5},
    label: 'Макс. размер мелких',
  })
  shapesMiddle.addInput(PARAMS, 'shapeMiddleSpaceMin', {
    min: 0,
    max: 1,
    label: 'Мин пробел',
  })
  shapesMiddle.addInput(PARAMS, 'shapeMiddleSpaceMax', {
    min: 0,
    max: 1,
    label: 'Макс пробел',
  })

  let shapesBack = advanced.addFolder({title: 'Нижний слой'})
  shapesBack.addInput(PARAMS, 'colorsBack', {
    label: 'Цвета больших',
  })
  shapesBack.addInput(PARAMS, 'shapeBackSizeMin', {
    x: {min: 0.01, max: 0.5},
    y: {min: 0, max: 5},
    label: 'Мин. размер крупных',
  })
  shapesBack.addInput(PARAMS, 'shapeBackSizeMax', {
    x: {min: 0.01, max: 1},
    y: {min: 0.1, max: 5},
    label: 'Макс. размер крупных',
  })
  shapesBack.addInput(PARAMS, 'shapeBackSpaceMin', {
    min: 0,
    max: 1,
    label: 'Мин пробел',
  })
  shapesBack.addInput(PARAMS, 'shapeBackSpaceMax', {
    min: 0,
    max: 1,
    label: 'Макс пробел',
  })

  return pane
}
