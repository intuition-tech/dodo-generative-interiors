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

  let advanced = pane.addFolder({title: 'Больше настроек', expanded: false})
  // let zoom = advanced.addInput(PARAMS, 'zoomSpeed', {
  //   min: 0.0,
  //   max: 0.1,
  //   label: 'zoomSpeed',
  // })
  let colorsSmall = advanced.addInput(PARAMS, 'colorsSmall', {
    label: 'Цвета мелких',
  })

  let colorsBig = advanced.addInput(PARAMS, 'colorsBig', {
    label: 'Цвета больших',
  })
  let colorsBgFg = advanced.addInput(PARAMS, 'colorsBgFg', {
    label: 'Фон и градиенты',
  })
  let scale = advanced.addInput(PARAMS, 'scale', {
    min: 1,
    max: 30,
    label: 'Сжатие',
  })
  advanced.addInput(PARAMS, 'shapesVertAmp', {
    min: 0,
    max: 1,
    step: 0.01,
    label: 'Вертикальная амплитуда',
  })
  advanced.addInput(PARAMS, 'shapeSmallSizeMin', {
    x: {min: 0.01, max: 0.5},
    y: {min: 0, max: 5},
    label: 'Мин. размер мелких',
  })
  advanced.addInput(PARAMS, 'shapeSmallSizeMax', {
    x: {min: 0.01, max: 1},
    y: {min: 0.1, max: 5},
    label: 'Макс. размер мелких',
  })
  advanced.addInput(PARAMS, 'shapeBigSizeMin', {
    x: {min: 0.01, max: 0.5},
    y: {min: 0, max: 5},
    label: 'Мин. размер крупных',
  })
  advanced.addInput(PARAMS, 'shapeBigSizeMax', {
    x: {min: 0.01, max: 1},
    y: {min: 0.1, max: 5},
    label: 'Макс. размер крупных',
  })
  advanced.addInput(PARAMS, 'shapeSpaceMin', {
    min: 0,
    max: 1,
    label: 'Мин пробел',
  })
  advanced.addInput(PARAMS, 'shapeSpaceMax', {
    min: 0,
    max: 1,
    label: 'Макс пробел',
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

  return pane
}
