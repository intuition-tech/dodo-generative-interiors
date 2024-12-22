export function Pane(PARAMS, seedStringCallback) {
  const pane = new Tweakpane.Pane()

  let seedString = pane.addInput(PARAMS, 'seedString', {label: 'Город'})
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
  //   content: 'Округлено до XXXXXX',pane
  // })

  let sizeXRounded = wall.addMonitor(PARAMS, 'sizeXRounded', {
    format: value => Math.round(value),
    elementName: 'yoooo',
    label: 'Округлили до',
  })
  sizeXRounded.element.style.opacity = '0.5'

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
  let panelWidthRounded = panel.addMonitor(PARAMS, 'panelWidthRounded', {
    format: value => Math.round(value),
    label: 'Округлили до',
  })
  panelWidthRounded.element.style.opacity = '0.5'
  panel.addInput(PARAMS, 'panelHeight', {
    step: 1,
    min: 1,
    // max: 10000,
    label: 'Высота, мм',
  })
  panel.addInput(PARAMS, 'panelOffset', {
    label: 'Смещение',
  })

  let advanced = pane.addFolder({title: 'Больше настроек', expanded: false})

  let scale = advanced.addInput(PARAMS, 'scale', {
    step: 1,
    label: 'Сжатие',
  })
  advanced.addInput(PARAMS, 'shapesRadiusMin', {
    step: 1,
    label: 'Радиус мин',
  })
  advanced.addInput(PARAMS, 'shapesRadiusMax', {
    step: 1,
    label: 'Радиус макс',
  })
  advanced.addInput(PARAMS, 'shapesOverlap', {
    step: 1,
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

  // Настроить имеющиесфя лампыа

  let shapesFront = advanced.addFolder({title: 'Верхний слой', expanded: false})
  shapesFront.addInput(PARAMS, 'colorsFront', {
    label: 'Палитра',
  })
  shapesFront.addInput(PARAMS, 'shapeFrontSizeMin', {
    x: {min: 0.01, max: 0.5},
    y: {min: 0, max: 10},
    label: 'Мин размер',
  })
  shapesFront.addInput(PARAMS, 'shapeFrontSizeMax', {
    x: {min: 0.01, max: 1},
    y: {min: 0.1, max: 10},
    label: 'Макс размер',
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
  shapesFront.addInput(PARAMS, 'shapeFrontTreshold', {
    min: 0,
    max: 1,
    label: 'Порог',
  })

  let shapesMiddle = advanced.addFolder({title: 'Средний слой', expanded: false})
  shapesMiddle.addInput(PARAMS, 'colorsMiddle', {
    label: 'Палитра',
  })
  shapesMiddle.addInput(PARAMS, 'colorsMiddleAccent', {
    label: 'Палитра акцентная',
  })
  shapesMiddle.addInput(PARAMS, 'shapeMiddleSizeMin', {
    x: {min: 0.01, max: 0.5},
    y: {min: 0, max: 5},
    label: 'Мин размер',
  })
  shapesMiddle.addInput(PARAMS, 'shapeMiddleSizeMax', {
    x: {min: 0.01, max: 1},
    y: {min: 0.1, max: 5},
    label: 'Макс размер',
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
  shapesMiddle.addInput(PARAMS, 'shapeMiddleTreshold', {
    min: 0,
    max: 1,
    label: 'Порог',
  })

  let shapesBack = advanced.addFolder({title: 'Нижний слой', expanded: false})
  shapesBack.addInput(PARAMS, 'colorsBack', {
    label: 'Палитра',
  })
  shapesBack.addInput(PARAMS, 'colorsBackAccent', {
    label: 'Палитра акцентная',
  })
  shapesBack.addInput(PARAMS, 'shapeBackSizeMin', {
    x: {min: 0.01, max: 0.5},
    y: {min: 0, max: 10},
    label: 'Мин размер',
  })
  shapesBack.addInput(PARAMS, 'shapeBackSizeMax', {
    x: {min: 0.01, max: 1},
    y: {min: 0.1, max: 10},
    label: 'Макс размер',
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
  shapesBack.addInput(PARAMS, 'shapeBackTreshold', {
    min: 0,
    max: 1,
    label: 'Порог',
  })

  return pane
}
