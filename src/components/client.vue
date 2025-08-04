<template>
    <div class="header">
        <h1>Help Desk</h1>
       
    </div>
    <div class="SubmitTicket">
        <h2> Submit A Ticket</h2>
        <form @submit.prevent="handleSubmit">
            <div class="form-group">
                <label for="subject">Subject:</label>
                <input type="text" id="subject" v-model="subject" required />
            </div>
            <div class="form-group
">
                <label for="description">Description:</label>
                <textarea id="description" v-model="description" required></textarea>
            </div>
            <div class="form-group">
                <label for="priority">Priority:</label>
                <select id="priority" v-model="priority" required>
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                </select>

                <label for="type">Type:</label>
                <select id="type" v-model="type" required>
                    <option value="payment">payment</option>
                    <option value="service">service</option>
                    <option value="account">account</option>
                </select>

            </div>
            <button type="submit">Submit Ticket</button>
        </form>
        <div v-if="successMessage" class="success">{{ successMessage }}</div>
        <div v-if="errorMessage" class="error">{{ errorMessage }}</div> 
    </div>

    <div class="my-tickets">
        <h2>My Tickets</h2>
        <table>
            <thead>
                <tr>
                    <th>Ticket ID</th>
                    <th>Subject</th>
                    <th>Status</th>
                    <th>Priority</th>
                    <th>Created At</th>
                    <th>Actions</th>  <!-- New column -->
                </tr>
            </thead>
            <tbody>
                <tr v-for="ticket in tickets" :key="ticket.id">
                    <td>{{ ticket.id }}</td>
                    <td>{{ ticket.subject }}</td>
                    <td>{{ ticket.status }}</td>
                    <td>{{ ticket.priority }}</td>
                    <td>{{ formatDate(ticket.createdAt) }}</td>

                    
                    <td>
                        <button class="chat-btn" @click="openChat(ticket.id)">
                            💬 Chat
                            <span
                              v-if="ticket.unreadCount && ticket.unreadCount > 0"
                              class="unread-indicator"
                            ></span>
                        </button>
                    </td>
                </tr>
            </tbody>
        </table>
        <div v-if="tickets.length === 0" class="no-tickets">
            <p>No tickets available.</p>
        </div>
    </div>
    <div v-if="showChat" class="chat-modal">
        <div class="chat-content">
            <div class="chat-header">
                <h3>Ticket #{{ selectedTicketId }} Chat</h3>
                <button class="close-button" @click="closeChat">&times;</button>
            </div>
            <div class="chat-messages">
                <div v-for="(message, index) in chatMessages" 
                     :key="index" 
                     :class="['message', message.sender === 'You' ? 'sent' : 'received']">
                    <div class="message-content">
                        <p>{{ message.content }}</p>
                        <span class="message-sender">{{ message.sender }}</span>
                    </div>
                </div>
            </div>
            <div class="chat-input">
                <textarea 
                    v-model="newMessage" 
                    placeholder="Type your message..." 
                    rows="2"
                    @keyup.enter="sendMessage"
                ></textarea>
                <button @click="sendMessage">Send</button>
            </div>
        </div>
    </div>
</template>

