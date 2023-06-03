import { BrowserRouter, Route, Routes } from "react-router-dom";
import NewsSection from "./sections/NewsSection";
import ClimbAppBar from "./components/ClimbAppBar";
import RoutesSection from "./sections/RoutesSection";
import { createContext, useState } from "react";
import { isLogged } from "./utils/login";
import LoginPage from "./pages/LoginPage";

export const UserContext = createContext<any>(isLogged());

function App() {
  const [user, setUser] = useState<Boolean>(isLogged());

  return (
    <BrowserRouter>
      <UserContext.Provider value={{ user: user, setUser: setUser }}>
      <ClimbAppBar />
      <Routes>
        <Route path ="/" element={<NewsSection />} />
        <Route path ="/news" element={<NewsSection />} />
        <Route path="/routes" element={<RoutesSection />} />
        <Route path="/login" element={<LoginPage />} />
      </Routes>
      </UserContext.Provider>
    </BrowserRouter>
  );
}

export default App;