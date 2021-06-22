import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import Grid from "./components/Grid";
import "./App.scss";

function App() {
  const [newGame, setNewGame] = useState(false);
  const [list, setList] = useState([]);
  const [visibleItems, setVisibleItems] = useState([]);
  const [duration, setDuration] = useState(0);
  const [finishedItems, setFinishedItems] = useState([]);
  const [winner, setWinner] = useState(false);

  const useInterval = (callback, delay, duration) => {
    const durationRef = useRef(duration);
    const durationIntervalRef = useRef();

    const handler = () => {
      callback(durationRef);
    };

    useEffect(() => {
      const durationInterval = setInterval(handler, delay);
      durationIntervalRef.current = durationInterval;
      return () => {
        clearInterval(durationInterval);
      };
    }, [delay]);

    return durationIntervalRef;
  };

  const checkItems = (firstIndex, secondIndex) => {
    if (
      firstIndex !== secondIndex &&
      list[firstIndex].url === list[secondIndex].url
    ) {
      setFinishedItems([...finishedItems, firstIndex, secondIndex]);
    } else {
      setTimeout(() => {
        setVisibleItems([]);
      }, 600);
    }
  };

  // use axios to fetch thumb photos, build each thumb photos to a pair, next shuffle the cards
  useEffect(() => {
    axios
      .get(
        "https://api.unsplash.com/search/photos/?client_id=c0c103ae0af5122685dec516d4275b6471e81c388d2ce0791c61bb8f47285d5d&query=puppy&per_page=12"
      )
      .then((res) => {
        const newList = res.data.results.map((item) => {
          return {
            id: item.id,
            url: item.urls.thumb,
            description: item.alt_description,
          };
        });

        setList(
          newList
            .concat(
              newList.map((item) => {
                return {
                  ...item,
                  id: item.id + "1",
                };
              })
            )
            .sort(() => {
              return 0.5 - Math.random();
            })
        );
      });
  }, [newGame]);

  // track duration of the game
  const durationIntervalRef = useInterval(
    (durationRef) => {
      durationRef.current++;
      setDuration(durationRef.current);
    },
    1000,
    duration
  );

  // check all pairs are completed successfully
  useEffect(() => {
    if (finishedItems.length > 0 && finishedItems.length === list.length) {
      setWinner(true);
      clearInterval(durationIntervalRef.current);
    }
  }, [finishedItems]);

  return (
    <div className="text-center p-4 d-flex flex-column">
      {winner ? (
        <button
          onClick={() => {
            setNewGame(!newGame);
            setVisibleItems([]);
            setFinishedItems([]);
            setWinner(false);
          }}
          className="btn btn-success mb-4"
        >
          <strong>Start a New Game</strong>
        </button>
      ) : (
        <button className="btn btn-info mb-4" disabled>
          Memory Game
        </button>
      )}

      {list.length === 0 ? (
        <div>...Loading</div>
      ) : (
        <div>
          <Grid
            list={list}
            visibleItems={visibleItems}
            setVisibleItems={setVisibleItems}
            finishedItems={finishedItems}
            checkItems={checkItems}
          />
          {winner && (
            <div>
              Congratulation! You Complete the game.
              <br />
              Finished in {duration} seconds
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default App;
