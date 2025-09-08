# Elve Agency - Digital Solutions Platform

## Project Overview

Elve Agency is a comprehensive digital agency platform featuring a modern, responsive website with a full-featured content management system. The platform showcases services, projects, client testimonials, and pricing plans, while providing administrators with intuitive tools to manage all content dynamically.

## 🚀 Technology Stack

### Backend
- **Flask** - Lightweight Python web framework
- **MongoDB** - NoSQL database for flexible data storage
- **Flask-CORS** - Cross-origin resource sharing support
- **PyMongo** - MongoDB Python driver
- **Python-dotenv** - Environment variables management

### Frontend
- **React** - Modern UI library with hooks
- **CSS3** - Custom styling and responsive design
- **Vite** - Fast build tool and development server

## 📦 Installation & Setup

### Prerequisites
- Python 3.8 or higher
- Node.js 14 or higher
- MongoDB (local installation or cloud instance)
- npm or yarn package manager

### Backend Setup

1. **Navigate to backend directory**
   ```bash
   cd backend
   ```

2. **Create and activate virtual environment**
   ```bash
   # For Unix/macOS
   python -m venv venv
   source venv/bin/activate
   
   # For Windows
   python -m venv venv
   venv\Scripts\activate
   ```

3. **Install Python dependencies**
   ```bash
   pip install -r requirements.txt
   ```

4. **Configure environment variables**
   Create a `.env` file in the backend directory with:
   ```env
   MONGODB_URI=mongodb://localhost:27017/elve_agency
   MONGODB_DBNAME=elve_agency
   FLASK_ENV=development
   SECRET_KEY=123
   ```

5. **Run database migration (if needed)**
   ```bash
   python migrate_home_data.py # Not necessary, so removed it.
   ```

6. **Start the Flask development server**
   ```bash
   python app.py
   ```
   Server will run on http://localhost:5001

### Frontend Setup

1. **Navigate to frontend directory**
   ```bash
   cd frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment variables**
   Create a `.env` file in the frontend directory with:
   ```env
   VITE_API_BASE_URL=http://localhost:5001
   ```

4. **Start the development server**
   ```bash
   npm run dev
   ```
   Application will run on http://localhost:5173

## 🗄️ Database Schema

The application uses MongoDB with the following collections:
- `home` - Homepage content and configuration
- `services` - Service offerings
- `projects` - Portfolio projects
- `testimonials` - Client testimonials
- `clients` - Client logos and information
- `faqs` - Frequently asked questions
- `pricing` - Pricing plans and features

## 🔌 API Endpoints

### Content Management
- `GET /api/home` - Retrieve homepage content
- `PUT /api/admin/home` - Update entire homepage
- `PUT /api/admin/home/section/:section` - Update specific section

### Resource Endpoints
- `GET /api/services` - Get all services
- `GET /api/projects` - Get all projects
- `GET /api/testimonials` - Get all testimonials
- `GET /api/clients` - Get all clients
- `GET /api/faqs` - Get all FAQs
- `GET /api/pricing` - Get all pricing plans

### Static Assets
- `GET /images/:filename` - Serve image files
- `GET /js/:filename` - Serve JavaScript files
- `GET /css/:filename` - Serve CSS files

## 👨‍💻 Admin Features

The admin panel provides full CRUD capabilities for:
- Header section management (title, description)
- Banner content (video thumbnail, statistics)
- Service section customization
- About section (logo, content, call-to-action buttons)
- Dynamic content updates across all sections

Access the admin panel at: http://localhost:5001/admin-panel

## 🚦 Deployment

### Production Preparation

1. **Backend Configuration**
   - Set `FLASK_ENV=production`
   - Use production MongoDB URI
   - Configure proper CORS settings
   - Set a secure secret key

2. **Frontend Build**
   ```bash
   npm run build
   ```

3. **WSGI Server**
   Use Gunicorn for production:
   ```bash
   gunicorn -w 4 -b 0.0.0.0:5001 app:app
   ```

### Deployment Options
- **Heroku** - For full-stack deployment
- **Netlify/Vercel** - Frontend hosting with serverless functions
- **AWS/GCP** - Containerized deployment with Docker
- **DigitalOcean** - App platform or droplet deployment

## 🐛 Troubleshooting

### Common Issues

1. **Database Connection Errors**
   - Verify MongoDB is running
   - Check the connection string in the environment variables

2. **CORS Issues**
   - Ensure frontend URL is included in CORS configuration
   - Check Flask-CORS settings

3. **Image Loading Problems**
   - Verify image paths in the database
   - Check static file serving configuration

4. **Admin Panel Authentication**
   - Ensure proper token management
   - Verify admin user exists in the database

### Debug Endpoints
- `GET /debug/routes` - List all available API routes
- `GET /debug/env` - Check current environment configuration
- `GET /debug/db` - Test database connection status

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Development Guidelines
- Follow PEP 8 for Python code
- Use ESLint for JavaScript code quality
- Write meaningful commit messages
- Update documentation for new features

## 📄 License

This project is proprietary software. All rights reserved.

## 📞 Support

For technical support or questions:
- Create an issue in the repository
- Contact the development team
- Check the API documentation

---

**Elve Agency** - Crafting digital experiences that drive business growth.
