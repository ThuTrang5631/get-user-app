import { useEffect, useState } from "react";
import Card from "./Component/Card";

let dataLists = {};

function App() {
  const [totalUsers, setTotalUsers] = useState(0);
  const maxPage = totalUsers / 20;
  const [page, setPage] = useState(undefined);
  const [disabled, setDisabled] = useState("");

  const fetchData = async () => {
    try {
      const res = await fetch(`https://dummyjson.com/users?limit=20`);
      const data = await res.json();
      setTotalUsers(data?.total);
      dataLists = { 0: data?.users };
      setPage(0);
    } catch (error) {
      console.log(error);
    }
  };

  const fetchDataStore = async () => {
    setDisabled("disabled");

    try {
      const res = await fetch(
        `https://dummyjson.com/users?limit=20&skip=${20 * (page + 1)}`
      );
      const data = await res.json();
      dataLists = { ...dataLists, [page + 1]: data?.users };
      setDisabled("");
    } catch (error) {
      console.log(error);
      setDisabled("");
    }
  };

  const handleClickPrev = () => {
    console.log("pageclickprev", page);
    setPage(page - 1);
  };

  const handleClickNext = () => {
    console.log("pageClickNext", page);
    setPage(page + 1);

    if (Object.keys(dataLists).length === maxPage) {
      setDisabled(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    if (page !== undefined && Object.keys(dataLists).length !== maxPage) {
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

      console.log("dataLists?.[page]", dataLists?.[page]);
      Promise.all(dataLists?.[page]?.map((data) => loadImage(data?.image)))
        .then(() => {
          fetchDataStore();
        })
        .catch((err) => console.log("Failed to load images", err));
    }
  }, [page]);

  return (
    <div className="app">
      <div className="contain-btns">
        <button disabled={page === 0} className="btn" onClick={handleClickPrev}>
          Prev
        </button>
        <button
          disabled={page === maxPage - 1}
          className={`btn ${disabled}`}
          onClick={handleClickNext}
        >
          Next
        </button>
      </div>
      <div className="contain-card">
        {dataLists?.[page]?.map((item) => {
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
