import '../assets/index.less';
import Slider from '../src/slider';

export default {
  methods: {
    next() {
      this.$refs.slider.slickNext();
    },
    previous() {
      this.$refs.slider.slickPrev();
    },
  },
  render() {
    const settings = {
      props: {
        dots: true,
        infinite: true,
        speed: 500,
        slidesToShow: 1,
        slidesToScroll: 1,
      },
      ref: 'slider',
    };
    return (
      <div>
        <h2>Previous and Next methods</h2>
        <Slider {...settings}>
          <div key={1}>
            <h3>1</h3>
          </div>
          <div key={2}>
            <h3>2</h3>
          </div>
          <div key={3}>
            <h3>3</h3>
          </div>
          <div key={4}>
            <h3>4</h3>
          </div>
          <div key={5}>
            <h3>5</h3>
          </div>
          <div key={6}>
            <h3>6</h3>
          </div>
        </Slider>
        <div style={{ textAlign: 'center' }}>
          <button class="button" onClick={this.previous}>
            Previous
          </button>
          <button class="button" onClick={this.next}>
            Next
          </button>
        </div>
      </div>
    );
  },
};
