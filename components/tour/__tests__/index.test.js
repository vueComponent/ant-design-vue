import Tour from '..';
import mountTest from '../../../tests/shared/mountTest';

describe('Tour', () => {
  mountTest({
    render() {
      return (
        <Tour
          steps={[
            {
              title: 'Antdv',
              description: 'Ant Design Vue',
            },
          ]}
        />
      );
    },
  });
});
