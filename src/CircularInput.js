import React from 'react'
import CircularMouseTracker from './CircularTracker'

export default class CircularInput extends React.Component {
  canvas = React.createRef()

  componentDidMount() {
    const canvas = this.canvas.current
    this.drawingContext = canvas.getContext('2d')
    this.centerX = canvas.width / 2
    this.centerY = canvas.height / 4
    this.radius = canvas.width / 4

    this.drawingContext.lineWidth = 4
    this.drawingContext.strokeStyle = 'red'
  }

  drawToCanvas = deg => {
    this.cleanCanvas()
    this.drawingContext.arc(this.centerX, this.centerY, this.radius, deg, true)
    this.drawingContext.stroke()
  }

  cleanCanvas = () => {
    this.canvas.current.width = this.canvas.current.width
  }

  render() {
    return (
      <CircularMouseTracker>
        {deg => {
          if (this.drawingContext) this.drawToCanvas(deg)

          return (
            <div className="circular-input">
              <div className="circular-input__value">{parseInt(deg, 10)}</div>

              <canvas
                ref={this.canvas}
                className="circular-input__track"
                width={200}
                height={200}
              />
            </div>
          )
        }}
      </CircularMouseTracker>
    )
  }
}
