from fastapi import FastAPI, APIRouter, HTTPException, Header
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
import httpx
import asyncio
from pathlib import Path
from pydantic import BaseModel
from typing import List, Optional
import uuid
from datetime import datetime, timezone

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

ADMIN_PASSWORD = os.environ.get('ADMIN_PASSWORD', 'Newral@123')

app = FastAPI()
api_router = APIRouter(prefix="/api")

_cache = {}
COINGECKO_BASE = "https://api.coingecko.com/api/v3"

FALLBACK_COINS = [
    {"id":"bitcoin","name":"Bitcoin","symbol":"BTC","image":"https://assets.coingecko.com/coins/images/1/large/bitcoin.png","current_price":97250.00,"market_cap":1920000000000,"market_cap_rank":1,"price_change_percentage_24h":1.85,"total_volume":42000000000,"sparkline_in_7d":[]},
    {"id":"ethereum","name":"Ethereum","symbol":"ETH","image":"https://assets.coingecko.com/coins/images/279/large/ethereum.png","current_price":3420.50,"market_cap":412000000000,"market_cap_rank":2,"price_change_percentage_24h":-0.42,"total_volume":18500000000,"sparkline_in_7d":[]},
    {"id":"tether","name":"Tether","symbol":"USDT","image":"https://assets.coingecko.com/coins/images/325/large/Tether.png","current_price":1.00,"market_cap":142000000000,"market_cap_rank":3,"price_change_percentage_24h":0.01,"total_volume":85000000000,"sparkline_in_7d":[]},
    {"id":"solana","name":"Solana","symbol":"SOL","image":"https://assets.coingecko.com/coins/images/4128/large/solana.png","current_price":195.30,"market_cap":95000000000,"market_cap_rank":4,"price_change_percentage_24h":3.15,"total_volume":5200000000,"sparkline_in_7d":[]},
    {"id":"binancecoin","name":"BNB","symbol":"BNB","image":"https://assets.coingecko.com/coins/images/825/large/bnb-icon2_2x.png","current_price":685.20,"market_cap":99000000000,"market_cap_rank":5,"price_change_percentage_24h":0.87,"total_volume":2100000000,"sparkline_in_7d":[]},
    {"id":"ripple","name":"XRP","symbol":"XRP","image":"https://assets.coingecko.com/coins/images/44/large/xrp-symbol-white-128.png","current_price":2.58,"market_cap":148000000000,"market_cap_rank":6,"price_change_percentage_24h":5.22,"total_volume":12000000000,"sparkline_in_7d":[]},
    {"id":"usd-coin","name":"USDC","symbol":"USDC","image":"https://assets.coingecko.com/coins/images/6319/large/usdc.png","current_price":1.00,"market_cap":56000000000,"market_cap_rank":7,"price_change_percentage_24h":0.00,"total_volume":9800000000,"sparkline_in_7d":[]},
    {"id":"cardano","name":"Cardano","symbol":"ADA","image":"https://assets.coingecko.com/coins/images/975/large/cardano.png","current_price":1.05,"market_cap":37000000000,"market_cap_rank":8,"price_change_percentage_24h":2.10,"total_volume":1800000000,"sparkline_in_7d":[]},
    {"id":"dogecoin","name":"Dogecoin","symbol":"DOGE","image":"https://assets.coingecko.com/coins/images/5/large/dogecoin.png","current_price":0.385,"market_cap":56000000000,"market_cap_rank":9,"price_change_percentage_24h":-1.35,"total_volume":4200000000,"sparkline_in_7d":[]},
    {"id":"avalanche-2","name":"Avalanche","symbol":"AVAX","image":"https://assets.coingecko.com/coins/images/12559/large/Avalanche_Circle_RedWhite_Trans.png","current_price":38.75,"market_cap":16000000000,"market_cap_rank":10,"price_change_percentage_24h":1.92,"total_volume":820000000,"sparkline_in_7d":[]},
]

FALLBACK_GLOBAL = {
    "total_market_cap": 3450000000000,
    "total_volume": 185000000000,
    "market_cap_change_24h": 1.42,
    "active_cryptocurrencies": 15230,
    "markets": 1120,
    "btc_dominance": 55.6,
}

