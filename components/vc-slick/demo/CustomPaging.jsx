import '../assets/index.less';
import Slider from '../src/slider';
import imgList from './imglist';

const { abstract01, abstract02, abstract03, abstract04 } = imgList;

export default {
  render() {
    const settings = {
      props: {
        dots: true,
        dotsClass: 'slick-dots slick-thumb',
        infinite: true,
        speed: 500,
        slidesToShow: 1,
        slidesToScroll: 1,
      },
      scopedSlots: {
        customPaging: ({ i }) => {
          return (
            <a>
              <img src={imgList[`abstract0${i + 1}`]} />
            </a>
          );
        },
      },
    };
    return (
      <div>
        <h2>Custom Paging</h2>
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
