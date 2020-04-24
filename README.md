Sumario de los ejercicios
JAVASCRIPT
1. Balancear llaves
Archivo: balancedGroupSymbols.js
Descripción: puede probar diferentes inputs introduciendo otro valor en la constante "line"

2. Arreglo del caracol
Archivo: snail.js
Descripción: puede probar diferentes inputs cambiando los valores de las matrices y las dimensiones correspondientes

NODE JS
1. Realizar una API REST para transacciones y usuarios

Primero debe crear un par de usuarios de la siguiente forma:
URL: http://localhost:8081/users
METHOD: POST
BODY(JSON): {
				"id": 1,
				"username": "quanto",
				"email": "quanto@email.com"
			}
URL: http://localhost:8081/users
METHOD: POST
BODY(JSON): {
				"id": 2,
				"username": "ariel",
				"email": "ariel@email.com"
			}

1.1 Simple CRUD of transactions
Para crear una transacción:
URL: http://localhost:8081/transactions
METHOD: POST
BODY(JSON): {
				"description": "transaction 1",
				"user": 1
			}
Para leer una transacción:
URL: http://localhost:8081/transactions/:id
METHOD: GET
Para modificar una transacción:
URL: http://localhost:8081/transactions/:id
METHOD: PUT
BODY(JSON): {
				"description": "New description"
			}
Para borrar una transacción:
URL: http://localhost:8081/transactions/:id
METHOD: DELETE

1.2 Endpoint that links a transaction with a user
URL: http://localhost:8081/users/:id/transactions
METHOD: POST
BODY(JSON): {
				"description": "New transaction"
			}
			
1.3 History of transactions from all users
URL: http://localhost:8081/transactions
METHOD: GET

1.4 History of transactions by user
URL: http://localhost:8081/users/:id/transactions
METHOD: GET

1.5 Endpoint that changes the linked user of a transaction to another user
URL: http://localhost:8081/transactions/:id/changeUser
METHOD: PUT
BODY(JSON): {
				"user": 2
			}