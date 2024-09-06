export function Pane(PARAMS) {
  const pane = new Tweakpane.Pane()
  pane.secretElements = []
  let debug = pane.addInput(PARAMS, 'debug', {label: 'Отладка'})
  pane.secretElements.push(debug)

  let colors = pane.addInput(PARAMS, 'colors', {label: 'Цвета'})
  pane.secretElements.push(colors)

  let gradient1 = pane.addInput(PARAMS, 'gradient1', {
    label: 'Градиент 1',
  })
  pane.secretElements.push(gradient1)
  let gradient2 = pane.addInput(PARAMS, 'gradient2', {
    label: 'Градиент 2',
  })
  pane.secretElements.push(gradient2)

  let scale = pane.addInput(PARAMS, 'scale', {
    min: 1,
    max: 30,
    label: 'Сжатие',
  })
  pane.secretElements.push(scale)

  pane.addInput(PARAMS, 'size', {
    x: {min: 1, max: 10000},
    y: {min: 1, max: 10000},
    label: 'Размер, мм',
  })

  let shapesFolder = pane.addFolder({title: 'Фигуры', expanded: true})
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

  return pane
}
