import React, { useState, useEffect } from 'react';
import { Calendar, Plus, Edit3, Save, X, LogOut, Users, DollarSign, Camera, Clock, CalendarCheck } from 'lucide-react';

const ContentTrackerSystem = () => {
  const [currentUser, setCurrentUser] = useState(null);
  const [isCalendarConnected, setIsCalendarConnected] = useState(false);
  const [gapi, setGapi] = useState(null);
  
  // Calendar IDs from your Google Calendar settings
  const CALENDAR_IDS = {
    paid: 'c_6e8e002f93b9598e34f4e73652d68b9fba480067ce649685d3f561d7f114b2c@group.calendar.google.com', // DL MEDIA SCED
    pr: 'c_9d65f1d498bd1c56fd28936fe2e06c1eef0f933cdaa24c5195c1c8de07e08f6d@group.calendar.google.com' // PR SCED
  };

  const [events, setEvents] = useState([
    {
      id: 1,
      filmDate: '2025-06-25',
      client: 'willnorr',
      instagramUser: 'DumbLit Live',
      content: 'Dumblit Live',
      contactPerson: 'Will',
      status: 'Edit',
      paymentStatus: 'Paid',
      totalOwed: 350.00,
      payments: [
        { id: 1, amount: 350.00, method: 'Cashapp' }
      ],
      editors: 'N/A',
      createdBy: 'gregg',
      eventType: 'paid',
      calendarEventId: null
    },
    {
      id: 2,
      filmDate: '2025-06-23',
      client: 'boyband',
      instagramUser: 'DumbLit Live',
      content: 'Dumblit Live',
      contactPerson: 'Manager',
      status: 'POSTED',
      paymentStatus: 'PR',
      totalOwed: 0,
      payments: [],
      editors: 'N/A',
      createdBy: 'cook',
      eventType: 'pr',
      calendarEventId: null
    },
    {
      id: 3,
      filmDate: '2025-06-25',
      client: 'oneway lil steve',
      instagramUser: 'DumbLit Live',
      content: 'Dumblit Live',
      contactPerson: 'Steve',
      status: 'Edit',
      paymentStatus: 'Paid',
      totalOwed: 200.00,
      payments: [
        { id: 1, amount: 200.00, method: 'Apple Pay' }
      ],
      editors: 'N/A',
      createdBy: 'gregg',
      eventType: 'paid',
      calendarEventId: null
    },
    {
      id: 4,
      filmDate: '2025-06-14',
      client: 'rio feltt',
      instagramUser: 'DumbLit Live',
      content: 'Dumblit Live',
      contactPerson: 'Rio',
      status: 'Edit',
      paymentStatus: 'Paid',
      totalOwed: 1000.00,
      payments: [
        { id: 1, amount: 300.00, method: 'Cashapp' },
        { id: 2, amount: 400.00, method: 'Apple Pay' },
        { id: 3, amount: 300.00, method: 'Zelle' }
      ],
      editors: 'N/A',
      createdBy: 'cook',
      eventType: 'paid',
      calendarEventId: null
    }
  ]);
  
  const [showEventForm, setShowEventForm] = useState(false);
  const [editingEvent, setEditingEvent] = useState(null);
  const [formData, setFormData] = useState({
    filmDate: '',
    client: '',
    instagramUser: '',
    content: '',
    contactPerson: '',
    status: '',
    paymentStatus: '',
    totalOwed: '',
    payments: [],
    editors: '',
    eventType: 'paid'
  });

  // NEW: Inline editing state
  const [editingCell, setEditingCell] = useState({ eventId: null, field: null });
  const [editValue, setEditValue] = useState('');

  // NEW: Payment dropdown state
  const [expandedPayments, setExpandedPayments] = useState(new Set());

  // Close payment dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = () => {
      setExpandedPayments(new Set());
    };
    
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  const paymentMethods = ['Cashapp', 'Apple Pay', 'Zelle', 'Venmo', 'PayPal', 'Bank Transfer', 'Check', 'Cash', 'Stripe', 'Square'];

  // Payment management functions
  const addPayment = (eventId) => {
    const updatedEvents = events.map(event => {
      if (event.id === eventId) {
        const newPayment = {
          id: Date.now(),
          amount: 0,
          method: 'Cashapp'
        };
        return {
          ...event,
          payments: [...(event.payments || []), newPayment]
        };
      }
      return event;
    });
    setEvents(updatedEvents);
  };

  const updatePayment = (eventId, paymentId, field, value) => {
    const updatedEvents = events.map(event => {
      if (event.id === eventId) {
        const updatedPayments = event.payments.map(payment => {
          if (payment.id === paymentId) {
            return { ...payment, [field]: field === 'amount' ? parseFloat(value) || 0 : value };
          }
          return payment;
        });
        return { ...event, payments: updatedPayments };
      }
      return event;
    });
    setEvents(updatedEvents);
  };

  const removePayment = (eventId, paymentId) => {
    const updatedEvents = events.map(event => {
      if (event.id === eventId) {
        return {
          ...event,
          payments: event.payments.filter(payment => payment.id !== paymentId)
        };
      }
      return event;
    });
    setEvents(updatedEvents);
  };

  const getTotalPaid = (payments) => {
    return (payments || []).reduce((sum, payment) => sum + (parseFloat(payment.amount) || 0), 0);
  };

  const togglePaymentDropdown = (eventId, e) => {
    e.stopPropagation(); // Prevent the click from bubbling up
    const newExpanded = new Set(expandedPayments);
    if (newExpanded.has(eventId)) {
      newExpanded.delete(eventId);
    } else {
      newExpanded.clear(); // Close other dropdowns
      newExpanded.add(eventId);
    }
    setExpandedPayments(newExpanded);
  };

  const users = [
    { id: 'gregg', name: 'Gregg', password: 'gregg123' },
    { id: 'cook', name: 'Cook', password: 'cook123' }
  ];

  const [loginForm, setLoginForm] = useState({ username: '', password: '' });

  // Initialize Google Calendar API
  useEffect(() => {
    const initializeGoogleAPI = async () => {
      if (window.gapi) {
        await window.gapi.load('client:auth2', async () => {
          try {
            await window.gapi.client.init({
              apiKey: 'AIzaSyDRGpHAsKwvLz7ZkVPuBjRuIHefhFX2DLE',
              clientId: '746473079813-55e8j8ni075fc7qn8459tc5ivdv731t2.apps.googleusercontent.com',
              discoveryDocs: ['https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest'],
              scope: 'https://www.googleapis.com/auth/calendar'
            });
            setGapi(window.gapi);
          } catch (error) {
            console.error('Failed to initialize Google API:', error);
          }
        });
      }
    };

    // Load Google API script
    if (!window.gapi) {
      const script = document.createElement('script');
      script.src = 'https://apis.google.com/js/api.js';
      script.onload = initializeGoogleAPI;
      document.body.appendChild(script);
    } else {
      initializeGoogleAPI();
    }
  }, []);

  const connectToCalendar = async () => {
    if (!gapi) {
      alert('Google API not loaded. Please refresh the page and try again.');
      return;
    }
    
    try {
      const authInstance = gapi.auth2.getAuthInstance();
      const user = await authInstance.signIn();
      if (user.isSignedIn()) {
        setIsCalendarConnected(true);
        alert('Successfully connected to Google Calendar!');
      }
    } catch (error) {
      console.error('Calendar connection failed:', error);
      alert('Failed to connect to Google Calendar. Please try again.');
    }
  };

  const createCalendarEvent = async (eventData) => {
    if (!gapi || !isCalendarConnected) return null;

    try {
      const calendarId = eventData.eventType === 'paid' ? CALENDAR_IDS.paid : CALENDAR_IDS.pr;
      const eventTitle = `${eventData.client} - ${eventData.content}`;
      const eventDescription = `
Client: ${eventData.client}
Instagram User: ${eventData.instagramUser}
Content: ${eventData.content}
Type: ${eventData.eventType.toUpperCase()}
${eventData.eventType === 'paid' ? `Amount Owed: ${eventData.totalOwed}\nTotal Paid: ${getTotalPaid(eventData.payments)}` : 'PR Event (No Payment)'}
Created by: ${currentUser.name}
      `.trim();

      const calendarEvent = {
        summary: eventTitle,
        description: eventDescription,
        start: {
          date: eventData.filmDate,
          timeZone: 'America/New_York'
        },
        end: {
          date: eventData.filmDate,
          timeZone: 'America/New_York'
        },
        colorId: eventData.eventType === 'paid' ? '10' : '11'
      };

      const response = await gapi.client.calendar.events.insert({
        calendarId: calendarId,
        resource: calendarEvent
      });

      return response.result.id;
    } catch (error) {
      console.error('Failed to create calendar event:', error);
      alert('Failed to create calendar event. Event saved locally only.');
      return null;
    }
  };

  const updateCalendarEvent = async (eventData, calendarEventId) => {
    if (!gapi || !isCalendarConnected || !calendarEventId) return;

    try {
      const calendarId = eventData.eventType === 'paid' ? CALENDAR_IDS.paid : CALENDAR_IDS.pr;
      const eventTitle = `${eventData.client} - ${eventData.content}`;
      const eventDescription = `
Client: ${eventData.client}
Instagram User: ${eventData.instagramUser}
Content: ${eventData.content}
Type: ${eventData.eventType.toUpperCase()}
${eventData.eventType === 'paid' ? `Amount Owed: ${eventData.totalOwed}\nTotal Paid: ${getTotalPaid(eventData.payments)}` : 'PR Event (No Payment)'}
Created by: ${currentUser.name}
      `.trim();

      const calendarEvent = {
        summary: eventTitle,
        description: eventDescription,
        start: {
          date: eventData.filmDate,
          timeZone: 'America/New_York'
        },
        end: {
          date: eventData.filmDate,
          timeZone: 'America/New_York'
        },
        colorId: eventData.eventType === 'paid' ? '10' : '11'
      };

      await gapi.client.calendar.events.update({
        calendarId: calendarId,
        eventId: calendarEventId,
        resource: calendarEvent
      });
    } catch (error) {
      console.error('Failed to update calendar event:', error);
    }
  };

  const deleteCalendarEvent = async (eventType, calendarEventId) => {
    if (!gapi || !isCalendarConnected || !calendarEventId) return;

    try {
      const calendarId = eventType === 'paid' ? CALENDAR_IDS.paid : CALENDAR_IDS.pr;
      await gapi.client.calendar.events.delete({
        calendarId: calendarId,
        eventId: calendarEventId
      });
    } catch (error) {
      console.error('Failed to delete calendar event:', error);
    }
  };

  const handleLogin = () => {
    const user = users.find(u => u.id === loginForm.username && u.password === loginForm.password);
    if (user) {
      setCurrentUser(user);
      setLoginForm({ username: '', password: '' });
    } else {
      alert('Invalid credentials');
    }
  };

  const handleLogout = () => {
    setCurrentUser(null);
  };

  const resetForm = () => {
    setFormData({
      filmDate: '',
      client: '',
      instagramUser: '',
      content: '',
      contactPerson: '',
      status: '',
      paymentStatus: '',
      totalOwed: '',
      payments: [],
      editors: '',
      eventType: 'paid'
    });
    setEditingEvent(null);
    setShowEventForm(false);
  };

  const handleSubmit = async () => {
    if (!formData.filmDate || !formData.client) {
      alert('Please fill in required fields (Film Date and Client)');
      return;
    }
    
    let calendarEventId = null;
    
    if (editingEvent) {
      // Update existing event
      if (editingEvent.calendarEventId) {
        await updateCalendarEvent(formData, editingEvent.calendarEventId);
        calendarEventId = editingEvent.calendarEventId;
      } else {
        calendarEventId = await createCalendarEvent(formData);
      }
      
      setEvents(events.map(event => 
        event.id === editingEvent.id 
          ? { ...formData, id: editingEvent.id, createdBy: editingEvent.createdBy, calendarEventId }
          : event
      ));
    } else {
      // Create new event
      calendarEventId = await createCalendarEvent(formData);
      
      const newEvent = {
        ...formData,
        id: Date.now(),
        createdBy: currentUser.id,
        calendarEventId
      };
      setEvents([...events, newEvent]);
    }
    
    resetForm();
  };

  const handleEdit = (event) => {
    setFormData({...event, eventType: event.eventType || (event.paymentStatus === 'PR' ? 'pr' : 'paid')});
    setEditingEvent(event);
    setShowEventForm(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this event?')) {
      const event = events.find(e => e.id === id);
      if (event && event.calendarEventId) {
        await deleteCalendarEvent(event.eventType || (event.paymentStatus === 'PR' ? 'pr' : 'paid'), event.calendarEventId);
      }
      setEvents(events.filter(event => event.id !== id));
    }
  };

  // NEW: Inline editing functions
  const startEditing = (eventId, field, currentValue) => {
    setEditingCell({ eventId, field });
    setEditValue(currentValue || '');
  };

  const cancelEditing = () => {
    setEditingCell({ eventId: null, field: null });
    setEditValue('');
  };

  const saveEdit = async (eventId, field) => {
    const updatedEvents = events.map(event => {
      if (event.id === eventId) {
        const updatedEvent = { ...event, [field]: editValue };
        
        // If changing payment status, update related fields
        if (field === 'paymentStatus') {
          if (editValue === 'PR') {
            updatedEvent.totalOwed = 0;
            updatedEvent.payments = [];
            updatedEvent.eventType = 'pr';
          } else if (editValue === 'Paid') {
            updatedEvent.eventType = 'paid';
          }
        }

        // Update calendar event if it exists
        if (event.calendarEventId) {
          updateCalendarEvent(updatedEvent, event.calendarEventId);
        }
        
        return updatedEvent;
      }
      return event;
    });
    
    setEvents(updatedEvents);
    cancelEditing();
  };

  const handleKeyPress = (e, eventId, field) => {
    if (e.key === 'Enter') {
      saveEdit(eventId, field);
    } else if (e.key === 'Escape') {
      cancelEditing();
    }
  };

  // NEW: Render editable cell function
  const renderEditableCell = (event, field, displayValue, type = 'text') => {
    const isEditing = editingCell.eventId === event.id && editingCell.field === field;
    
    if (isEditing) {
      if (field === 'status') {
        const options = ['Edit', 'POSTED', 'Booked', 'Unscheduled'];
        
        return (
          <select
            value={editValue}
            onChange={(e) => setEditValue(e.target.value)}
            onBlur={() => saveEdit(event.id, field)}
            onKeyDown={(e) => handleKeyPress(e, event.id, field)}
            className="w-full px-2 py-1 border border-indigo-500 rounded text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500"
            autoFocus
          >
            <option value="">Select...</option>
            {options.map(option => (
              <option key={option} value={option}>{option}</option>
            ))}
          </select>
        );
      } else if (field === 'paymentStatus') {
        const options = ['Paid', 'PR'];
        
        return (
          <select
            value={editValue}
            onChange={(e) => setEditValue(e.target.value)}
            onBlur={() => saveEdit(event.id, field)}
            onKeyDown={(e) => handleKeyPress(e, event.id, field)}
            className="w-full px-2 py-1 border border-indigo-500 rounded text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500"
            autoFocus
          >
            <option value="">Select...</option>
            {options.map(option => (
              <option key={option} value={option}>{option}</option>
            ))}
          </select>
        );
      } else if (field === 'editors') {
        const editorOptions = ['gregg', 'cook', 'arjohn', 'N/A'];
        
        return (
          <select
            value={editValue}
            onChange={(e) => setEditValue(e.target.value)}
            onBlur={() => saveEdit(event.id, field)}
            onKeyDown={(e) => handleKeyPress(e, event.id, field)}
            className="w-full px-2 py-1 border border-indigo-500 rounded text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500"
            autoFocus
          >
            <option value="">Select...</option>
            {editorOptions.map(option => (
              <option key={option} value={option}>{option}</option>
            ))}
          </select>
        );
      } else {
        return (
          <input
            type={type}
            value={editValue}
            onChange={(e) => setEditValue(e.target.value)}
            onBlur={() => saveEdit(event.id, field)}
            onKeyDown={(e) => handleKeyPress(e, event.id, field)}
            className="w-full px-2 py-1 border border-indigo-500 rounded text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500"
            autoFocus
          />
        );
      }
    }
    
    return (
      <span 
        onClick={() => startEditing(event.id, field, event[field])}
        className="cursor-pointer hover:bg-gray-100 px-2 py-1 rounded block w-full transition-colors duration-150"
        title="Click to edit"
      >
        {displayValue}
      </span>
    );
  };

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'paid': return 'bg-green-100 text-green-800';
      case 'posted': return 'bg-blue-100 text-blue-800';
      case 'edit': return 'bg-orange-100 text-orange-800';
      case 'booked': return 'bg-purple-100 text-purple-800';
      case 'pr': return 'bg-pink-100 text-pink-800';
      case 'deposited': return 'bg-cyan-100 text-cyan-800';
      case 'unscheduled': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const totalOwed = events.reduce((sum, event) => sum + (parseFloat(event.totalOwed) || 0), 0);
  const totalPaid = events.reduce((sum, event) => sum + getTotalPaid(event.payments), 0);
  const myEvents = events.filter(event => event.createdBy === currentUser?.id);
  const paidEvents = events.filter(event => event.eventType === 'paid');
  const prEvents = events.filter(event => event.eventType === 'pr');

  if (!currentUser) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
        <div className="bg-white rounded-xl shadow-lg p-8 w-full max-w-md">
          <div className="text-center mb-6">
            <Calendar className="w-12 h-12 text-indigo-600 mx-auto mb-4" />
            <h1 className="text-2xl font-bold text-gray-900">Content Tracker</h1>
            <p className="text-gray-600">Gregg & Cook Merch Co 2.0</p>
          </div>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Username</label>
              <select
                value={loginForm.username}
                onChange={(e) => setLoginForm({...loginForm, username: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              >
                <option value="">Select User</option>
                <option value="gregg">Gregg</option>
                <option value="cook">Cook</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
              <input
                type="password"
                value={loginForm.password}
                onChange={(e) => setLoginForm({...loginForm, password: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="Enter password"
                onKeyPress={(e) => e.key === 'Enter' && handleLogin()}
              />
            </div>
            <button
              onClick={handleLogin}
              className="w-full bg-indigo-600 text-white py-2 px-4 rounded-lg hover:bg-indigo-700 transition-colors"
            >
              Sign In
            </button>
          </div>
          
          <div className="mt-6 p-4 bg-gray-50 rounded-lg">
            <p className="text-sm text-gray-600 text-center">Demo Credentials:</p>
            <p className="text-xs text-gray-500 text-center mt-1">gregg/gregg123 or cook/cook123</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <Calendar className="w-8 h-8 text-indigo-600 mr-3" />
              <div>
                <h1 className="text-xl font-bold text-gray-900">Content Tracker</h1>
                <p className="text-sm text-gray-500">Gregg & Cook Merch Co 2.0</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              {!isCalendarConnected && (
                <button
                  onClick={connectToCalendar}
                  className="flex items-center px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                >
                  <CalendarCheck className="w-4 h-4 mr-2" />
                  Connect Calendar
                </button>
              )}
              {isCalendarConnected && (
                <span className="flex items-center text-green-600 text-sm">
                  <CalendarCheck className="w-4 h-4 mr-1" />
                  Calendar Connected
                </span>
              )}
              <div className="text-right">
                <p className="text-sm font-medium text-gray-900">Welcome, {currentUser.name}</p>
                <p className="text-xs text-gray-500">{myEvents.length} events created</p>
              </div>
              <button
                onClick={handleLogout}
                className="flex items-center px-3 py-2 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <LogOut className="w-4 h-4 mr-1" />
                Sign Out
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Stats Dashboard */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-6 mb-6">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <Camera className="w-8 h-8 text-blue-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Events</p>
                <p className="text-2xl font-bold text-gray-900">{events.length}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <DollarSign className="w-8 h-8 text-green-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Paid Events</p>
                <p className="text-2xl font-bold text-gray-900">{paidEvents.length}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <Users className="w-8 h-8 text-pink-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">PR Events</p>
                <p className="text-2xl font-bold text-gray-900">{prEvents.length}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <DollarSign className="w-8 h-8 text-yellow-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Owed</p>
                <p className="text-2xl font-bold text-gray-900">${totalOwed.toFixed(2)}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <DollarSign className="w-8 h-8 text-green-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Paid</p>
                <p className="text-2xl font-bold text-gray-900">${totalPaid.toFixed(2)}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-lg font-semibold text-gray-900">Events & Projects</h2>
            <p className="text-sm text-gray-500 mt-1">
              💡 <span className="font-medium">Pro tip:</span> Click payment methods to see breakdown • Edit any cell inline • Matches your Google Sheets layout
            </p>
          </div>
          <button
            onClick={() => setShowEventForm(true)}
            className="flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add New Event
          </button>
        </div>

        {/* Event Form Modal */}
        {showEventForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg shadow-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-semibold">
                    {editingEvent ? 'Edit Event' : 'Create New Event'}
                  </h3>
                  <button
                    onClick={resetForm}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Event Type</label>
                    <div className="flex space-x-4">
                      <label className="flex items-center">
                        <input
                          type="radio"
                          value="paid"
                          checked={formData.eventType === 'paid'}
                          onChange={(e) => setFormData({...formData, eventType: e.target.value, paymentStatus: 'Paid'})}
                          className="mr-2"
                        />
                        <span className="text-green-600 font-medium">💰 Paid Event (DL Media Calendar)</span>
                      </label>
                      <label className="flex items-center">
                        <input
                          type="radio"
                          value="pr"
                          checked={formData.eventType === 'pr'}
                          onChange={(e) => setFormData({...formData, eventType: e.target.value, paymentStatus: 'PR'})}
                          className="mr-2"
                        />
                        <span className="text-pink-600 font-medium">📢 PR Event (PR Calendar)</span>
                      </label>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Film Date</label>
                    <input
                      type="date"
                      value={formData.filmDate}
                      onChange={(e) => setFormData({...formData, filmDate: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Client</label>
                    <input
                      type="text"
                      value={formData.client}
                      onChange={(e) => setFormData({...formData, client: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Contact Person</label>
                    <input
                      type="text"
                      value={formData.contactPerson}
                      onChange={(e) => setFormData({...formData, contactPerson: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                      placeholder="Contact name or info"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Instagram User</label>
                    <input
                      type="text"
                      value={formData.instagramUser}
                      onChange={(e) => setFormData({...formData, instagramUser: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Content</label>
                    <input
                      type="text"
                      value={formData.content}
                      onChange={(e) => setFormData({...formData, content: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                    <select
                      value={formData.status}
                      onChange={(e) => setFormData({...formData, status: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    >
                      <option value="">Select Status</option>
                      <option value="Edit">Edit</option>
                      <option value="POSTED">Posted</option>
                      <option value="Booked">Booked</option>
                      <option value="Unscheduled">Unscheduled</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Payment Status</label>
                    <select
                      value={formData.paymentStatus}
                      onChange={(e) => setFormData({...formData, paymentStatus: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    >
                      <option value="">Select Status</option>
                      <option value="Paid">Paid</option>
                      <option value="PR">PR</option>
                    </select>
                  </div>
                  
                  {(formData.eventType === 'paid' || formData.paymentStatus === 'Paid') && (
                    <>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Total Owed ($)</label>
                        <input
                          type="number"
                          step="0.01"
                          value={formData.totalOwed}
                          onChange={(e) => setFormData({...formData, totalOwed: e.target.value})}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                        />
                      </div>
                      
                      <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-1">Payments Received</label>
                        <div className="space-y-2 max-h-32 overflow-y-auto">
                          {(formData.payments || []).map((payment, index) => (
                            <div key={payment.id || index} className="flex items-center space-x-2 bg-gray-50 rounded p-2">
                              <div className="flex items-center">
                                <span className="text-gray-500 text-sm mr-1">$</span>
                                <input
                                  type="number"
                                  step="0.01"
                                  value={payment.amount || ''}
                                  onChange={(e) => {
                                    const updatedPayments = [...(formData.payments || [])];
                                    updatedPayments[index] = { ...payment, amount: parseFloat(e.target.value) || 0 };
                                    setFormData({...formData, payments: updatedPayments});
                                  }}
                                  placeholder="0.00"
                                  className="w-20 px-2 py-1 border border-gray-300 rounded text-sm"
                                />
                              </div>
                              <select
                                value={payment.method || 'Cashapp'}
                                onChange={(e) => {
                                  const updatedPayments = [...(formData.payments || [])];
                                  updatedPayments[index] = { ...payment, method: e.target.value };
                                  setFormData({...formData, payments: updatedPayments});
                                }}
                                className="flex-1 px-2 py-1 border border-gray-300 rounded text-sm"
                              >
                                {paymentMethods.map(method => (
                                  <option key={method} value={method}>{method}</option>
                                ))}
                              </select>
                              <button
                                type="button"
                                onClick={() => {
                                  const updatedPayments = formData.payments.filter((_, i) => i !== index);
                                  setFormData({...formData, payments: updatedPayments});
                                }}
                                className="text-red-600 hover:text-red-800"
                              >
                                <X className="w-4 h-4" />
                              </button>
                            </div>
                          ))}
                          <button
                            type="button"
                            onClick={() => {
                              const newPayment = { id: Date.now(), amount: 0, method: 'Cashapp' };
                              setFormData({...formData, payments: [...(formData.payments || []), newPayment]});
                            }}
                            className="w-full py-2 border border-dashed border-gray-300 rounded text-sm text-gray-600 hover:border-indigo-400 hover:text-indigo-600 transition-colors"
                          >
                            + Add Payment
                          </button>
                        </div>
                        {formData.payments && formData.payments.length > 0 && (
                          <div className="mt-2 text-sm text-gray-600">
                            Total Paid: <span className="font-semibold text-green-600">
                              ${formData.payments.reduce((sum, p) => sum + (parseFloat(p.amount) || 0), 0).toFixed(2)}
                            </span>
                          </div>
                        )}
                      </div>
                    </>
                  )}
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Editors</label>
                    <select
                      value={formData.editors}
                      onChange={(e) => setFormData({...formData, editors: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    >
                      <option value="">Select Editor</option>
                      <option value="gregg">gregg</option>
                      <option value="cook">cook</option>
                      <option value="arjohn">arjohn</option>
                      <option value="N/A">N/A</option>
                    </select>
                  </div>
                  
                  <div className="md:col-span-2 flex justify-end space-x-3 pt-4">
                    <button
                      onClick={resetForm}
                      className="px-4 py-2 text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleSubmit}
                      className="flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
                    >
                      <Save className="w-4 h-4 mr-2" />
                      {editingEvent ? 'Update Event' : 'Create Event'}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Events Table */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Film Date</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Client</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Instagram User</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Content</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Contact</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Payment Status</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total Owed</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total Paid</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Payment Methods</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Editors</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {events.map((event) => (
                  <tr key={event.id} className="hover:bg-gray-50 group">
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                      {renderEditableCell(
                        event, 
                        'filmDate', 
                        new Date(event.filmDate).toLocaleDateString(),
                        'date'
                      )}
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                      {renderEditableCell(event, 'client', event.client)}
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                      {renderEditableCell(event, 'instagramUser', event.instagramUser)}
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                      {renderEditableCell(event, 'content', event.content)}
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                      {renderEditableCell(event, 'contactPerson', event.contactPerson)}
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap">
                      {renderEditableCell(
                        event, 
                        'status', 
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(event.status)}`}>
                          {event.status}
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap">
                      {renderEditableCell(
                        event, 
                        'paymentStatus', 
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${event.paymentStatus === 'PR' ? 'bg-pink-100 text-pink-800' : 'bg-green-100 text-green-800'}`}>
                          {event.paymentStatus || 'Not Set'}
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                      {event.paymentStatus === 'PR' ? (
                        <span className="text-gray-400">-</span>
                      ) : (
                        renderEditableCell(
                          event, 
                          'totalOwed', 
                          `$${parseFloat(event.totalOwed || 0).toFixed(2)}`,
                          'number'
                        )
                      )}
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                      {event.paymentStatus === 'PR' ? (
                        <span className="text-gray-400">-</span>
                      ) : (
                        <span className="text-green-600 font-semibold">
                          ${getTotalPaid(event.payments).toFixed(2)}
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap">
                      {event.paymentStatus === 'PR' ? (
                        <span className="text-gray-400 text-sm">PR Event</span>
                      ) : (
                        <div className="relative">
                          <button
                            onClick={(e) => togglePaymentDropdown(event.id, e)}
                            className="text-sm text-indigo-600 hover:text-indigo-800 flex items-center"
                          >
                            {(event.payments || []).length} payment{(event.payments || []).length !== 1 ? 's' : ''}
                            <span className="ml-1">▼</span>
                          </button>
                          
                          {expandedPayments.has(event.id) && (
                            <div 
                              className="absolute top-full left-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-10 min-w-[200px]"
                              onClick={(e) => e.stopPropagation()}
                            >
                              <div className="p-3 space-y-2">
                                {(event.payments || []).map((payment, index) => (
                                  <div key={payment.id} className="flex items-center space-x-2 text-xs">
                                    <span className="text-green-600">$</span>
                                    <input
                                      type="number"
                                      step="0.01"
                                      value={payment.amount}
                                      onChange={(e) => updatePayment(event.id, payment.id, 'amount', e.target.value)}
                                      className="w-16 px-1 py-1 border border-gray-300 rounded text-xs"
                                      placeholder="0"
                                    />
                                    <select
                                      value={payment.method}
                                      onChange={(e) => updatePayment(event.id, payment.id, 'method', e.target.value)}
                                      className="flex-1 px-1 py-1 border border-gray-300 rounded text-xs"
                                    >
                                      {paymentMethods.map(method => (
                                        <option key={method} value={method}>{method}</option>
                                      ))}
                                    </select>
                                    <button
                                      onClick={() => removePayment(event.id, payment.id)}
                                      className="text-red-500 hover:text-red-700"
                                      title="Remove payment"
                                    >
                                      <X className="w-3 h-3" />
                                    </button>
                                  </div>
                                ))}
                                
                                <button
                                  onClick={() => addPayment(event.id)}
                                  className="w-full text-xs text-indigo-600 hover:text-indigo-800 py-1 border border-dashed border-indigo-300 rounded hover:border-indigo-400 transition-colors flex items-center justify-center"
                                >
                                  <Plus className="w-3 h-3 mr-1" />
                                  Add Payment
                                </button>
                              </div>
                            </div>
                          )}
                        </div>
                      )}
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                      {renderEditableCell(event, 'editors', event.editors || 'N/A')}
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleEdit(event)}
                          className="text-indigo-600 hover:text-indigo-900 p-1 rounded hover:bg-indigo-50 transition-colors"
                          title="Edit in form"
                        >
                          <Edit3 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(event.id)}
                          className="text-red-600 hover:text-red-900 p-1 rounded hover:bg-red-50 transition-colors"
                          title="Delete event"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            
            {events.length === 0 && (
              <div className="text-center py-12">
                <Camera className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No events yet</h3>
                <p className="text-gray-500">Get started by creating your first event.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContentTrackerSystem;