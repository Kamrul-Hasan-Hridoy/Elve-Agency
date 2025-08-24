import os
from dotenv import load_dotenv

load_dotenv()
DATA_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), 'data'))
class Config:
    #DB configuration
    MONGODB_URI = os.getenv('MONGODB_URI', 'mongodb://localhost:27017/elve_agency')
    MONGODB_DBNAME = os.getenv('MONGODB_DBNAME', 'elve_agency')

    #Paths to data files
    HOME_DATA = os.path.join(DATA_DIR, 'home.json')
    ABOUT_DATA = os.path.join(DATA_DIR, 'about.json')
    SERVICES_DATA = os.path.join(DATA_DIR, 'services.json')
    PROJECTS_DATA = os.path.join(DATA_DIR, 'projects.json')
    PRICING_DATA = os.path.join(DATA_DIR, 'pricing.json')
    BLOGS_DATA = os.path.join(DATA_DIR, 'blogs.json')
    TESTIMONIALS_DATA = os.path.join(DATA_DIR, 'testimonials.json')
    CLIENTS_DATA = os.path.join(DATA_DIR, 'clients.json')
    FAQS_DATA = os.path.join(DATA_DIR, 'faqs.json')