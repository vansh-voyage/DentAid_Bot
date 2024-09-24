// // import React, { useState, useEffect } from "react";
// // import { ChatBubbleLeftIcon, PaperAirplaneIcon } from "@heroicons/react/24/outline";
// // import { motion, AnimatePresence } from "framer-motion";
// // import axios from 'axios';
// // import toothIcon from "../assets/tooth.svg";
// // import toothbrushIcon from "../assets/toothbrush.svg";

// // const Chatbot = () => {
// //   const [messages, setMessages] = useState([]);
// //   const [input, setInput] = useState("");
// //   const [isTyping, setIsTyping] = useState(false);

// //   const handleSend = async () => {
// //     if (input.trim()) {
// //       setMessages([...messages, { text: input, sender: "user" }]);
// //       setInput("");
// //       setIsTyping(true);
  
// //       try {
// //         const response = await axios.post('http://localhost:8080/api/agent', {
// //           user_question: input
// //         }, {
// //           headers: {
// //             'Content-Type': 'application/json'
// //           }
// //         });
  
// //         const botResponse = response.data.response;
  
// //         // Ensure botResponse is a string
// //         let formattedResponse = botResponse;
// //         if (Array.isArray(botResponse)) {
// //           formattedResponse = botResponse.join("\n");
// //         }
  
// //         // Ensure the response is clean and formatted
// //         formattedResponse = formattedResponse.replace(/\[\]/g, '').trim();
  
// //         // Render videos if URLs are detected
// //         setMessages((prev) => [
// //           ...prev,
// //           { text: formattedResponse, sender: "bot" },
// //         ]);
// //       } catch (error) {
// //         console.error("Error:", error);
  
// //         const errorMessage = error.response?.data?.error || "Sorry, something went wrong. Please try again.";
  
// //         // Ensure errorMessage is a string
// //         setMessages((prev) => [
// //           ...prev,
// //           { text: typeof errorMessage === 'string' ? errorMessage : JSON.stringify(errorMessage), sender: "bot" }
// //         ]);
// //       } finally {
// //         setIsTyping(false);
// //       }
// //     }
// //   };
  

// //   useEffect(() => {
// //     const handleKeyPress = (e) => {
// //       if (e.key === "Enter" && !e.shiftKey) { // Prevent sending on Shift+Enter
// //         e.preventDefault(); // Prevent default Enter key behavior (e.g., adding a new line)
// //         handleSend();
// //       }
// //     };

// //     window.addEventListener("keydown", handleKeyPress);
// //     return () => {
// //       window.removeEventListener("keydown", handleKeyPress);
// //     };
// //   }, [input]);

// //   const renderContent = (text) => {
// //     // Regular expression to match YouTube URLs
// //     const videoRegex = /Title:\s*(.*?)\s*URL:\s*(https:\/\/www\.youtube\.com\/watch\?v=[\w-]+)/g;
// //     let match;
// //     const content = [];
  
// //     while ((match = videoRegex.exec(text)) !== null) {
// //       const [_, title, url] = match;
// //       // Extract video ID from the URL
// //       const videoId = new URL(url).searchParams.get('v');
// //       const embedUrl = `https://www.youtube.com/embed/${videoId}`;
      
// //       content.push(
// //         <div key={url} className="mb-4">
// //           <div className="font-semibold">{title}</div>
// //           <iframe
// //             width="100%"
// //             height="315"
// //             src={embedUrl}
// //             title={title}
// //             frameBorder="0"
// //             allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
// //             allowFullScreen
// //             className="my-2"
// //           />
// //         </div>
// //       );
// //     }
  
// //     if (content.length === 0) {
// //       return text; // Return plain text if no videos are found
// //     }
    
// //     return content;
// //   };
  

