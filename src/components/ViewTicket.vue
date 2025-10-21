<template>
  <MainTemplate>
    <div class="view-ticket p-8">
      <h2 class="text-xl font-bold mb-4">Ticket Details</h2>

      <div v-if="ticket">
        <p><strong>Subject:</strong> {{ ticket.subject }}</p>
        

        <div v-if="isAdmin"><strong>Status: </strong>
          <select 
                            v-model="ticket.status" 
                            @change="updateTicketStatus(ticket.id, ticket.status)"
                            :class="['status-select', ticket.status.toLowerCase()]"
                        >
                           
                             <option v-for="ticketStatus in ticketStatuses" :key="ticketStatus.id" :value="ticketStatus.name">
                                {{ ticketStatus.name }}
                            </option>
          </select>
        </div>
        <div v-else>
          <p><strong>Status:</strong> {{ ticket.status }}</p>
        </div>

        <p><strong>Created At:</strong> {{ formatDate(ticket.createdAt) }}</p>
        <p><strong>Created By:</strong> {{ ticket.reporter?.email || 'Unknown' }}</p>
        <div v-if="isAdmin"><strong>Assignee: </strong>
          <select 
                            v-model="ticket.assignedTo" 
                            @change="updateAssignedTo(ticket.id, ticket.assignedTo)"
                            :class="['status-select', ticket.assignedTo.toLowerCase()]"
                        >
                           
                             <option v-for="user in users" :key="user.id" :value="user.name">
                                {{ user.name }}
                            </option>
          </select>
        </div>
        <div v-else>
          <p><strong>Assignee:</strong> {{ ticket.assignedTo }}</p>
        </div>




        
      </div>
      <div v-else>
        <p>Loading ticket details...</p>
      </div>
    

      <h3 class="text-lg font-semibold mt-6">Messages</h3>
      <div class="messages-container" ref="messagesContainer" @scroll="handleScroll">
        <div v-if="messages.length > 0" class="messages">
          <div v-for="msg in messages" :key="msg.id"  :class="['message border-b py-2', msg.sender === currentUser ? 'received' : 'sent']">
            <p><strong>{{ msg.sender || 'Unknown' }}:</strong></p>
            <p>{{ msg.content }}</p>
            <small class="text-gray-500">{{ formatDate(msg.createdAt) }}</small>
          </div>
        </div>
        <div v-else>
          <p>No messages found for this ticket.</p>
        </div>
      </div>
    </div>

    <!-- Fixed message composer -->
    <div class="message-composer">
      <form @submit.prevent="sendMessage">
        <textarea
          ref="textarea"
          v-model="newMessage"
          class="composer-textarea"
          placeholder="Type a message..."
          rows="1"
          @input="autoResize"
          @keydown.enter.exact.prevent="sendMessage" 
          @keydown.shift.enter.stop
          :disabled="sending"
        ></textarea>
        <button type="submit" class="composer-button" :disabled="sending || !newMessage.trim()">
          Send
        </button>
      </form>
    </div>
  </MainTemplate>
</template>

<script setup>
import { ref, onMounted, nextTick, watch ,computed } from 'vue'
import { useRoute ,useRouter} from 'vue-router'
import MainTemplate from './MainTemplate.vue'
import { useAuthStore } from '../stores/auth';
import { jwtDecode } from 'jwt-decode';
import { useToast } from 'vue-toastification'

const ticketStatuses = ref([]);
const router = useRouter();
const isAdmin = computed(() => auth.user?.admin);
const auth = useAuthStore();
const route = useRoute()
const ticketId = route.params.id
const ticket = ref(null)
const messages = ref([])
const newMessage = ref("")
const sending = ref(false)
const textarea = ref(null)
const messagesContainer = ref(null)
const currentUser = computed(() => auth.user?.email);
 const toast = useToast();
const users = ref([]);
const fetchTicketDetails = async () => {
  const token = localStorage.getItem('token')
  try {
    const res = await fetch(`http://localhost:8080/api/tickets/view/${ticketId}`, {
      headers: {
        Authorization: 'Bearer ' + token,
        'Content-Type': 'application/json',
      },
    })
    ticket.value = await res.json()
  } catch (error) {
    console.error('Error fetching ticket:', error)
  }
}



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




const fetchMessages = async () => {
  const token = localStorage.getItem('token')
  try {
    const res = await fetch(`http://localhost:8080/api/tickets/${ticketId}/messages`, {
      headers: {
        Authorization: 'Bearer ' + token,
        'Content-Type': 'application/json',
      },
    })
    messages.value = await res.json()
  } catch (error) {
    console.error('Error fetching messages:', error)
  }
}
const startMessagePolling = () => {
            setInterval(() => {
                fetchMessages();
            }, 3000)
        }



 /**Functional 28-July-2025 */
        const updateTicketStatus = async (ticketId, status) => {
            try {
                const token = auth.token; //localStorage.getItem('token');
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
              //  const ticket = tickets.value.find(t => t.id === ticketId);
                if (ticket) {
                    ticket.status = status;
                    toast.success('Ticket status updated');
                }
                 fetchTicketDetails();
            } catch (error) {
                console.error('Error updating ticket status:', error);
                toast.error('Error updating ticket status');
                // Revert the change on error
                //await fetchTickets();
            }
        };



