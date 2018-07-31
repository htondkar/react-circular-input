import React from 'react'
import CircularMouseTracker from './CircularTracker'

export default class CircularInput extends React.Component {
  canvas = React.createRef()
  dragHandle = React.createRef()
  degToRadCoefficient = Math.PI / 180

  componentDidMount() {
    this.createDrawingContext()
    this.initialCalculations()

    const initialPositions = this.calculateHandlePosition(0)
    this.syncTheHandle(initialPositions)
    this.drawTheIndicatorHand(initialPositions)
  }

  createDrawingContext = () => {
    // set up canvas
    const canvas = this.canvas.current
    this.drawingContext = canvas.getContext('2d')
  }

  initialCalculations = () => {
    const { canvas } = this

    // get coordinations
    this.centerX = canvas.current.width / 2
    this.centerY = canvas.current.height / 2
    this.radius = canvas.current.width / 2 - 10 // 10px padding

    this.handleRadius = this.dragHandle.current.getBoundingClientRect().width / 2
  }

  drawToCanvas = degrees => {
    requestAnimationFrame(() => {
      // fun fact: this whole requestAnimationFrame, takes 0.1 ms!

      this.cleanTheCanvas()

      // convert to radian for more convenience
      const radians = degrees * this.degToRadCoefficient

      // draw
      this.drawTheArc(radians)
      const handlePosition = this.calculateHandlePosition(radians)
      this.syncTheHandle(handlePosition)
      this.drawTheIndicatorHand(handlePosition)
    })
  }

  cleanTheCanvas = () => {
    this.canvas.current.width = this.canvas.current.width
  }

  drawTheArc = radians => {
    const { drawingContext, centerX, centerY, radius } = this

    // start the arc
    drawingContext.arc(centerX, centerY, radius, 0, radians)

    // set the styles
    drawingContext.lineWidth = 10

    // make the arc transparent based on radians, alpha at least 0.3
    drawingContext.strokeStyle = `rgba(200, 0, 100, ${this.radiansToTransparency(
      radians
    )})`

    drawingContext.lineCap = 'round'

    // draw
    drawingContext.stroke()
  }

  radiansToTransparency = radians => Math.max(0.3, radians / (2 * Math.PI))

  calculateHandlePosition = radians => {
    // convert radians to x and y in order to draw the line
    const { x, y } = this.getXYGivenDegree(radians)

    // .lineTo method considers the 0,0 as the origin, but we want the center
    // to be the origin so, to convert, we add center coordinations to
    // our calculations
    return {
      x: x + this.centerX,
      y: y + this.centerY,
    }
  }

  drawTheIndicatorHand = ({ x, y }) => {
    const { drawingContext, centerX, centerY } = this

    // start a line
    drawingContext.beginPath()
    drawingContext.moveTo(centerX, centerY)
    drawingContext.lineTo(x, y)

    // set the styles
    // dashes are 5px and spaces are 3px
    drawingContext.setLineDash([8, 8])
    drawingContext.strokeStyle = 'grey'
    drawingContext.lineWidth = 1

    // draw
    drawingContext.stroke()
  }

  getXYGivenDegree = radians => ({
    x: this.radius * Math.cos(radians),
    y: this.radius * Math.sin(radians),
  })

  syncTheHandle = ({ x, y }) => {
    const handleElement = this.dragHandle.current

    handleElement.style.left = x - this.handleRadius + 'px'
    handleElement.style.top = y - this.handleRadius + 'px'
  }

  render() {
    return (
      <CircularMouseTracker>
        {(deg, onDragStart) => {
          if (this.drawingContext) this.drawToCanvas(deg)

          return (
            <div className="circular-input">
              <div className="circular-input__value">
                <span className="circular-input__value__wrapper">{Math.ceil(deg)}</span>
              </div>

              <div
                className="circular-input__drag-handle"
                onMouseDown={onDragStart}
                ref={this.dragHandle}
              />

              <canvas
                ref={this.canvas}
                className="circular-input__track"
                width="200px"
                height="200px"
              />
            </div>
          )
        }}
      </CircularMouseTracker>
    )
  }
}