FALLBACK_TRENDING = [
    {"id":"pepe","name":"Pepe","symbol":"PEPE","thumb":"https://assets.coingecko.com/coins/images/29850/small/pepe-token.jpeg","market_cap_rank":19,"price_btc":0.0000000002},
    {"id":"solana","name":"Solana","symbol":"SOL","thumb":"https://assets.coingecko.com/coins/images/4128/small/solana.png","market_cap_rank":4,"price_btc":0.002},
    {"id":"dogecoin","name":"Dogecoin","symbol":"DOGE","thumb":"https://assets.coingecko.com/coins/images/5/small/dogecoin.png","market_cap_rank":9,"price_btc":0.000004},
]

DEFAULT_SCHEMES = [
    {
        "id": str(uuid.uuid4()),
        "title": "Starter Plan",
        "min_investment": 5000,
        "max_investment": 25000,
        "return_percentage": 40,
        "duration_months": 1,
        "description": "Perfect for beginners. Invest as low as Rs.5,000 and get up to 40% returns in just 1 month.",
        "is_popular": False,
        "is_active": True,
        "created_at": datetime.now(timezone.utc).isoformat(),
    },
    {
        "id": str(uuid.uuid4()),
        "title": "Growth Plan",
        "min_investment": 25000,
        "max_investment": 100000,
        "return_percentage": 40,
        "duration_months": 1,
        "description": "For serious investors. Higher investment, same guaranteed 40% returns managed by expert portfolio management.",
        "is_popular": True,
        "is_active": True,
        "created_at": datetime.now(timezone.utc).isoformat(),
    },
    {
        "id": str(uuid.uuid4()),
        "title": "Premium Plan",
        "min_investment": 100000,
        "max_investment": 500000,
        "return_percentage": 40,
        "duration_months": 1,
        "description": "Our premium tier. Invest Rs.1 Lakh to Rs.5 Lakhs and earn 40% returns with dedicated portfolio management and priority support.",
        "is_popular": False,
        "is_active": True,
        "created_at": datetime.now(timezone.utc).isoformat(),
    },
    {
        "id": str(uuid.uuid4()),
        "title": "Elite Plan",
        "min_investment": 500000,
        "max_investment": 2500000,
        "return_percentage": 40,
        "duration_months": 1,
        "description": "For high-net-worth investors. Invest Rs.5 Lakhs+ and enjoy 40% returns with 1-on-1 consulting and weekly portfolio reports.",
        "is_popular": False,
        "is_active": True,
        "created_at": datetime.now(timezone.utc).isoformat(),
    },
]


DEFAULT_SETTINGS = {
    "id": "site_settings",
    "telegram_link": "https://t.me/wealthx_invest",
    "updated_at": datetime.now(timezone.utc).isoformat(),
}

TEAM_MEMBERS = [
    {"name": "Ankur Agrawal", "role": "Founder & Lead Portfolio Manager", "initials": "AA"},
    {"name": "Radhika Gupta", "role": "Senior Investment Analyst", "initials": "RG"},
    {"name": "Abhay Sharma", "role": "Risk Management Head", "initials": "AS"},
    {"name": "Rishabh Singh", "role": "Client Relations Manager", "initials": "RS"},
]


async def seed_schemes():
    count = await db.schemes.count_documents({})
    if count == 0:
        await db.schemes.insert_many(DEFAULT_SCHEMES)
        logging.info("Seeded default schemes")
    settings = await db.settings.find_one({"id": "site_settings"}, {"_id": 0})
    if not settings:
        await db.settings.insert_one(DEFAULT_SETTINGS)
        logging.info("Seeded default settings")


@app.on_event("startup")
async def startup():
    await seed_schemes()