const sendMessage = async () => {
  if (!newMessage.value.trim() || sending.value) return
  sending.value = true
  const token = localStorage.getItem('token')

  try {
    const res = await fetch(`http://localhost:8080/api/tickets/${ticketId}/message`, {
      method: 'POST',
      headers: {
        Authorization: 'Bearer ' + token,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ content: newMessage.value }),
    })

    if (res.ok) {
      const saved = await res.json()
      messages.value.push(saved) // Optimistic update
      newMessage.value = ""
      await nextTick()
      autoResize() // reset textarea height
      scrollToBottom()
    } else {
      console.error("Failed to send message")
    }
  } catch (err) {
    console.error("Error sending message:", err)
  } finally {
    sending.value = false
  }
}

const autoResize = () => {
  const el = textarea.value
  if (!el) return
  el.style.height = "auto"
  el.style.height = el.scrollHeight + "px"
}

const scrollToBottom = () => {
  if (messagesContainer.value) {
    messagesContainer.value.scrollTop = messagesContainer.value.scrollHeight
  }
}

const formatDate = (dateString) => {
  const d = new Date(dateString)
  return isNaN(d) ? 'Invalid date' : d.toLocaleString()
}


   const fetchUsers = async () => {
             const token = localStorage.getItem('token');
            try {
               
                const response = await fetch('http://localhost:8080/api/available-users', {
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
              //  const ticket = tickets.value.find(t => t.id === ticketId);
                if (ticket) {
                    ticket.assignedTo = assignment;
                    toast.success('Ticket updated');

                }
            } catch (error) {
                console.error('Error updating ticket:', error);
                toast.error('Error updating ticket');

                
            }
        };


        const isAtBottom = ref(true)

        const handleScroll = () => {
          if (!messagesContainer.value) return
          const { scrollTop, scrollHeight, clientHeight } = messagesContainer.value
          // If within ~50px of bottom, consider "at bottom"
          isAtBottom.value = scrollTop + clientHeight >= scrollHeight - 50
        }

onMounted(async () => {
  await fetchTicketDetails()
  await fetchMessages()
  await fetchTicketStatuses()
  nextTick(scrollToBottom)
  startMessagePolling()
  fetchUsers()
  
})

// auto-scroll when messages change
/*watch(messages, () => nextTick(scrollToBottom))*/

watch(messages, async () => {
  await nextTick()
  if (isAtBottom.value) {
    scrollToBottom()
  }
})
</script>


<style scoped>
.view-ticket {
  padding-bottom: 100px; /* space for composer */
  max-width: 1200px;
  width: 100%;
  margin: 0 auto;
  box-sizing: border-box;
}

/* Scrollable messages area */
.messages-container {
  max-height: 60vh;
  overflow-y: auto;
  padding-right: 5px;
}

.message {
  padding: 15px;
  background: #f7f7f7;
  margin-bottom: 12px;
  border-radius: 5px;
  font-size: 1rem;
  line-height: 1.4;
  word-wrap: break-word;
}

/* Composer fixed at bottom */
.message-composer {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  background: white;
  border-top: 1px solid #ddd;
  padding: 10px;
  z-index: 9999;
}

.message-composer form {
  display: flex;
  gap: 10px;
  align-items: flex-end;
}

.composer-textarea {
  flex: 1;
  padding: 10px;
  border-radius: 6px;
  border: 1px solid #ccc;
  font-size: 1rem;
  resize: none;
  overflow: hidden;
  max-height: 200px;
}

.composer-button {
  padding: 10px 16px;
  border: none;
  background: #2563eb;
  color: white;
  border-radius: 6px;
  cursor: pointer;
}

.composer-button:disabled {
  background: #888;
  cursor: not-allowed;
}

.message.sent {
    margin-left: auto;
    flex-direction: row-reverse;
}
.message.sent .message-content {
    background-color: #3b82f6;
    color: white;
    border-bottom-right-radius: 4px;
    margin-left: 8px;
}
.received{
   background-color: #3b82f6;
    color: white;
    border-bottom-right-radius: 4px;
    margin-left: 8px;
}
.message.received {
    margin-right: auto;
    flex-direction: row;
}

.message.received .message-content {
    background-color: #f1f5f9;
    color: #1a1a1a;
    border-bottom-left-radius: 4px;
    margin-right: 8px;
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
/* Mobile tweaks */
@media (max-width: 768px) {
  .composer-textarea {
    font-size: 0.95rem;
    padding: 8px;
  }
  .composer-button {
    padding: 8px 12px;
    font-size: 0.9rem;

  }

}
</style>