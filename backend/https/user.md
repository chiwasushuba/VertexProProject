(gets all the user)
GET /user/ 


(gets a single user)
GET /user/:id


POST /user/signup
params:
  - email: String, email used
  - password: String,
  - role: admin or user (default = user)
  - firstName: String,
  - lastName: String,
  - middleName: String,
  - gender: String, (Male, Female, or Others)
  - position: String, (Coordinator, Sampler, or Helper)
  - completeAddress: String
  - nbiExpirationDate: Date
  - fitToWorkExpirationDate: Date
  - gcashNumber: Number
  - gcashName
  - profileImage: String,

POST /user/
{
  "email": "johndoe@example.com",
  "password": "SecurePass123",
  "firstName": "John",
  "lastName": "Doe",
  "middleName": "Michael",
  "gender": "Male",
  "position": "Coordinator",
  "completeAddress": "123 Main Street, Manila",
  "nbiExpirationDate": "2026-05-15",
  "fitToWorkExpirationDate": "2026-06-10",
  "gcashNumber": 9123456789,
  "gcashName": "John M. Doe",
  "profileImage": "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRqT1nFXt_nZYKVIx4coe2GFqo1lNqcM5OpRw&s"
}




