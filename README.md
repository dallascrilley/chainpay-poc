# README #
 
### install dependencies ###

* npm install
 

### start server ###

* node index.js
 

### server will run at  port 3001 ###

curl -X POST \
  http://localhost:3001/transfer \
  -H 'cache-control: no-cache' \
  -H 'content-type: application/json' \
  -d '{
	"address":"0x85148b2debD2a2ea4eA744500BeAD37453b5004b",
	"amount":10
}'



curl -X POST \
  http://localhost:3001/transfer \
  -H 'cache-control: no-cache' \
  -H 'content-type: application/json' \
  -d '{
	"address":<address>,
	"amount":<amount>
}'
 
* this endpoint will return transaction hex if succeed else will return error

