import '../assets/index.less';
import Slider from '../src/slider';
import imgList from './imglist';

const { abstract01, abstract02, abstract03, abstract04 } = imgList;

export default {
  render() {
    const settings = {
      props: {
        dots: true,
        lazyLoad: true,
        infinite: true,
        speed: 500,
        slidesToShow: 1,
        slidesToScroll: 1,
        initialSlide: 1,
      },
    };
    return (
      <div>
        <h2> Lazy Load</h2>
        <Slider {...settings}>
          <div>
            <img src={abstract01} />
          </div>
          <div>
            <img src={abstract02} />
          </div>
          <div>
            <img src={abstract03} />
          </div>
          <div>
            <img src={abstract04} />
          </div>
        </Slider>
      </div>
    );
  },
};
