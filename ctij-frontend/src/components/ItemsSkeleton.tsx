import { Skeleton } from "@mui/material";

const ItemsSkeleton = () => {
  return (
    <tr style={{ height: 60 }}>
      <th
        className="whitespace-nowrap text-start ml-px pl-4 text-md font-bold leading-6 text-main-color "
        style={{ width: "33%" }}
      >
        <Skeleton
          animation="wave"
          variant="rounded"
          style={{ width: "100%", height: 40 }}
        />
      </th>
      <th
        className="  h-fit ml-px pl-4 text-md text-start font-bold leading-6 text-main-color"
        style={{ minWidth: 200, maxWidth: 200, width: "15%" }}
      >
        <div className="flex gap-2 items-center">
          <Skeleton
            animation="wave"
            variant="rounded"
            style={{ width: "100%", height: 40 }}
          />
        </div>
      </th>
      <th className="px-4 text-md text-start font-bold leading-6 text-main-color">
        <Skeleton
          animation="wave"
          variant="rounded"
          style={{ width: "100%", height: 40 }}
        />
      </th>
      <th className=" min-w-[60px]  max-w-[60px] pr-3 ">
        {" "}
        <Skeleton
          animation="wave"
          variant="rounded"
          style={{ width: "100%", height: 40 }}
        />
      </th>
    </tr>
  );
};

export default ItemsSkeleton;
