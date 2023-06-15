import { BrowserRouter, Route, Routes } from "react-router-dom";
import NewsSection from "./sections/NewsSection";
import ClimbAppBar from "./components/ClimbAppBar";
import RoutesSection from "./sections/RoutesSection";
import { createContext, useEffect, useState } from "react";
import { isLogged, getUserInfo } from "./utils/auth";
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";
import ProfilePage from "./pages/ProfilePage";

export interface UserInfo {
  readonly username : string,
  readonly isStaff : string
  readonly id : number
}

export const UserContext = createContext<any>(isLogged());
export const UserInfoContext = createContext<any>(null);

function App() {
  const [user, setUser] = useState<Boolean>(isLogged());
  const [userInfo, setUserInfo] = useState<UserInfo | null>();
  
  useEffect(() => {
    const fetchData = async () => {
      setUserInfo(await getUserInfo())
    }
  
    fetchData()
      .catch(console.error);
  }, [user])


  return (
    <BrowserRouter>
      <UserContext.Provider value={{ user: user, setUser: setUser }}>
        <UserInfoContext.Provider value={{ userInfo : userInfo }}>
            <ClimbAppBar />
            <Routes>
              <Route path ="/" element={<NewsSection />} />
              <Route path ="/news" element={<NewsSection />} />
              <Route path="/routes" element={<RoutesSection />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/signup" element={<SignupPage />} />
              <Route path="/profile" element={<ProfilePage />} />
            </Routes>
        </UserInfoContext.Provider>
      </UserContext.Provider>
    </BrowserRouter>
  );
}

export default App;