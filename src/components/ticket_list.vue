<template>
    <MainTemplate>
    <!-- Ticket Form -->
    <div  class="ticket-form">
       <div class="ticket-list-container">
        <h1>Tickets</h1>

        <div class="filters">
        <input
            v-model="searchQuery"
            type="text"
            placeholder="Search subject..."
            class="filter-input"
        />

        <input
            v-model="dateFrom"
            type="date"
            class="filter-input"
            placeholder="From date"
        />

        <input
            v-model="dateTo"
            type="date"
            class="filter-input"
            placeholder="To date"
        />

        <select v-model="selectedStatus" class="filter-input">
            <option value="">All Statuses</option>
            <option value="open">Open</option>
            <option value="closed">Closed</option>
            <option value="in Progress">In Progress</option>
        </select>

        <select v-model="selectedPriority" class="filter-input">
            <option value="">All Priorities</option>
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
        </select>
            </div>
            </div>
 </div>

 <div class="ticket-list  ">
        <table>
            <thead>
                <tr>
                    <th>Ticket ID</th>
                    <th>Subject</th>
                    <th>Status</th>
                    <th>Priority</th>
                    <th>Assignee</th>
                    <th>Created At</th>
                    <th></th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="ticket in filteredTickets" :key="ticket.id">
                    <td>{{ ticket.id }}</td>
                    <td><RouterLink :to="`/tickets/view/${ticket.id}`">{{ ticket.subject }}</RouterLink></td>
                    <td>
                        <select 
                            v-model="ticket.status" 
                            @change="updateTicketStatus(ticket.id, ticket.status)"
                            :class="['status-select', ticket.status.toLowerCase()]"
                        >
                           
                             <option v-for="ticketStatus in ticketStatuses" :key="ticketStatus.id" :value="ticketStatus.name">
                                {{ ticketStatus.name }}
                            </option>
                        </select>
                    </td>
                    <td>
                        <select 
                            v-model="ticket.priority" 
                            @change="updateTicketPriority(ticket.id, ticket.priority)"
                            :class="['priority-select', ticket.priority.toLowerCase()]"
                        >
                            <option value="low">Low</option>
                            <option value="medium">Medium</option>
                            <option value="high">High</option>
                        </select>
                    </td>
                      <td>
                        <select 
                            v-model="ticket.assignedTo"   @change="updateAssignedTo(ticket.id, ticket.assignedTo)">
                            <option value="Unassigned"></option>
                            <option v-for="sysuser in users" :key="sysuser.id" :value="sysuser.name">
                                {{ sysuser.name }}
                            </option>
                        </select>
                    </td>
                    <td>{{ formatDate(ticket.createdAt) }}</td>
                    <td>
                  
                        <i class="pi pi-comments" @click="openChat(ticket.id)" style="font-size: 1.3rem" title="Chat"></i>
                        <i ></i>
                    </td>
                </tr>
            </tbody>
        </table>
        </div>


        <div v-if="tickets.length === 0" class="no-tickets">
            <p>No tickets available.</p>
        </div>

        <!-- Chat Modal -->
        <div v-if="showChat" class="chat-modal">
            <div class="chat-content">
                <div class="chat-header">
                    <h3>Ticket #{{ selectedTicketId }} Chat</h3>
                    <button class="close-btn" @click="closeChat">&times;</button>
                </div>
                <div class="chat-messages" ref="chatContainer">
                    <div v-for="(message, index) in chatMessages" 
                         :key="index" 
                         :class="['message', message.sender === currentUser ? 'sent' : 'received']">
                        <div class="message-content">
                            <p style="margin: 0;">{{ message.content }}</p>
                            <span class="message-sender">{{ message.sender }}</span>
                        </div>
                    </div>
                </div>
                <div class="chat-input">
                    <textarea 
                        v-model="newMessage" 
                        placeholder="Type your message..." 
                        @keyup.enter="sendMessage"
                        rows="2"
                    ></textarea>
                    <button @click="sendMessage">Send</button>
                </div>
            </div>
        </div>
  
   </MainTemplate>
