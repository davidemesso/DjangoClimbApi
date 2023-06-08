import { BrowserRouter, Route, Routes } from "react-router-dom";
import NewsSection from "./sections/NewsSection";
import ClimbAppBar from "./components/ClimbAppBar";
import RoutesSection from "./sections/RoutesSection";
import { createContext, useEffect, useState } from "react";
import { isLogged, isStaff } from "./utils/auth";
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";

export const UserContext = createContext<any>(isLogged());
export const UserStaffContext = createContext<any>(await isStaff());

function App() {
  const [user, setUser] = useState<Boolean>(isLogged());
  const [staff, setIsStaff] = useState<Boolean>();
  
  useEffect(() => {
    const fetchData = async () => {
      setIsStaff(await isStaff())
    }
  
    fetchData()
      .catch(console.error);
  }, [user])


  return (
    <BrowserRouter>
      <UserContext.Provider value={{ user: user, setUser: setUser }}>
        <UserStaffContext.Provider value={{ isStaff: staff }}>
            <ClimbAppBar />
            <Routes>
              <Route path ="/" element={<NewsSection />} />
              <Route path ="/news" element={<NewsSection />} />
              <Route path="/routes" element={<RoutesSection />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/signup" element={<SignupPage />} />
            </Routes>
        </UserStaffContext.Provider>
      </UserContext.Provider>
    </BrowserRouter>
  );
}

export default App;