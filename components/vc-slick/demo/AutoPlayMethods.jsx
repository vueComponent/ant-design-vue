import '../assets/index.less';
import Slider from '../src/slider';

export default {
  methods: {
    play() {
      this.$refs.slider.slickPlay();
    },
    pause() {
      this.$refs.slider.slickPause();
    },
  },
  render() {
    const settings = {
      props: {
        dots: true,
        infinite: true,
        slidesToShow: 3,
        slidesToScroll: 1,
        autoplay: true,
        autoplaySpeed: 2000,
      },
      ref: 'slider',
    };
    return (
      <div>
        <h2>Auto Play & Pause with buttons</h2>
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
        <div style={{ textAlign: 'center' }}>
          <button class="button" onClick={this.play}>
            Play
          </button>
          <button class="button" onClick={this.pause}>
            Pause
          </button>
        </div>
      </div>
    );
  },
};
