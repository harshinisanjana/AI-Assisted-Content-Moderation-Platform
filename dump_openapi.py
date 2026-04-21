import json
from main import app

with open("openapi.json", "w") as f:
    json.dump(app.openapi(), f, indent=2)

print("OpenAPI schema dumped to openapi.json")
