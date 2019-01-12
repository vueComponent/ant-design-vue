import '../assets/index.less';
import Slider from '../src/slider';

export default {
  render() {
    const settings = {
      props: {
        dots: true,
        infinite: false,
        speed: 500,
        slidesToScroll: 4,
        slidesToShow: 4,
      },
    };
    return (
      <div>
        <h2>Uneven sets (finite)</h2>
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
