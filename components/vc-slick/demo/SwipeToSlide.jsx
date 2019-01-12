import '../assets/index.less';
import Slider from '../src/slider';

export default {
  render() {
    const settings = {
      props: {
        infinite: true,
        centerPadding: '60px',
        slidesToShow: 5,
        swipeToSlide: true,
        afterChange: function(index) {
          console.log(`Slider Changed to: ${index + 1}, background: #222; color: #bada55`);
        },
      },
      class: 'center',
    };
    return (
      <div>
        <h2>Swipe To Slide</h2>
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
          <div>
            <h3>7</h3>
          </div>
          <div>
            <h3>8</h3>
          </div>
          <div>
            <h3>9</h3>
          </div>
        </Slider>
      </div>
    );
  },
};
