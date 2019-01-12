import '../assets/index.less';
import Slider from '../src/slider';

const CustomSlide = {
  props: ['index'],
  render() {
    return (
      <div>
        <h3>{this.index}</h3>
      </div>
    );
  },
};

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
    };
    return (
      <div>
        <h2>Custom Slides</h2>
        <Slider {...settings}>
          <CustomSlide index={1} />
          <CustomSlide index={2} />
          <CustomSlide index={3} />
          <CustomSlide index={4} />
          <CustomSlide index={5} />
          <CustomSlide index={6} />
        </Slider>
      </div>
    );
  },
};
