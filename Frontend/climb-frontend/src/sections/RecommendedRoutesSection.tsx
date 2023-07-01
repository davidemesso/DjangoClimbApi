import axios from "axios";
import { useContext, useEffect, useState } from "react";
import RouteCard from "../components/RouteCard";
import { getAccessToken, getUserInfo } from "../utils/auth";
import { Box, Typography } from "@mui/material";
import { UserInfoContext } from "../App";
import { useNavigate } from "react-router-dom";

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

function RecommendedRoutesSection() {
  const [routes, setRoutes] = useState<Array<Route>>([]);
  const [refresh, setRefresh] = useState<boolean>();
  const [favorites, setFavorites] = useState<Array<Favorite>>([]);
  const [average, setAverage] = useState<number | null>();
  const {userInfo} = useContext(UserInfoContext);
  const navigate = useNavigate()

  useEffect(() => {

    const fetchData = async () => {
      const userInfo = await getUserInfo()
      if (userInfo == null)
        return navigate("/")
        
      const accessToken = await getAccessToken()

      if(!accessToken)
        return;

      await axios.get(`http://localhost:8000/api/routes/recommended`,
      {
        headers: {
          'authorization': 'Bearer ' + accessToken
        }
      })
      .then(response => {
        setRoutes(response.data);
      })
      .catch(error => {
        console.error(error);
      });

      await axios.get('http://localhost:8000/api/user/favorites',
      {
        headers: {
          'authorization': 'Bearer ' + accessToken
        }
      })
      .then(response => {
        setFavorites(response.data);
      })
      .catch(error => {
        console.error(error);
      });

      await axios.get('http://localhost:8000/api/average/difficulty',
      {
        headers: {
          'authorization': 'Bearer ' + accessToken
        }
      })
      .then(response => {
        setAverage(response.data);
      })
      .catch(_ => {
        setAverage(null);
      });
    }

    fetchData()
      .catch(console.error);
  }, [refresh]);

  if (!userInfo)
    return <></>

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
      disableFavorites={true}    
    />
  );

  return (
    <Box>
      <Typography 
        className="px-8 pt-8"
        variant="h5">
        { `I percorsi suggeriti per te!` }
      </Typography>
      <Typography
        className="px-8"
        variant="h6">
        {
          average 
          ? `Basato sulla tua media difficoltà di: ${average.toPrecision(2)}`
          : "Non hai ancora dei percorsi preferiti, aggiungili per una raccomandazione migliore."
        }
      </Typography>
      <Box className="flex flex-col w-full mx-auto h-fit">
        {elements}
        {elements.length == 0 && 
          <Typography className="mt-4 text-center">
            Nessun percorso trovato
          </Typography>
        }
      </Box>
    </Box>
  );
}
export default RecommendedRoutesSection;