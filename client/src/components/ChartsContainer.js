import Wrapper from "../assets/wrappers/ChartsContainer";
import { useState } from "react";
import BarChart from "./BarChart";
import AreaChart from "./AreaChart";
import { useAppContext } from "./context/appContext";

const ChartsContainer = () => {
  const [barChart, setBarChart] = useState(true);
  const { monthlyApplications: data } = useAppContext();

  return (
    <Wrapper>
      <h1>Monthly Application</h1>
      <button type="button" onClick={() => setBarChart(!barChart)}>
        {barChart ? "Area Chart" : "Bar Chart"}
      </button>

      {barChart ? <BarChart data={data} /> : <AreaChart data={data} />}
    </Wrapper>
  );
};
export default ChartsContainer;
