export default `
    createUser(userInput: userInputData): User!
    login(userInput: userLoginInputData): UserLogin!
    updateBio(bio: String): String!
    followUser(followedUserId: Int!): String!
    `