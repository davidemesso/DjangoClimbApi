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
}

function NewsSection() {
  const [news, setNews] = useState([]);
  const {userInfo} = useContext(UserInfoContext);

  useEffect(() => {
    axios.get('http://localhost:8000/api/news')
      .then(response => {
        setNews(response.data);
      })
      .catch(error => {
        console.error(error);
      });
  }, []);

  const elements = news.map((news: News) =>
    <NewsCard 
      key={news.title + Math.random()}
      title={news.title}
      content={news.content}
      insertDate={news.insert_date}
      username={news.username}
    />
  );

  return (
    <Box>
      {userInfo && userInfo.isStaff ? <AddNewsCard/> : <></>}
      <div className="flex flex-col w-full h-full">
        {elements}
      </div>
    </Box>
  );
}
export default NewsSection;