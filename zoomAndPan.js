export function zoomAndPan(selectorContainer, selectorMovable, options = {}) {
  const container = document.querySelector(selectorContainer)
  const movable = container.querySelector(selectorMovable)
  movable.style.transformOrigin = '0 0'
  movable.style.position = 'absolute'

  let constantSizeElements = options.constantSizeElements || []

  let scale = options.scale || 1
  let panning = false
  let startPoint = {x: 0, y: 0}
  let endPoint = {x: 0, y: 0}

  // Zoom functionality
  container.addEventListener('wheel', e => {
    e.preventDefault()
    const delta = e.deltaY > 0 ? 0.9 : 1.1
    scale *= delta

    const rect = movable.getBoundingClientRect()
    const mouseX = e.clientX - rect.left
    const mouseY = e.clientY - rect.top

    updateTransform()

    // Adjust the translation to keep the mouse position fixed
    endPoint.x += mouseX * (1 - delta)
    endPoint.y += mouseY * (1 - delta)

    updateTransform()
  })

  // Pan functionality
  container.addEventListener('mousedown', e => {
    e.preventDefault()
    startPoint = {x: e.clientX - endPoint.x, y: e.clientY - endPoint.y}
    panning = true
  })

  container.addEventListener('mousemove', e => {
    if (!panning) return
    e.preventDefault()
    endPoint = {x: e.clientX - startPoint.x, y: e.clientY - startPoint.y}
    updateTransform()
  })

  container.addEventListener('mouseup', () => {
    panning = false
  })

  function updateTransform() {
    movable.style.transform = `translate(${endPoint.x}px, ${endPoint.y}px) scale(${scale})`

    constantSizeElements.forEach(el => {
      el.style.fontSize = `${10 / scale}px`
    })
  }

  updateTransform()
}
