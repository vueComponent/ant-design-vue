import '../assets/index.less';
import Slider from '../src/slider';

export default {
  render() {
    const settings = {
      props: {
        dots: true,
        infinite: true,
        slidesToShow: 3,
        slidesToScroll: 1,
      },
      scopedSlots: {
        nextArrow: props => {
          const {
            class: className,
            style,
            on: { click },
          } = props;
          return (
            <div
              class={className}
              style={{ ...style, display: 'block', background: 'red' }}
              onClick={click}
            />
          );
        },
        prevArrow: props => {
          const {
            class: className,
            style,
            on: { click },
          } = props;
          return (
            <div
              class={className}
              style={{ ...style, display: 'block', background: 'green' }}
              onClick={click}
            />
          );
        },
      },
    };
    return (
      <div>
        <h2>Custom Arrows</h2>
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