async def cached_fetch(key, url, ttl_seconds=120, fallback=None):
    now = datetime.now(timezone.utc).timestamp()
    if key in _cache and (now - _cache[key]["ts"]) < ttl_seconds:
        return _cache[key]["data"]
    for attempt in range(3):
        try:
            async with httpx.AsyncClient(timeout=15.0) as http_client:
                resp = await http_client.get(url, headers={"Accept": "application/json"})
                if resp.status_code == 429:
                    if attempt < 2:
                        await asyncio.sleep(2 * (attempt + 1))
                        continue
                    if key in _cache: return _cache[key]["data"]
                    if fallback is not None: return fallback
                    raise HTTPException(status_code=429, detail="Rate limit")
                resp.raise_for_status()
                data = resp.json()
                _cache[key] = {"data": data, "ts": now}
                return data
        except httpx.HTTPStatusError:
            if key in _cache: return _cache[key]["data"]
            if fallback is not None: return fallback
            raise
        except Exception:
            if attempt < 2:
                await asyncio.sleep(1)
                continue
            if key in _cache: return _cache[key]["data"]
            if fallback is not None: return fallback
            raise
    if fallback is not None: return fallback
    raise HTTPException(status_code=503, detail="Unable to fetch data")


def verify_admin(password: str):
    if password != ADMIN_PASSWORD:
        raise HTTPException(status_code=401, detail="Invalid password")


# --- Admin Auth ---
class AdminLogin(BaseModel):
    password: str

@api_router.post("/admin/login")
async def admin_login(data: AdminLogin):
    if data.password != ADMIN_PASSWORD:
        raise HTTPException(status_code=401, detail="Invalid password")
    return {"message": "Login successful", "authenticated": True}


# --- Schemes CRUD ---
class SchemeCreate(BaseModel):
    title: str
    min_investment: int
    max_investment: int
    return_percentage: float
    duration_months: int
    description: str
    is_popular: bool = False
    is_active: bool = True

class SchemeUpdate(BaseModel):
    title: Optional[str] = None
    min_investment: Optional[int] = None
    max_investment: Optional[int] = None
    return_percentage: Optional[float] = None
    duration_months: Optional[int] = None
    description: Optional[str] = None
    is_popular: Optional[bool] = None
    is_active: Optional[bool] = None


@api_router.get("/schemes")
async def get_schemes(active_only: bool = True):
    query = {"is_active": True} if active_only else {}
    schemes = await db.schemes.find(query, {"_id": 0}).sort("min_investment", 1).to_list(100)
    return {"schemes": schemes}


@api_router.post("/admin/schemes")
async def create_scheme(scheme: SchemeCreate, x_admin_password: str = Header(None)):
    verify_admin(x_admin_password)
    doc = scheme.model_dump()
    doc["id"] = str(uuid.uuid4())
    doc["created_at"] = datetime.now(timezone.utc).isoformat()
    await db.schemes.insert_one(doc)
    return {"message": "Scheme created", "id": doc["id"]}


@api_router.put("/admin/schemes/{scheme_id}")
async def update_scheme(scheme_id: str, scheme: SchemeUpdate, x_admin_password: str = Header(None)):
    verify_admin(x_admin_password)
    update_data = {k: v for k, v in scheme.model_dump().items() if v is not None}
    if not update_data:
        raise HTTPException(status_code=400, detail="No fields to update")
    result = await db.schemes.update_one({"id": scheme_id}, {"$set": update_data})
    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="Scheme not found")
    return {"message": "Scheme updated"}


@api_router.delete("/admin/schemes/{scheme_id}")
async def delete_scheme(scheme_id: str, x_admin_password: str = Header(None)):
    verify_admin(x_admin_password)
    result = await db.schemes.delete_one({"id": scheme_id})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Scheme not found")
    return {"message": "Scheme deleted"}


# --- Settings ---
@api_router.get("/settings")
async def get_settings():
    settings = await db.settings.find_one({"id": "site_settings"}, {"_id": 0})
    if not settings:
        return DEFAULT_SETTINGS
    return settings


class SettingsUpdate(BaseModel):
    telegram_link: Optional[str] = None

@api_router.put("/admin/settings")
async def update_settings(data: SettingsUpdate, x_admin_password: str = Header(None)):
    verify_admin(x_admin_password)
    update_data = {k: v for k, v in data.model_dump().items() if v is not None}
    if not update_data:
        raise HTTPException(status_code=400, detail="No fields to update")
    update_data["updated_at"] = datetime.now(timezone.utc).isoformat()
    await db.settings.update_one({"id": "site_settings"}, {"$set": update_data}, upsert=True)
    return {"message": "Settings updated"}


