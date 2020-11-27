import { withInstall } from '../_util/type';
import ImageInternal, { ImageProps } from './Image';

const Image = ImageInternal;

export { ImageProps };
export default withInstall(Image);
