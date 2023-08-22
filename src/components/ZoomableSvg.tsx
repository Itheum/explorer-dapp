import React, { useRef } from "react";
import SVG from "react-inlinesvg";
import {
  TransformWrapper,
  TransformComponent,
  ReactZoomPanPinchRef,
} from "react-zoom-pan-pinch";

export const ZoomableSvg = ({
  data,
  preProcess,
} : {
  data: any,
  preProcess: any,
}) => {
  const transformComponentRef = useRef<ReactZoomPanPinchRef | null>(null);

  const zoomIn = () => {
    if (transformComponentRef.current) {
      const { zoomIn } = transformComponentRef.current;
      zoomIn();
    }
  };

  const zoomOut = () => {
    if (transformComponentRef.current) {
      const { zoomOut } = transformComponentRef.current;
      zoomOut();
    }
  };

  const resetTransform = () => {
    if (transformComponentRef.current) {
      const { resetTransform } = transformComponentRef.current;
      resetTransform();
    }
  };

  return (
    <TransformWrapper
      initialScale={1}
      initialPositionX={0}
      initialPositionY={0}
      ref={transformComponentRef}
    >
      <React.Fragment>
        <TransformComponent
          wrapperStyle={{ width: "100%", aspectRatio: "1 / 1" }}
          contentStyle={{ width: "100%", height: "auto" }}
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
            onClick={zoomIn}
            style={{
              display: "block",
              width: "24px",
              height: "24px",
              margin: "1px 2px",
              color: "rgb(255, 255, 255)",
              transition: "color 200ms ease 0s",
              background: "none",
              padding: "0px",
              border: "0px",
              outline: "0px",
              cursor: "pointer"
            }}
          ><svg
              width="24" height="24" stroke="currentColor">
              <g>
                <path
                  d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z">
                </path>
                <path d="M12 10h-2v2H9v-2H7V9h2V7h1v2h2v1z"></path>
              </g>
            </svg>
          </button>
          <button
            onClick={zoomOut}
            style={{
              display: "block",
              width: "24px",
              height: "24px",
              margin: "1px 2px",
              color: "rgb(255, 255, 255)",
              transition: "color 200ms ease 0s",
              background: "none",
              padding: "0px",
              border: "0px",
              outline: "0px",
              cursor: "pointer"
            }}
          ><svg
              width="24" height="24" stroke="currentColor">
              <path
                d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14zM7 9h5v1H7z">
              </path>
            </svg>
          </button>
          <button
            onClick={resetTransform}
            style={{
              display: "block",
              width: "24px",
              height: "24px",
              margin: "1px 2px",
              color: "rgb(255, 255, 255)",
              transition: "color 200ms ease 0s",
              background: "none",
              padding: "0px",
              border: "0px",
              outline: "0px",
              cursor: "pointer"
            }}
          >
            <svg
              width="24" height="24" stroke="currentColor">
              <path
                d="M15 3l2.3 2.3-2.89 2.87 1.42 1.42L18.7 6.7 21 9V3zM3 9l2.3-2.3 2.87 2.89 1.42-1.42L6.7 5.3 9 3H3zm6 12l-2.3-2.3 2.89-2.87-1.42-1.42L5.3 17.3 3 15v6zm12-6l-2.3 2.3-2.87-2.89-1.42 1.42 2.89 2.87L15 21h6z">
              </path>
            </svg>
          </button>
        </div>
      </React.Fragment>
    </TransformWrapper>
  );
};
