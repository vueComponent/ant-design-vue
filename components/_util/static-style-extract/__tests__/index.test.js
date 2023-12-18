// import { StyleProvider } from '../../cssinjs';
import { extractStyle } from '../index';
import { ConfigProvider } from '../../../components';
import { theme } from '../../../index';

const testGreenColor = '#008000';
describe('Static-Style-Extract', () => {
  it('should extract static styles', () => {
    const cssText = extractStyle();
    expect(cssText).not.toContain(testGreenColor);
    expect(cssText).toMatchSnapshot();
  });
  it('should extract static styles with customTheme', () => {
    const cssText = extractStyle(node => {
      return (
        <ConfigProvider
          theme={{
            token: {
              colorPrimary: testGreenColor,
            },
          }}
        >
          {node}
        </ConfigProvider>
      );
    });
    expect(cssText).toContain(testGreenColor);
    expect(cssText).toMatchSnapshot();
  });

  it('should extract static styles with customTheme and customStyle', () => {
    const cssText = extractStyle(node => {
      return (
        <ConfigProvider
          theme={{
            algorithm: theme.darkAlgorithm,
            token: {
              colorPrimary: testGreenColor,
            },
          }}
        >
          {node}
        </ConfigProvider>
      );
    });
    expect(cssText).toContain('#037003');
    expect(cssText).toMatchSnapshot();
  });
  // it('with custom hashPriority', () => {
  //   const cssText = extractStyle(
  //     (node) => (
  //       <StyleProvider hashPriority='high'>
  //         <ConfigProvider
  //           theme={{
  //             token: {
  //               colorPrimary: testGreenColor,
  //             },
  //           }}
  //         >
  //           {node}
  //         </ConfigProvider>
  //       </StyleProvider>
  //     ),
  //   );
  //   expect(cssText).toContain(testGreenColor);
  //   expect(cssText).not.toContain(':where');
  //   expect(cssText).toMatchSnapshot();
  //
  //   const cssText2 = extractStyle((node) => (
  //     <ConfigProvider
  //       theme={{
  //         token: {
  //           colorPrimary: testGreenColor,
  //         },
  //       }}
  //     >
  //       {node}
  //     </ConfigProvider>
  //   ));
  //   expect(cssText2).toContain(':where');
  // });
});
