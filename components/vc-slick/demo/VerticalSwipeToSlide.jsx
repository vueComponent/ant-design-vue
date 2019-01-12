import '../assets/index.less';
import Slider from '../src/slider';

export default {
  render() {
    const settings = {
      props: {
        dots: true,
        infinite: true,
        slidesToShow: 3,
        slidesToScroll: 1,
        vertical: true,
        verticalSwiping: true,
        swipeToSlide: true,
        beforeChange: function(currentSlide, nextSlide) {
          console.log('before change', currentSlide, nextSlide);
        },
        afterChange: function(currentSlide) {
          console.log('after change', currentSlide);
        },
      },
    };
    return (
      <div>
        <h2>Vertical Mode with Swipe To Slide</h2>
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
