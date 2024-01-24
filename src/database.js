import { connection, connect } from "mongoose";
import { config } from "dotenv";

config()

connect(process.env.URI);

connection.on("open", () => {
    console.log("[🧹] DB Api connected <3")
})

connection.on("close", () => {
    console.log("[🧹] DB Api disconnected :'p")
})