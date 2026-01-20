# Basic Expense Tracker

A simple web app to manage personal and group expenses. You can add expenses, split bills among group members, and see who owes what.

## How to Run it

**Backend**
1. `cd backend`
2. `npm install`
3. Create a `.env` file (copy from `.env.example`) and add your database link.
4. Start the server: `npm run dev`

**Frontend**
1. `cd frontend`
2. `npm install`
3. `npm run dev`

## Features
- **User Accounts:** Sign up and log in securely.
- **Groups:** Create groups for trips or shared bills.
- **Expenses:** Add expenses and split them equally or unequally.
- **Balances:** Check how much you owe or are owed.

## API Endpoints

### Auth
- `POST /api/auth/signup` - Create a new account
- `POST /api/auth/login` - Log in
- `GET /api/auth/users` - List all users

### Groups
- `POST /api/groups` - Create a new group
- `GET /api/groups` - Get all your groups
- `GET /api/groups/:id` - Get group details and expenses

### Expenses
- `POST /api/expenses` - Add a new expense
- `GET /api/expenses` - Get recent expenses
- `GET /api/expenses/balance` - View your total balance
- `DELETE /api/expenses/:id` - Remove an expense

## Screenshots

you can check in screenshots folder.