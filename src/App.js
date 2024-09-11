
import './App.css';

import Table from './Table';
import { data } from "./Utils/Utils"
import { headers, movieHeaders, moviedata } from "./Utils/Utils"

function App() {
  return (
    <div className="App ">
      <Table data={moviedata} headers={movieHeaders} />


    </div>
  );
}

export default App;
