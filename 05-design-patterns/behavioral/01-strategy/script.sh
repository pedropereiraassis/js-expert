# postgres
docker run \
  --name postgres \
  --rm \
  -e POSTGRES_USER=postgres \
  -e POSTGRES_PASSWORD=postgres \
  -e POSTGRES_DB=heroes \
  -p 5432:5432 \
  -d \
  postgres

docker logs postgres
docker exec -it postgres psql --username postgres --dbname heroes
CREATE TABLE warriors(id serial PRIMARY KEY, name VARCHAR(255) NOT NULL, type VARCHAR(255) NOT NULL);
SELECT * FROM warriors;

# mongodb
docker run \
  --name mongodb \
  --rm \
  -e MONGO_INITDB_ROOT_USERNAME=mongo \
  -e MONGO_INITDB_ROOT_PASSWORD=admin \
  -p 27017:27017 \
  -d \
  mongo:4

docker logs mongodb