import axios from "axios";
import { useContext, useEffect, useState } from "react";
import { Box } from "@mui/material";
import { UserInfoContext } from "../App";
import AddCourseCard from "../components/AddCourseCard";
import CourseCard from "../components/CourseCard";

interface Course {
  readonly title: string;
  readonly description: string;
  readonly date: Date;
  readonly username: string;
  readonly id: number;
  readonly price: number;
  readonly max_people: number;
}

function CoursesSection() {
  const [courses, setCourses] = useState([]);
  const [refresh, setRefresh] = useState<boolean>();
  const {userInfo} = useContext(UserInfoContext);

  useEffect(() => {
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
      setRefresh={setRefresh} 
      refresh={refresh}
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