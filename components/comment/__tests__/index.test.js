import { mount } from '@vue/test-utils';
import moment from 'moment';
import { asyncExpect } from '@/tests/utils';
import Comment from '..';
import List from '../../list';
import Form from '../../form';
import Button from '../../button';
import Input from '../../input';

const CommentTest = {
  data() {
    return {
      comments: [],
      submitting: false,
      value: '',
      moment,
    };
  },
  methods: {
    handleSubmit() {
      if (!this.value) {
        return;
      }

      this.submitting = true;

      setTimeout(() => {
        this.submitting = false;
        this.comments = [
          {
            author: 'Han Solo',
            avatar: 'https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png',
            content: this.value,
            datetime: moment().fromNow(),
          },
          ...this.comments,
        ];
        this.value = '';
      }, 1000);
    },
    handleChange(e) {
      this.value = e.target.value;
    },
  },
  render() {
    return (
      <div>
        {this.comments.length ? (
          <List
            dataSource={this.comments}
            header={`${this.comments.length} ${this.comments.length > 1 ? 'replies' : 'reply'}`}
            itemLayout="horizontal"
            renderItem={item => {
              return (
                <List.Item>
                  <Comment
                    author={item.author}
                    avatar={item.avatar}
                    content={item.content}
                    datetime={item.datetime}
                  />
                </List.Item>
              );
            }}
          />
        ) : null}
        <Comment>
          <div slot="content">
            <Form.Item>
              <Input.TextArea rows={4} onChange={this.handleChange} value={this.value} />
            </Form.Item>
            <Form.Item>
              <Button
                htmlType="submit"
                loading={this.submitting}
                onClick={this.handleSubmit}
                type="primary"
              >
                Add Comment
              </Button>
            </Form.Item>
          </div>
        </Comment>
      </div>
    );
  },
};

describe('Comment', () => {
  it('Comment can be used as editor, user can customize the editor component.', async () => {
    const wrapper = mount(CommentTest, {
      sync: false,
    });
    await asyncExpect(() => {
      wrapper.find('textarea').element.value = '222';
      wrapper.find('textarea').trigger('input');
    });
    await asyncExpect(() => {
      wrapper.find('Button').trigger('click');
    });

    await asyncExpect(() => {
      expect(wrapper.findAll('.ant-list-header').wrappers[0].element.innerHTML).toBe('1 reply');
      expect(wrapper.html()).toMatchSnapshot();
    }, 2000);
  });
});
