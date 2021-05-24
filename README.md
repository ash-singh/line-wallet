# line-wallet

## Prerequisites
- [nodejs]
- [docker](https://docs.docker.com/install/)

## Getting started

1. clone [https://github.com/ash-singh/line-wallet.git](https://github.com/ash-singh/line-wallet.git) and `cd` into the project's root

## challenge
2. Run challenge
```shell script
    $ node challenge/run.js
```

3. start monodb
```shell script
    $ docker compose up -d
```
4. create a copy of .env.example and name it .env 
```shell script
    $ cp .env.example .env
```

5. set your own value for env variable in .env

6. run following command
```shell script
    $ bash run.sh
```
7. naviagate to [http://localhost:4000/graphql](http://localhost:4000/graphql)

## Setting Plaid access token

1. Call createLinkToken and obtain link_token
2. Open clinet/placid.html and set 
    token: 'above link token'
3. Click Link Placid Account button, follow the steps provided by Plaid. After 
   successful login you will see the public_token in browser console.
4. Copy public_token from the browser console and Call setPlaidAccessToken


## Example user document

```json
{
  "_id": {
    "$oid": "60ab35cc309a90409271d40d"
  },
  "name": "Jim Bean",
  "email": "jimbean@gmail.com",
  "password": "asdasdsadasdasdasdad",
  "verification_token": "adasdasdadad",
  "is_verified": true,
  "__v": 0,
  "access_token": "xxxxxxxxxxxxxx",
  "placid": {
    "_id": {
      "$oid": "60ab4b9e2e9e334fa1f51414"
    },
    "access_token": "dummy-1805-4c96-bdea-1c6ff2e2473c",
    "item_id": "dummylXB8N3HvxebaeVWofE838xE",
    "email": "accountholder0@example.com",
    "full_name": "Alberta Bobbeth Charleson",
    "address": {
      "city": "Malakoff",
      "country": "US",
      "postal_code": "14236",
      "region": "NY",
      "street": "2992 Cameron Road"
    },
    "account": {
      "account": "xxxxxx30000",
      "account_id": "ccccccccd6APoDZyI5pvDA9vggUzGWVRK",
      "routing": "xxxxxx",
      "wire_routing": "xxxxxx",
      "name": "Plaid Checking",
      "account_type": "depository"
    }
  },
  "dwolla": {
    "customer": "https://api-sandbox.dwolla.com/customers/783950b2-e694-4d7c-a2a0-5fff246f527c",
    "funding_source": "https://api-sandbox.dwolla.com/funding-sources/6eae04ba-adfc-4470-a24a-fc4b597ea154",
    "wallet": {
      "id": "e0183ebf-e110-44cb-b318-b9d7a98164a9",
      "funding_source": "https://api-sandbox.dwolla.com/funding-sources/e0183ebf-e110-44cb-b318-b9d7a98164a9",
      "created": "2021-05-24T11:26:30.521Z",
      "source_type": "balance",
      "name": "Balance"
    }
  }
}
```

