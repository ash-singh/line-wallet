# line-wallet

## challenge
1. node challenge/run.js

## Prerequisites
- [nodejs]
- [docker](https://docs.docker.com/install/)

## Getting started

1. clone [https://github.com/ash-singh/line-wallet.git](https://github.com/ash-singh/line-wallet.git) and `cd` into the project's root

2. start monodb
```shell script
    $ docker compose up -d
```
2. install monodb
```shell script
    $ docker compose up -d
```
3. create a copy of .env.example and name it .env 

4. set your own value for env variable in .env

5. run following command
```shell script
    $ bash run.sh
```
5. naviagate to [http://localhost:4000/graphql](http://localhost:4000/graphql)

## Setting Plaid access token

1. Call createLinkToken and obtain link_token
2. Open clinet/placid.html and set 
    token: 'above link token'
3. Click Link Placid Account button, follow the steps provided by Plaid. After 
   successful login you will see the public_token in browser console.
4. Copy public_token from the browser console and Call setPlaidAccessToken
