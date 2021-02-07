import React from 'react'

const Header = ({course}) => (
    <h2>
      {course.name}
    </h2>
  )
  
  const Part = ({part}) => (
    <p>
      {part.name} {part.exercises}
    </p>
  )
  
  const Content = ({parts}) => (
    parts.map(part => 
      <Part key={part.id} part={part} />
    )
  )
  
  
  const Total = ({parts}) => {
    const total = parts.reduce((sum, part) => sum + part.exercises, 0)
    return (
      <b>total of {total} exercises</b>
    )
  }
  
  const Course = ({course}) => {
    return (
      <div>
        <Header course={course} />
        <Content parts={course.parts} />
        <Total parts={course.parts} />
      </div>
    )
  }

  export default Course;