</template>

<script>
import { ref, onMounted, nextTick, computed, onUnmounted} from 'vue';
import { useToast } from 'vue-toastification'
import { useAuthStore } from '../stores/auth';
import { jwtDecode } from 'jwt-decode';

import MainTemplate from './MainTemplate.vue';
import { useRouter } from 'vue-router';
export default {
    name: 'TicketList',
    components: {
    MainTemplate,
  },
    setup() {
        const auth = useAuthStore();
        const toast = useToast();
        const tickets = ref([]);
        const showChat = ref(false);
        const selectedTicketId = ref(null);
        const newMessage = ref('');
        const chatMessages = ref([]);
        const chatContainer = ref(null);
        const currentUser = computed(() => auth.user?.email);
        const showForm = ref(true);
        const users = ref([]);
        const router = useRouter();
        const searchQuery = ref('');
        const dateFrom = ref('');
        const dateTo = ref('');
        const selectedStatus = ref('');
        const selectedPriority = ref('');
        const ticketStatuses = ref([]);

        const filteredTickets = computed(() => {
            return tickets.value.filter(ticket => {
                const subjectMatch = ticket.subject?.toLowerCase().includes(searchQuery.value.toLowerCase());

                const statusMatch = !selectedStatus.value || ticket.status === selectedStatus.value;
                const priorityMatch = !selectedPriority.value || ticket.priority === selectedPriority.value;

                const createdAt = new Date(ticket.createdAt);

                const dateFromMatch = !dateFrom.value || createdAt >= new Date(dateFrom.value);
                const dateToMatch = !dateTo.value || createdAt <= new Date(dateTo.value + 'T23:59:59');

                return subjectMatch && statusMatch && priorityMatch && dateFromMatch && dateToMatch;
            });
        });



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

        const handleLogout = () => {
        auth.logout();
        router.push('/login');
        };

        const fetchTickets = async () => {
            const token = auth.token;  
            console.log("Token Tickets: "+token)
            if(token){
            try {
               const response = await fetch('http://localhost:8080/api/tickets', {
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
              //  toast.error('Error fetching tickets');
            }
            }        
            
        };



        const openChat = async (ticketId) => {
            selectedTicketId.value = ticketId;
            showChat.value = true;
            await fetchMessages(ticketId);
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
                const response = await fetch(`http://localhost:8080/api/tickets/${ticketId}/messages`, {
                    headers: {
                        'Authorization': `Bearer ${token}`
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
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    },
                    body: JSON.stringify({
                        content: newMessage.value.trim()
                    })
                });

                if (!response.ok) throw new Error('Failed to send message');

                // Add message to chat
                chatMessages.value.push({
                    text: newMessage.value.trim(),
                    sender: 'Admin',
                    created_at: new Date().toISOString()
                });

                newMessage.value = '';

                // Scroll to bottom
                nextTick(() => {
                    const container = chatContainer.value;
                    if (container) {
                        container.scrollTop = container.scrollHeight;
                    }
                });

                // Fetch latest messages to sync with any other responses
                await fetchMessages(selectedTicketId.value);
            } catch (error) {
                console.error('Error sending message:', error);
            }
        };


        let messagePollingInterval = null;

        const startMessagePolling = (ticketId) => {
            messagePollingInterval = setInterval(() => {
                if (showChat.value) {
                    fetchMessages(ticketId);
                }
            }, 3000); // Poll every 3 seconds
        };


        const stopMessagePolling = () => {
            if (messagePollingInterval) {
                clearInterval(messagePollingInterval);
                messagePollingInterval = null;
            }
        };

        
        /**Functional 28-July-2025 */
        const updateTicketStatus = async (ticketId, status) => {
            try {
                const token = localStorage.getItem('token');
                const response = await fetch(`http://localhost:8080/api/tickets/status/${ticketId}`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': 'Bearer '+ token
                    },
                    body: JSON.stringify({status})
                });
                
                if (!response.ok) {
                     toast.error('Failed to update ticket status');
                    throw new Error('Failed to update ticket status');

                }
                
                // Update local state
                const ticket = tickets.value.find(t => t.id === ticketId);
                if (ticket) {
                    ticket.status = status;
                    toast.success('Ticket status updated');
                }
            } catch (error) {
                console.error('Error updating ticket status:', error);
                toast.error('Error updating ticket status');
                // Revert the change on error
                await fetchTickets();
            }
        };


        const updateTicketPriority = async (ticketId, priority) => {
            try {
                const token = localStorage.getItem('token');
                const response = await fetch(`http://localhost:8080/api/tickets/priority/${ticketId}`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': 'Bearer '+ token,
                    },
                    body: JSON.stringify({ priority })
                });
                
                if (!response.ok) {
                    throw new Error('Failed to update ticket priority');
                }
                
                // Update local state
                const ticket = tickets.value.find(t => t.id === ticketId);
                if (ticket) {
                    ticket.priority = priority;
                    toast.success('Ticket priority updated');

                }
            } catch (error) {
                console.error('Error updating ticket priority:', error);
                toast.error('Error updating ticket priority');

                // Revert the change on error
                await fetchTickets();
            }
        };


        const updateAssignedTo = async (ticketId, assignment) => {
            try {
                const token = localStorage.getItem('token');
                const response = await fetch(`http://localhost:8080/api/tickets/assign/${ticketId}`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': 'Bearer '+ token,
                    },
                    body: JSON.stringify({ assignment })
                });
                
                if (!response.ok) {
                    throw new Error('Failed to update ticket');
                }
                
                // Update local state
                const ticket = tickets.value.find(t => t.id === ticketId);
                if (ticket) {
                    ticket.assignedTo = assignment;
                    toast.success('Ticket updated');

                }
            } catch (error) {
                console.error('Error updating ticket:', error);
                toast.error('Error updating ticket');

                // Revert the change on error
                await fetchTickets();
            }
        };

     const toggleForm = () => {
        showForm.value = !showForm.value;
        };

   
        let pollInterval;
         // Set up polling for updates
        onMounted(() => {
            const token = auth.token;
            console.log("On Mounted "+token);
            if(token){
                 fetchTickets();
                 fetchUsers();
                 fetchTicketStatuses();
            }
         
            // Poll for updates every 30 seconds
             pollInterval = setInterval(fetchTickets, 30000);
            
        });

        onUnmounted(() => {
            clearInterval(pollInterval)
            stopMessagePolling();
        })
     

         const fetchUsers = async () => {
             const token = localStorage.getItem('token');
            try {
               
                const response = await fetch('http://localhost:8080/api/users', {
                    headers: {
                         "Authorization": "Bearer "+ token,
                         "Content-Type": "application/json"
                    }
                });
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                users.value = await response.json();
            } catch (error) {
                console.error('Error fetching Users:', error);
            }
        };


          const fetchTicketStatuses = async () => {
            const token = auth.token;
            try {
                if (!token) return;
                currentUser.value = jwtDecode(token);
                if(currentUser.value.admin){
                router.push('/')

                }
                const response = await fetch('http://localhost:8080/api/ticket-statuses',
                {
                            headers: {
                                "Authorization": "Bearer "+ token,
                                "Content-Type": "application/json"
                            }
                        });
                if (!response.ok) throw new Error('Failed to ticket status');
                ticketStatuses.value = await response.json();
            } catch (error) {
                console.error('Error fetching ticket status:', error);
            }
    };

        return { 
            tickets, 
            showChat, 
            selectedTicketId, 
            newMessage, 
            chatMessages, 
            chatContainer,
            openChat, 
            closeChat, 
            sendMessage,
            formatDate,
            updateTicketStatus,
            updateTicketPriority,
            currentUser,
            filteredTickets,
            searchQuery,
            dateFrom,
            dateTo,
            selectedStatus,
            selectedPriority, 
            toggleForm,
            showForm,
            users,
            fetchUsers,
            updateAssignedTo,
            handleLogout,
            fetchTicketStatuses,
            ticketStatuses
            

        };

        

    }
};
</script>


