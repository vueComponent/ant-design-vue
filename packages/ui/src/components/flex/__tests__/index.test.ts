import { describe, expect, it, vi } from 'vitest'
import { Flex } from '@ant-design-vue/ui'
import { mount } from '@vue/test-utils'

describe('Flex', () => {
  it('should render correctly', () => {
    const wrapper = mount(Flex, {
      slots: {
        default: `<div>test</div>`,
      },
    });

    expect(wrapper.html()).toMatchSnapshot();
  });

  it('Flex', () => {
    const wrapper = mount(Flex, {
      props: {
        justify: 'center'
      },
      slots: {
        default: `<div>test</div>`
      },
    });
    
    const wrapper3 = mount(Flex, {
      props: {
        flex: '0 1 auto',
      },
      slots: {
        default: `<div>test</div>`,
      },
    });

    expect(wrapper.classes('ant-flex')).toBeTruthy();
    expect(wrapper.find('.ant-flex-justify-center')).toBeTruthy();
    expect(wrapper3.classes('ant-flex')).toBeTruthy();
    expect(wrapper3.element.style.flex).toBe('0 1 auto');
  });

  describe('Props: gap', () => {
    it('support string', () => {
      const wrapper = mount(Flex, {
        props: {
          gap: 'inherit',
        },
        slots: {
          default: `<div>test</div>`,
        },
      });
      expect(wrapper.classes('ant-flex')).toBeTruthy();
      expect(wrapper.element.style.gap).toBe('inherit');
    });

    it('support number', () => {
      const wrapper = mount(Flex, {
        props: {
          gap: '100',
        },
        slots: {
          default: `<div>test</div>`,
        },
      });
      expect(wrapper.classes('ant-flex')).toBeTruthy();
      expect(wrapper.element.style.gap).toBe('100px');
    });

    it('support preset size', () => {
      const wrapper = mount(Flex, {
        props: {
          gap: 'small',
        },
        slots: {
          default: `<div>test</div>`,
        },
      });

      expect(wrapper.classes('ant-flex')).toBeTruthy();
      expect(wrapper.classes('ant-flex-gap-small')).toBeTruthy();
    });
  });

  it('Component work', () => {
    const wrapper = mount(Flex, {
      slots: {
        default: `<div>test</div>`
      },
    });

    const wrapper2 = mount(Flex, {
      props: {
        componentTag: 'span'
      },
      slots: {
        default: `<div>test</div>`
      },
    });

    expect(wrapper.find('.ant-flex').element.tagName).toBe('DIV');
    expect(wrapper2.find('.ant-flex').element.tagName).toBe('SPAN');
  });

  it('when vertical=true should stretch work', () => {
    const wrapper = mount(Flex, {
      props: {
        vertical: true
      },
      slots: {
        default: `<div>test</div>`
      },
    });

    const wrapper2 = mount(Flex, {
      props: {
        vertical: true,
        align: 'center',
      },
      slots: {
        default: `<div>test</div>`,
      },
    });

    expect(wrapper.find('.ant-flex-align-stretch')).toBeTruthy();
    expect(wrapper2.find('.ant-flex-align-center')).toBeTruthy();
  });

  it('wrap prop shouled support boolean', () => {
    const wrapper = mount(Flex, {
      props: {
        wrap: 'wrap',
      },
      slots: {
        default: `<div>test</div>`,
      },
    });

    const wrapper2 = mount(Flex, {
      props: {
        wrap: true,
      },
      slots: {
        default: `<div>test</div>`,
      },
    });

    expect(wrapper.classes('ant-flex-wrap-wrap')).toBeTruthy();
    expect(wrapper2.classes('ant-flex-wrap-wrap')).toBeTruthy();
  })
})
