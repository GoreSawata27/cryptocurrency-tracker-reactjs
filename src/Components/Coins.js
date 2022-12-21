import React, { useEffect, useState } from "react";
import "../Components/Coins.css";

export default function Coins() {
  const [coins, setCoins] = useState([]);
  const [loadMore, setLoadMore] = useState(20);
  const [fevorite, setFevorite] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState();
  const [fav , setFav] = useState(true)

  const fetchCoins = async () => {
    try {
      const data = await fetch(
        `https://api.coinstats.app/public/v1/coins?skip=0&limit=${loadMore}&currency=EUR`
      );
      const result = await data.json();
      const Fav_store = result?.coins?.map((item) => {
        return { ...item, isFavorite: false };
      });
      setCoins(Fav_store);
      setLoading(false);
    } catch (error) {
      setError(error.msg);
    }
  };

  const handelSelect = (e) => {
    const name = e.target.value;
    if (name === "Price") {
      const store = coins?.sort((a, b) => b?.price - a?.price);
      setCoins([...store]);
    } else if (name === "MarketCap") {
      const store = coins?.sort((a, b) => b?.marketCap - a?.marketCap);
      setCoins([...store]);
    } else if (name === "%1h") {
      const store = coins?.sort((a, b) => b?.priceChange1h - a?.priceChange1h);
      setCoins([...store]);
    } else if (name === "%1d") {
      const store = coins?.sort((a, b) => b?.priceChange1d - a?.priceChange1d);
      setCoins([...store]);
    } else if (name === "Favorite") {
      const store = fevorite.sort();
      setCoins([...store]);
      setFav(false)
    }
  };

  const handelFavorite = (coin) => {
    const store = coins.map((item) => {
      return {
        ...item,
        coin, isFavorite:coin.id===item.id ? true : false
      };
    });

    setCoins(store);
    const arr = [...new Set(fevorite)];
    arr.push(coin);
    setFevorite(arr);
  };

  const handelMore = () => {
    setLoadMore((prev) => prev + 20);
  };

  useEffect(() => {
    fetchCoins();
  }, [loadMore]);

  const Mapping_coins = coins?.map((coin) => {
    return (
      <tr key={coin.id} className="coin-row">
        <td className="hide-mobile" >{coin.rank}</td>
        <td className="coin-name">
          <div className="img-symbol">
            <img src={coin.icon} alt="img" />
            {coin.name.slice(0, 12)}
          </div>
        </td>
        <td>${coin.price.toFixed(0).toLocaleString()}</td>
        <td className="hide-mobile">${coin.marketCap.toFixed(0).toLocaleString()}</td>
        <td className="hide-mobile">${coin.volume.toFixed(0)}</td>
        <td className="hide-mobile" >${coin.availableSupply.toFixed(0)} </td>
        <td>{coin.priceChange1h.toFixed(2)}%</td>
        <td>{coin.priceChange1d.toFixed(2)}%</td>
        <td>{coin.priceChange1w.toFixed(2)}%</td>
        <td className="hide-mobile">
          <button 
            className="Fav-button"
            onClick={() => handelFavorite(coin)}
            disabled={coin.isFavorite}
          >
           {
            fav ? 'Add':'Remove'
           }
          </button>
        </td>
      </tr>
    );
  });

  if (error) {
    return <div> {error}</div>;
  }
  return (
    <div className="container">
      <div className="navbar">
        <div className="logo">CryptroTracker</div>
        <div className="select">
          <select  onChange={handelSelect}>
            <option>Sort by</option>
            <option value="Price">Price</option>
            <option className="hide-mobile" value="MarketCap">MarketCap</option>
            <option  value="%1h">%1h</option>
            <option  value="%1d">%1d</option>
            <option  value="%1d">%1w</option>
            <option  value="Favorite">favourites</option>
          </select>
        </div>
      </div>
      <table>
        <thead>
          <tr>
            <th className="hide-mobile" >Rank</th>
            <th>Name</th>
            <th>Price</th>
            <th className="hide-mobile">MarketCap</th>
            <th className="hide-mobile">Volume</th>
            <th className="hide-mobile">Supply</th>
            <th>% 1h</th>
            <th>% 1d</th>
            <th>% 1w</th>
            <th className="hide-mobile">favourite</th>
          </tr>
        </thead>
        <tbody>{loading ? <div> loading...</div> : <>{Mapping_coins}</>}</tbody>
      </table>

      {loading ? (
        <div> </div>
      ) : (
        <div className="loadMore">
          <button onClick={handelMore} className="btn">
            Load More
          </button>
        </div>
      )}
    </div>
  );
}
