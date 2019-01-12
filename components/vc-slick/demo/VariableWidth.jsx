import '../assets/index.less';
import Slider from '../src/slider';

export default {
  render() {
    const settings = {
      class: 'slider variable-width',
      props: {
        dots: true,
        infinite: true,
        centerMode: true,
        slidesToShow: 1,
        slidesToScroll: 1,
        variableWidth: true,
      },
    };
    return (
      <div>
        <h2>Variable width</h2>
        <Slider {...settings}>
          <div style={{ width: '100px' }}>
            <p>100</p>
          </div>
          <div style={{ width: '200px' }}>
            <p>200</p>
          </div>
          <div style={{ width: '75px' }}>
            <p>75</p>
          </div>
          <div style={{ width: '300px' }}>
            <p>300</p>
          </div>
          <div style={{ width: '225px' }}>
            <p>225</p>
          </div>
          <div style={{ width: '175px' }}>
            <p>175</p>
          </div>
        </Slider>
      </div>
    );
  },
};
