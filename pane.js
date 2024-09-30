export function Pane(PARAMS) {
  const pane = new Tweakpane.Pane()
  pane.secretElements = []

  pane.addInput(PARAMS, 'seedString', {label: 'Слово'})

  let debug = pane.addInput(PARAMS, 'debug', {label: 'Отладка'})
  pane.secretElements.push(debug)

  let colors = pane.addInput(PARAMS, 'colors', {label: 'Цвета'})
  pane.secretElements.push(colors)

  let wall = pane.addFolder({title: 'Обои'})

  let gradient1 = wall.addInput(PARAMS, 'gradient1', {
    label: 'Градиент 1',
  })
  pane.secretElements.push(gradient1)
  let gradient2 = wall.addInput(PARAMS, 'gradient2', {
    label: 'Градиент 2',
  })
  pane.secretElements.push(gradient2)

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
    max: 10000,
    label: 'Ширина, мм',
  })
  let sizeY = wall.addInput(PARAMS, 'sizeY', {
    min: 1,
    max: 10000,
    label: 'Высота, мм',
  })

  let shapesFolder = wall.addFolder({title: 'Фигуры', expanded: true})
  pane.secretElements.push(shapesFolder)

  shapesFolder.addInput(PARAMS, 'shapeProbability', {
    min: 0,
    max: 1,
    step: 0.01,
    label: 'Вероятность фигуры',
  })
  shapesFolder.addInput(PARAMS, 'shapesVertAmp', {
    min: 0,
    max: 1,
    step: 0.01,
    label: 'Вертикальная амплитуда',
  })
  shapesFolder.addInput(PARAMS, 'shapeSizeMin', {
    x: {min: 0.01, max: 0.5},
    y: {min: 0, max: 5},
    label: 'Мин. размер',
  })
  shapesFolder.addInput(PARAMS, 'shapeSizeMax', {
    x: {min: 0.01, max: 1},
    y: {min: 0.1, max: 5},
    label: 'Макс. размер',
  })
  shapesFolder.addInput(PARAMS, 'shapesRadius', {
    min: 0,
    max: 500,
    label: 'Радиус',
  })
  shapesFolder.addInput(PARAMS, 'shapesFreq', {
    min: 0.1,
    max: 6,
    step: 0.1,
    label: 'Частота',
  })
  shapesFolder.addInput(PARAMS, 'shapesOverlap', {
    min: -100,
    max: 100,
    label: 'Нахлёст',
  })
  shapesFolder.addInput(PARAMS, 'shapesDistribution', {
    min: 0.5,
    max: 4,
    label: 'Неравенство',
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
