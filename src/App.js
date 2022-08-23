
import './App.css';
import SpeciesTable from './SpeciesTable';
import SpeciesBarChart from './SpeciesBarChart';
import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";

function App() {
  return (
    <BrowserRouter>
      <nav className="navbar navbar-expand navbar-dark bg-dark">
        <div className="navbar-nav mr-auto">
        <Link to={"/"} className="navbar-brand">
            Species viewer
          </Link>
          <li className="nav-item">
            <Link to={"/graph"} className="nav-link">
              Graph
            </Link>
          </li>
          <li className="nav-item">
            <Link to={"/table"} className="nav-link">
              Table
            </Link> 
          </li>
        </div>
      </nav>
      <Routes>
        <Route path="/" element={
        <div>
          <div>Welcome to species viewer !</div>
          <div>Please click on a panel.</div>
        </div>}></Route>
        <Route path="/graph" element={<SpeciesBarChart></SpeciesBarChart>}></Route>
        <Route path="/table" element={<SpeciesTable></SpeciesTable>}></Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
