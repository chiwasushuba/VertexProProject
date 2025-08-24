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
  "email": "test.user@example.com",
  "password": "securepassword123",
  "role": "user",
  "firstName": "Test",
  "lastName": "user",
  "middleName": "",
  "gender": "Male",
  "position": "Coordinator",
  "completeAddress": "123 Street, City",
  "nbiRegistrationDate": "2023-10-01",
  "nbiExpirationDate": "2025-09-01",
  "fitToWorkExpirationDate": "2025-10-01",
  "gcashNumber": 9123456789,
  "gcashName": "Test user",
  "profileImage": "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRqT1nFXt_nZYKVIx4coe2GFqo1lNqcM5OpRw&s" //FILE
}



