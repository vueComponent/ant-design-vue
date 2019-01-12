import '../assets/index.less';
import Slider from '../src/slider';

export default {
  render() {
    const settings = {
      props: {
        focusOnSelect: true,
        infinite: true,
        slidesToShow: 3,
        slidesToScroll: 1,
        speed: 500,
      },
    };
    return (
      <div>
        <h2>FocusOnSelect</h2>
        <div>Click on any slide to select and make it current slide</div>
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
