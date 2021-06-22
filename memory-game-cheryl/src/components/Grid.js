import React from "react";
import Card from "./Card";

const Grid = (props) => {
  const { list, visibleItems, setVisibleItems, finishedItems, checkItems } =
    props;

  return (
    <div className="container">
      <div className="row">
        {list.map((item, index) => (
          <Card
            key={item.id}
            className={`col-lg-2 col-md-3 col-sm-4 col-xs-6 card ${
              visibleItems.includes(index) ? "grid-card-show" : ""
            } ${
              finishedItems.includes(index)
                ? "grid-card-show grid-card-finished"
                : ""
            }`}
            onClick={() => {
              if (!finishedItems.includes(index)) {
                switch (visibleItems.length) {
                  case 0:
                    setVisibleItems([index]);
                    break;
                  case 1:
                    if (visibleItems[0] !== index) {
                      setVisibleItems(visibleItems.concat(index));
                      checkItems(visibleItems[0], index);
                    }
                    break;
                  case 2:
                    setVisibleItems([index]);
                    break;
                  default:
                    setVisibleItems([]);
                }
              }
            }}
            imgSource={item.url}
            imgDesc={item.description}
          />
        ))}
      </div>
    </div>
  );
};

Grid.defaultProps = {
  list: [],
};

export default Grid;
