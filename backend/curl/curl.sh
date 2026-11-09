
curl -X POST localhost:3000/cliente/signup -H "Content-Type: application/json" -d @cliente.json
curl -X POST localhost:3000/auth/login -H "Content-Type: application/json" -d @user.json

# EMPLEADO
curl -X POST localhost:3000/empleado \
-H "Content-Type: application/json" -d @user.json
curl -X GET 'localhost:3000/empleado?lastid=0&limit=10' \
-H "Authorization: Bearer $TOKEN"
curl -X GET localhost:3000/empleado/3 \
-H "Authorization: Bearer $TOKEN"
curl -X PATCH localhost:3000/empleado/3 \
-H "Authorization: Bearer $TOKEN" \
-H "Content-Type: application/json" -d @user.json
curl -X DELETE localhost:3000/empleado/3 \
-H "Authorization: Bearer $TOKEN"

# CATEGORIA
curl -X POST localhost:3000/categoria \
-H "Authorization: Bearer $TOKEN" \
-H "Content-Type: application/json" \
-d @categoria.json
curl -X GET 'localhost:3000/categoria?lastid=0&limit=10' \
-H "Authorization: Bearer $TOKEN"
curl -X GET localhost:3000/categoria/3 \
-H "Authorization: Bearer $TOKEN"
curl -X PATCH localhost:3000/categoria/3 \
-H "Authorization: Bearer $TOKEN" \
-H "Content-Type: application/json" \
-d @categoria.json
curl -X DELETE localhost:3000/categoria/3 \
-H "Authorization: Bearer $TOKEN"

# PRODUCTO
curl -X POST localhost:3000/producto \
-H "Authorization: Bearer $TOKEN" \
-H "Content-Type: application/json" \
-d @producto.json
curl -X POST localhost:3000/producto/3/image \
-H "Authorization: Bearer $TOKEN" \
-F "images=@red_1.webp" \
-F "images=@red_2.webp" \
-F "images=@red_3.webp" \
-F "images=@red_5.webp"
curl -v -X GET localhost:3000/producto/image/.webp \
-H "Authorization: Bearer $TOKEN" \
--output img.webp
curl -X GET 'localhost:3000/producto?lastid=0&limit=10' \
-H "Authorization: Bearer $TOKEN"
curl -X GET localhost:3000/producto/3 \
-H "Authorization: Bearer $TOKEN"
curl -X PATCH localhost:3000/producto/3 \
-H "Authorization: Bearer $TOKEN" \
-H "Content-Type: application/json" \
-d @producto.json
curl -X DELETE localhost:3000/producto/3 \
-H "Authorization: Bearer $TOKEN"