import Echo from "laravel-echo";
import Pusher from "pusher-js";

window.Pusher = Pusher;

console.log("⚡ Echo is starting...");


// const echo = new Echo({

//     broadcaster: "reverb",
//     key: "app-key",
//     wsHost: "localhost",
//     wsPort: 8080,
//     forceTLS: false,
//     enabledTransports: ["ws"],
//     auth: {
//         headers: {
//             get Authorization() {
//                 return `Bearer ${localStorage.getItem("token")}`;
//             },
//         },
//     },

//     withCredentials: false, // do not send cookies

//     authEndpoint: "http://localhost:8000/api/broadcasting/auth",

// });

const echo = new Echo({
    broadcaster: "pusher",
    key: "224c3ab42e3d93075cf2",
    cluster: "eu",
    forceTLS: true,
    enabledTransports: ["ws"],
    auth: {
        headers: {
            get Authorization() {
                return `Bearer ${localStorage.getItem("token")}`;
            },
        },
    },

    withCredentials: false, // do not send cookies

    authEndpoint: `${import.meta.env.VITE_APP_URL}/api/broadcasting/auth`,

});




export default echo;
