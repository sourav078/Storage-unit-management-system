🚀 Storage Unit Management System 

A full-stack web application to manage storage units, bookings, and admin operations.

🌟 Features



      👤 User
      
          Register & Login
          
          Browse storage units
          
          Search units by location/size
          
          View unit details
          
          Book available units
          
          View personal dashboard
          

      
      🛠 Admin
        
            Separate login (/admin/login)
            
            Create storage units
            
            Upload real images (max 5 per unit)
            
            Update unit details & status
            
            Delete units
            

🧱 Tech Stack

      Frontend	------> React.js  
      
      Backend	-------->Node.js + Express
      
      Database -------->	MongoDB
      
      Auth ------------>	JWT
      
      File Upload ------>	Multer
      
      Styling	----------> CSS       


📁 Project Structure

      taskmanagerv1/
      │
      ├── backend/
      │   ├── config/
      │   ├── controllers/
      │   ├── middleware/
      │   ├── models/
      │   ├── routes/
      │   ├── uploads/
      │   ├── seeds/
      │   └── server.js
      │
      ├── frontend/
      │   ├── public/
      │   ├── src/
      │   │   ├── api/
      │   │   ├── components/
      │   │   ├── context/
      │   │   ├── pages/
      │   │   └── App.js
      │
      └── package.json


⚙️ Prerequisites

      Make sure you have these installed:
      🧩 Required Tools
        🟢 Node.js (v18+ recommended)
        🟢 npm (comes with Node)
        🟢 MongoDB (local or Atlas)
        🟢 Git
      🧠 Optional (Recommended)
        VS Code
        Postman (for API testing)

🔐 Admin Access

  URL: http://localhost:3000/admin/login
  Email: admin@gmail.com
  Password: admin123


  🪟 WINDOWS SETUP GUIDE
  
  📥 Step 1 — Clone the Project
   Create a folder, open the terminal at its root and paste the following code:
   
                            git clone <your-repo-url>
                            cd taskmanagerv1

 📦 Step 2 — Install Dependencies
 nd paste the following code aswell:
 
                            npm install
                            npm install --prefix backend
                            npm install --prefix frontend                                                                               
                                        
⚙️ Step 3 — Setup Backend Environment
Create file:
  backend/.env
  
and paste this inside env:

                        PORT=5001
                        MONGO_URI=your_mongodb_connection_string
                        JWT_SECRET=your_secret_key
  
  
Example (local MongoDB):
MONGO_URI=mongodb://127.0.0.1:27017/storage-system


🌐 Step 4 — Setup Frontend Environment

  Create:
  frontend/.env
  Paste:
  
  REACT_APP_API_BASE_URL=http://localhost:5001/api


🧑‍💼 Step 5 — Create Admin User (Seed)

     
      node backend/seeds/adminSeeder.js
      
  You should see:
  Admin user created successfully

▶️ Step 6 — Run the Project

  type in terminal:  npm run dev

🌍 Access the App

  Service	URL
    Frontend	http://localhost:3000
    Backend API	http://localhost:5001


🧠 Architecture Overview


    Frontend (React)
            ↓
    API Calls (Axios)
            ↓
    Backend (Express)
            ↓
    MongoDB Database
            ↓
    Uploads (Local Storage)    



🚀 Future Improvements

  AWS S3 for image storage
  Booking approval system
  Notifications for admin
  Payment integration
  Role-based dashboard separation    


💡 Final Note

This project demonstrates:

  Full-stack development
  Authentication & authorization
  File uploads
  REST API design
  Scalable architecture
        