// //   return (
// //     <div className="flex justify-center items-center h-screen">
// //       <motion.div 
// //         className="w-full max-w-md p-6 bg-white rounded-lg shadow-xl relative"
// //         initial={{ y: 50, opacity: 0 }}
// //         animate={{ y: 0, opacity: 1 }}
// //         transition={{ duration: 0.5 }}
// //       >
// //         <motion.div 
// //           className="absolute top-0 left-0 right-0 bottom-0 z-0"
// //           initial={{ opacity: 0 }}
// //           animate={{ opacity: 1 }}
// //           transition={{ duration: 2, repeat: Infinity, repeatType: "mirror" }}
// //           style={{ background: "linear-gradient(135deg, #4FD1C5 25%, #81E6D9 50%, #E6FFFA 75%)" }}
// //         >
// //           <img 
// //             src={toothIcon} 
// //             alt="Tooth Icon"
// //             className="absolute top-10 left-10 w-32 h-32 opacity-20"
// //           />
// //           <img 
// //             src={toothbrushIcon} 
// //             alt="Toothbrush Icon"
// //             className="absolute bottom-10 right-10 w-32 h-32 opacity-20"
// //           />
// //         </motion.div>

// //         <div className="relative z-10">
// //           <div className="flex items-center justify-between mb-4">
// //             <h1 className="text-2xl font-bold text-gray-700">Dental Care Bot</h1>
// //             <ChatBubbleLeftIcon className="h-8 w-8 text-blue-500" />
// //           </div>
// //           <div className="flex flex-col space-y-4 h-64 overflow-y-auto">
// //             <AnimatePresence>
// //               {messages.map((message, index) => (
// //                 <motion.div
// //                   key={index}
// //                   className={`p-3 rounded-lg max-w-xs ${
// //                     message.sender === "user" ? "bg-blue-500 text-white self-end" : "bg-gray-200 text-gray-700 self-start"
// //                   }`}
// //                   initial={{ opacity: 0, y: 20 }}
// //                   animate={{ opacity: 1, y: 0 }}
// //                   exit={{ opacity: 0, y: -20 }}
// //                   transition={{ duration: 0.3 }}
// //                 >
// //                   {renderContent(message.text)}
// //                 </motion.div>
// //               ))}
// //             </AnimatePresence>
// //             {isTyping && (
// //               <motion.div
// //                 className="self-start p-3 rounded-lg max-w-xs bg-gray-200 text-gray-700 flex items-center space-x-2"
// //                 initial={{ opacity: 0 }}
// //                 animate={{ opacity: 1 }}
// //                 transition={{ duration: 0.3 }}
// //               >
// //                 <div className="flex space-x-1">
// //                   <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce"></div>
// //                   <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce delay-200"></div>
// //                   <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce delay-400"></div>
// //                 </div>
// //                 <span>Bot is typing...</span>
// //               </motion.div>
// //             )}
// //           </div>
// //           <div className="flex mt-4">
// //             <input
// //               type="text"
// //               className="flex-1 p-2 border rounded-l-lg focus:outline-none focus:ring-2 focus:ring-blue-500 relative z-10"
// //               placeholder="Type your dental query..."
// //               value={input}
// //               onChange={(e) => setInput(e.target.value)}
// //             />
// //             <button
// //               onClick={handleSend}
// //               className="p-2 bg-blue-500 text-white rounded-r-lg hover:bg-blue-600 focus:outline-none relative z-10"
// //             >
// //               <PaperAirplaneIcon className="h-5 w-5 transform rotate-45" />
// //             </button>
// //           </div>
// //         </div>
// //       </motion.div>
// //     </div>
// //   );
// // };

// // export default Chatbot;


// import React, { useState, useEffect } from "react";
// import { ChatBubbleLeftIcon, PaperAirplaneIcon } from "@heroicons/react/24/outline";
// import { motion, AnimatePresence } from "framer-motion";
// import axios from 'axios';
// import toothIcon from "../assets/tooth.svg";
// import toothbrushIcon from "../assets/toothbrush.svg";

// const Chatbot = () => {
//   const [messages, setMessages] = useState([]);
//   const [input, setInput] = useState("");
//   const [isTyping, setIsTyping] = useState(false);

//   const handleSend = async () => {
//     if (input.trim()) {
//       setMessages([...messages, { text: input, sender: "user" }]);
//       setInput("");
//       setIsTyping(true);
  
//       try {
//         const response = await axios.post('http://localhost:8080/api/agent', {
//           user_question: input
//         }, {
//           headers: {
//             'Content-Type': 'application/json'
//           }
//         });
  
//         const botResponse = response.data.response;
  
