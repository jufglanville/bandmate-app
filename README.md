# Band Finder

Band Finder is a platform designed for musicians to connect, form bands, and find gigs. Users can create profiles, upload their music, and search for other musicians based on their skills and music style.

## Technologies Used

- **Frontend**: Next.js, TypeScript, React, Tailwind CSS
- **Component Development**: Storybook
- **Testing**: Storybook, Jest, Playwright
- **CI/CD**: GitHub Actions
- **Error Tracking**: Sentry
- **Database**: Supabase

## Getting Started

### 1. Clone the Repository

To get started, clone the repository and navigate to the project folder:

```bash
git clone https://github.com/jufglanville/bandmate-app
cd bandmate-app
```

### 2. Install Dependencies

Next, install the required dependencies:

```bash
npm install
```

### 3. Start the Development Server

You can start the development server with the following command:

```bash
npm run dev
```

The app will be available at [http://localhost:3000](http://localhost:3000).

### 4. Database Setup

The app uses **Supabase** as the backend database. Follow the steps below to set up the local database:

#### a. Start the Supabase Local Instance

To start the local Supabase database, run:

```bash
supabase start
```

The Supabase dashboard will be accessible at [http://127.0.0.1:54323](http://127.0.0.1:54323).

#### b. Creating New Tables

To create new tables, you can use the Supabase dashboard or run the following command to generate a new migration file:

```bash
supabase migration new <table_name>
```

This will create a migration file in the `migrations` folder. You can then write the SQL commands for creating the table in the migration file.

#### c. Resetting local database

To run reset the local database, run:

```bash
supabase db reset
```

This will delete all the data in the local database and run the migrations giving a new fresh blank database.

#### d. Stop the Local Database

To stop the local database, run:

```bash
supabase stop
```

### 5. CI/CD & Migrations

The app uses **GitHub Actions** for CI/CD.

When you create a new pull request to the `main` branch, the CI/CD pipeline will run the Storybook tests and linting checks.

When you merge any database changes to the `main` branch, the CI/CD pipeline will automatically run the migrations on the production database.
