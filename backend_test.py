import requests
import sys
import json
from datetime import datetime
import time

class CryptoAPITester:
    def __init__(self, base_url="https://token-flow-hub.preview.emergentagent.com/api"):
        self.base_url = base_url
        self.tests_run = 0
        self.tests_passed = 0
        self.failed_tests = []
        self.results = {}

    def run_test(self, name, method, endpoint, expected_status, data=None, expected_fields=None):
        """Run a single API test"""
        url = f"{self.base_url}/{endpoint}"
        headers = {'Content-Type': 'application/json'}

        self.tests_run += 1
        print(f"\n🔍 Testing {name}...")
        
        try:
            if method == 'GET':
                response = requests.get(url, headers=headers, timeout=30)
            elif method == 'POST':
                response = requests.post(url, json=data, headers=headers, timeout=30)

            # Check status code
            success = response.status_code == expected_status
            if success:
                self.tests_passed += 1
                print(f"✅ Passed - Status: {response.status_code}")
                
                # Check response structure if expected_fields provided
                if expected_fields:
                    try:
                        response_data = response.json()
                        self.validate_response_fields(name, response_data, expected_fields)
                        return True, response_data
                    except Exception as e:
                        print(f"⚠️  Response structure issue: {str(e)}")
                        return True, {}
                
                return True, response.json() if response.content else {}
            else:
                print(f"❌ Failed - Expected {expected_status}, got {response.status_code}")
                print(f"Response: {response.text}")
                self.failed_tests.append({
                    "test": name,
                    "expected": expected_status,
                    "actual": response.status_code,
                    "response": response.text
                })

            return success, {}

        except requests.exceptions.Timeout:
            print(f"❌ Failed - Timeout after 30 seconds")
            self.failed_tests.append({
                "test": name,
                "error": "Timeout"
            })
            return False, {}
        except Exception as e:
            print(f"❌ Failed - Error: {str(e)}")
            self.failed_tests.append({
                "test": name,
                "error": str(e)
            })
            return False, {}

    def validate_response_fields(self, test_name, data, expected_fields):
        """Validate response has expected fields"""
        for field in expected_fields:
            if field not in data:
                raise ValueError(f"Missing field '{field}' in {test_name} response")
        print(f"✅ Response structure validated for {test_name}")

    def test_root_endpoint(self):
        """Test API root endpoint"""
        success, response = self.run_test(
            "API Root",
            "GET",
            "",
            200,
            expected_fields=["message"]
        )
        return success

    def test_top_coins_endpoint(self):
        """Test top coins endpoint"""
        success, response = self.run_test(
            "Top Coins (Default)",
            "GET",
            "crypto/top-coins",
            200,
            expected_fields=["coins"]
        )
        
        if success and response:
            coins = response.get("coins", [])
            print(f"📊 Returned {len(coins)} coins")
            
            # Test with limit parameter
            success_limit, response_limit = self.run_test(
                "Top Coins (Limit 5)",
                "GET",
                "crypto/top-coins?limit=5",
                200,
                expected_fields=["coins"]
            )
            
            if success_limit and response_limit:
                limited_coins = response_limit.get("coins", [])
                print(f"📊 Limited query returned {len(limited_coins)} coins")
                if len(limited_coins) > 5:
                    print(f"⚠️  Warning: Expected max 5 coins, got {len(limited_coins)}")
        
        return success

    def test_trending_endpoint(self):
        """Test trending coins endpoint"""
        success, response = self.run_test(
            "Trending Coins",
            "GET",
            "crypto/trending",
            200,
            expected_fields=["trending"]
        )
        
        if success and response:
            trending = response.get("trending", [])
            print(f"🔥 Returned {len(trending)} trending coins")
        
        return success

    def test_global_stats_endpoint(self):
        """Test global market stats endpoint"""
        success, response = self.run_test(
            "Global Market Stats",
            "GET",
            "crypto/global",
            200,
            expected_fields=["total_market_cap", "total_volume", "active_cryptocurrencies"]
        )
        
        if success and response:
            print(f"🌍 Market Cap: ${response.get('total_market_cap', 0):,.0f}")
            print(f"🌍 24h Volume: ${response.get('total_volume', 0):,.0f}")
            print(f"🌍 Active Cryptos: {response.get('active_cryptocurrencies', 0):,}")
        
        return success

    def test_newsletter_subscription(self):
        """Test newsletter subscription endpoint"""
        test_email = f"test_{int(time.time())}@example.com"
        
        # Test valid email
        success, response = self.run_test(
            "Newsletter Subscribe (Valid)",
            "POST",
            "newsletter/subscribe",
            200,
            data={"email": test_email},
            expected_fields=["message", "status"]
        )
        
        if success and response:
            print(f"📧 Subscription status: {response.get('status')}")
        
        # Test duplicate email
        success_dup, response_dup = self.run_test(
            "Newsletter Subscribe (Duplicate)",
            "POST",
            "newsletter/subscribe",
            200,
            data={"email": test_email},
            expected_fields=["message", "status"]
        )
        
        if success_dup and response_dup:
            status = response_dup.get('status')
            if status == 'exists':
                print(f"✅ Duplicate email handling works correctly")
            else:
                print(f"⚠️  Expected 'exists' status for duplicate, got '{status}'")
        
        # Test invalid email
        success_invalid, _ = self.run_test(
            "Newsletter Subscribe (Invalid Email)",
            "POST",
            "newsletter/subscribe",
            422,  # FastAPI validation error
            data={"email": "invalid-email"}
        )
        
        return success and success_dup

def main():
    print("🚀 Starting Crypto Investment Platform API Tests")
    print("=" * 60)
    
    tester = CryptoAPITester()
    
    # Run all tests
    tests = [
        tester.test_root_endpoint,
        tester.test_top_coins_endpoint,
        tester.test_trending_endpoint,
        tester.test_global_stats_endpoint,
        tester.test_newsletter_subscription,
    ]
    
    all_passed = True
    for test in tests:
        try:
            result = test()
            if not result:
                all_passed = False
        except Exception as e:
            print(f"❌ Test failed with exception: {str(e)}")
            all_passed = False
        
        print("-" * 40)
    
    # Print final results
    print("\n📊 Test Results Summary:")
    print(f"Tests Run: {tester.tests_run}")
    print(f"Tests Passed: {tester.tests_passed}")
    print(f"Tests Failed: {tester.tests_run - tester.tests_passed}")
    print(f"Success Rate: {(tester.tests_passed / tester.tests_run * 100):.1f}%")
    
    if tester.failed_tests:
        print("\n❌ Failed Tests:")
        for failed in tester.failed_tests:
            print(f"  - {failed.get('test', 'Unknown')}: {failed.get('error', 'Status code mismatch')}")
    
    return 0 if all_passed else 1

if __name__ == "__main__":
    sys.exit(main())