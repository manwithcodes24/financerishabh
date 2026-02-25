from fastapi import FastAPI, APIRouter, HTTPException
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
import httpx
import asyncio
from pathlib import Path
from pydantic import BaseModel
from typing import List
import uuid
from datetime import datetime, timezone

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

app = FastAPI()
api_router = APIRouter(prefix="/api")

# In-memory cache with long TTL
_cache = {}
COINGECKO_BASE = "https://api.coingecko.com/api/v3"

# Fallback data for when API is rate limited
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
    {"id":"polkadot","name":"Polkadot","symbol":"DOT","image":"https://assets.coingecko.com/coins/images/12171/large/polkadot.png","current_price":7.85,"market_cap":11200000000,"market_cap_rank":11,"price_change_percentage_24h":-0.65,"total_volume":450000000,"sparkline_in_7d":[]},
    {"id":"chainlink","name":"Chainlink","symbol":"LINK","image":"https://assets.coingecko.com/coins/images/877/large/chainlink-new-logo.png","current_price":18.42,"market_cap":11800000000,"market_cap_rank":12,"price_change_percentage_24h":2.78,"total_volume":890000000,"sparkline_in_7d":[]},
    {"id":"tron","name":"TRON","symbol":"TRX","image":"https://assets.coingecko.com/coins/images/1094/large/tron-logo.png","current_price":0.268,"market_cap":23000000000,"market_cap_rank":13,"price_change_percentage_24h":0.45,"total_volume":620000000,"sparkline_in_7d":[]},
    {"id":"polygon-ecosystem-token","name":"POL","symbol":"POL","image":"https://assets.coingecko.com/coins/images/32440/large/polygon.png","current_price":0.485,"market_cap":4800000000,"market_cap_rank":14,"price_change_percentage_24h":1.12,"total_volume":310000000,"sparkline_in_7d":[]},
    {"id":"shiba-inu","name":"Shiba Inu","symbol":"SHIB","image":"https://assets.coingecko.com/coins/images/11939/large/shiba.png","current_price":0.0000245,"market_cap":14500000000,"market_cap_rank":15,"price_change_percentage_24h":-2.18,"total_volume":750000000,"sparkline_in_7d":[]},
    {"id":"uniswap","name":"Uniswap","symbol":"UNI","image":"https://assets.coingecko.com/coins/images/12504/large/uni.jpg","current_price":13.85,"market_cap":8300000000,"market_cap_rank":16,"price_change_percentage_24h":0.92,"total_volume":340000000,"sparkline_in_7d":[]},
    {"id":"litecoin","name":"Litecoin","symbol":"LTC","image":"https://assets.coingecko.com/coins/images/2/large/litecoin.png","current_price":125.40,"market_cap":9400000000,"market_cap_rank":17,"price_change_percentage_24h":-0.28,"total_volume":580000000,"sparkline_in_7d":[]},
    {"id":"near","name":"NEAR Protocol","symbol":"NEAR","image":"https://assets.coingecko.com/coins/images/10365/large/near.jpg","current_price":5.62,"market_cap":6700000000,"market_cap_rank":18,"price_change_percentage_24h":3.45,"total_volume":420000000,"sparkline_in_7d":[]},
    {"id":"pepe","name":"Pepe","symbol":"PEPE","image":"https://assets.coingecko.com/coins/images/29850/large/pepe-token.jpeg","current_price":0.0000185,"market_cap":7800000000,"market_cap_rank":19,"price_change_percentage_24h":6.72,"total_volume":2100000000,"sparkline_in_7d":[]},
    {"id":"stellar","name":"Stellar","symbol":"XLM","image":"https://assets.coingecko.com/coins/images/100/large/Stellar_symbol_black_RGB.png","current_price":0.462,"market_cap":13800000000,"market_cap_rank":20,"price_change_percentage_24h":1.05,"total_volume":380000000,"sparkline_in_7d":[]},
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
    {"id":"ripple","name":"XRP","symbol":"XRP","thumb":"https://assets.coingecko.com/coins/images/44/small/xrp-symbol-white-128.png","market_cap_rank":6,"price_btc":0.000027},
    {"id":"near","name":"NEAR Protocol","symbol":"NEAR","thumb":"https://assets.coingecko.com/coins/images/10365/small/near.jpg","market_cap_rank":18,"price_btc":0.00006},
]


async def cached_fetch(key: str, url: str, ttl_seconds: int = 120, fallback=None):
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
                    # Return cached or fallback
                    if key in _cache:
                        return _cache[key]["data"]
                    if fallback is not None:
                        return fallback
                    raise HTTPException(status_code=429, detail="CoinGecko rate limit. Try again later.")
                resp.raise_for_status()
                data = resp.json()
                _cache[key] = {"data": data, "ts": now}
                return data
        except httpx.HTTPStatusError:
            if key in _cache:
                return _cache[key]["data"]
            if fallback is not None:
                return fallback
            raise
        except Exception:
            if attempt < 2:
                await asyncio.sleep(1)
                continue
            if key in _cache:
                return _cache[key]["data"]
            if fallback is not None:
                return fallback
            raise

    if fallback is not None:
        return fallback
    raise HTTPException(status_code=503, detail="Unable to fetch data")


@api_router.get("/")
async def root():
    return {"message": "Crypto Investment API"}


@api_router.get("/crypto/top-coins")
async def get_top_coins(limit: int = 20):
    url = f"{COINGECKO_BASE}/coins/markets?vs_currency=usd&order=market_cap_desc&per_page={limit}&page=1&sparkline=true&price_change_percentage=24h,7d"
    try:
        data = await cached_fetch(f"top_coins_{limit}", url, ttl_seconds=120, fallback=FALLBACK_COINS[:limit])
        # If data is already our fallback format (list of dicts with 'id' key)
        if isinstance(data, list) and len(data) > 0 and "id" in data[0]:
            return {"coins": data[:limit]}
        # CoinGecko format
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
    except HTTPException:
        return {"coins": FALLBACK_COINS[:limit]}
    except Exception as e:
        logging.error(f"Error fetching top coins: {e}")
        return {"coins": FALLBACK_COINS[:limit]}


@api_router.get("/crypto/trending")
async def get_trending():
    url = f"{COINGECKO_BASE}/search/trending"
    try:
        data = await cached_fetch("trending", url, ttl_seconds=300, fallback={"coins": []})
        if "trending" in data:
            return data  # Already our format
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
        return {"trending": FALLBACK_TRENDING}


@api_router.get("/crypto/global")
async def get_global_stats():
    url = f"{COINGECKO_BASE}/global"
    try:
        data = await cached_fetch("global", url, ttl_seconds=300, fallback={"data": {}})
        if "total_market_cap" in data:
            return data  # Already our format
        gdata = data.get("data", {})
        if not gdata:
            return FALLBACK_GLOBAL
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
        return FALLBACK_GLOBAL


class NewsletterSubscribe(BaseModel):
    email: str

def is_valid_email(email: str) -> bool:
    import re
    return bool(re.match(r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$', email))

@api_router.post("/newsletter/subscribe")
async def subscribe_newsletter(data: NewsletterSubscribe):
    if not is_valid_email(data.email):
        raise HTTPException(status_code=422, detail="Invalid email address")
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
