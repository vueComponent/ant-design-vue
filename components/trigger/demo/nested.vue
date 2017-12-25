<script>
import Trigger from '../index'
import '../assets/index.less'
const builtinPlacements = {
  left: {
    points: ['cr', 'cl'],
  },
  right: {
    points: ['cl', 'cr'],
  },
  top: {
    points: ['bc', 'tc'],
  },
  bottom: {
    points: ['tc', 'bc'],
  },
  topLeft: {
    points: ['bl', 'tl'],
  },
  topRight: {
    points: ['br', 'tr'],
  },
  bottomRight: {
    points: ['tr', 'br'],
  },
  bottomLeft: {
    points: ['tl', 'bl'],
  },
}

const popupBorderStyle = {
  border: '1px solid red',
  padding: '10px',
}

export default {
  render () {
    return (
      <div>
        <div style={{ margin: '50px' }}>
          <Trigger
            popupPlacement='right'
            action={['click']}
            builtinPlacements={builtinPlacements}
          >
            <div style={popupBorderStyle} slot='popup' onClick={(e) => { e.stopPropagation() }}>
              jjj
            </div>
            <span href='#' style={{ margin: '20px' }} onClick={console.log}>trigger</span>
          </Trigger>
        </div>
      </div>
    )
  },
}

</script>
