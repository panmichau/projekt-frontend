## Frontend-Project

### Requirements

To run the project, following are needed:

* Node.js
* npm
* a running backend application
* a configured API URL in the environment file

### Installing Dependencies

After cloning the repository, go to the project directory and install the dependencies:

```bash
npm install
```

### Environment Configuration

In the root directory of the project, create a `.env` file and set the backend API URL and Google Analitics, for example:

```
PUBLIC_API_URL=http://localhost:8443 
PUBLIC_GA_MEASUREMENT_ID=..............
```

### Running the Application in Development Mode

To start the frontend application in development mode, run:

```bash
npm run dev
```

By default, the application will be available at:

```text
http://localhost:5173
```


## Technologies Used

This frontend project was created as a web application for managing a transport and logistics system. The application communicates with the backend through a REST API and allows users to manage users, employees, clients, contracts, courses, loads, and delivery states.

### Svelte 5

The main technology used in the project is Svelte 5. The project uses Svelte 5 syntax and features, including rune-based reactivity such as `$state`.

### SvelteKit

The application uses SvelteKit, which is responsible for routing, page structure, and frontend project organization. Individual modules of the application are divided into separate routes and components.

### Vite

Vite is used as the development server and build tool. It is responsible for running the application locally and creating the production build.

### TypeScript

The project is written in TypeScript. Static typing improves code safety and makes it easier to work with data returned from the backend. API types are generated from the OpenAPI specification, which allows the frontend to use types such as `UserDTO`, `EmployeeDTO`, `CourseDTO`, `LoadDTO`, `ContractDTO`, and `ClientDTO`.

### Yup
Yup is used for schema-based form validation. It helps validate form data before sending requests to the backend.

### Sentry

Sentry is configured for application monitoring and error tracking. It helps collect and analyze frontend errors.

### Google Analytics

The project supports Google Analytics through a public measurement ID stored in the environment configuration.

Example environment variable:

PUBLIC_GA_MEASUREMENT_ID=.................

### REST API

The frontend communicates with the backend using a REST API. The application supports endpoints related to:

* authentication and user registration,
* users,
* employees,
* positions,
* clients,
* contracts,
* courses,
* loads.

Example API paths include `/auth/login`, `/auth/me`, `/user/list`, `/employee/list`, `/client/list`, `/contract/list`, `/course/list`, etc.

### ESLint

ESLint is used for static code analysis. It helps detect potential code issues and keeps the codebase consistent.

### Prettier

Prettier is used for automatic code formatting. The project also includes plugins for Svelte and Tailwind CSS formatting.

### Tailwind CSS

Tailwind CSS is used for styling the user interface. It allows components to be styled using utility classes without creating separate CSS files for every element. The project uses utility classes for layout, spacing, colors, borders, and typography.

### User Authentication and Roles

The application includes a user authentication mechanism and role-based access control. User roles determine access to selected modules and actions in the interface. The system includes the following roles:

* `ADMIN`
* `MANAGER`
* `FORWARDER`
* `DRIVER`
* `NONE`

After logging in, the application fetches the current user data and uses it to control access to modules and available actions.

### Backend Communication

Requests to the backend are separated into dedicated API files. This keeps view components independent from the details of HTTP communication. This approach improves code maintainability and separates backend communication logic from UI logic.

### Modular Application Structure

The project is divided into modules that represent the main areas of the system. Each module is responsible for a specific part of the application, such as managing clients, contracts, courses, or employees. The modules use forms, tables, action components, and dedicated state classes for managing view state.