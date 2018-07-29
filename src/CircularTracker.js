import React from 'react'

export default class CircularMouseTracker extends React.Component {
  wrapper = React.createRef()
  indicator = React.createRef()
  radToDegCoefficient = 180 / Math.PI

  state = {
    degree: 0,
  }

  componentDidMount() {
    window.addEventListener('mousemove', this.handleMouseMove)
    this.calculateCenterOfSelf()
  }

  componentWillUnmount() {
    window.removeEventListener('mousemove', this.handleMouseMove)
  }

  handleMouseMove = ({ clientX, clientY }) => {
    // get the distance between mouse and the center of wrapped children
    const deltaX = clientX - this.centerOfSelf.x
    const deltaY = clientY - this.centerOfSelf.y

    // calculate the degree based on cartesian frame
    const correspondingDegree = this.calculateDegree(deltaX, deltaY)

    this.setState({ degree: correspondingDegree })
  }

  calculateDegree = (dX, dY) => {
    const radian = Math.atan2(dY, dX)
    const degree = radian * this.radToDegCoefficient

    if (this.isPositive(degree)) {
      return degree
    }

    return degree + 360
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
