import { DefaultChatTransport, type UIMessage } from 'ai';

// export const chatApi = {
//   sendMessage: async (messages: UIMessage[]) => {
//     const transport = new DefaultChatTransport({
//       api: 'http://localhost:8000/chat/chat',
//     });
    
//     try {
//       const stream = await transport.stream({ messages });
//       // Assuming the transport returns a readable stream.
//       // You might need to adjust how you process the stream based on the library's specifics.
//       return stream;
//     } catch (error) {
//       console.error('Error sending message to chat API:', error);
//       throw error;
//     }
//   },
// };
