import '../assets/index.less';
import Slider from '../src/slider';

export default {
  data() {
    return {
      display: true,
      width: 600,
    };
  },
  render() {
    const settings = {
      props: {
        dots: true,
        infinite: true,
        speed: 500,
        slidesToShow: 3,
        slidesToScroll: 1,
      },
    };
    return (
      <div>
        <h2> Resizable Collapsible </h2>
        <button
          class="button"
          onClick={() => {
            this.width = this.width + 100;
          }}
        >
          {' '}
          increase{' '}
        </button>
        <button
          class="button"
          onClick={() => {
            this.width = this.width - 100;
          }}
        >
          {' '}
          decrease{' '}
        </button>
        <button
          class="button"
          onClick={() => {
            this.display = !this.display;
          }}
        >
          {' '}
          toggle{' '}
        </button>
        <div
          style={{
            width: this.width + 'px',
            display: this.display ? 'block' : 'none',
          }}
        >
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
      </div>
    );
  },
};
