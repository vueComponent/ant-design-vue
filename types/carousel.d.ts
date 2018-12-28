import { AntdVueComponent } from './component';

/** ACarousel Layout Component */
export declare class ACarousel extends AntdVueComponent {
  afterChange(current: number): void

  autoplay: boolean

  beforeChange(form: number, to: number): void

  dots: boolean

  easing: string

  effect: string

  vertical: boolean

  goTo(slideNumber: number): void

  next(): void

  prev(): void
}

/** ACarouselPanel Layout Component */
export declare class ACarouselPanel extends AntdVueComponent {

}
