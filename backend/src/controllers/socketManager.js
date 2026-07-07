import { Server } from "socket.io";

let connections = {};
let messages = {};
let timeOnline = {};

export const connectToSocket = (server) => {
    const io = new Server(server, {
        cors: {
            origin: "*",
            methods: ["GET", "POST"],
            allowedHeaders:["*"],
            credentials:true
        }
    });

    io.on("connection", (socket) => {
        console.log("SOMETHING IS CONNECTED");
        
        console.log("User Connected:", socket.id);

        // Join Call
        socket.on("join-call", (path) => {
            if (!connections[path]) {
                connections[path] = [];
            }

            connections[path].push(socket.id);
            timeOnline[socket.id] = new Date();

            // Send old messages to newly joined user
            if (messages[path]) {
                for (let a = 0; a < messages[path].length; a++) {
                    io.to(socket.id).emit(
                        "chat-message",
                        messages[path][a].data,
                        messages[path][a].sender,
                        messages[path][a]["socket-id-sender"]
                    );
                }
            }

            // Notify others
            connections[path].forEach((id) => {
                if (id !== socket.id) {
                    io.to(id).emit("user-joined", socket.id);
                }
            });
        });

        // WebRTC Signaling
        socket.on("signal", (toId, signalData) => {
            io.to(toId).emit("signal", socket.id, signalData);
        });

        // Chat Messages
        socket.on("chat-message", (data, sender) => {
            const [matchingRoom, found] = Object.entries(connections).reduce(
                ([room, isFound], [roomKey, roomValue]) => {
                    if (!isFound && roomValue.includes(socket.id)) {
                        return [roomKey, true];
                    }
                    return [room, isFound];
                },
                ["", false]
            );

            if (found) {
                if (!messages[matchingRoom]) {
                    messages[matchingRoom] = [];
                }

                messages[matchingRoom].push({
                    sender,
                    data,
                    "socket-id-sender": socket.id
                });

                console.log(
                    "Message:",
                    sender,
                    ":",
                    data
                );

                connections[matchingRoom].forEach((elm) => {
                    io.to(elm).emit(
                        "chat-message",
                        data,
                        sender,
                        socket.id
                    );
                });
            }
        });

        // Disconnect
        socket.on("disconnect", () => {
            console.log("User Disconnected:", socket.id);

            const diffTime = Math.abs(
                new Date() - timeOnline[socket.id]
            );

            console.log(
                `User ${socket.id} stayed online for ${Math.floor(
                    diffTime / 1000
                )} seconds`
            );

            let key = null;

            for (const [k, v] of Object.entries(connections)) {
                if (v.includes(socket.id)) {
                    key = k;
                    break;
                }
            }

            if (key) {
                // Notify users
                connections[key].forEach((id) => {
                    io.to(id).emit("user-left", socket.id);
                });

                // Remove socket
                const index = connections[key].indexOf(socket.id);

                if (index !== -1) {
                    connections[key].splice(index, 1);
                }

                // Delete empty room
                if (connections[key].length === 0) {
                    delete connections[key];
                    delete messages[key];
                }
            }

            delete timeOnline[socket.id];
        });
    });

    return io;
};