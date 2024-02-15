import { useEffect, useState } from "react";


const prefix = "dashboard";

export default function useLocalStoragehook(key, initialvalue){
  const prefixedkey = prefix + key;

 

  const [value, setvalue] = useState(() => {
    const value = localStorage.getItem(prefixedkey);

    if (value!==null) {
      return JSON.parse(value)
    }

    if (typeof initialvalue === "function") {
      return initialvalue();
    } else {
      return initialvalue;
    }
  })

  useEffect(() => {
    localStorage.setItem(prefixedkey, JSON.stringify(value));
  }, [prefixedkey,value])

  return [value, setvalue];

}

