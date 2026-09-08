from flask import Flask, render_template, jsonify, request
from datetime import datetime, timezone
import random, statistics

app = Flask(__name__)

products = [
    {"id":1,"name":"Samsung Galaxy A55 5G","category":"Phones & Tablets","price":38999,"location":"Nairobi","condition":"New","seller":"TechHub Kenya","rating":4.8,"emoji":"📱"},
    {"id":2,"name":"HP EliteBook 840 G8","category":"Computers & Laptops","price":52500,"location":"Nairobi","condition":"Refurbished","seller":"Laptop Point","rating":4.7,"emoji":"💻"},
    {"id":3,"name":"Lenovo IdeaPad 5","category":"Computers & Laptops","price":69900,"location":"Nakuru","condition":"New","seller":"Digital World","rating":4.6,"emoji":"💻"},
    {"id":4,"name":"LG 55-inch Smart TV","category":"Electronics","price":84999,"location":"Mombasa","condition":"New","seller":"HomeTech","rating":4.5,"emoji":"📺"},
    {"id":5,"name":"Office Executive Chair","category":"Furniture","price":18500,"location":"Nairobi","condition":"New","seller":"Office Mart","rating":4.4,"emoji":"🪑"},
    {"id":6,"name":"DJI Mini Drone","category":"Electronics","price":115000,"location":"Nairobi","condition":"New","seller":"Gadget Zone","rating":4.9,"emoji":"🚁"},
    {"id":7,"name":"Solar Panel 550W","category":"Home & Energy","price":24500,"location":"Eldoret","condition":"New","seller":"Green Power","rating":4.7,"emoji":"☀️"},
    {"id":8,"name":"Mountain Bike","category":"Sports & Fitness","price":32000,"location":"Nakuru","condition":"New","seller":"Active Kenya","rating":4.5,"emoji":"🚲"},
]

def price_stats(items):
    vals = [p["price"] for p in items]
    if not vals: return {"count":0}
    return {"count":len(vals),"lowest":min(vals),"highest":max(vals),
            "average":round(statistics.mean(vals)), "median":round(statistics.median(vals))}

@app.route("/")
def index():
    return render_template("index.html")

@app.get("/api/products")
def api_products():
    q = request.args.get("q","").strip().lower()
    category = request.args.get("category","").strip().lower()
    items = [p for p in products if (not q or q in p["name"].lower() or q in p["category"].lower() or q in p["seller"].lower())
             and (not category or category == "all" or p["category"].lower() == category)]
    return jsonify({"products":items,"stats":price_stats(items),
                    "updated_at":datetime.now(timezone.utc).isoformat()})

@app.get("/api/product/<int:pid>")
def api_product(pid):
    p = next((x for x in products if x["id"]==pid), None)
    if not p: return jsonify({"error":"Product not found"}),404
    comps = [x for x in products if x["category"]==p["category"] and x["id"]!=pid]
    comp_prices = [x["price"] for x in comps] + [p["price"]]
    avg = round(statistics.mean(comp_prices))
    p = dict(p)
    p["market_average"]=avg
    p["price_position"]=round((p["price"]-avg)/avg*100,1)
    p["comparables"]=comps
    return jsonify(p)

@app.get("/api/market")
def api_market():
    base = {"NSE": [182.4, 0.8], "USD/KES": [129.42, -0.12], "EUR/KES": [151.06, 0.21], "GBP/KES":[174.92,-0.31]}
    data=[]
    for symbol,(value,change) in base.items():
        jitter=random.uniform(-0.15,0.15) if symbol=="NSE" else random.uniform(-0.03,0.03)
        v=round(value+jitter,2)
        data.append({"symbol":symbol,"value":v,"change":round(change+jitter/4,2)})
    return jsonify({"data":data,"updated_at":datetime.now(timezone.utc).isoformat()})

@app.get("/api/health")
def health():
    return jsonify({"status":"online","service":"J&M Capital","time":datetime.now(timezone.utc).isoformat()})

@app.post("/api/contact")
def contact():
    body=request.get_json(silent=True) or {}
    return jsonify({"ok":True,"message":f"Thanks, {body.get('name','there')}. Your message has been received."})

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000, debug=True)
