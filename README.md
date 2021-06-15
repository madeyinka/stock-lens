# stock-lens
A stock taking inventory system. Reconciliation and sales valuation.

# Auth Routes
# Register
url: https://stocklens.herokuapp.com/stock-lens/api/1.0/auth/register
method: POST
payload: {
    "fname": "Adekunle",
    "lname": "Chukwuemeka",
    "email": "example@email.com",
    "phone": "090000000001",
    "role": "manager",
    "station_id": "xxxxxxxxxxxxxxx",
    "branch_id": "xxxxxxxxxxxxxxxx"
}
resp(success): {"error": boolean, "message":"", resp:response}

# login:
url: https://stocklens.herokuapp.com/stock-lens/api/1.0/auth/login
method: POST
payload: { "email":"example@email.com", "password":"userPassword"}
resp(success): {"error": boolean, message: "", token: token}

# verify
url: https://stocklens.herokuapp.com/stock-lens/api/1.0/auth/verify
method: GET
payload: 
resp(success): {"error": boolean, message:"", resp: response}

# password-reset
url: https://stocklens.herokuapp.com/stock-lens/api/1.0/auth/reset
method: POST
payload: {"email":"example@email.com"}
resp: {"error": boolean, "message": ""}