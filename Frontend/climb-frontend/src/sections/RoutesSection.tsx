import axios from "axios";
import { useEffect, useState } from "react";
import RouteCard from "../components/RouteCard";
import { getAccessToken } from "../utils/auth";

interface Route {
  readonly id: number;
  readonly name: string;
  readonly description: string;
  readonly end_date: string;
  readonly difficulty: number;
  readonly favorites_count: number;
}

export interface Favorite {
  readonly route: number;
}

function RoutesSection() {
  const [routes, setRoutes] = useState<Array<Route>>([]);
  const [favorites, setFavorites] = useState<Array<Favorite>>([]);

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
  }, []);

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
    />
  );

  return (
    <div className="flex flex-col w-[80%] mx-auto h-fit">
      {elements}
    </div>
  );
}
export default RoutesSection;