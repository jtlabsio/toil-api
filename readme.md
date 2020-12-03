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

# start mongod
sudo systemctl start mongod.service
sudo systemctl enable mongod
```

```bash
git clone https://github.com/jtlabsio/toil-api.git
cd toil-api
npm i
npm start
```