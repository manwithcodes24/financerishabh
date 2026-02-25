from fastapi import FastAPI, APIRouter, HTTPException
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
import httpx
from pathlib import Path
from pydantic import BaseModel, Field, ConfigDict
from typing import List, Optional
import uuid
from datetime import datetime, timezone

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# MongoDB connection
mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

app = FastAPI()
api_router = APIRouter(prefix="/api")

# In-memory cache
_cache = {}

COINGECKO_BASE = "https://api.coingecko.com/api/v3"

async def cached_fetch(key: str, url: str, ttl_seconds: int = 120):
    now = datetime.now(timezone.utc).timestamp()
    if key in _cache and (now - _cache[key]["ts"]) < ttl_seconds:
        return _cache[key]["data"]
    
    async with httpx.AsyncClient(timeout=15.0) as http_client:
        resp = await http_client.get(url)
        if resp.status_code == 429:
            # Rate limited - return cached data if available
            if key in _cache:
                return _cache[key]["data"]
            raise HTTPException(status_code=429, detail="CoinGecko rate limit exceeded. Try again later.")
        resp.raise_for_status()
        data = resp.json()
        _cache[key] = {"data": data, "ts": now}
        return data


@api_router.get("/")
async def root():
    return {"message": "Crypto Investment API"}


@api_router.get("/crypto/top-coins")
async def get_top_coins(limit: int = 20):
    url = f"{COINGECKO_BASE}/coins/markets?vs_currency=usd&order=market_cap_desc&per_page={limit}&page=1&sparkline=true&price_change_percentage=24h,7d"
    try:
        data = await cached_fetch(f"top_coins_{limit}", url, ttl_seconds=120)
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
                "price_change_percentage_7d": coin.get("price_change_percentage_7d_in_currency"),
                "total_volume": coin.get("total_volume"),
                "sparkline_in_7d": coin.get("sparkline_in_7d", {}).get("price", []),
            })
        return {"coins": coins}
    except httpx.HTTPStatusError as e:
        raise HTTPException(status_code=e.response.status_code, detail="Failed to fetch coin data")
    except Exception as e:
        logging.error(f"Error fetching top coins: {e}")
        raise HTTPException(status_code=500, detail=str(e))


@api_router.get("/crypto/trending")
async def get_trending():
    url = f"{COINGECKO_BASE}/search/trending"
    try:
        data = await cached_fetch("trending", url, ttl_seconds=300)
        trending = []
        for item in data.get("coins", [])[:10]:
            coin = item.get("item", {})
            trending.append({
                "id": coin.get("id"),
                "name": coin.get("name"),
                "symbol": coin.get("symbol", "").upper(),
                "thumb": coin.get("thumb"),
                "market_cap_rank": coin.get("market_cap_rank"),
                "price_btc": coin.get("price_btc"),
            })
        return {"trending": trending}
    except Exception as e:
        logging.error(f"Error fetching trending: {e}")
        raise HTTPException(status_code=500, detail=str(e))


@api_router.get("/crypto/global")
async def get_global_stats():
    url = f"{COINGECKO_BASE}/global"
    try:
        data = await cached_fetch("global", url, ttl_seconds=300)
        gdata = data.get("data", {})
        return {
            "total_market_cap": gdata.get("total_market_cap", {}).get("usd", 0),
            "total_volume": gdata.get("total_volume", {}).get("usd", 0),
            "market_cap_change_24h": gdata.get("market_cap_change_percentage_24h_usd", 0),
            "active_cryptocurrencies": gdata.get("active_cryptocurrencies", 0),
            "markets": gdata.get("markets", 0),
            "btc_dominance": gdata.get("market_cap_percentage", {}).get("btc", 0),
        }
    except Exception as e:
        logging.error(f"Error fetching global: {e}")
        raise HTTPException(status_code=500, detail=str(e))


# Newsletter subscription
class NewsletterSubscribe(BaseModel):
    email: str

@api_router.post("/newsletter/subscribe")
async def subscribe_newsletter(data: NewsletterSubscribe):
    existing = await db.newsletter.find_one({"email": data.email}, {"_id": 0})
    if existing:
        return {"message": "Already subscribed", "status": "exists"}
    doc = {
        "id": str(uuid.uuid4()),
        "email": data.email,
        "subscribed_at": datetime.now(timezone.utc).isoformat(),
    }
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
