import React, { FC, useState } from "react";
import { FaAngleDoubleLeft, FaAngleDoubleRight, FaAngleLeft, FaAngleRight } from "react-icons/fa";

// const PAGE_SIZES: number[] = [8, 16, 24];
const THROTTLE_TIME = 500;

interface PropsType {
  pageCount: number;
  pageIndex: number;
  pageSize: number;
  gotoPage: (e: number) => void;
  disabled?: boolean;
  // setPageSize: (e: number) => void,
}

export const CustomPagination: FC<PropsType> = ({
  pageCount,
  pageIndex,
  // eslint-disable-next-line
  pageSize,
  gotoPage,
  disabled = false,
  // setPageSize,
}) => {
  const canPreviousPage = pageIndex > 0;
  const canNextPage = pageIndex < pageCount - 1;
  const [isInThrottle, setIsInThrottle] = useState(false);
  const previousPage = () => {
    if (canPreviousPage) {
      gotoPage(pageIndex - 1);
    }
  };
  const nextPage = () => {
    if (canNextPage) {
      gotoPage(pageIndex + 1);
    }
  };

  return (
    <div className="flex justify-center items-center mt-4">
      <div className="d-flex">
        <button
          className="btn btn-primary mr-2"
          onClick={() => {
            gotoPage(0);
            setIsInThrottle(true);
            setTimeout(() => {
              setIsInThrottle(false);
            }, THROTTLE_TIME);
          }}
          disabled={!canPreviousPage || isInThrottle || disabled}>
          <FaAngleDoubleLeft />
        </button>
        <button
          className="btn btn-primary"
          onClick={() => {
            previousPage();
            setIsInThrottle(true);
            setTimeout(() => {
              setIsInThrottle(false);
            }, THROTTLE_TIME);
          }}
          disabled={!canPreviousPage || isInThrottle || disabled}>
          <FaAngleLeft />
        </button>
      </div>

      <div className="d-flex align-items-center mx-2">
        <span>
          Page <span className="font-weight-bold">{pageIndex + 1}</span> of <span className="font-weight-bold">{pageCount}</span>
        </span>{" "}
      </div>

      <div className="d-flex ps-4 pe-2">
        <button
          className="btn btn-primary mr-2"
          onClick={() => {
            nextPage();
            setIsInThrottle(true);
            setTimeout(() => {
              setIsInThrottle(false);
            }, THROTTLE_TIME);
          }}
          disabled={!canNextPage || isInThrottle || disabled}>
          <FaAngleRight />
        </button>
        <button
          className="btn btn-primary"
          onClick={() => {
            gotoPage(pageCount - 1);
            setIsInThrottle(true);
            setTimeout(() => {
              setIsInThrottle(false);
            }, THROTTLE_TIME);
          }}
          disabled={!canNextPage || isInThrottle || disabled}>
          <FaAngleDoubleRight />
        </button>
      </div>
    </div>
  );
};