<style scoped>
/* Modern Font Import - Add this at the top */
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&display=swap');


.ticket-list{
    width: 900px;
   


}
.view-ticket {
  padding: 20px;
  width: 100%;
  box-sizing: border-box;
}

select {
  width: 100%;
  padding: 8px;
  border: 1px solid #ddd;
  border-radius: 4px;
}
.ticket-form {
   
   width: 980px;
    
  }
/* Mobile adjustments */
@media (max-width: 768px) {
  .view-ticket {
    padding: 10px;
  }

 

  .ticket-form {
    margin-bottom: 15px;
     width: 100%;
  }
  .table-list{
    width: 100%;
  }
}
/* Mobile adjustments */
@media (max-width: 500px) {
  .view-ticket {
    padding: 10px;
  }

 

  .ticket-form {
    margin-bottom: 15px;
    width: 100%;
    
  }
  
}


/* Table responsiveness */
.ticket-table {
  width: 100%;
  overflow-x: auto; /* allow horizontal scroll if needed */
}
/* Base Styles */
.ticket-list-container {
  width: 100%;
  max-width: 100%; /* Fill available space */
  margin: 0;
  padding: 16px;
  border-radius: 16px;
  background-color: #ffffff;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
  box-sizing: border-box;
}

/* Headings */
h1 {
  text-align: center;
  font-weight: 600;
  color: #1a1a1a;
  font-size: clamp(1.5rem, 2vw, 1.75rem); /* Scales with screen size */
  margin-bottom: 16px;
}
/* Table wrapper for horizontal scroll on small screens */
table {
  width: 980px;
  border-collapse: separate;
  border-spacing: 0;
  margin: 16px 0 ;
}


