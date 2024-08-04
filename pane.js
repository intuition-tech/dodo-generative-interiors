export function Pane(PARAMS) {
  // ballsColor: "#000000",
  // backgroundColor: "#ffffff",
  // letterColor: "#000000",
  const pane = new Tweakpane.Pane()
  // pane.addInput(PARAMS, 'seedString', {label: 'Слово'})
  pane.addInput(PARAMS, 'debug')
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
  // pane.addInput(PARAMS, 'contourCircleScale', {
  //   min: 0.1,
  //   max: 3,
  //   label: 'Contour circle scale',
  // })
  // pane.addInput(PARAMS, 'shapeStiffness', {
  //   min: 0,
  //   max: 99,
  //   label: 'Shape stiffness',
  // })
  // pane.addInput(PARAMS, 'chainStiffness', {
  //   min: 0,
  //   max: 999,
  //   label: 'Chain stiffness',
  // })
  // // pane.addInput(PARAMS, 'gravity', {
  // //   min: -0.0001,
  // //   max: 0.0001,
  // //   label: 'Gravity',
  // // })
  // // pane.addInput(PARAMS, 'chainElementLength', {
  // //   min: 0,
  // //   max: 100,
  // //   label: 'Chain element length',
  // // })
  // pane.addInput(PARAMS, 'letterScale', {
  //   min: 0.1,
  //   max: 5,
  //   label: 'Letter scale',
  // })
  // pane.addInput(PARAMS, 'canvasScale', {
  //   min: 0.1,
  //   max: 20,
  //   label: 'Canvas scale',
  // })
  // pane.addInput(PARAMS, 'targetDist', {
  //   min: 1,
  //   max: 10000,
  //   label: 'Target dist',
  // })
  // pane.addInput(PARAMS, 'wordStiffness', {
  //   min: 0,
  //   max: 10,
  //   label: 'Word stiffness',
  // })

  // let ballsPane = pane.addFolder({title: 'Balls'})
  // ballsPane.addInput(PARAMS, 'ballsRadius', {
  //   min: 1,
  //   max: 500,
  //   label: 'Radius',
  // })
  // ballsPane.addInput(PARAMS, 'ballsNumber', {
  //   min: 0,
  //   max: 500,
  //   label: 'Number',
  // })
  // ballsPane.addInput(PARAMS, 'ballsMass', {
  //   min: 0.001,
  //   max: 100,
  //   label: 'Mass',
  // })
  // ballsPane.addInput(PARAMS, 'ballsSpeed', {
  //   min: 0,
  //   max: 30,
  //   label: 'Speed',
  // })

  // let renderPane = pane.addFolder({title: 'Render'})
  // renderPane.addInput(PARAMS, 'isDebug', {label: 'Debug'})
  // renderPane.addInput(PARAMS, 'letterColor', {label: 'Letter color'})
  // renderPane.addInput(PARAMS, 'backgroundColor', {label: 'Background color'})
  // renderPane.addInput(PARAMS, 'ballsColor', {label: 'Balls color'})

  // pane.addInput(PARAMS, 'slop', {min: -100, max: 100, step: 0.01, label: 'Slop'})
  // // .on('change', _ => {
  // //   world.bodies.forEach(body => {
  // //     body.slop = PARAMS.slop
  // //   })
  // // })
  pane.addInput(PARAMS, 'size', {
    x: {min: 1, max: 2048, step: 1},
    y: {min: 1, max: 2048, step: 1},
    label: 'Size',
  })

  let shapesFolder = pane.addFolder({title: 'Shapes'})
  shapesFolder.addInput(PARAMS, 'shapesNumber', {
    min: 0,
    max: 100,
    label: 'Shapes number',
  })
  shapesFolder.addInput(PARAMS, 'shapeProbability', {
    min: 0,
    max: 1,
    step: 0.01,
    label: 'Shape probability',
  })
  shapesFolder.addInput(PARAMS, 'shapesVertAmp', {
    min: 0,
    max: 1,
    step: 0.01,
    label: 'Amp',
  })
  shapesFolder.addInput(PARAMS, 'shapeSizeMin', {
    x: {min: 0.01, max: 2, step: 0.01},
    y: {min: 0.01, max: 2, step: 0.01},
    label: 'Shape size min',
  })
  shapesFolder.addInput(PARAMS, 'shapeSizeMax', {
    x: {min: 0.01, max: 2, step: 0.01},
    y: {min: 0.01, max: 2, step: 0.01},
    label: 'Shape size max',
  })

  return pane
}
