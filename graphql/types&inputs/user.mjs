export default `
input userInputData{
    fname: String!
    lname: String!
    email: String!
    password: String!
    userName: String!
    birthDate: String!
}

input userLoginInputData{
    email: String!
    password: String!
}

type User{
    _id: Int
    fname: String
    lname: String
    email: String
    userName: String
    birthDate: String
    bio: String
}

type UserLogin{
    _id: Int
    email: String!
    userName: String
    password: String
    fname: String
    lname: String
    birthDate: String
    bio: String
}
`