# --- Team ---
@api_router.get("/team")
async def get_team():
    return {"team": TEAM_MEMBERS}


# --- Crypto APIs ---
@api_router.get("/")
async def root():
    return {"message": "Crypto Investment API"}


@api_router.get("/crypto/top-coins")
async def get_top_coins(limit: int = 20):
    url = f"{COINGECKO_BASE}/coins/markets?vs_currency=usd&order=market_cap_desc&per_page={limit}&page=1&sparkline=true&price_change_percentage=24h,7d"
    try:
        data = await cached_fetch(f"top_coins_{limit}", url, ttl_seconds=120, fallback=FALLBACK_COINS[:limit])
        if isinstance(data, list) and len(data) > 0 and "id" in data[0]:
            return {"coins": data[:limit]}
        coins = []
        for coin in data:
            coins.append({
                "id": coin.get("id"),
                "name": coin.get("name"),
                "symbol": coin.get("symbol", "").upper(),
                "image": coin.get("image"),
                "current_price": coin.get("current_price"),
                "market_cap": coin.get("market_cap"),
                "market_cap_rank": coin.get("market_cap_rank"),
                "price_change_percentage_24h": coin.get("price_change_percentage_24h"),
                "total_volume": coin.get("total_volume"),
                "sparkline_in_7d": coin.get("sparkline_in_7d", {}).get("price", []),
            })
        return {"coins": coins}
    except Exception as e:
        logging.error(f"Error: {e}")
        return {"coins": FALLBACK_COINS[:limit]}


@api_router.get("/crypto/trending")
async def get_trending():
    url = f"{COINGECKO_BASE}/search/trending"
    try:
        data = await cached_fetch("trending", url, ttl_seconds=300, fallback={"coins": []})
        if "trending" in data: return data
        trending = []
        for item in data.get("coins", [])[:10]:
            coin = item.get("item", {})
            trending.append({
                "id": coin.get("id"), "name": coin.get("name"),
                "symbol": coin.get("symbol", "").upper(), "thumb": coin.get("thumb"),
                "market_cap_rank": coin.get("market_cap_rank"), "price_btc": coin.get("price_btc"),
            })
        return {"trending": trending}
    except Exception as e:
        logging.error(f"Error: {e}")
        return {"trending": FALLBACK_TRENDING}


@api_router.get("/crypto/global")
async def get_global_stats():
    url = f"{COINGECKO_BASE}/global"
    try:
        data = await cached_fetch("global", url, ttl_seconds=300, fallback={"data": {}})
        if "total_market_cap" in data: return data
        gdata = data.get("data", {})
        if not gdata: return FALLBACK_GLOBAL
        return {
            "total_market_cap": gdata.get("total_market_cap", {}).get("usd", 0),
            "total_volume": gdata.get("total_volume", {}).get("usd", 0),
            "market_cap_change_24h": gdata.get("market_cap_change_percentage_24h_usd", 0),
            "active_cryptocurrencies": gdata.get("active_cryptocurrencies", 0),
            "markets": gdata.get("markets", 0),
            "btc_dominance": gdata.get("market_cap_percentage", {}).get("btc", 0),
        }
    except Exception as e:
        logging.error(f"Error: {e}")
        return FALLBACK_GLOBAL


# --- Newsletter ---
import re

class NewsletterSubscribe(BaseModel):
    email: str

def is_valid_email(email: str) -> bool:
    return bool(re.match(r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$', email))

@api_router.post("/newsletter/subscribe")
async def subscribe_newsletter(data: NewsletterSubscribe):
    if not is_valid_email(data.email):
        raise HTTPException(status_code=422, detail="Invalid email address")
    existing = await db.newsletter.find_one({"email": data.email}, {"_id": 0})
    if existing:
        return {"message": "Already subscribed", "status": "exists"}
    doc = {"id": str(uuid.uuid4()), "email": data.email, "subscribed_at": datetime.now(timezone.utc).isoformat()}
    await db.newsletter.insert_one(doc)
    return {"message": "Successfully subscribed!", "status": "success"}


app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=os.environ.get('CORS_ORIGINS', '*').split(','),
    allow_methods=["*"],
    allow_headers=["*"],
)

logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(name)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()
