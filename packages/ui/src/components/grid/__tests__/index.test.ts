import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import { Row, Col } from '@ant-design-vue/ui'

describe('Row', () => {
  it('renders with ant-row class', () => {
    const wrapper = mount(Row)
    expect(wrapper.classes('ant-row')).toBe(true)
  })

  it('renders slot content', () => {
    const wrapper = mount(Row, {
      slots: { default: '<div class="child">content</div>' },
    })
    expect(wrapper.find('.child').exists()).toBe(true)
  })

  it('applies justify style', () => {
    const wrapper = mount(Row, {
      props: { justify: 'center' },
    })
    expect(wrapper.element.style.justifyContent).toBe('center')
  })

  it('applies align style', () => {
    const wrapper = mount(Row, {
      props: { align: 'middle' },
    })
    expect(wrapper.element.style.alignItems).toBe('center')
  })

  it('applies nowrap when wrap is false', () => {
    const wrapper = mount(Row, {
      props: { wrap: false },
    })
    expect(wrapper.element.style.flexWrap).toBe('nowrap')
  })

  it('applies negative margin for numeric gutter', () => {
    const wrapper = mount(Row, {
      props: { gutter: 16 },
    })
    expect(wrapper.element.style.marginLeft).toBe('-8px')
    expect(wrapper.element.style.marginRight).toBe('-8px')
  })

  it('applies row-gap for array gutter', () => {
    const wrapper = mount(Row, {
      props: { gutter: [16, 24] },
    })
    expect(wrapper.element.style.marginLeft).toBe('-8px')
    expect(wrapper.element.style.rowGap).toBe('24px')
  })
})

describe('Col', () => {
  it('renders with ant-col class', () => {
    const wrapper = mount(Col)
    expect(wrapper.classes('ant-col')).toBe(true)
  })

  it('applies span as flex width', () => {
    const wrapper = mount(Col, {
      props: { span: 12 },
    })
    expect(wrapper.element.style.flex).toBe('0 0 50%')
    expect(wrapper.element.style.maxWidth).toBe('50%')
  })

  it('hides when span is 0', () => {
    const wrapper = mount(Col, {
      props: { span: 0 },
    })
    expect(wrapper.element.style.display).toBe('none')
  })

  it('applies offset as margin', () => {
    const wrapper = mount(Col, {
      props: { span: 12, offset: 6 },
    })
    expect(wrapper.element.style.marginInlineStart).toBe('25%')
  })

  it('applies push as inset', () => {
    const wrapper = mount(Col, {
      props: { span: 12, push: 6 },
    })
    expect(wrapper.element.style.insetInlineStart).toBe('25%')
  })

  it('applies pull as inset', () => {
    const wrapper = mount(Col, {
      props: { span: 12, pull: 6 },
    })
    expect(wrapper.element.style.insetInlineEnd).toBe('25%')
  })

  it('applies order', () => {
    const wrapper = mount(Col, {
      props: { span: 12, order: 3 },
    })
    expect(wrapper.element.style.order).toBe('3')
  })

  it('applies flex shorthand (number)', () => {
    const wrapper = mount(Col, {
      props: { flex: 1 },
    })
    expect(wrapper.element.style.flex).toBe('1 1 auto')
  })

  it('applies flex shorthand (dimension string)', () => {
    const wrapper = mount(Col, {
      props: { flex: '200px' },
    })
    expect(wrapper.element.style.flex).toBe('0 0 200px')
  })

  it('applies flex shorthand (auto)', () => {
    const wrapper = mount(Col, {
      props: { flex: 'auto' },
    })
    // 'auto' is not a dimension, so parseFlex passes it through
    expect(wrapper.element.style.flex).toBe('1 1 auto')
  })

  it('receives gutter padding from Row', () => {
    const wrapper = mount({
      template: '<Row :gutter="16"><Col :span="12">test</Col></Row>',
      components: { Row, Col },
    })
    const col = wrapper.find('.ant-col')
    expect((col.element as HTMLElement).style.paddingLeft).toBe('8px')
    expect((col.element as HTMLElement).style.paddingRight).toBe('8px')
  })
})
