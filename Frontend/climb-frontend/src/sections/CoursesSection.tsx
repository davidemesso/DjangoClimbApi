import axios from "axios";
import { useContext, useEffect, useState } from "react";
import { Box } from "@mui/material";
import { UserInfoContext } from "../App";
import AddCourseCard from "../components/AddCourseCard";
import CourseCard from "../components/CourseCard";
import { getAccessToken } from "../utils/auth";

interface Course {
  readonly title: string;
  readonly description: string;
  readonly date: Date;
  readonly username: string;
  readonly id: number;
  readonly price: number;
  readonly max_people: number;
  readonly participants_count: number;
}

function CoursesSection() {
  const [courses, setCourses] = useState([]);
  const [refresh, setRefresh] = useState<boolean>();
  const [userParticipation, setUserParticipation] = useState<Array<number>>([]);
  const {userInfo} = useContext(UserInfoContext);

  useEffect(() => {
    const fetchData = async () => {
      const accessToken = await getAccessToken()

      if(!accessToken)
        return;

      await axios.get(`http://localhost:8000/courses/participations`,
      {
        headers: {
          'authorization': 'Bearer ' + accessToken
        }
      })
      .then(response => {
        setUserParticipation(response.data);
      })
      .catch(error => {
        console.error(error);
      });
    }

    fetchData()
      .catch(console.error);

    axios.get('http://localhost:8000/courses/')
      .then(response => {
        setCourses(response.data);
      })
      .catch(error => {
        console.error(error);
      });
  }, [refresh]);

  const elements = courses.map((course: Course) =>
    <CourseCard 
      key={course.title + Math.random()}
      title={course.title}
      description={course.description}
      date={course.date}
      username={course.username}
      id={course.id}
      price={course.price}
      maxPeople={course.max_people}
      participantsCount={course.participants_count}
      setRefresh={setRefresh} 
      refresh={refresh}
      participations={userParticipation}
    />
  );

  return (
    <Box>
      {userInfo && userInfo.isStaff ? <AddCourseCard setRefresh={setRefresh} refresh={refresh}/> : <></>}
      <Box className="flex flex-col w-full h-full">
        {elements}
      </Box>
    </Box>
  );
}
export default CoursesSection;