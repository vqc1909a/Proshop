import bcrypt from "bcryptjs";

const users = [
    {
        name: "Admin User",
        email: "admin@example.com",
        password: bcrypt.hashSync("123456", 10),
        isAdmin: true,
        isSuperAdmin: true
    },
    {
        name: "Admin2 User",
        email: "admin2@example.com",
        password: bcrypt.hashSync("123456", 10),
        isAdmin: true,
        isSuperAdmin: false
    },
    {
        name: "John Doe",
        email: "john@example.com",
        password: bcrypt.hashSync("123456", 10),
    },
    {
        name: "Jane Doe",
        email: "jane@example.com",
        password: bcrypt.hashSync("123456", 10),
    }
] 

export default users;