/* Smaller mobile adjustments */
@media (max-width: 500px) {
  .ticket-list-container {
    padding: 12px;
    border-radius: 8px;
  }
  th, td {
    padding: 8px;
    font-size: 0.85rem;
  }

  .chat-modal {
    bottom: 8px;
    right: 8px;
    width: 95%;
    height: 75%;
    box-sizing: border-box;
  }

  .ticket-list{
    width: 100%;
    
  }
}
/* Filters layout */
.filters {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(160px, 1fr));
  gap: 12px;
}

.filter-input {
  width: 100%;
  padding: 8px 10px;
  border: 1px solid #ccc;
  border-radius: 6px;
  font-size: 14px;
  box-sizing: border-box;
}

th, td {
    padding: 12px 16px;
    text-align: left;
    border-bottom: 1px solid #edf2f7;
}

th {
    background-color: #f8fafc;
    font-weight: 500;
    color: #64748b;
    font-size: 0.875rem;
    text-transform: uppercase;
    letter-spacing: 0.05em;
}

td {
    color: #334155;
    font-size: 0.9375rem;
}

/* Status Badge Updates */
.status-badge {
    padding: 6px 12px;
    border-radius: 20px;
    font-size: 0.8125rem;
    font-weight: 500;
    display: inline-block;
}

.status-badge.open {
    background-color: #ecfdf5;
    color: #059669;
}

.status-badge.in-progress {
    background-color: #fef3c7;
    color: #d97706;
}

.status-badge.closed {
    background-color: #f1f5f9;
    color: #64748b;
}


.chat-modal {
  position: fixed;
  bottom: 16px;
  right: 16px;
  width: min(90%, 360px); /* Shrinks on mobile */
  height: min(80%, 480px);
  background: #ffffff;
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
  z-index: 1000;
  display: flex;
  flex-direction: column;
}

.chat-content {
    display: flex;
    flex-direction: column;
    height: 100%;
}

.chat-messages {
    flex: 1;
    overflow-y: auto;
    padding: 16px;
    display: flex;
    flex-direction: column;
    gap: 8px;
    background: #f8f9fa;
}

.message {
    display: flex;
    max-width: 85%;
    margin: 4px 0;
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
    border-radius: 16px;
    position: relative;
    word-wrap: break-word;
}

