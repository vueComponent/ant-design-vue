<script>
import Trigger from '../index';
import '../assets/index.less';
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
};

const popupBorderStyle = {
  border: '1px solid red',
  padding: '10px',
};

export default {
  render() {
    return (
      <div style={{ margin: '200px' }}>
        <div>
          <Trigger popupPlacement="left" action={['click']} builtinPlacements={builtinPlacements}>
            <div slot="popup" style={popupBorderStyle}>
              i am a click popup
            </div>
            <span>
              <div ref="saveContainerRef1" />
              <Trigger
                popupPlacement="bottom"
                action={['hover']}
                builtinPlacements={builtinPlacements}
                getPopupContainer={() => this.$refs.saveContainerRef1}
              >
                <div slot="popup" style={popupBorderStyle}>
                  i am a hover popup
                </div>
                <span href="#" style={{ margin: '20px' }}>
                  trigger
                </span>
              </Trigger>
            </span>
          </Trigger>
        </div>
        {false ? (
          <div style={{ margin: '50px' }}>
            <Trigger
              popupPlacement="right"
              action={['click', 'hover']}
              builtinPlacements={builtinPlacements}
            >
              <div
                style={popupBorderStyle}
                slot="popup"
                onClick={e => {
                  e.stopPropagation();
                }}
              >
                <div ref="saveContainerRef" />
                <Trigger
                  popupPlacement="bottom"
                  action={['click']}
                  builtinPlacements={builtinPlacements}
                  getPopupContainer={() => this.$refs.saveContainerRef}
                >
                  <div slot="popup" style={popupBorderStyle}>
                    I am inner Trigger Popup
                  </div>
                  <span href="#" style={{ margin: 20 }}>
                    clickToShowInnerTrigger
                  </span>
                </Trigger>
              </div>
              <span href="#" style={{ margin: '20px' }} onClick={console.log}>
                trigger
              </span>
            </Trigger>
          </div>
        ) : null}
      </div>
    );
  },
};
</script>
