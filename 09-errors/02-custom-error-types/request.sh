echo $'\n\n[requesting: normal request]'
curl -i localhost:3000 -X POST -d '{"name": "Avenger", "age": 50}' # correct

echo $'\n\n[requesting: wrong age]'
curl -i localhost:3000 -X POST -d '{"name": "Avenger", "age": 18}' # incorrect

echo $'\n\n[requesting: wrong name]'
curl -i localhost:3000 -X POST -d '{"name": "A", "age": 50}' # incorrect

echo $'\n\n[requesting: connection error]'
curl -i localhost:3000 -X POST -d '{"connectionError": "Error", "name": "Avenger", "age": 50}' # incorrect