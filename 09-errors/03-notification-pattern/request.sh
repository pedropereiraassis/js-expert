echo $'\n\n[requesting: normal request]'
curl -i localhost:3000 -X POST -d '{"name": "Avenger", "age": 50}' # correct

echo $'\n\n[requesting: invalid age]'
curl -i localhost:3000 -X POST -d '{"name": "Avenger", "age": 18}'

echo $'\n\n[requesting: invalid name]'
curl -i localhost:3000 -X POST -d '{"name": "A", "age": 50}'

echo $'\n\n[requesting: all invalid]'
curl -i localhost:3000 -X POST -d '{"name": "A", "age": 0}'

echo $'\n\n[requesting: connection error]'
curl -i localhost:3000 -X POST -d '{"connectionError": "Error", "name": "Avenger", "age": 50}'