import LazyLoad from '../src/LazyLoad';

import './style.less';

const Application = {
  render() {
    return (
      <div>
        Scroll to load images.
        <div class="filler" />
        <LazyLoad height={762} offsetVertical={300}>
          <img src="http://apod.nasa.gov/apod/image/1502/HDR_MVMQ20Feb2015ouellet1024.jpg" />
        </LazyLoad>
        <div class="filler" />
        <LazyLoad height={683} offsetVertical={300}>
          <img src="http://apod.nasa.gov/apod/image/1502/2015_02_20_conj_bourque1024.jpg" />
          <span />
        </LazyLoad>
        <div class="filler" />
        <div class="ScrollableContainer">
          <div class="filler" />
          <div class="filler" />
          <div class="filler" />
          <LazyLoad height={480}>
            <img src="http://apod.nasa.gov/apod/image/1502/MarsPlume_jaeschke_480.gif" />
          </LazyLoad>
        </div>
        <div class="filler" />
        <LazyLoad height={720} offsetVertical={300}>
          <img src="http://apod.nasa.gov/apod/image/1502/ToadSky_Lane_1080_annotated.jpg" />
        </LazyLoad>
        <div class="filler" />
      </div>
    );
  },
};

export default Application;
