import '../assets/index.less';
import Slider from '../src/slider';

export default {
  render() {
    const settings = {
      props: {
        centerMode: true,
        infinite: true,
        centerPadding: '60px',
        slidesToShow: 3,
        speed: 500,
        rows: 2,
        slidesPerRow: 2,
      },
      class: 'center',
    };
    return (
      <div>
        <h2>Multiple Rows</h2>
        <Slider {...settings}>
          <div style={{ width: '400px' }}>
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
          <div>
            <h3>10</h3>
          </div>
          <div>
            <h3>11</h3>
          </div>
          <div>
            <h3>12</h3>
          </div>
          <div>
            <h3>13</h3>
          </div>
          <div>
            <h3>14</h3>
          </div>
          <div>
            <h3>15</h3>
          </div>
          <div>
            <h3>16</h3>
          </div>
        </Slider>
      </div>
    );
  },
};
