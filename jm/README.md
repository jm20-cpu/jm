# J&M Capital — Realtime Website

A working Flask website implementing the J&M Capital concept:
- Marketplace with live search/filtering
- Product price-intelligence modal
- Live-updating market-feed interface
- Analytics/AI/Academy sections
- Responsive modern UI
- Render deployment configuration

## Run locally
1. Install Python 3.11+.
2. Open a terminal in this folder.
3. `pip install -r requirements.txt`
4. `python app.py`
5. Open http://127.0.0.1:5000

## Deploy to Render
Push this folder to GitHub and create a Render Web Service.
Build: `pip install -r requirements.txt`
Start: `gunicorn app:app`

## Production upgrades
The current demo is deliberately self-contained. Before public launch, connect PostgreSQL, authentication, object storage for images, real/licensed market APIs, payments, messaging, moderation, email/SMS, analytics and an AI provider. Never expose API keys in frontend code.
