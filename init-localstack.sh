#!/bin/bash

# user
aws --endpoint-url=http://localhost:4569 dynamodb put-item --table-name 529821714029-rekognition-backend-local-user --item '{"id":{"S":"64511a6f-fc7c-41fc-bd81-ab3019137404"}, "lastname":{"S":"Gasser"}, "firstname":{"S":"Andreas"},"email":{"S":"andreas.safe@gmail.com"}, "password":{"S":"$2a$10$WqlYzHH6KMIzXZW5LjbqjOPmJQUazm.0obVxwVlyWovUlqZM0bn.G"}}'

# todos
# aws --endpoint-url=http://localhost:4569 dynamodb put-item --table-name 529821714029-mtbPaths-local-todo --item '{"id":{"S":"aa6e2737-3d8f-49f2-b1ac-19a949b7ae1a"},"message":{"S":"Send message"},"completed":{"BOOL":false},"user_id":{"S":"64511a6f-fc7c-41fc-bd81-ab3019137404"},"created_at":{"S":"1542886083288"}}'
# aws --endpoint-url=http://localhost:4569 dynamodb put-item --table-name 529821714029-mtbPaths-local-todo --item '{"id":{"S":"b5f711a3-54ed-4719-9800-94999e0cb166"},"message":{"S":"second send message"},"completed":{"BOOL":true},"user_id":{"S":"64511a6f-fc7c-41fc-bd81-ab3019137404"},"created_at":{"S":"1542886088096"}}'