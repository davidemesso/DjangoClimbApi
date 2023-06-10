import axios from "axios";
import { useEffect, useState } from "react";
import RouteCard from "../components/RouteCard";

interface Route {
  readonly name: string;
  readonly description: string;
  readonly difficulty: number;
}

function RoutesSection() {
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
      difficulty={route.difficulty}  
    />
  );

  return (
    <div className="flex flex-col w-[80%] mx-auto h-fit">
      {elements}
    </div>
  );
}
export default RoutesSection;