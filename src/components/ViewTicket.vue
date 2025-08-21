<template>
  <MainTemplate>
    <div class="view-ticket p-8 ">
      <h2 class="text-xl font-bold mb-4">Ticket Details</h2>

      <div v-if="ticket">
        <p><strong>Subject:</strong> {{ ticket.subject }}</p>
        <p><strong>Status:</strong> {{ ticket.status }}</p>
        <p><strong>Created At:</strong> {{ formatDate(ticket.createdAt) }}</p>
        <p><strong>Created By:</strong> {{ ticket.reporter?.email || 'Unknown' }}</p>
        <p><strong>Assignee:</strong> {{ ticket.assignedTo }}</p>

      </div>
      <div v-else>
        <p>Loading ticket details...</p>
      </div>

      <h3 class="text-lg font-semibold mt-6">Messages</h3>
      <div v-if="messages.length > 0" class="messages mt-2">
        <div v-for="msg in messages" :key="msg.id" class="message border-b py-2">
          <p><strong>{{ msg.sender || 'Unknown' }}:</strong></p>
          <p>{{ msg.content }}</p>
          <small class="text-gray-500">{{ formatDate(msg.createdAt) }}</small>
        </div>
      </div>
      <div v-else>
        <p>No messages found for this ticket.</p>
      </div>
    </div>
  </MainTemplate>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import MainTemplate from './MainTemplate.vue';

const route = useRoute();
const ticketId = route.params.id;

const ticket = ref(null);
const messages = ref([]);

const token = localStorage.getItem('token');

const fetchTicketDetails = async () => {
  const token = localStorage.getItem('token');
  try {
    const res = await fetch(`http://localhost:8080/api/tickets/view/${ticketId}`, {
      headers: {
        'Authorization': 'Bearer ' + token,
        'Content-Type': 'application/json',
      },
    });
    const data = await res.json();
    ticket.value = data; // Your endpoint returns a TicketResponseDTO directly
  } catch (error) {
    console.error('Error fetching ticket:', error);
  }
};

const fetchMessages = async () => {
  try {
    const token = localStorage.getItem('token');
    const res = await fetch(`http://localhost:8080/api/tickets/${ticketId}/messages`, {
      headers: {
        'Authorization': 'Bearer ' + token,
        'Content-Type': 'application/json',
      },
    });
    const data = await res.json();
    messages.value = data;
  } catch (error) {
    console.error('Error fetching messages:', error);
  }
};

const formatDate = (dateString) => {
  const d = new Date(dateString);
  return isNaN(d) ? 'Invalid date' : d.toLocaleString();
};



onMounted(() => {
  fetchTicketDetails();
  fetchMessages();
});
</script>


<style scoped>
.view-ticket {
  padding: 20px;
  max-width: 1200px; /* Center on large screens */
  width: 100%;
  margin: 0 auto;
  box-sizing: border-box;
}

.message {
  padding: 15px;
  background: #f7f7f7;
  margin-bottom: 12px;
  border-radius: 5px;
  font-size: 1rem;
  line-height: 1.4;
  word-wrap: break-word; /* Prevent overflow from long text */
}

/* Tablet */
@media (max-width: 1024px) {
  .view-ticket {
    padding: 15px;
    max-width: 100%;
  }
}

/* Mobile */
@media (max-width: 768px) {
  .view-ticket {
    padding: 10px;
    width: 100%;
  }

  .message {
    font-size: 0.95rem;
    padding: 12px;
  }
}

/* Small mobile (portrait) */
@media (max-width: 480px) {
  .message {
    font-size: 0.9rem;
    padding: 10px;
  }
}
</style>


