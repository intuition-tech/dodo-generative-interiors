export function zoomAndPan(
  PARAMS,
  selectorContainer,
  selectorMovable,
  options = {},
) {
  const container = document.querySelector(selectorContainer)
  const movable = container.querySelector(selectorMovable)
  movable.style.transformOrigin = '0 0'
  movable.style.position = 'absolute'
  let constantSizeElements = options.constantSizeElements || []
  let scale = options.scale || 1
  let panning = false
  let startPoint = {x: 0, y: 0}
  let endPoint = {x: 0, y: 0}
  let lastDistance = 0
  let isSpacePressed = false
  let lastTouchDistance = 0

  // Zoom and pan functionality
  container.addEventListener('wheel', handleWheel, {passive: false})

  // Pan functionality
  container.addEventListener('mousedown', handleMouseDown)
  container.addEventListener('mousemove', handleMouseMove)
  container.addEventListener('mouseup', handleMouseUp)
  container.addEventListener('mouseleave', handleMouseUp)

  // Touch events for mobile devices
  container.addEventListener('touchstart', handleTouchStart, {passive: false})
  container.addEventListener('touchmove', handleTouchMove, {passive: false})
  container.addEventListener('touchend', handleTouchEnd)

  // Keyboard events
  window.addEventListener('keydown', handleKeyDown)
  window.addEventListener('keyup', handleKeyUp)

  function handleWheel(e) {
    e.preventDefault()

    if (e.ctrlKey || e.metaKey) {
      // Zoom
      const delta = e.deltaY > 0 ? 1 - PARAMS.zoomSpeed : 1 + PARAMS.zoomSpeed
      zoomAround(e.clientX, e.clientY, delta)
    } else {
      // Pan
      endPoint.x -= e.deltaX
      endPoint.y -= e.deltaY
      updateTransform()
    }
  }

  function handleMouseDown(e) {
    if (e.button !== 0) return // Only left mouse button
    // if (isSpacePressed || e.altKey) {
    e.preventDefault()
    startPanning(e.clientX, e.clientY)
    // }
  }

  function handleMouseMove(e) {
    if (panning) {
      e.preventDefault()
      movePanning(e.clientX, e.clientY)
    }
  }

  function handleMouseUp() {
    panning = false
  }

  function handleTouchStart(e) {
    e.preventDefault()
    if (e.touches.length === 2) {
      lastTouchDistance = getDistance(e.touches[0], e.touches[1])
    } else if (e.touches.length === 1) {
      startPanning(e.touches[0].clientX, e.touches[0].clientY)
    }
  }

  function handleTouchMove(e) {
    e.preventDefault()
    if (e.touches.length === 2) {
      const newDistance = getDistance(e.touches[0], e.touches[1])
      const delta = newDistance / lastTouchDistance
      zoomAround(
        (e.touches[0].clientX + e.touches[1].clientX) / 2,
        (e.touches[0].clientY + e.touches[1].clientY) / 2,
        delta,
      )
      lastTouchDistance = newDistance
    } else if (e.touches.length === 1) {
      movePanning(e.touches[0].clientX, e.touches[0].clientY)
    }
  }

  function handleTouchEnd() {
    panning = false
    lastTouchDistance = 0
  }

  function handleKeyDown(e) {
    if (e.code === 'Space') {
      isSpacePressed = true
      container.style.cursor = 'grab'
    }
  }

  function handleKeyUp(e) {
    if (e.code === 'Space') {
      isSpacePressed = false
      container.style.cursor = 'default'
    }
  }

  function startPanning(clientX, clientY) {
    panning = true
    startPoint = {x: clientX - endPoint.x, y: clientY - endPoint.y}
  }

  function movePanning(clientX, clientY) {
    endPoint = {x: clientX - startPoint.x, y: clientY - startPoint.y}
    updateTransform()
  }

  function zoomAround(clientX, clientY, delta) {
    const oldScale = scale
    scale *= delta
    const rect = movable.getBoundingClientRect()
    const mouseX = clientX - rect.left
    const mouseY = clientY - rect.top
    endPoint.x += mouseX * (1 - delta)
    endPoint.y += mouseY * (1 - delta)
    updateTransform()
  }

  function getDistance(touch1, touch2) {
    return Math.hypot(
      touch1.clientX - touch2.clientX,
      touch1.clientY - touch2.clientY,
    )
  }

  function updateTransform() {
    movable.style.transform = `translate(${endPoint.x}px, ${endPoint.y}px) scale(${scale})`
    constantSizeElements.forEach(el => {
      el.style.transform = `scale(${0.5 / scale})`
    })
  }

  updateTransform()
}
