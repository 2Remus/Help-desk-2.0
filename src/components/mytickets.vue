<template>
  <MainTemplate>
    <div class="ticket-list-container">
      <h1>My Tickets</h1>
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
          <option v-for="status in ticketStatuses" :key="status" :value="status">
            {{ status }}
          </option>
        </select>
        <select v-model="selectedPriority" class="filter-input">
          <option value="">All Priorities</option>
          <option value="low">Low</option>
          <option value="medium">Medium</option>
          <option value="high">High</option>
        </select>
      </div>
    </div>
    <div class="ticket-list">
      <table>
        <thead>
          <tr>
            <th>Ticket ID</th>
            <th>Subject</th>
            <th>Description</th>
            <th>Status</th>
            <th>Priority</th>
            <th>Issue Type</th>
            <th>Assigned To</th>
            <th>Created At</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="ticket in filteredTickets" :key="ticket.id">
            <td>{{ ticket.id }}</td>
            <td>{{ ticket.subject }}</td>
            <td>{{ ticket.description }}</td>
            <td>
              <select 
                v-model="ticket.status" 
                @change="updateTicketStatus(ticket.id, ticket.status)"
                :class="['status-select', ticket.status?.toLowerCase()]"
              >
                <option v-for="status in ticketStatuses" :key="status" :value="status">
                  {{ status }}
                </option>
              </select>
            </td>
            <td>
              <select 
                v-model="ticket.priority" 
                @change="updateTicketPriority(ticket.id, ticket.priority)"
                :class="['priority-select', ticket.priority?.toLowerCase()]"
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </td>
            <td>
              <select 
                v-model="ticket.issueType" 
                @change="updateTicketIssueType(ticket.id, ticket.issueType)"
                :class="['status-select', ticket.issueType?.toLowerCase()]"
              >
                <option v-for="type in issueTypes" :key="type" :value="type">
                  {{ type }}
                </option>
              </select>
            </td>
            <td>{{ ticket.assignedTo }}</td>
            <td>{{ formatDate(ticket.createdAt) }}</td>
          </tr>
        </tbody>
      </table>
    </div>
    <div v-if="tickets.length === 0" class="no-tickets">
      <p>No tickets assigned to you.</p>
    </div>
  </MainTemplate>
</template>

<script>
import { ref, computed, onMounted } from 'vue'
import { useAuthStore } from '../stores/auth'
import MainTemplate from './MainTemplate.vue'