.message.sent .message-content {
    background-color: #3b82f6;
    color: white;
    border-bottom-right-radius: 4px;
    margin-left: 8px;
}

.message.received .message-content {
    background-color: #f1f5f9;
    color: #1a1a1a;
    border-bottom-left-radius: 4px;
    margin-right: 8px;
}

.message-sender {
    font-size: 0.75rem;
    margin-top: 4px;
    opacity: 0.7;
}

.chat-input {
    padding: 12px;
    border-top: 1px solid #e5e7eb;
    background: white;
    display: flex;
    gap: 8px;
    align-items: flex-start;
}

.chat-input textarea {
    flex: 1;
    padding: 8px 12px;
    border: 1px solid #e5e7eb;
    border-radius: 8px;
    resize: none;
    height: 40px;
    font-family: inherit;
}

.chat-input button {
    padding: 8px 16px;
    height: 40px;
    white-space: nowrap;
}

.chat-header {
    padding: 16px;
    border-bottom: 1px solid #e5e7eb;
    display: flex;
    justify-content: space-between;
    align-items: center;
    background: white;
}

.chat-header h3 {
    margin: 0;
    font-size: 1rem;
    font-weight: 600;
}

.close-btn {
    padding: 4px 8px;
    background: none;
    border: none;
    font-size: 1.5rem;
    cursor: pointer;
    color: #6b7280;
}

.close-btn:hover {
    color: #374151;
}

/* Empty State */
.no-tickets {
    text-align: center;
    color: #64748b;
    padding: 48px 24px;
}

.no-tickets p {
    font-size: 0.9375rem;
    font-weight: 500;
}

.status-select,
.priority-select {
    padding: 6px 12px;
    border-radius: 20px;
    font-size: 0.8125rem;
    font-weight: 500;
    border: 1px solid #e2e8f0;
    background-color: white;
    cursor: pointer;
}

.status-select.open {
    color: #059669;
    border-color: #059669;
}

.status-select.in-progress {
    color: #d97706;
    border-color: #d97706;
}

.status-select.closed {
    color: #64748b;
    border-color: #64748b;
}

.priority-select.low {
    color: #059669;
    border-color: #059669;
}

.priority-select.medium {
    color: #d97706;
    border-color: #d97706;
}

.priority-select.high {
    color: #dc2626;
    border-color: #dc2626;
}

select:focus {
    outline: none;
    box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.2);
}

.header-buttons {
    display: flex;
    justify-content: flex-end;
    margin-bottom: 20px;
}

.nav-btn {
    padding: 8px 16px;
    background-color: #4f46e5;
    color: white;
    border: none;
    border-radius: 8px;
    cursor: pointer;
    font-size: 0.875rem;
    font-weight: 500;
    display: flex;
    align-items: center;
    gap: 6px;
    transition: background-color 0.2s;
}

.nav-btn:hover {
    background-color: #4338ca;
}

.search-input {
  width: 100%;
  padding: 8px 12px;
  border: 1px solid #ccc;
  border-radius: 6px;
  font-size: 16px;
}

.filter-input {
  width: 100%;
  padding: 8px 10px;
  border: 1px solid #ccc;
  border-radius: 6px;
  font-size: 14px;
}


@media (max-width: 768px) {
  .ticket-list table,
  .ticket-list thead,
  .ticket-list tbody,
  .ticket-list th,
  .ticket-list td,
  .ticket-list tr {
    display: block;
  }
  .ticket-list thead tr {
    display: none;
  }
  .ticket-list tr {
    margin-bottom: 20px;
    border-bottom: 2px solid #ddd;
  }
  .ticket-list td {
  /*  padding-left: 50%;*/
    position: relative;
    text-align: left;
  }
  .ticket-list td::before {
    content: attr(data-label);
    position: absolute;
    left: 15px;
    font-weight: bold;
    
  }
  .ticket-list{
    width: 100%;
  }
  table{width: 100%;}
}
</style>