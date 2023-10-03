import { useEffect, useState, useRef } from "react";
import Card from "./Component/Card";

let dataLists = {};

function App() {
  const [totalUsers, setTotalUsers] = useState(0);
  const maxPage = totalUsers / 20;
  const [disabled, setDisabled] = useState("");
  const [finishFetchFirst, setFinishFetchFirst] = useState(false);
  const page = useRef(0);
  const nextPage = page.current + 1;
  const prevPage = page.current - 1;
  const [pageCurrent, setPageCurrent] = useState(page.current);

  const loadImage = (image) => {
    return new Promise((resolve, reject) => {
      const loadImg = new Image();
      loadImg.src = image;
      // wait 500  milliseconds to simulate loading time
      loadImg.onload = () =>
        setTimeout(() => {
          resolve(image);
        }, 500);

      loadImg.onerror = (err) => reject(err);
    });
  };

  const fetchData = async () => {
    try {
      const res = await fetch(`https://dummyjson.com/users?limit=20`);
      const data = await res.json();
      setTotalUsers(data?.total);
      dataLists = { 0: data?.users };
      setFinishFetchFirst(true);
    } catch (error) {
      console.log(error);
    }
  };

  const fetchDataStore = async () => {
    setDisabled("disabled");

    try {
      const res = await fetch(
        `https://dummyjson.com/users?limit=20&skip=${20 * (page.current + 1)}`
      );
      const data = await res.json();
      dataLists = { ...dataLists, [page.current + 1]: data?.users };
      setDisabled("");
    } catch (error) {
      console.log(error);
      setDisabled("");
    }
  };

  const handleClickPrev = () => {
    page.current = prevPage;
    setPageCurrent(prevPage);
    console.log("pageclickprev", page);
  };

  const handleClickNext = () => {
    page.current = nextPage;
    console.log("pageClickNext", page);

    if (Object.keys(dataLists).length !== maxPage) {
      Promise.all(
        dataLists?.[pageCurrent]?.map((data) => loadImage(data?.image))
      )
        .then(() => {
          fetchDataStore();
        })
        .catch((err) => console.log("Failed to load images", err));
    }

    setPageCurrent(nextPage);

    if (Object.keys(dataLists).length === maxPage) {
      setDisabled(false);
    }
  };

  useEffect(() => {
    if (!finishFetchFirst) {
      fetchData();
    } else {
      console.log("dataLists?.[page]", dataLists?.[page.current]);
      Promise.all(
        dataLists?.[pageCurrent]?.map((data) => loadImage(data?.image))
      )
        .then(() => {
          fetchDataStore();
        })
        .catch((err) => console.log("Failed to load images", err));
    }
  }, [finishFetchFirst]);

  console.log("page", page);
  console.log("dataList", dataLists);
  console.log("data list", dataLists?.[pageCurrent]);

  return (
    <div className="app">
      <div className="contain-btns">
        <button
          disabled={pageCurrent === 0}
          className="btn"
          onClick={handleClickPrev}
        >
          Prev
        </button>
        <button
          disabled={pageCurrent === maxPage - 1}
          className={`btn ${disabled}`}
          onClick={handleClickNext}
        >
          Next
        </button>
      </div>
      <div className="contain-card">
        {dataLists?.[pageCurrent]?.map((item) => {
          return (
            <Card
              key={item?.id}
              src={item?.image}
              name={item?.firstName}
              email={item?.email}
            ></Card>
          );
        })}
      </div>
    </div>
  );
}

export default App;
