import Echo from "laravel-echo";
import Pusher from "pusher-js";
import cookies from "react-cookies";

window.Pusher = Pusher;

const echo = new Echo({
    broadcaster: "reverb",
    key: process.env.REACT_APP_REVERB_APP_KEY,
    wsHost: process.env.REACT_APP_REVERB_HOST || "127.0.0.1",
    wsPort: Number(process.env.REACT_APP_REVERB_PORT || 8081),
    wssPort: Number(process.env.REACT_APP_REVERB_PORT || 8081),
    forceTLS: false,
    enabledTransports: ["ws", "wss"],
    authEndpoint: "http://127.0.0.1:8000/api/broadcasting/auth", 
    authorizer: (channel) => {
        return {
            authorize: (socketId, callback) => {
                const token = cookies.load("token");
                fetch("http://127.0.0.1:8000/api/broadcasting/auth", { 
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: token ? `Bearer ${token}` : "",
                    },
                    body: JSON.stringify({
                        socket_id: socketId,
                        channel_name: channel.name,
                    }),
                })
                    .then((response) => response.json())
                    .then((data) => callback(null, data))
                    .catch((error) => callback(error));
            },
        };
    },
});

export default echo;