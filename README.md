Youtube: [Link](https://youtu.be/FX5HTyvH7p4).
# OpenAI-backend

The backend server used **PostgreSQL** as the database. **Prisma**, an ORM, makes working with databases easy for application developers. The NodeJS application is designed using **ExpressJS**, but it follows an architecture similar to NestJS Microservices architecture. To run the backend on the localhost server:

1. Download PostgreSQL and set it up on your local computer.
2. Install the required dependencies by running `yarn` in the project directory to fetch all the necessary packages.
3. Finally, start the development server by executing the command `yarn dev`.

Following these steps will initiate the backend server, making it accessible on the localhost, allowing you to interact with the application seamlessly.

## Database

![image](https://github.com/Hardchik/OpenAI-Backend/assets/83291010/80be2d72-f140-4030-80db-f4312fd2b1a7)
The above is a screenshot of PgAdmin4, a management tool for PostgreSQL, it shows the creation of database **openai** and two tables are created in the database namely, **Auth** & **Document**.
