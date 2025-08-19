import os

class Config:
    DATA_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), 'data'))
    
    # Paths to data files
    HOME_DATA = os.path.join(DATA_DIR, 'home.json')
    ABOUT_DATA = os.path.join(DATA_DIR, 'about.json')
    SERVICES_DATA = os.path.join(DATA_DIR, 'services.json')
    PROJECTS_DATA = os.path.join(DATA_DIR, 'projects.json')
    PRICING_DATA = os.path.join(DATA_DIR, 'pricing.json')
    BLOGS_DATA = os.path.join(DATA_DIR, 'blogs.json')
    TESTIMONIALS_DATA = os.path.join(DATA_DIR, 'testimonials.json')
    CLIENTS_DATA = os.path.join(DATA_DIR, 'clients.json')
    FAQS_DATA = os.path.join(DATA_DIR, 'faqs.json')