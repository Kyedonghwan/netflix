import styled from "styled-components";
import {BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./routes/Home";
import TV from "./routes/TV";
import Search from "./routes/Search";
import Header from "./components/Header";

function App() {

  return (
    <BrowserRouter>
      <Header />
      <Routes>
        <Route path="/tv" element={<TV />}></Route>
        <Route path="/search" element={<Search />}></Route>
        <Route path="/" element={<Home />}>
          <Route path="/movies/:movieId" element={<Home />}></Route>
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App;
