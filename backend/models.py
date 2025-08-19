from dataclasses import dataclass, asdict
from typing import List

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
class AboutData:
    title: str
    subtitle: str
    values: List[str]
    team: List[dict]
    services: List[str]