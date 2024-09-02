export function Pane(PARAMS) {
  const pane = new Tweakpane.Pane()
  pane.addInput(PARAMS, 'debug', {label: 'Отладка'})
  pane.addInput(PARAMS, 'colors', {label: 'Цвета'})
  pane.addInput(PARAMS, 'gradient1', {label: 'Градиент 1'})
  pane.addInput(PARAMS, 'gradient2', {label: 'Градиент 2'})
  pane.addInput(PARAMS, 'scale', {
    min: 1,
    max: 30,
    label: 'Сжатие',
  })
  pane.addInput(PARAMS, 'size', {
    x: {min: 1, max: 10000},
    y: {min: 1, max: 10000},
    label: 'Размер, мм',
  })

  let shapesFolder = pane.addFolder({title: 'Фигуры', expanded: true})
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
    x: {min: 0.01, max: 0.5, step: 0.01},
    y: {min: 0, max: 5, step: 0.1},
    label: 'Мин. размер',
  })
  shapesFolder.addInput(PARAMS, 'shapeSizeMax', {
    x: {min: 0.01, max: 1, step: 0.01},
    y: {min: 0.1, max: 5, step: 0.1},
    label: 'Макс. размер',
  })
  shapesFolder.addInput(PARAMS, 'shapesFreq', {
    min: 0.1,
    max: 6,
    step: 0.1,
    label: 'Частота',
  })

  return pane
}
