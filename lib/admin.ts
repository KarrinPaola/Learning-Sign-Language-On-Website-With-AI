import { auth } from "@clerk/nextjs/server"

const adminIds = [
    "user_2sAUHQ6F6ICTpgKI9jQdQ5AzJxF",
    "user_2tI63Gg9Wx96mgHh8RnkiOdPsva"
]

export const getIsAdmin  = async () =>{
    const {userId} = await auth()

    if(!userId){
        return false
    }

    return adminIds.indexOf(userId) !== -1
}

