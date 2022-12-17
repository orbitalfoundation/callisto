
echo "\nWriting a person to db now:"
curl -X GET http://localhost:8080/sys/services/db -H 'Content-Type: application/json' -d '{"command":"write","data":{"uuid":"person1234","age":32}}'

echo "\n\nQuerying for that same person now:"
curl -X GET http://localhost:8080/sys/services/db -H 'Content-Type: application/json' -d '{"command":"query","data":{"uuid":"person1234"}}'

echo "\n\nQuerying for persons of same age now:"
curl -X GET http://localhost:8080/sys/services/db -H 'Content-Type: application/json' -d '{"command":"query","data"":{"age":32}}'

echo "\n\nQuerying for persons of differing age now:"
curl -X GET http://localhost:8080/sys/services/db -H 'Content-Type: application/json' -d '{"command":"query","data":{"age":31}}'

echo "\n\n... done tests\n"