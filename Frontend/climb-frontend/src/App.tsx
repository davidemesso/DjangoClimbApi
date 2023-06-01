import { BrowserRouter, Route, Routes } from "react-router-dom";
import NewsSection from "./sections/NewsSection";
import ClimbAppBar from "./components/ClimbAppBar";
import RoutesSection from "./sections/RoutesSection";

function App() {

  return (
    <BrowserRouter>
      <ClimbAppBar />
      <Routes>
        <Route path ="/" element={<NewsSection />} />
        <Route path ="/news" element={<NewsSection />} />
        <Route path="/routes" element={<RoutesSection />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;