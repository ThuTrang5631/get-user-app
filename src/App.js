import { useEffect, useLayoutEffect, useState } from "react";
import Card from "./Component/Card";

let dataLists = {};

function App() {
  const [totalUsers, setTotalUsers] = useState(0);
  const maxPage = totalUsers / 20;
  const [page, setPage] = useState(undefined);

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
  console.log("dataLists", dataLists);

  const fetchDataStore = async () => {
    try {
      const res = await fetch(
        `https://dummyjson.com/users?limit=20&skip=${20 * (page + 1)}`
      );
      const data = await res.json();
      dataLists = { ...dataLists, [page + 1]: data?.users };
    } catch (error) {
      console.log(error);
    }
  };

  const handleClickPrev = () => {
    console.log("pageclickprev", page);
    setPage(page - 1);
  };

  const handleClickNext = () => {
    console.log("pageClickNext", page);
    setPage(page + 1);
  };

  useLayoutEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    if (page !== undefined && Object.keys(dataLists).length !== maxPage) {
      fetchDataStore();
    }
  }, [page]);

  console.log("data page 0", dataLists?.[0]);

  return (
    <div className="app">
      <div className="contain-btns">
        <button disabled={page === 0} className="btn" onClick={handleClickPrev}>
          Prev
        </button>
        <button
          disabled={page === maxPage - 1}
          className="btn"
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