<script>
import { ref, onMounted, nextTick } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '../stores/auth';
export default {
    name: 'SubmitTicket',
    setup() {
        const auth = useAuthStore();


          function formatDate(dateString) {
            if (!dateString) return '';
            // Convert to valid ISO if using space instead of T
            const cleaned = dateString.replace(' ', 'T');
            const date = new Date(cleaned);
            if (isNaN(date.getTime())) {
                return 'Invalid Date';
            }
        return date.toLocaleString(); // e.g., "7/15/2025, 9:44 AM"
        }


         const router = useRouter();
        const subject = ref('');
        const description = ref('');
        const priority = ref('low');
        const type = ref('payment');
        const successMessage = ref('');
        const errorMessage = ref('');
        const tickets = ref([]);
        const showChat = ref(false);
        const selectedTicketId = ref(null);
        const newMessage = ref('');

        const chatMessages = ref([]);

        // Fetch unread count for each ticket
        const fetchUnreadCounts = async () => {
            for (const ticket of tickets.value) {
                try {
                    const res = await fetch(`http://localhost:8080/api/tickets/${ticket.id}/unread`);
                    if (res.ok) {
                        const data = await res.json();
                        ticket.unreadCount = data.unread;
                    } else {
                        ticket.unreadCount = 0;
                    }
                } catch {
                    ticket.unreadCount = 0;
                }
            }
        };

        const handleSubmit = async () => {

        const chatMessages = ref([
            { sender: 'You', text: 'Hi, I need help with my ticket.' },
            { sender: 'Support', text: 'How can we assist you today?' },
            { sender: 'You', text: 'I have a question about my ticket.' },
            { sender: 'Support', text: 'Please provide your ticket ID for reference.' },
            { sender: 'You', text: 'My ticket ID is 12345.' },
            { sender: 'Support', text: 'Thank you! We will look into it and get back to you shortly.' }
        ]);


        

        const handleSubmit = async () => {  // Remove event parameter
            try {
                const token = localStorage.getItem('token');
                const response = await fetch('http://localhost:8080/api/tickets/create', {
                    method: 'POST',
                    headers: {
                        "Authorization": "Bearer "+ token,
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        subject: subject.value,
                        description: description.value,
                        priority: priority.value,
                        type: type.value
                    })
                });
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                successMessage.value = 'Ticket submitted successfully!';
                errorMessage.value = '';
                subject.value = '';
                description.value = '';
                priority.value = 'low';

                type.value = 'payment';
                await fetchTickets();

                type.value = 'payment';  // Reset type to default
                fetchMyTickets(); // Refresh the ticket list

            } catch (error) {
                errorMessage.value = `Error submitting ticket: ${error.message}`;
                successMessage.value = '';
            }
        };

        const fetchTickets = async () => {
            try {
                const token = localStorage.getItem('token');
                const response = await fetch('http://localhost:8080/api/tickets',
                     {
                    headers: {
                        "Authorization": "Bearer "+ token,
                         "Content-Type": "application/json"
                    }
                });
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                tickets.value = await response.json();
                await fetchUnreadCounts();
            } catch (error) {
                console.error('Error fetching tickets:', error);
            }
        };


        const fetchMyTickets = async () => {
            try {
                const token = localStorage.getItem('token');
                const response = await fetch('http://localhost:8080/api/myTickets',
                     {
                    headers: {
                        "Authorization": "Bearer "+ token,
                         "Content-Type": "application/json"
                    }
                });
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                tickets.value = await response.json();
            } catch (error) {
                console.error('Error fetching tickets:', error);
            }
        };


        // Add polling interval ref
        let messagePollingInterval = null;

        const startMessagePolling = (ticketId) => {
            messagePollingInterval = setInterval(async () => {
                if (showChat.value) {
                    await fetchMessages(ticketId);
                }
            }, 2000);
        };

        const stopMessagePolling = () => {
            if (messagePollingInterval) {
                clearInterval(messagePollingInterval);
                messagePollingInterval = null;
            }
        };

        // Mark messages as read when chat is opened
        const markMessagesAsRead = async (ticketId) => {
            try {
                await fetch(`http://localhost:8080/api/tickets/${ticketId}/read`, { method: 'POST' });
                // Update unread count for this ticket
                const ticket = tickets.value.find(t => t.id === ticketId);
                if (ticket) ticket.unreadCount = 0;
            } catch (e) {
                // ignore error
            }
        };

        const openChat = async (ticketId) => {
            selectedTicketId.value = ticketId;
            showChat.value = true;
            await fetchMessages(ticketId);
            await markMessagesAsRead(ticketId);
            startMessagePolling(ticketId);
        };

        const closeChat = () => {
            showChat.value = false;
            selectedTicketId.value = null;
            newMessage.value = '';
            chatMessages.value = [];
            stopMessagePolling();
        };


        const fetchMessages = async (ticketId) => {
            try {
                const token = localStorage.getItem('token');
                const response = await fetch(`http://localhost:8080/api/tickets/${ticketId}/messages`,
                 {
                    headers: {
                        "Authorization": "Bearer "+ token,
                         "Content-Type": "application/json"
                    }
                });
                if (!response.ok) throw new Error('Failed to fetch messages');
                chatMessages.value = await response.json();
            } catch (error) {
                console.error('Error fetching messages:', error);
                chatMessages.value = [];
            }
        };


        const sendMessage = async () => {
            if (!newMessage.value.trim()) return;

            try {
                const token = localStorage.getItem('token');
                const response = await fetch(`http://localhost:8080/api/tickets/${selectedTicketId.value}/message`, {
                    method: 'POST',
                    headers: {
                         'Authorization': 'Bearer '+ token,
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        content: newMessage.value.trim()
                    })
                });

                if (!response.ok) throw new Error('Failed to send message');

                chatMessages.value.push({
                    sender: 'You',
                    text: newMessage.value.trim(),
                    created_at: new Date().toISOString()
                });

                newMessage.value = '';

                nextTick(() => {
                    const chatContainer = document.querySelector('.chat-messages');
                    if (chatContainer) {
                        chatContainer.scrollTop = chatContainer.scrollHeight;
                    }
                });
            } catch (error) {
                console.error('Error sending message:', error);
            }
        };


        const handleLogout = () => {
            auth.logout();
            router.push('/login');
        };

        
        onMounted(() => {

            fetchTickets();

            const token = localStorage.getItem('token');
            if(!token){
                handleLogout()
              
            }
            fetchMyTickets();
            // Return cleanup function

            return () => {
                stopMessagePolling();
            };
        });

        return { 
            subject, description, priority, type,
            successMessage, errorMessage, 
            tickets, handleSubmit, showChat, 
            selectedTicketId, newMessage, 
            chatMessages, sendMessage, handleLogout, 
            openChat, closeChat ,
                        formatDate,fetchMyTickets

        };
    }
},
};
</script>

