import { User } from "../../interface/users.interface";

export function checkUserExists(username: string) {
    const users: User[] = JSON.parse(localStorage.getItem('users') as string) || [];
    let userexists: boolean = false;

    users.forEach((user: User) => {
        if(user.username === username) userexists = true;
    })

    return userexists;
}