# Radio Channel Backend
In order the backend is working correctly following environment variables have to be defined:
```
PORT            Port for the express server; default is 5002
MONGO_URL       MongDB URL for storing the radio channels
A1_RADIO_URL    URL for updating channels from cloud (get cloud data from A1)
JWT_SECRET      Secret for verifing tokens
```