# toil-api

Under development

## Getting Started

### Prerequisites

* Node.js (LTS recommended)
* MongoDB

#### Node.js

Recommend using a package management tool (i.e. homebrew) or using n (<https://github.com/tj/n>).

#### MongoDB

##### Docker

Note: the following command is an example. Consider mapping a volume to store the mongo data locally.

```bash
docker run --name mongodb -d mongo:4.4 -p 27017:27017
```

##### Multipass / Ubuntu VM

```bash
# create VM for MongoDB
multipass launch -n mongodb
multipass shell mongodb

# add the MongoDB release signing key
curl -fsSL https://www.mongodb.org/static/pgp/server-4.4.asc | sudo apt-key add -

# add the MongoDB package repository
echo "deb [ arch=amd64,arm64 ] https://repo.mongodb.org/apt/ubuntu focal/mongodb-org/4.4 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-4.4.list

# install MongoDB
sudo apt install mongodb-org

# update /etc/mongod.conf to expose Mongo from VM
# find bindIp: 127.0.0.1 and change to bindIp: 0.0.0.0
sudo vi /etc/mongod.conf

# start mongod
sudo systemctl start mongod.service
sudo systemctl enable mongod
```

#### API

##### Clone and Install Dependencies

```bash
git clone https://github.com/jtlabsio/toil-api.git
cd toil-api
npm i
```

##### Configure

Create a `local.yml` file in the `./settings` folder:

```bash
touch settings/local.yml
```

Now, get the IP of the mongodb instance (run the following command and look for IPv4 value):

```bash
multipass info mongodb1
```

Finally, modify the `local.yml` to point to the mongodb instance... see my example below (note the IP of `192.168.64.8` is from my local machine and will be different for your install):

```yaml
data:
  url: mongodb://192.168.64.8:27017/toil
logging:
  level: trace
```

##### Run the Microservice

```bash
npm start
```
