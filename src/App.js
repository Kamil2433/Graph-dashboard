import React from "react";
import Navbartop from "./Components/Navbartop";
import Datacontext from "./Context/DataContext";
import Bargraph from "./Components/Bargraph";
import Piechart from "./Components/Piechart";
import Linegraph from "./Components/Linegraph";

function App() {
  return (
    <>
      <Datacontext>
        <Navbartop />

        <div className="container border-solid my-2 py-5">
          <Linegraph />
        </div>

        <div className="border-solid border-2 container float-root flex flex-row  mx-l m-px p-[5px]  w-sm">
          <div
            className=" flex border mx-1 max-w-full max-h-screen"
            style={{ width: "800px", height: "300px" }}
          >
            <Bargraph className="" />
          </div>

          <div className="container border">
            <Piechart />
          </div>
        </div>
      </Datacontext>
    </>
  );
}

export default App;
