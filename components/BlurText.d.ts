declare module '@/components/BlurText' {
  import { FC } from 'react';

  interface BlurTextProps {
    text?: string;
    delay?: number;
    className?: string;
    animateBy?: 'words' | 'chars';
    direction?: 'top' | 'bottom';
    threshold?: number;
    rootMargin?: string;
    animationFrom?: Record<string, any>;
    animationTo?: Record<string, any>[];
    easing?: (t: number) => number;
    onAnimationComplete?: (() => void) | undefined;
    stepDuration?: number;
  }

  const BlurText: FC<BlurTextProps>;
  export default BlurText;
}
