import React, { useRef } from "react";
import SVG from "react-inlinesvg";
import {
  TransformWrapper,
  TransformComponent,
  ReactZoomPanPinchRef,
} from "react-zoom-pan-pinch";
import svgReset from "./Reset.svg";
import svgZoomIn from "./ZoomIn.svg";
import svgZoomOut from "./ZoomOut.svg";
import "./index.scss";

const INITIAL_SCALE = 2;

export const ZoomableSvg = ({
  data,
  preProcess,
} : {
  data: any,
  preProcess: any,
}) => {
  const transformComponentRef = useRef<ReactZoomPanPinchRef | null>(null);

  const actionZoomIn = () => {
    if (transformComponentRef.current) {
      const { zoomIn } = transformComponentRef.current;
      zoomIn();
    }
  };

  const actionZoomOut = () => {
    if (transformComponentRef.current) {
      const { zoomOut } = transformComponentRef.current;
      zoomOut();
    }
  };

  const actionReset = () => {
    if (transformComponentRef.current) {
      const { centerView } = transformComponentRef.current;
      centerView(INITIAL_SCALE);
    }
  };

  return (
    <TransformWrapper
      initialScale={INITIAL_SCALE}
      centerOnInit
      centerZoomedOut
      initialPositionX={0}
      initialPositionY={0}
      ref={transformComponentRef}
      wheel={{
        // step: 0.5,
        smoothStep: 0.004,
      }}
      // pinch={{
      //   step: 0.5,
      // }}
    >
      <React.Fragment>
        <TransformComponent
          wrapperStyle={{
            width: '100%',
            height: '100%',
          }}
          contentStyle={{
            height: "100%",
            // width: "auto",
          }}
        >
          <SVG
            id="zoomable-svg"
            src={data}
            preProcessor={(code) => preProcess(code)}
            // style={{ width: "100%", height: "auto" }}
          />
        </TransformComponent>

        <div
          style={{
            position: "absolute",
            top: "1rem",
            left: "unset",
            right: "1rem",
            bottom: "unset",
            backgroundColor: "rgba(19, 20, 22, 0.9)",
            borderRadius: "2px",
            display: "flex",
            flexDirection: "column",
            padding: "2px 1px",
          }}
        >
          <button
            className="zoomable-toolbar-button"
            onClick={actionZoomIn}
          >
            <img src={svgZoomIn} style={{ width: "100%", height: "100%" }} />
          </button>
          <button
            className="zoomable-toolbar-button"
            onClick={actionZoomOut}
          >
            <img src={svgZoomOut} style={{ width: "100%", height: "100%" }} />
          </button>
          <button
            className="zoomable-toolbar-button"
            onClick={actionReset}
          >
            <img src={svgReset} style={{ width: "100%", height: "100%" }} />
          </button>
        </div>
      </React.Fragment>
    </TransformWrapper>
  );
};
