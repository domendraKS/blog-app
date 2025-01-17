import { Pagination } from "flowbite-react";
import React from "react";

const PaginationComp = ({ currentPageNo, totalPage, onPageChange }) => {
  return (
    <>
      <div className="flex overflow-x-auto sm:justify-center my-2">
        <Pagination
          currentPage={currentPageNo}
          totalPages={totalPage}
          onPageChange={onPageChange}
        />
      </div>
    </>
  );
};

export default PaginationComp;
