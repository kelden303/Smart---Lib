# TODO - Frontend-only Library Management

## Status: COMPLETED

### What was done:
1. Created `frontend/src/services/mockData.js` with in-memory data store
2. Updated `frontend/src/App.jsx` to use mock APIs instead of backend
3. All pages now work without MongoDB/backend

### How to run:
```bash
cd frontend
npm run dev
```

### Features:
- Sample data pre-loaded (5 books, 3 users, 1 transaction)
- All CRUD operations work (add books, add users, borrow/return)
- Data persists in memory while dev server is running
- Data resets when dev server restarts
