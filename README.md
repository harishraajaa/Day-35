# Day-35 Task: <b>Mentor and Student Assigning with Database</b>

## Quick Start Guide

Our API server is conveniently hosted at: `https://student-mentor-harishcorp.onrender.com`

## Key API Endpoints

1. **Create Mentor (POST)**: Establish a new mentor profile.
   - Endpoint: `/mentors/createMentor`

2. **Create Student (POST)**: Register a new student.
   - Endpoint: `/students/createStudent`

3. **Assign Student to Mentor (POST)**: Link a student to a mentor, fostering a learning relationship.
   - Endpoint: `/mentors/assignStudent/:mentorId/:studentId`

4. **Assign or Change Mentor for Student (PUT)**: Assign a new mentor to a student or modify an existing mentor-student relationship.
   - Endpoint: `/mentors/assignChangeMentor/:studentId/:newMentorId`

5. **Get All Students for a Mentor (GET)**: Retrieve a comprehensive list of all students under the guidance of a specific mentor.
   - Endpoint: `/mentors/getMentorById/:mentorId`

6. **Get Previously Assigned Mentor for a Student (GET)**: Access the historical data of a student's previously assigned mentor.
   - Endpoint:

## Detailed Documentation

For an in-depth understanding of our API and its usage, we recommend referring to our comprehensive Postman Documentation.

[![Postman Documentation](https://run.pstmn.io/button.svg)](https://www.postman.com/harishcorp/workspace/public/collection/37763613-69c2fe9c-df40-4ceb-86e2-c8d38fb8cb71?action=share&creator=37763613)
