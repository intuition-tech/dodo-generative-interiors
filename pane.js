export function Pane(PARAMS) {
  // ballsColor: "#000000",
  // backgroundColor: "#ffffff",
  // letterColor: "#000000",
  const pane = new Tweakpane.Pane()
  // pane.addInput(PARAMS, 'seedString', {label: 'Слово'})
  pane.addInput(PARAMS, 'debug', {label: 'Отладка'})
  pane.addInput(PARAMS, 'colors', {label: 'Цвета'})
  pane.addInput(PARAMS, 'slicesNumber', {
    min: 1,
    max: 80,
    step: 1,
    label: 'Полоски',
  })
  pane.addInput(PARAMS, 'scale', {
    min: 1,
    max: 30,
    label: 'Сжатие',
  })
  pane.addInput(PARAMS, 'size', {
    x: {min: 1, max: 2048, step: 1},
    y: {min: 1, max: 2048, step: 1},
    label: 'Size',
  })

  let shapesFolder = pane.addFolder({title: 'Фигуры'})
  shapesFolder.addInput(PARAMS, 'shapesNumber', {
    min: 0,
    max: 100,
    label: 'Число',
  })
  shapesFolder.addInput(PARAMS, 'shapeRadius', {
    min: 0,
    max: 512,
    label: 'Скругление',
  })
  shapesFolder.addInput(PARAMS, 'shapeProbability', {
    min: 0,
    max: 1,
    step: 0.01,
    label: 'Вероятность',
  })
  shapesFolder.addInput(PARAMS, 'shapesVertAmp', {
    min: 0,
    max: 1,
    step: 0.01,
    label: 'Расколбас',
  })
  shapesFolder.addInput(PARAMS, 'shapesStep', {
    min: 1,
    max: 512,
    label: 'Шаг',
  })
  shapesFolder.addInput(PARAMS, 'shapeSizeMin', {
    x: {min: 0.01, max: 2, step: 0.01},
    y: {min: 0.01, max: 2, step: 0.01},
    label: 'Мелкость',
  })
  shapesFolder.addInput(PARAMS, 'shapeSizeMax', {
    x: {min: 0.01, max: 2, step: 0.01},
    y: {min: 0.01, max: 2, step: 0.01},
    label: 'Крупность',
  })

  return pane
}
