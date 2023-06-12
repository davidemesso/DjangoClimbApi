import axios from "axios";
import { useContext, useEffect, useState } from "react";
import RouteCard from "../components/RouteCard";
import { getAccessToken } from "../utils/auth";
import { Box } from "@mui/material";
import { UserInfoContext } from "../App";
import AddRouteCard from "../components/AddRouteCard";

interface Route {
  readonly id: number;
  readonly name: string;
  readonly description: string;
  readonly end_date: string;
  readonly difficulty: number;
  readonly image: any;
  readonly favorites_count: number;
}

export interface Favorite {
  readonly route: number;
}

function RoutesSection() {
  const [routes, setRoutes] = useState<Array<Route>>([]);
  const [favorites, setFavorites] = useState<Array<Favorite>>([]);
  const [refresh, setRefresh] = useState<boolean>();
  const {userInfo} = useContext(UserInfoContext);

  useEffect(() => {
    axios.get('http://localhost:8000/api/routes')
      .then(response => {
        setRoutes(response.data);
      })
      .catch(error => {
        console.error(error);
      });

    const fetchData = async () => {
      await axios.get('http://localhost:8000/api/user/favorites',
        {
          headers: {
            'authorization': 'Bearer ' + await getAccessToken()
          }
        }
        )
        .then(response => {
          setFavorites(response.data);
        })
        .catch(error => {
          console.error(error);
        });
    }

    fetchData()
      .catch(console.error);
  }, [refresh]);

  const elements = routes.map((route: Route) =>
    <RouteCard 
      key={route.name + Math.random()}
      id={route.id}  
      title={route.name}
      description={route.description}  
      endDate={route.end_date}  
      difficulty={route.difficulty}  
      favoritesCount={route.favorites_count}
      favorites={favorites}
      image={route.image}
      refresh={refresh}
      setRefresh={setRefresh}
    />
  );

  return (
    <Box>
      {userInfo && userInfo.isStaff ? <AddRouteCard setRefresh={setRefresh} refresh={refresh}/> : <></>}
      <div className="flex flex-col w-[80%] mx-auto h-fit">
        {elements}
      </div>
    </Box>
  );
}
export default RoutesSection;