export default {
  name: 'MyTickets',
  components: { MainTemplate },
  setup() {
    const auth = useAuthStore()
    const tickets = ref([])
    const searchQuery = ref('')
    const dateFrom = ref('')
    const dateTo = ref('')
    const selectedStatus = ref('')
    const selectedPriority = ref('')
    // These should match your backend values
    const ticketStatuses = ref(['Open', 'In Progress', 'Closed'])
    const issueTypes = ref(['Bug', 'Feature', 'Support']) // Replace with your actual types

    // Fetch issue types from backend if needed
    const fetchIssueTypes = async () => {
      const token = auth.token
      if (!token) return
      try {
        const response = await fetch('http://localhost:8080/api/issue-types', {
          headers: {
            'Authorization': 'Bearer ' + token,
            'Content-Type': 'application/json'
          }
        })
        if (!response.ok) throw new Error('Failed to fetch issue types')
        const data = await response.json()
        issueTypes.value = Array.isArray(data)
          ? data.map(type => type.name || type)
          : issueTypes.value
      } catch (error) {
        console.error('Error fetching issue types:', error)
      }
    }

    const fetchMyTickets = async () => {
      const token = auth.token
      if (!token) return
      try {
        const response = await fetch('http://localhost:8080/api/tickets/my-assigned', {
          headers: {
            'Authorization': 'Bearer ' + token,
            'Content-Type': 'application/json'
          }
        })
        if (!response.ok) throw new Error('Failed to fetch tickets')
        tickets.value = await response.json()
      } catch (error) {
        console.error('Error fetching my tickets:', error)
        tickets.value = []
      }
    }

    // Update functions
    const updateTicketStatus = async (ticketId, status) => {
      try {
        const token = auth.token
        const response = await fetch(`http://localhost:8080/api/tickets/status/${ticketId}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + token
          },
          body: JSON.stringify({ status })
        })
        if (!response.ok) throw new Error('Failed to update ticket status')
      } catch (error) {
        console.error('Error updating ticket status:', error)
        await fetchMyTickets()
      }
    }

    const updateTicketPriority = async (ticketId, priority) => {
      try {
        const token = auth.token
        const response = await fetch(`http://localhost:8080/api/tickets/priority/${ticketId}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + token
          },
          body: JSON.stringify({ priority })
        })
        if (!response.ok) throw new Error('Failed to update ticket priority')
      } catch (error) {
        console.error('Error updating ticket priority:', error)
        await fetchMyTickets()
      }
    }

    const updateTicketIssueType = async (ticketId, issueType) => {
      try {
        const token = auth.token
        const response = await fetch(`http://localhost:8080/api/tickets/issue-type/${ticketId}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + token
          },
          body: JSON.stringify({ issueType })
        })
        if (!response.ok) throw new Error('Failed to update ticket issue type')
      } catch (error) {
        console.error('Error updating ticket issue type:', error)
        await fetchMyTickets()
      }
    }

    const filteredTickets = computed(() => {
      return tickets.value.filter(ticket => {
        const subjectMatch = ticket.subject?.toLowerCase().includes(searchQuery.value.toLowerCase())
        const statusMatch = !selectedStatus.value || ticket.status === selectedStatus.value
        const priorityMatch = !selectedPriority.value || ticket.priority === selectedPriority.value
        const createdAt = new Date(ticket.createdAt)
        const dateFromMatch = !dateFrom.value || createdAt >= new Date(dateFrom.value)
        const dateToMatch = !dateTo.value || createdAt <= new Date(dateTo.value + 'T23:59:59')
        return subjectMatch && statusMatch && priorityMatch && dateFromMatch && dateToMatch
      })
    })

    function formatDate(dateString) {
      if (!dateString) return ''
      const cleaned = dateString.replace(' ', 'T')
      const date = new Date(cleaned)
      if (isNaN(date.getTime())) return 'Invalid Date'
      return date.toLocaleString()
    }

    onMounted(() => {
      fetchMyTickets()
      fetchIssueTypes()
    })

    return {
      tickets,
      searchQuery,
      dateFrom,
      dateTo,
      selectedStatus,
      selectedPriority,
      ticketStatuses,
      issueTypes,
      filteredTickets,
      formatDate,
      updateTicketStatus,
      updateTicketPriority,
      updateTicketIssueType
    }
  }
}
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&display=swap');
.ticket-list-container { width: 100%; max-width: 100%; margin: 0; padding: 16px; border-radius: 16px; background-color: #fff; box-shadow: 0 2px 12px rgba(0,0,0,0.08); font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif; box-sizing: border-box; }
h1 { text-align: center; font-weight: 600; color: #1a1a1a; font-size: clamp(1.5rem, 2vw, 1.75rem); margin-bottom: 16px; }
.filters { display: grid; grid-template-columns: repeat(auto-fit, minmax(160px, 1fr)); gap: 12px; }
.filter-input { width: 100%; padding: 8px 10px; border: 1px solid #ccc; border-radius: 6px; font-size: 14px; box-sizing: border-box; }
.ticket-list { width: 900px; }
table { width: 980px; border-collapse: separate; border-spacing: 0; margin: 16px 0; }
th, td { padding: 12px 16px; text-align: left; border-bottom: 1px solid #edf2f7; }
th { background-color: #f8fafc; font-weight: 500; color: #64748b; font-size: 0.875rem; text-transform: uppercase; letter-spacing: 0.05em; }
td { color: #334155; font-size: 0.9375rem; }
.no-tickets { text-align: center; color: #64748b; padding: 48px 24px; }
.no-tickets p { font-size: 0.9375rem; font-weight: 500; }
@media (max-width: 768px) {
  .ticket-list table, .ticket-list thead, .ticket-list tbody, .ticket-list th, .ticket-list td, .ticket-list tr { display: block; }
  .ticket-list thead tr { display: none; }
  .ticket-list tr { margin-bottom: 20px; border-bottom: 2px solid #ddd; }
  .ticket-list td { position: relative; text-align: left; }
  .ticket-list td::before { content: attr(data-label); position: absolute; left: 15px; font-weight: bold; }
  .ticket-list { width: 100%; }
  table { width: 100%; }
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
</style>