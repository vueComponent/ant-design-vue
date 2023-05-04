import TreeSelect from '..';
import focusTest from '../../../tests/shared/focusTest';
import mountTest from '../../../tests/shared/mountTest';
import { mount } from '@vue/test-utils';

const CUSTOM_DROPDOWN_RENDER_ID = 'custom_dropdown_id';
describe('TreeSelect', () => {
  focusTest(TreeSelect);
  mountTest(TreeSelect);

  it('custom dropdown render', async () => {
    const dropDownRenderHandler = jest.fn();
    const wrapper = mount(
      {
        render() {
          return (
            <TreeSelect>
              {{
                dropdownRender: () => {
                  dropDownRenderHandler();
                  return <div id={CUSTOM_DROPDOWN_RENDER_ID}>hello</div>;
                },
              }}
            </TreeSelect>
          );
        },
      },
      { sync: false, attachTo: 'body' },
    );
    wrapper.find('input').trigger('mousedown');
    expect(wrapper.find(`#${CUSTOM_DROPDOWN_RENDER_ID}`)).not.toBeNull();
  });
});
