import axios from "axios";
import { useEffect, useState } from "react";
import RouteCard from "../components/RouteCard";
import { Box } from "@mui/material";

interface Route {
  readonly name: string;
  readonly description: string;
}

function NewsSection() {
  const [routes, setRoutes] = useState([]);

  useEffect(() => {
    axios.get('http://localhost:8000/api/routes')
      .then(response => {
        setRoutes(response.data);
      })
      .catch(error => {
        console.error(error);
      });
  }, []);

  const elements = routes.map((route: Route) =>
    <RouteCard 
      key={route.name + Math.random()}
      title={route.name}
      description={route.description}  
    />
  );

  return (
    <Box>
      <div className="flex flex-col w-full h-full">
        {elements}
      </div>
    </Box>
  );
}
export default NewsSection;