//         let formattedResponse = botResponse;
//         if (Array.isArray(botResponse)) {
//           formattedResponse = botResponse.join("\n");
//         }
  
//         formattedResponse = formattedResponse.replace(/\[\]/g, '').trim();
  
//         setMessages((prev) => [
//           ...prev,
//           { text: formattedResponse, sender: "bot" },
//         ]);
//       } catch (error) {
//         console.error("Error:", error);
  
//         const errorMessage = error.response?.data?.error || "Sorry, something went wrong. Please try again.";
  
//         setMessages((prev) => [
//           ...prev,
//           { text: typeof errorMessage === 'string' ? errorMessage : JSON.stringify(errorMessage), sender: "bot" }
//         ]);
//       } finally {
//         setIsTyping(false);
//       }
//     }
//   };
  

//   useEffect(() => {
//     const handleKeyPress = (e) => {
//       if (e.key === "Enter" && !e.shiftKey) {
//         e.preventDefault();
//         handleSend();
//       }
//     };

//     window.addEventListener("keydown", handleKeyPress);
//     return () => {
//       window.removeEventListener("keydown", handleKeyPress);
//     };
//   }, [input]);

//   const renderContent = (text) => {
//     const videoRegex = /Title:\s*(.*?)\s*URL:\s*(https:\/\/www\.youtube\.com\/watch\?v=[\w-]+)/g;
//     let match;
//     const content = [];
  
//     while ((match = videoRegex.exec(text)) !== null) {
//       const [_, title, url] = match;
//       const videoId = new URL(url).searchParams.get('v');
//       const embedUrl = `https://www.youtube.com/embed/${videoId}`;
      
//       content.push(
//         <div key={url} className="mb-4">
//           <div className="font-semibold">{title}</div>
//           <iframe
//             width="100%"
//             height="315"
//             src={embedUrl}
//             title={title}
//             frameBorder="0"
//             allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
//             allowFullScreen
//             className="my-2 rounded-lg"
//           />
//         </div>
//       );
//     }
  
//     if (content.length === 0) {
//       return text;
//     }
    
//     return content;
//   };
  

//   return (
//     <div className="flex justify-center items-center h-screen bg-gradient-to-r from-teal-100 via-teal-300 to-teal-500">
//       <motion.div 
//         className="w-full max-w-md p-6 bg-white rounded-2xl shadow-2xl relative"
//         initial={{ y: 50, opacity: 0 }}
//         animate={{ y: 0, opacity: 1 }}
//         transition={{ duration: 0.5 }}
//       >
//         <motion.div 
//           className="absolute top-0 left-0 right-0 bottom-0 z-0 rounded-2xl overflow-hidden"
//           initial={{ opacity: 0 }}
//           animate={{ opacity: 1 }}
//           transition={{ duration: 2, repeat: Infinity, repeatType: "mirror" }}
//           style={{ background: "linear-gradient(135deg, #68D391 25%, #9AE6B4 50%, #C6F6D5 75%)" }}
//         >
//           <img 
//             src={toothIcon} 
//             alt="Tooth Icon"
//             className="absolute top-8 left-8 w-24 h-24 opacity-10"
//           />
//           <img 
//             src={toothbrushIcon} 
//             alt="Toothbrush Icon"
//             className="absolute bottom-8 right-8 w-24 h-24 opacity-10"
//           />
//         </motion.div>

