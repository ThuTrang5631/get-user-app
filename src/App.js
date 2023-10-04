import { useEffect, useState } from "react";
import Card from "./Component/Card";

let dataLists = {};
let page = 0;

function App() {
  const [totalUsers, setTotalUsers] = useState(0);
  const maxPage = totalUsers / 20;
  const [disabled, setDisabled] = useState("");
  const [finishFetchFirst, setFinishFetchFirst] = useState(false);
  const [pageCurrent, setPageCurrent] = useState(page);

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

  const fetchData = async (isFirst = false) => {
    setDisabled("disabled");

    const url = isFirst
      ? "https://dummyjson.com/users?limit=20"
      : `https://dummyjson.com/users?limit=20&skip=${20 * (page + 1)}`;

    try {
      const res = await fetch(url);
      const data = await res.json();
      setTotalUsers(data?.total);
      dataLists = isFirst
        ? { 0: data?.users }
        : { ...dataLists, [page + 1]: data?.users };
      setFinishFetchFirst(true);
      setDisabled("");
    } catch (error) {
      console.log(error);
      setDisabled("");
    }
  };

  const handleCurrentPage = () => {
    Promise.all(dataLists?.[pageCurrent]?.map((data) => loadImage(data?.image)))
      .then(() => {
        fetchData();
      })
      .catch((err) => console.log("Failed to load images", err));
  };

  const handleClickPrev = () => {
    page = page - 1;
    console.log("pageClickPrev", page);
    setPageCurrent(page);
  };

  const handleClickNext = () => {
    page = page + 1;
    console.log("pageClickNext", page);
    if (Object.keys(dataLists).length !== maxPage) {
      handleCurrentPage();
    }

    setPageCurrent(page);

    if (Object.keys(dataLists).length === maxPage) {
      setDisabled(false);
    }
  };

  useEffect(() => {
    if (!finishFetchFirst) {
      fetchData(true);
    } else {
      console.log("dataLists?.[page]", dataLists?.[pageCurrent]);
      handleCurrentPage();
    }
  }, [finishFetchFirst]);

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
