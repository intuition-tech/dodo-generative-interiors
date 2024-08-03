export function chaikinSmooth(polygon, iterations = 2) {
  let smoothed = polygon.slice()
  for (let i = 0; i < iterations; i++) {
    smoothed = chaikinIteration(smoothed)
  }
  return smoothed
}

function chaikinIteration(polygon) {
  let smoothed = []
  const n = polygon.length
  for (let i = 0; i < n; i++) {
    const p0 = polygon[i]
    const p1 = polygon[(i + 1) % n]
    const Q = [
      [0.75 * p0[0] + 0.25 * p1[0], 0.75 * p0[1] + 0.25 * p1[1]],
      [0.25 * p0[0] + 0.75 * p1[0], 0.25 * p0[1] + 0.75 * p1[1]],
    ]
    smoothed.push(Q[0], Q[1])
  }
  return smoothed
}
