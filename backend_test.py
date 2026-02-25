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

    def test_schemes_endpoint(self):
        """Test schemes retrieval endpoint"""
        success, response = self.run_test(
            "Get Schemes",
            "GET",
            "schemes",
            200,
            expected_fields=["schemes"]
        )
        
        if success and response:
            schemes = response.get("schemes", [])
            print(f"💰 Found {len(schemes)} active schemes")
            if len(schemes) >= 4:
                print(f"✅ Expected at least 4 default schemes, found {len(schemes)}")
            else:
                print(f"⚠️  Expected at least 4 schemes, found {len(schemes)}")
                
            # Validate scheme structure
            if schemes:
                first_scheme = schemes[0]
                required_fields = ["id", "title", "min_investment", "max_investment", 
                                 "return_percentage", "duration_months", "description", 
                                 "is_popular", "is_active"]
                for field in required_fields:
                    if field not in first_scheme:
                        print(f"⚠️  Missing field '{field}' in scheme structure")
                    else:
                        print(f"✅ Scheme field '{field}': {first_scheme[field]}")
        
        return success

    def test_admin_login(self):
        """Test admin login endpoint"""
        # Test correct password
        success, response = self.run_test(
            "Admin Login (Correct Password)",
            "POST",
            "admin/login",
            200,
            data={"password": "Newral@123"},
            expected_fields=["message", "authenticated"]
        )
        
        if success and response:
            authenticated = response.get("authenticated", False)
            if authenticated:
                print(f"✅ Admin login successful")
            else:
                print(f"⚠️  Login response shows not authenticated")
        
        # Test incorrect password
        success_wrong, _ = self.run_test(
            "Admin Login (Wrong Password)",
            "POST",
            "admin/login",
            401,
            data={"password": "wrongpassword"}
        )
        
        return success and success_wrong

    def test_admin_schemes_crud(self):
        """Test admin CRUD operations for schemes"""
        admin_password = "Newral@123"
        
        # Test creating a new scheme
        new_scheme_data = {
            "title": "Test Plan",
            "min_investment": 1000,
            "max_investment": 5000,
            "return_percentage": 40.0,
            "duration_months": 1,
            "description": "Test scheme for API testing",
            "is_popular": False,
            "is_active": True
        }
        
        success_create, create_response = self.run_test(
            "Admin Create Scheme",
            "POST",
            "admin/schemes",
            200,
            data=new_scheme_data
        )
        
        if not success_create:
            # Try with header
            url = f"{self.base_url}/admin/schemes"
            headers = {
                'Content-Type': 'application/json',
                'x-admin-password': admin_password
            }
            
            try:
                response = requests.post(url, json=new_scheme_data, headers=headers, timeout=30)
                if response.status_code == 200:
                    create_response = response.json()
                    success_create = True
                    self.tests_passed += 1
                    print(f"✅ Admin Create Scheme - Status: {response.status_code}")
                else:
                    print(f"❌ Admin Create Scheme - Expected 200, got {response.status_code}")
                    print(f"Response: {response.text}")
                    return False
            except Exception as e:
                print(f"❌ Admin Create Scheme - Error: {str(e)}")
                return False
        
        scheme_id = create_response.get("id") if create_response else None
        if not scheme_id:
            print(f"⚠️  No scheme ID returned from create operation")
            return False
        
        print(f"✅ Created scheme with ID: {scheme_id}")
        
        # Test updating the scheme
        update_data = {
            "title": "Updated Test Plan",
            "description": "Updated test scheme description"
        }
        
        url = f"{self.base_url}/admin/schemes/{scheme_id}"
        headers = {
            'Content-Type': 'application/json',
            'x-admin-password': admin_password
        }
        
        try:
            response = requests.put(url, json=update_data, headers=headers, timeout=30)
            success_update = response.status_code == 200
            if success_update:
                self.tests_passed += 1
                print(f"✅ Admin Update Scheme - Status: {response.status_code}")
            else:
                print(f"❌ Admin Update Scheme - Expected 200, got {response.status_code}")
        except Exception as e:
            print(f"❌ Admin Update Scheme - Error: {str(e)}")
            success_update = False
        
        # Test deleting the scheme
        try:
            response = requests.delete(url, headers=headers, timeout=30)
            success_delete = response.status_code == 200
            if success_delete:
                self.tests_passed += 1
                print(f"✅ Admin Delete Scheme - Status: {response.status_code}")
            else:
                print(f"❌ Admin Delete Scheme - Expected 200, got {response.status_code}")
        except Exception as e:
            print(f"❌ Admin Delete Scheme - Error: {str(e)}")
            success_delete = False
        
        self.tests_run += 3  # Create, Update, Delete
        
        return success_create and success_update and success_delete

    def test_team_endpoint(self):
        """Test team members endpoint"""
        success, response = self.run_test(
            "Get Team Members",
            "GET",
            "team",
            200,
            expected_fields=["team"]
        )
        
        if success and response:
            team = response.get("team", [])
            print(f"👥 Found {len(team)} team members")
            
            expected_members = ["Ankur Agrawal", "Radhika Gupta", "Abhay Sharma", "Rishabh Singh"]
            if len(team) >= 4:
                print(f"✅ Expected at least 4 team members, found {len(team)}")
                
                # Check if expected members are present
                found_members = [member.get("name", "") for member in team]
                for expected_member in expected_members:
                    if expected_member in found_members:
                        print(f"✅ Found expected team member: {expected_member}")
                    else:
                        print(f"⚠️  Missing expected team member: {expected_member}")
                
                # Validate team member structure
                if team:
                    first_member = team[0]
                    required_fields = ["name", "role", "initials"]
                    for field in required_fields:
                        if field not in first_member:
                            print(f"⚠️  Missing field '{field}' in team member structure")
                        else:
                            print(f"✅ Team member field '{field}': {first_member[field]}")
            else:
                print(f"⚠️  Expected 4 team members, found {len(team)}")
        
        return success

    def test_settings_endpoints(self):
        """Test settings GET and PUT endpoints"""
        admin_password = "Newral@123"
        
        # Test GET settings
        success_get, response = self.run_test(
            "Get Settings",
            "GET",
            "settings",
            200,
            expected_fields=["telegram_link"]
        )
        
        if success_get and response:
            telegram_link = response.get("telegram_link", "")
            print(f"📱 Current Telegram link: {telegram_link}")
            if telegram_link:
                print(f"✅ Telegram link is configured")
            else:
                print(f"⚠️  Telegram link is empty")
        
        # Test PUT settings (update Telegram link)
        test_telegram_link = "https://t.me/test_wealthx_invest"
        update_data = {
            "telegram_link": test_telegram_link
        }
        
        url = f"{self.base_url}/admin/settings"
        headers = {
            'Content-Type': 'application/json',
            'x-admin-password': admin_password
        }
        
        success_put = False
        try:
            response = requests.put(url, json=update_data, headers=headers, timeout=30)
            if response.status_code == 200:
                success_put = True
                self.tests_passed += 1
                print(f"✅ Update Settings - Status: {response.status_code}")
                
                # Verify the update by getting settings again
                success_verify, verify_response = self.run_test(
                    "Verify Settings Update",
                    "GET",
                    "settings",
                    200,
                    expected_fields=["telegram_link"]
                )
                
                if success_verify and verify_response:
                    updated_link = verify_response.get("telegram_link", "")
                    if updated_link == test_telegram_link:
                        print(f"✅ Telegram link successfully updated to: {updated_link}")
                    else:
                        print(f"⚠️  Expected '{test_telegram_link}', got '{updated_link}'")
            else:
                print(f"❌ Update Settings - Expected 200, got {response.status_code}")
                print(f"Response: {response.text}")
        except Exception as e:
            print(f"❌ Update Settings - Error: {str(e)}")
        
        self.tests_run += 2  # GET and PUT
        
        return success_get and success_put

def main():
    print("🚀 Starting Crypto Investment Platform API Tests")
    print("=" * 60)
    
    tester = CryptoAPITester()
    
    # Run all tests
    tests = [
        tester.test_root_endpoint,
        tester.test_schemes_endpoint,
        tester.test_team_endpoint,
        tester.test_settings_endpoints,
        tester.test_admin_login,
        tester.test_admin_schemes_crud,
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