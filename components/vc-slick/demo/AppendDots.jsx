import '../assets/index.less';
import Slider from '../src/slider';

export default {
  render() {
    const settings = {
      props: {
        dots: true,
        infinite: true,
        speed: 500,
        slidesToShow: 1,
        slidesToScroll: 1,
      },
      scopedSlots: {
        customPaging: ({ i }) => {
          return (
            <div
              style={{
                width: '30px',
                color: 'blue',
                border: '1px blue solid',
              }}
            >
              {i + 1}
            </div>
          );
        },
        appendDots: ({ dots }) => {
          return (
            <div
              style={{
                backgroundColor: '#ddd',
                borderRadius: '10px',
                padding: '10px',
              }}
            >
              <ul style={{ margin: '0px' }}> {dots} </ul>
            </div>
          );
        },
      },
    };
    return (
      <div>
        <h2>Append Dots</h2>
        <Slider {...settings}>
          <div>
            <h3>1</h3>
          </div>
          <div>
            <h3>2</h3>
          </div>
          <div>
            <h3>3</h3>
          </div>
          <div>
            <h3>4</h3>
          </div>
          <div>
            <h3>5</h3>
          </div>
          <div>
            <h3>6</h3>
          </div>
        </Slider>
      </div>
    );
  },
};