//         <div className="relative z-10">
//           <div className="flex items-center justify-between mb-4">
//             <h1 className="text-2xl font-bold text-gray-800">Dental Care Bot</h1>
//             <ChatBubbleLeftIcon className="h-8 w-8 text-teal-600" />
//           </div>
//           <div className="flex flex-col space-y-4 h-64 overflow-y-auto">
//             <AnimatePresence>
//               {messages.map((message, index) => (
//                 <motion.div
//                   key={index}
//                   className={`p-4 rounded-lg max-w-xs ${
//                     message.sender === "user" ? "bg-teal-500 text-white self-end" : "bg-gray-100 text-gray-800 self-start"
//                   }`}
//                   initial={{ opacity: 0, y: 20 }}
//                   animate={{ opacity: 1, y: 0 }}
//                   exit={{ opacity: 0, y: -20 }}
//                   transition={{ duration: 0.3 }}
//                 >
//                   {renderContent(message.text)}
//                 </motion.div>
//               ))}
//             </AnimatePresence>
//             {isTyping && (
//               <motion.div
//                 className="self-start p-4 rounded-lg max-w-xs bg-gray-100 text-gray-800 flex items-center space-x-2"
//                 initial={{ opacity: 0 }}
//                 animate={{ opacity: 1 }}
//                 transition={{ duration: 0.3 }}
//               >
//                 <div className="flex space-x-1">
//                   <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce"></div>
//                   <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce delay-200"></div>
//                   <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce delay-400"></div>
//                 </div>
//                 <span>Bot is typing...</span>
//               </motion.div>
//             )}
//           </div>
//           <div className="flex mt-4">
//             <input
//               type="text"
//               className="flex-1 p-3 border rounded-l-lg focus:outline-none focus:ring-2 focus:ring-teal-500 relative z-10"
//               placeholder="Type your dental query..."
//               value={input}
//               onChange={(e) => setInput(e.target.value)}
//             />
//             <button
//               onClick={handleSend}
//               className="p-3 bg-teal-500 text-white rounded-r-lg hover:bg-teal-600 focus:outline-none relative z-10"
//             >
//               <PaperAirplaneIcon className="h-5 w-5 transform rotate-45" />
//             </button>
//           </div>
//         </div>
//       </motion.div>
//     </div>
//   );
// };

// export default Chatbot;


import React, { useState, useEffect } from "react";
import { ChatBubbleLeftIcon, PaperAirplaneIcon } from "@heroicons/react/24/outline";
import { motion, AnimatePresence } from "framer-motion";
import axios from 'axios';
import toothIcon from "../assets/tooth.svg";
import toothbrushIcon from "../assets/toothbrush.svg";