<style scoped>
/* Main container classes */
.SubmitTicket,
.my-tickets,
.ticket-chatbox {
    max-width: 800px;
    margin: 20px auto;
    padding: 20px;
    border: 1px solid #ccc;
    border-radius: 5px;
    background-color: #f9f9f9;
}

/* Form styling */
.form-group {
    margin-bottom: 15px;
}

label {
    display: block;
    margin-bottom: 5px;
}

input, textarea, select {
    width: 100%;
    padding: 8px;
    box-sizing: border-box;
    border: 1px solid #ddd;
    border-radius: 4px;
}

/* Table styling */
table {
    width: 100%;
    border-collapse: collapse;
    margin-top: 15px;
}

th, td {
    padding: 10px;
    text-align: left;
    border-bottom: 1px solid #ddd;
}

th {
    background-color: #f2f2f2;
}

/* Button styling */
button {
    width: 100%;
    padding: 10px;
    background-color: #007bff;
    color: white;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    margin: 10px 0;
}

button:hover {
    background-color: #0056b3;
}

/* Messages */
.success {
    color: green;
    text-align: center;
    margin: 10px 0;
}

.error {
    color: red;
    text-align: center;
    margin: 10px 0;
}

/* Chat messages */
.chat-messages {
    margin-top: 10px;
    max-height: 300px;
    overflow-y: auto;
    padding: 10px;
    border: 1px solid #ddd;
    border-radius: 4px;
}

.chat-messages p {
    margin: 5px 0;
    padding: 5px;
}

.chat-messages strong {
    color: #333;
}

/* Headings */
h2 {
    text-align: center;
    margin-bottom: 20px;
    color: #333;
}

/* No tickets message */
.no-tickets {
    text-align: center;
    color: #888;
    padding: 20px;
    font-style: italic;
}

/* Chat Bubbles Styling */
.message {
    display: flex;
    margin: 8px 0;
    max-width: 85%;
}

.message.sent {
    margin-left: auto;
    flex-direction: row-reverse;
}

.message.received {
    margin-right: auto;
    flex-direction: row;
}

.message-content {
    padding: 8px 12px;
    border-radius: 15px;
    position: relative;
    max-width: 100%;
    word-wrap: break-word;
}

.message.sent .message-content {
    background-color: #007bff;
    color: white;
    margin-right: 8px;
    border-top-right-radius: 2px;
}

.message.received .message-content {
    background-color: #e9ecef;
    color: #333;
    margin-left: 8px;
    border-top-left-radius: 2px;
}

.message-sender {
    font-size: 0.75rem;
    margin-top: 4px;
    opacity: 0.7;
}

.message.sent .message-sender {
    text-align: right;
}

.message.received .message-sender {
    text-align: left;
}

.chat-messages {
    padding: 15px;
    height: 300px;
    color: #888;
    font-style: italic;
    display: flex;
    flex-direction: column;
}
/* Chat modal positioning */
.chat-modal {
    position: fixed;
    bottom: 24px;
    right: 24px;
    width: 360px;
    background: #ffffff;
    border-radius: 12px;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
    z-index: 1000;
}
.no-tickets {
    text-align: center;
}

.unread-indicator {
    display: inline-block;
    margin-left: 6px;
    width: 12px;
    height: 12px;
    background: #dc3545;
    border-radius: 50%;
    border: 2px solid #fff;
    vertical-align: middle;
    box-shadow: 0 0 2px #dc3545;
}

.chat-modal {
    width: 360px;
    background: #ffffff;
    border-radius: 12px;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
    z-index: 1000;
}

.unread-indicator {
  display: inline-block;
  margin-left: 6px;
  width: 12px;
  height: 12px;
  background: #dc3545;
  border-radius: 50%;
  border: 2px solid #fff;
  vertical-align: middle;
  box-shadow: 0 0 2px #dc3545;
}
</style>