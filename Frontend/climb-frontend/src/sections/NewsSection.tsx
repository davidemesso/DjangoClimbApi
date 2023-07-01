import axios from "axios";
import { useContext, useEffect, useState } from "react";
import { Box } from "@mui/material";
import { UserInfoContext } from "../App";
import AddNewsCard from "../components/AddNewsCard";
import NewsCard from "../components/NewsCard";

interface News {
  readonly title: string;
  readonly content: string;
  readonly insert_date: Date;
  readonly username: string;
  readonly id: number;
}

function NewsSection() {
  const [news, setNews] = useState([]);
  const [refresh, setRefresh] = useState<boolean>();
  const {userInfo} = useContext(UserInfoContext);

  useEffect(() => {
    axios.get('http://localhost:8000/api/news')
      .then(response => {
        setNews(response.data);
      })
      .catch(error => {
        console.error(error);
      });
  }, [refresh]);

  const elements = news.map((news: News) =>
    <NewsCard 
      key={news.title + Math.random()}
      title={news.title}
      content={news.content}
      insertDate={news.insert_date}
      username={news.username}
      id={news.id}
      setRefresh={setRefresh} 
      refresh={refresh}
    />
  );

  return (
    <Box>
      {userInfo && userInfo.isStaff ? <AddNewsCard setRefresh={setRefresh} refresh={refresh}/> : <></>}
      <Box className="flex flex-col w-full h-full">
        {elements}
      </Box>
    </Box>
  );
}
export default NewsSection;