const Chatbot = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);

  const handleSend = async () => {
    if (input.trim()) {
      setMessages([...messages, { text: input, sender: "user" }]);
      setInput("");
      setIsTyping(true);
  
      try {
        const response = await axios.post('http://localhost:8080/api/agent', {
          user_question: input
        }, {
          headers: {
            'Content-Type': 'application/json'
          }
        });
  
        const botResponse = response.data.response;
  
        let formattedResponse = botResponse;
        if (Array.isArray(botResponse)) {
          formattedResponse = botResponse.join("\n");
        }
  
        formattedResponse = formattedResponse.replace(/\[\]/g, '').trim();
  
        setMessages((prev) => [
          ...prev,
          { text: formattedResponse, sender: "bot" },
        ]);
      } catch (error) {
        console.error("Error:", error);
  
        const errorMessage = error.response?.data?.error || "Sorry, something went wrong. Please try again.";
  
        setMessages((prev) => [
          ...prev,
          { text: typeof errorMessage === 'string' ? errorMessage : JSON.stringify(errorMessage), sender: "bot" }
        ]);
      } finally {
        setIsTyping(false);
      }
    }
  };

  useEffect(() => {
    const handleKeyPress = (e) => {
      if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault();
        handleSend();
      }
    };

    window.addEventListener("keydown", handleKeyPress);
    return () => {
      window.removeEventListener("keydown", handleKeyPress);
    };
  }, [input]);

  const renderContent = (text) => {
    // Regular expression to match YouTube URLs
    const videoRegex = /Title:\s*(.*?)\s*URL:\s*(https:\/\/www\.youtube\.com\/watch\?v=[\w-]+)/g;
    let match;
    const content = [];
  
    while ((match = videoRegex.exec(text)) !== null) {
      const [_, title, url] = match;
      // Extract video ID from the URL
      const videoId = new URL(url).searchParams.get('v');
      const embedUrl = `https://www.youtube.com/embed/${videoId}`;
      
      content.push(
        <div key={url} className="mb-4">
          <div className="font-semibold">{title}</div>
          <iframe
            width="100%"
            height="315"
            src={embedUrl}
            title={title}
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            className="my-2"
          />
        </div>
      );
    }
  
    if (content.length === 0) {
      return text; // Return plain text if no videos are found
    }
    
    return content;
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <motion.div 
        className="w-full max-w-2xl p-8 bg-white rounded-xl shadow-lg relative"
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <div className="absolute top-0 left-0 right-0 bottom-0 z-0 rounded-xl overflow-hidden bg-gray-200">
          <img 
            src={toothIcon} 
            alt="Tooth Icon"
            className="absolute top-12 left-12 w-28 h-28 opacity-10"
          />
          <img 
            src={toothbrushIcon} 
            alt="Toothbrush Icon"
            className="absolute bottom-12 right-12 w-28 h-28 opacity-10"
          />
        </div>

        <div className="relative z-10">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-3xl font-bold text-gray-700">Dental Care Bot</h1>
            <ChatBubbleLeftIcon className="h-10 w-10 text-gray-500" />
          </div>
          <div className="flex flex-col space-y-4 h-80 overflow-y-auto">
            <AnimatePresence>
              {messages.map((message, index) => (
                <motion.div
                  key={index}
                  className={`p-4 rounded-lg max-w-md ${
                    message.sender === "user" ? "bg-blue-200 text-gray-800 self-end" : "bg-gray-300 text-gray-700 self-start"
                  }`}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  {renderContent(message.text)}
                </motion.div>
              ))}
            </AnimatePresence>
            {isTyping && (
              <motion.div
                className="self-start p-4 rounded-lg max-w-md bg-gray-300 text-gray-700 flex items-center space-x-2"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
              >
                <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce delay-200"></div>
                  <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce delay-400"></div>
                </div>
                <span>Bot is typing...</span>
              </motion.div>
            )}
          </div>
          <div className="flex mt-6">
            <input
              type="text"
              className="flex-1 p-3 border rounded-l-lg focus:outline-none focus:ring-2 focus:ring-blue-300 relative z-10"
              placeholder="Type your dental query..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
            />
            <button
              onClick={handleSend}
              className="p-3 bg-blue-500 text-white rounded-r-lg hover:bg-blue-600 focus:outline-none relative z-10"
            >
              <PaperAirplaneIcon className="h-6 w-6 transform rotate-45" />
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Chatbot;


// import React, { useState, useEffect } from "react";
// import { ChatBubbleLeftIcon, PaperAirplaneIcon } from "@heroicons/react/24/outline";
// import { motion, AnimatePresence } from "framer-motion";
// import axios from 'axios';
// import toothIcon from "../assets/tooth.svg";
// import toothbrushIcon from "../assets/toothbrush.svg";

// const Chatbot = () => {
//   const [messages, setMessages] = useState([]);
//   const [input, setInput] = useState("");
//   const [isTyping, setIsTyping] = useState(false);

//   const handleSend = async () => {
//     if (input.trim()) {
//       setMessages([...messages, { text: input, sender: "user" }]);
//       setInput("");
//       setIsTyping(true);
  
//       try {
//         const response = await axios.post('http://localhost:8080/api/agent', {
//           user_question: input
//         }, {
//           headers: {
//             'Content-Type': 'application/json'
//           }
//         });
  
//         const botResponse = response.data.response;
  
//         let formattedResponse = botResponse;
//         if (Array.isArray(botResponse)) {
//           formattedResponse = botResponse.join("\n");
//         }
  
//         formattedResponse = formattedResponse.replace(/\[\]/g, '').trim();
  
//         setMessages((prev) => [
//           ...prev,
//           { text: formattedResponse, sender: "bot" },
//         ]);
//       } catch (error) {
//         console.error("Error:", error);
  
//         const errorMessage = error.response?.data?.error || "Sorry, something went wrong. Please try again.";
  
//         setMessages((prev) => [
//           ...prev,
//           { text: typeof errorMessage === 'string' ? errorMessage : JSON.stringify(errorMessage), sender: "bot" }
//         ]);
//       } finally {
//         setIsTyping(false);
//       }
//     }
//   };

//   useEffect(() => {
//     const handleKeyPress = (e) => {
//       if (e.key === "Enter" && !e.shiftKey) {
//         e.preventDefault();
//         handleSend();
//       }
//     };

//     window.addEventListener("keydown", handleKeyPress);
//     return () => {
//       window.removeEventListener("keydown", handleKeyPress);
//     };
//   }, [input]);

//   const renderContent = (text) => {
//     const videoRegex = /Title:\s*(.*?)\s*URL:\s*(https:\/\/www\.youtube\.com\/watch\?v=[\w-]+)/g;
//     let match;
//     const content = [];
  
//     while ((match = videoRegex.exec(text)) !== null) {
//       const [_, title, url] = match;
//       const videoId = new URL(url).searchParams.get('v');
//       const embedUrl = `https://www.youtube.com/embed/${videoId}`;
      
//       content.push(
//         <div key={url} className="mb-4">
//           <div className="font-semibold text-gray-100">{title}</div>
//           <iframe
//             width="100%"
//             height="315"
//             src={embedUrl}
//             title={title}
//             frameBorder="0"
//             allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
//             allowFullScreen
//             className="my-2 rounded-lg shadow-lg"
//           />
//         </div>
//       );
//     }
  
//     if (content.length === 0) {
//       return text;
//     }
    
//     return content;
//   };

//   return (
//     <div className="flex justify-center items-center h-screen bg-gradient-to-br from-gray-900 to-gray-800">
//       <motion.div 
//         className="w-full max-w-2xl p-8 bg-gray-800 rounded-xl shadow-xl relative"
//         initial={{ y: 50, opacity: 0 }}
//         animate={{ y: 0, opacity: 1 }}
//         transition={{ duration: 0.5 }}
//       >
//         <div className="absolute top-0 left-0 right-0 bottom-0 z-0 rounded-xl overflow-hidden bg-gray-800">
//           <img 
//             src={toothIcon} 
//             alt="Tooth Icon"
//             className="absolute top-8 left-8 w-24 h-24 opacity-10"
//           />
//           <img 
//             src={toothbrushIcon} 
//             alt="Toothbrush Icon"
//             className="absolute bottom-8 right-8 w-24 h-24 opacity-10"
//           />
//         </div>

//         <div className="relative z-10">
//           <div className="flex items-center justify-between mb-6">
//             <h1 className="text-4xl font-extrabold text-blue-300">Dental Care Bot</h1>
//             <ChatBubbleLeftIcon className="h-10 w-10 text-blue-500" />
//           </div>
//           <div className="flex flex-col space-y-4 h-80 overflow-y-auto bg-gray-700 p-4 rounded-lg shadow-inner">
//             <AnimatePresence>
//               {messages.map((message, index) => (
//                 <motion.div
//                   key={index}
//                   className={`p-4 rounded-lg max-w-md ${
//                     message.sender === "user" ? "bg-blue-600 text-gray-100 self-end" : "bg-gray-600 text-gray-300 self-start"
//                   } shadow-md`}
//                   initial={{ opacity: 0, y: 20 }}
//                   animate={{ opacity: 1, y: 0 }}
//                   exit={{ opacity: 0, y: -20 }}
//                   transition={{ duration: 0.3 }}
//                 >
//                   {renderContent(message.text)}
//                 </motion.div>
//               ))}
//             </AnimatePresence>
//             {isTyping && (
//               <motion.div
//                 className="self-start p-4 rounded-lg max-w-md bg-gray-600 text-gray-300 flex items-center space-x-2 shadow-md"
//                 initial={{ opacity: 0 }}
//                 animate={{ opacity: 1 }}
//                 transition={{ duration: 0.3 }}
//               >
//                 <div className="flex space-x-1">
//                   <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce"></div>
//                   <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce delay-200"></div>
//                   <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce delay-400"></div>
//                 </div>
//                 <span>Bot is typing...</span>
//               </motion.div>
//             )}
//           </div>
//           <div className="flex mt-6">
//             <input
//               type="text"
//               className="flex-1 p-3 border rounded-l-lg bg-gray-700 text-gray-300 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-400 shadow-inner"
//               placeholder="Type your dental query..."
//               value={input}
//               onChange={(e) => setInput(e.target.value)}
//             />
//             <button
//               onClick={handleSend}
//               className="p-3 bg-blue-500 text-white rounded-r-lg hover:bg-blue-600 focus:outline-none shadow-lg transition duration-300"
//             >
//               <PaperAirplaneIcon className="h-6 w-6 transform rotate-45" />
//             </button>
//           </div>
//         </div>
//       </motion.div>
//     </div>
//   );
// };

// export default Chatbot;
