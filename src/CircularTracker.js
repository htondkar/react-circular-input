import React from 'react'

export default class CircularMouseTracker extends React.Component {
  wrapper = React.createRef()
  indicator = React.createRef()
  radToDegCoefficient = 180 / Math.PI
  tracking = false

  state = {
    degree: 0,
  }

  componentDidMount() {
    window.addEventListener('mousedown', this.handleMouseDown)
    window.addEventListener('mouseup', this.handleMouseUp)
    window.addEventListener('mousemove', this.handleMouseMove)
    window.addEventListener('click', this.handleClick)
    window.addEventListener('resize', this.calculateCenterOfSelf)

    // initial calc
    this.calculateCenterOfSelf()
  }

  componentWillUnmount() {
    window.removeEventListener('click', this.handleClick)
    window.removeEventListener('mousedown', this.handleMouseDown)
    window.removeEventListener('mouseup', this.handleMouseUp)
    window.removeEventListener('mousemove', this.handleMouseMove)
    window.removeEventListener('resize', this.calculateCenterOfSelf)
  }

  handleMouseDown = event => {
    event.preventDefault()
    this.tracking = true
  }

  handleMouseUp = event => {
    event.preventDefault()
    this.tracking = false
  }

  handleClick = event => {
    this.tracking = true
    this.handleMouseMove(event)
    this.tracking = false
  }

  handleMouseMove = ({ clientX, clientY }) => {
    if (!this.tracking) return

    // get the distance between mouse and the center of wrapped children
    const deltaX = clientX - this.centerOfSelf.x
    const deltaY = clientY - this.centerOfSelf.y

    // calculate the degree based on cartesian frame
    const correspondingDegree = this.calculateDegree(deltaX, deltaY)

    this.setState({ degree: correspondingDegree })
  }

  calculateDegree = (dX, dY) => {
    const radian = Math.atan2(dY, dX) // number between -PI/2 to +PI/2
    const degree = radian * this.radToDegCoefficient // number between -180deg to +180deg

    // convert to 360deg instead of -180 to +180
    return this.isPositive(degree) ? degree : degree + 360
  }

  isPositive = num => Math.sign(num) === 1

  calculateCenterOfSelf = () => {
    const wrapperElement = this.wrapper.current
    const { x, width, y, height } = wrapperElement.getBoundingClientRect()

    this.centerOfSelf = {
      x: x + width / 2,
      y: y + height / 2,
    }
  }

  render() {
    return (
      <div className="wrapper" ref={this.wrapper}>
        {this.props.children(this.state.degree)}
      </div>
    )
  }
}
