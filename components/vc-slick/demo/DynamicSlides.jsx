import '../assets/index.less';
import Slider from '../src/slider';

export default {
  data() {
    return {
      slides: [1, 2, 3, 4, 5, 6],
    };
  },
  methods: {
    click() {
      this.slides = this.slides.length === 6 ? [1, 2, 3, 4, 5, 6, 7, 8, 9] : [1, 2, 3, 4, 5, 6];
    },
  },
  render() {
    const settings = {
      props: {
        dots: true,
        infinite: true,
        speed: 500,
        slidesToShow: 3,
        slidesToScroll: 3,
      },
    };
    return (
      <div>
        <h2>Dynamic slides</h2>
        <button class="button" onClick={this.click}>
          Click to change slide count
        </button>
        <Slider {...settings}>
          {this.slides.map(function(slide) {
            return (
              <div key={slide}>
                <h3>{slide}</h3>
              </div>
            );
          })}
        </Slider>
      </div>
    );
  },
};
