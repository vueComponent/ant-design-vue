import { mount } from '@vue/test-utils';
import { asyncExpect } from '../../../tests/utils';
import Skeleton from '..';
import mountTest from '../../../tests/shared/mountTest';

describe('Skeleton', () => {
  const genSkeleton = props => {
    const skeletonProps = {
      props: {
        loading: true,
        ...props,
      },
      slots: {
        default: () => 'Bamboo',
      },
      sync: false,
    };
    return mount(Skeleton, skeletonProps);
  };
  mountTest(Skeleton);
  describe('avatar', () => {
    it('size', async () => {
      const wrapperSmall = genSkeleton({ avatar: { size: 'small' } });
      await asyncExpect(() => {
        expect(wrapperSmall.html()).toMatchSnapshot();
      });

      const wrapperDefault = genSkeleton({ avatar: { size: 'default' } });

      await asyncExpect(() => {
        expect(wrapperDefault.html()).toMatchSnapshot();
      });

      const wrapperLarge = genSkeleton({ avatar: { size: 'large' } });

      await asyncExpect(() => {
        expect(wrapperLarge.html()).toMatchSnapshot();
      });

      const wrapperNumber = genSkeleton({ avatar: { size: 20 } });

      await asyncExpect(() => {
        expect(wrapperNumber.html()).toMatchSnapshot();
      });
    });

    it('shape', async () => {
      const wrapperCircle = genSkeleton({ avatar: { shape: 'circle' } });
      await asyncExpect(() => {
        expect(wrapperCircle.html()).toMatchSnapshot();
      });

      const wrapperSquare = genSkeleton({ avatar: { shape: 'square' } });
      await asyncExpect(() => {
        expect(wrapperSquare.html()).toMatchSnapshot();
      });
    });
  });

  describe('title', () => {
    it('width', async () => {
      const wrapper = genSkeleton({ title: { width: '93%' } });
      await asyncExpect(() => {
        expect(wrapper.html()).toMatchSnapshot();
      });
    });
  });

  describe('paragraph', () => {
    it('rows', async () => {
      const wrapper = genSkeleton({ paragraph: { rows: 5 } });
      await asyncExpect(() => {
        expect(wrapper.html()).toMatchSnapshot();
      });
    });

    it('width', async () => {
      const wrapperPure = genSkeleton({ paragraph: { width: '93%' } });
      await asyncExpect(() => {
        expect(wrapperPure.html()).toMatchSnapshot();
      });

      const wrapperList = genSkeleton({ paragraph: { width: ['28%', '93%'] } });
      await asyncExpect(() => {
        expect(wrapperList.html()).toMatchSnapshot();
      });
    });
  });
});
