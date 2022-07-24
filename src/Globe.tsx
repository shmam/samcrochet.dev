// @ts-ignore
import createGlobe from 'cobe';
import { useEffect, useRef } from "react";

export interface GlobeProps {
  lat?: number;
  long?: number;
}

const Globe: React.FC<GlobeProps> = (props: GlobeProps) => {

  const canvasRef = useRef();
  const WIDTH = 150;
  const HEIGHT = 150;

  useEffect(() => {
    let phi = 0;
    const globe = createGlobe(canvasRef.current, {
      devicePixelRatio: 2,
      width: WIDTH * 2,
      height: HEIGHT * 2,
      phi: 0,
      theta: 0.31,
      dark: 0,
      diffuse: 0,
      mapSamples: 23000,
      mapBrightness: 12,
      baseColor: [0, 0, .5],
      markerColor: [1, 1, 1],
      glowColor: [0, 0, .7],
      markers: props.lat && props.long ? [
        { location: [props.lat, props.long], size: .1 },
      ] : [],
      onRender: (state: any) => {
        state.phi = phi;
        phi += 0.01;
      }
    });

    return () => {
      globe.destroy();
    };
  }, [props]);
  return (<canvas ref={canvasRef.current} style={{ width: WIDTH, height: HEIGHT }} />)
}

export default Globe;