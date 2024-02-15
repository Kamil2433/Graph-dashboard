import React, { useState } from "react";
import { useContext } from "react";
import useLocalStoragehook from "../hooks/useLocalstorage";

const Datacontext = React.createContext();

export function useData() {
  return useContext(Datacontext);
}

export default function Datacontxt({ children }) {
  const [data, setdata] = useLocalStoragehook("data", "");
  const [dataforpie, setpie] = useLocalStoragehook("piedata", "");
  const [dataforbar, setbar] = useLocalStoragehook("bardata", "");
  const [dataforline, setline] = useLocalStoragehook("linedata", "");
  const sectorCounts = {};
  const countryCounts = {};

  async function fetchdata() {
    const response = await fetch("http://localhost:3200/getdata", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
      },
      //  body:JSON.stringify({id:inputid,password:inputpassword})
    });
    const res = await response.json();
    const j = await setdata(res);
    // console.log(res);

    await getcountforpie(res);
    await getcountforbar(res);
    await getdataforline(res);
  }

  async function getcountforpie(indata) {
    const a = await indata.forEach((entry) => {
      if (entry.sector !== null) {
        const sector = entry.sector;

        // Check if the sector is already in the counts object
        if (entry.sector !== "" && sector !== "undefined") {
          if (sectorCounts[sector]) {
            // Increment the count if it exists

            sectorCounts[sector]++;
          } else {
            // Initialize the count to 1 if the sector is encountered for the first time
            sectorCounts[sector] = 1;
          }
        }
      }
    });

    // console.log(sectorCounts);

    var obj = await Object.entries(sectorCounts).map(([sector, count]) => ({
      sector,
      count,
    }));

    const obj1 = obj.slice(1, 15);
    // console.log(obj1);

    setpie(obj1);
  }

  async function getcountforbar(indata) {
    const a = await indata.forEach((entry) => {
      if (entry.sector !== null) {
        const country = entry.country;

        // Check if the sector is already in the counts object
        if (entry.country !== "" && country !== "undefined") {
          if (countryCounts[country]) {
            // Increment the count if it exists

            countryCounts[country]++;
          } else {
            // Initialize the count to 1 if the sector is encountered for the first time
            countryCounts[country] = 1;
          }
        }
      }
    });
    // console.log("here is ctry count:");
    // console.log(countryCounts);

    var obj = await Object.entries(countryCounts).map(([country, count]) => ({
      country,
      count,
    }));

    const obj2 = obj.slice(0, 40);
    // console.log(obj2);

    setbar(obj2);
  }

  function getdataforline(data) {
    const formattedData = data.map((d) => ({
      published: Date.parse(d.published),
      intensity: d.intensity,
      relevance: d.relevance,
    }));

    const finalformat = filterData(formattedData);
    finalformat.sort((a, b) => a.published - b.published);

    const final = finalformat.slice(0, 50);
    // console.log("here is the line data--");
    // console.log(dataforline);
    setline(final);
  }

  function filterData(data) {
    return data.filter(
      (entry) =>
        entry.hasOwnProperty("published") &&
        entry.hasOwnProperty("relevance") &&
        entry.hasOwnProperty("intensity")
    );
  }

  return (
    <Datacontext.Provider
      value={{
        fetchdata,
        data,
        setdata,
        dataforpie,
        getcountforpie,
        dataforbar,
        setbar,
        getcountforbar,
        dataforline,
        setline,
      }}
    >
      {children}
    </Datacontext.Provider>
  );
}
