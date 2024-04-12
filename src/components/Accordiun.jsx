import React, { useState, useEffect } from "react";
  
import { Link } from "react-router-dom";
import { useParams, useLocation, useSearchParams } from "react-router-dom";

function Accordion({ data, setAccordionOpen, accordionOpen }) {
  // const [accordionOpen, setAccordionOpen] = useState(false);
  const [paramFilter, setParamFilter] = useState("");
  const [params, setParams] = useSearchParams();
  const { type } = useParams();

  useEffect(() => {
    setParamFilter(params.get("filter"));
  }, [params]);

  const handleClick = () => {
    if (accordionOpen === data.title?.permalink) {
      setAccordionOpen("");
    } else setAccordionOpen(data.title?.permalink);
  };

  const handleSetParams = (list) => {
    // params.set("sort", list.permalink);
    // history.push({ search: params.toString() });

    setParams({ sort: list.permalink });
  };

  const generateLinkUrl = (list) => {
    let baseUrl = `/item-product-list/${data.title?.permalink}`;
    let queryParams = [];

    if (!list.permalink) {
    } else {
      queryParams.push(`filter=${list.permalink}`);
    }

    if (queryParams.length > 0) {
      baseUrl += `?${queryParams.join("&")}`;
    }

    return baseUrl;
  };

  return (
    <div className=" font-poppins ">
      <button
        onClick={handleClick}
        className=" py-1 flex justify-between items-center w-full"
      >
        <h4 className="  text-lg font-semibold">{data?.title?.name}</h4>
        <span
          className={` flex transition-all duration-300 ease-in-out justify-center items-center w-10 h-10 ${
            accordionOpen === data?.title?.permalink ? "" : "rotate-180"
          }`}
        >
          <FontAwesomeIcon icon={faAngleUp} />
        </span>
      </button>
      <div
        className={`overflow-hidden text-sm font-semibold transition-all duration-300 ease-in-out mt-2 grid ${
          accordionOpen === data.title?.permalink
            ? " grid-rows-[1fr] opacity-100 "
            : " grid-rows-[0fr] opacity-0 "
        }`}
      >
        <div className=" overflow-hidden border-b flex flex-col gap-2 items-start">
          {data.listItem.map((list, idx) => (
            <Link
              key={list.id}
              className=" w-full h-full"
              // onClick={() => handleSetParams(list)}
              to={generateLinkUrl(list)}
            >
              <div
                className={`p-[10px] hover:bg-[#F2F2F2] w-full text-left transition-colors duration-300 ease-in-out active:bg-primary-700 ${
                  data.title?.permalink === type
                    ? `${
                        paramFilter === list.permalink
                          ? " bg-primary hover:bg-primary"
                          : `${
                              !paramFilter && idx === 0
                                ? " bg-primary hover:bg-primary"
                                : " "
                            }`
                      }`
                    : " "
                }`}
              >
                <h5>{list.name}</h5>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Accordion;
