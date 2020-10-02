import BackTop from '../components/back-top';
import '../components/back-top/style';

export default {
  render() {
    return (
      // default example
      <div style={{ height: '3000px' }}>
        content
        <BackTop />
      </div>

      // target example
      // <div style={{ height: '500px', overflow: 'auto' }} class="back-top-demo">
      //   <div style={{ height: '2000px', background: '#eee' }}>content</div>
      //   <BackTop
      //     target={() => {
      //       return document.querySelector('.back-top-demo');
      //     }}
      //   />
      // </div>

      // click example
      //  <div style={{ height: '3000px' }}>
      //   content
      //   <BackTop
      //     onClick={() => {
      //       console.log('======================');
      //       console.log('click');
      //       console.log('======================');
      //     }}
      //   />
      // </div>
    );
  },
};
