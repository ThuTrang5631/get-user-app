import { useEffect, useState } from "react";
import Card from "./Component/Card";

const dataStore = {
  prev: [],
  next: [],
};

function App() {
  const [usersList, setUsersList] = useState([]);
  const [skip, setSkip] = useState(0);
  const [total, setTotal] = useState(0);

  const fetchDataPrev = async () => {
    try {
      let res;
      if (skip === 0) {
        res = await fetch(`https://dummyjson.com/users?limit=20`);
      } else {
        res = await fetch(
          `https://dummyjson.com/users?limit=20&skip=${skip - 20}`
        );
      }
      const data = await res.json();
      setTotal(data?.total);
      if (usersList.length === 0) {
        setUsersList(data?.users);
      } else {
        dataStore.prev = data?.users;
      }
    } catch (error) {
      console.log(error);
    }
  };

  const fetchDataNext = async () => {
    try {
      const res = await fetch(
        `https://dummyjson.com/users?limit=20&skip=${skip + 20}`
      );
      const data = await res.json();
      dataStore.next = data?.users;
    } catch (error) {
      console.log(error);
    }
  };

  const handleClickPrev = () => {
    setUsersList(dataStore.prev);
    setSkip(skip - 20);
  };

  const handleClickNext = () => {
    setUsersList(dataStore.next);
    setSkip(skip + 20);
  };

  useEffect(() => {
    fetchDataPrev();
    fetchDataNext();
  }, [skip]);

  return (
    <div className="app">
      <div className="contain-btns">
        <button disabled={skip === 0} className="btn" onClick={handleClickPrev}>
          Prev
        </button>
        <button
          disabled={skip === total - 20}
          className="btn"
          onClick={handleClickNext}
        >
          Next
        </button>
      </div>
      <div className="contain-card">
        {usersList?.map((item) => {
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
