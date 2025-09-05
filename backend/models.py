from dataclasses import dataclass, asdict, field
from typing import List, Dict
from datetime import datetime
import os
from pymongo import MongoClient

from dotenv import load_dotenv, find_dotenv
from pymongo.errors import ConfigurationError, ServerSelectionTimeoutError

load_dotenv(find_dotenv())

mongo_uri = (
    os.getenv("MONGODB_URI")
    or os.getenv("MONGO_URI")
    or "mongodb://localhost:27017/elve_agency"
)

DEFAULT_DB_NAME = os.getenv("MONGO_DB_NAME", "elve_agency")

if "cluster0.abc.mongodb.net" in mongo_uri:
    raise RuntimeError("❌ Replace placeholder Mongo URI with your real cluster URI")

if mongo_uri.startswith("mongodb+srv://"):
    try:
        import dns  # type: ignore
    except Exception:
        raise RuntimeError("❌ Install SRV support: pip install 'pymongo[srv]'")

# Client
client = MongoClient(os.getenv('MONGODB_URI', 'mongodb://localhost:27017/elve_agency'))
db = client.get_database(os.getenv('MONGODB_DBNAME', 'elve_agency'))

try:
    client.admin.command("ping")
    print("✅ Connected to MongoDB!......")
except (ConfigurationError, ServerSelectionTimeoutError) as e:
    raise RuntimeError(f"❌ MongoDB connection failed: {e}") from e

# Database
try:
    db = client.get_database()
    if not db.name:
        raise ValueError("No default DB in URI")
except Exception:
    db = client[DEFAULT_DB_NAME]

# Collections
home_collection = db['home']
projects_collection = db['projects']
services_collection = db['services']
pricing_collection = db["pricing"]
testimonials_collection = db["testimonials"]
clients_collection = db["clients"]
faqs_collection = db["faqs"]
about_collection = db["about"]
blogs_collection = db["blogs"]
contact_messages_collection = db["contact_messages"]

# Data Models

@dataclass
class HomeData:
    hero_title: str
    hero_description: str
    services: List[str]

@dataclass
class Service:
    id: int
    title: str
    icon: str
    desc: str
    list: List[str]
    image: str

@dataclass
class Project:
    id: int
    image: str
    category: str
    title: str
    tags: List[str]
    description: str

@dataclass
class PricingPlan:
    id: int
    name: str
    badge: str
    description: str
    price: str
    features: List[str]

@dataclass
class Blog:
    id: int
    image: str
    category: str
    title: str
    description: str
    date: str
    read_time: str
    content: str

@dataclass
class Testimonial:
    id: int
    desc: str
    name: str
    role: str
    img: str

@dataclass
class Client:
    id: int
    name: str
    logo: str

@dataclass
class FAQ:
    id: int
    question: str
    answer: str
    open: bool

@dataclass
class LearnContainer:
    heading: str
    videoImage: str

@dataclass
class StorySection:
    mainHeading: str
    paragraphs: List[str]
    images: List[str]

@dataclass
class CoreValue:
    icon: str
    title: str
    description: str

@dataclass
class TeamMember:
    image: str
    name: str
    role: str

@dataclass
class ServiceItem:
    icon: str
    title: str
    description: str

@dataclass
class TestimonialItem:
    description: str
    name: str
    role: str
    image: str

@dataclass
class Award:
    image: str
    title: str

@dataclass
class FAQItem:
    question: str
    answer: str
    open: bool

@dataclass
class AboutData:
    learnContainer: LearnContainer
    storySection: StorySection
    coreValues: List[CoreValue]
    team: List[TeamMember]
    services: List[ServiceItem]
    testimonials: List[TestimonialItem]
    awards: List[Award]
    faqs: List[FAQItem]

# Contact Message Model
@dataclass
class ContactMessage:
    full_name: str
    email: str
    phone: str
    message: str
    created_at: datetime = field(default_factory=datetime.utcnow)
    read: bool = False  # Track read/unread status

    def to_dict(self):
        data = asdict(self)
        if data['created_at']:
            data['created_at'] = data['created_at'].isoformat()
        return data
