import React, { useState, useEffect } from 'react';
import { Calendar, Plus, Edit3, Save, X, LogOut, Users, DollarSign, Camera, Clock } from 'lucide-react';

const ContentTrackerSystem = () => {
  const [currentUser, setCurrentUser] = useState(null);
  const [events, setEvents] = useState([
    {
      id: 1,
      filmDate: '2025-06-25',
      client: 'willnorr',
      instagramUser: 'DumbLit Live',
      content: 'Dumblit Live',
      contact: 'Edit',
      editStatus: 'Paid',
      paymentStatus: 'Paid',
      totalOwed: 350.00,
      totalPaid: 350.00,
      paymentMethods: 'Cashapp',
      editors: 'N/A',
      createdBy: 'gregg'
    },
    {
      id: 2,
      filmDate: '2025-06-23',
      client: 'boyband',
      instagramUser: 'DumbLit Live',
      content: 'Dumblit Live',
      contact: 'POSTED',
      editStatus: 'PR',
      paymentStatus: 'Paid',
      totalOwed: 0,
      totalPaid: 0,
      paymentMethods: 'PR',
      editors: 'N/A',
      createdBy: 'cook'
    },
    {
      id: 3,
      filmDate: '2025-06-25',
      client: 'oneway lil steve',
      instagramUser: 'DumbLit Live',
      content: 'Dumblit Live',
      contact: 'Edit',
      editStatus: 'Paid',
      paymentStatus: 'Paid',
      totalOwed: 200.00,
      totalPaid: 200.00,
      paymentMethods: 'Apple Pay',
      editors: 'N/A',
      createdBy: 'gregg'
    },
    {
      id: 4,
      filmDate: '2025-06-14',
      client: 'rio feltt',
      instagramUser: 'DumbLit Live',
      content: 'Dumblit Live',
      contact: 'Edit',
      editStatus: 'Paid',
      paymentStatus: 'Paid',
      totalOwed: 300.00,
      totalPaid: 800.00,
      paymentMethods: 'Multiple',
      editors: 'N/A',
      createdBy: 'cook'
    }
  ]);
  
  const [showEventForm, setShowEventForm] = useState(false);
  const [editingEvent, setEditingEvent] = useState(null);
  const [formData, setFormData] = useState({
    filmDate: '',
    client: '',
    instagramUser: '',
    content: '',
    contact: '',
    editStatus: '',
    paymentStatus: '',
    totalOwed: '',
    totalPaid: '',
    paymentMethods: '',
    editors: ''
  });

  const users = [
    { id: 'gregg', name: 'Gregg', password: 'gregg123' },
    { id: 'cook', name: 'Cook', password: 'cook123' }
  ];

  const [loginForm, setLoginForm] = useState({ username: '', password: '' });

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
      contact: '',
      editStatus: '',
      paymentStatus: '',
      totalOwed: '',
      totalPaid: '',
      paymentMethods: '',
      editors: ''
    });
    setEditingEvent(null);
    setShowEventForm(false);
  };

  const handleSubmit = () => {
    if (!formData.filmDate || !formData.client) {
      alert('Please fill in required fields (Film Date and Client)');
      return;
    }
    
    if (editingEvent) {
      setEvents(events.map(event => 
        event.id === editingEvent.id 
          ? { ...formData, id: editingEvent.id, createdBy: editingEvent.createdBy }
          : event
      ));
    } else {
      const newEvent = {
        ...formData,
        id: Date.now(),
        createdBy: currentUser.id
      };
      setEvents([...events, newEvent]);
    }
    
    resetForm();
  };

  const handleEdit = (event) => {
    setFormData(event);
    setEditingEvent(event);
    setShowEventForm(true);
  };

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this event?')) {
      setEvents(events.filter(event => event.id !== id));
    }
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
  const totalPaid = events.reduce((sum, event) => sum + (parseFloat(event.totalPaid) || 0), 0);
  const myEvents = events.filter(event => event.createdBy === currentUser?.id);

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
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
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
              <Users className="w-8 h-8 text-green-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">My Events</p>
                <p className="text-2xl font-bold text-gray-900">{myEvents.length}</p>
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
          <h2 className="text-lg font-semibold text-gray-900">Events & Projects</h2>
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
                    <label className="block text-sm font-medium text-gray-700 mb-1">Contact Status</label>
                    <select
                      value={formData.contact}
                      onChange={(e) => setFormData({...formData, contact: e.target.value})}
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
                    <label className="block text-sm font-medium text-gray-700 mb-1">Edit Status</label>
                    <select
                      value={formData.editStatus}
                      onChange={(e) => setFormData({...formData, editStatus: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    >
                      <option value="">Select Status</option>
                      <option value="Paid">Paid</option>
                      <option value="PR">PR</option>
                      <option value="Deposited">Deposited</option>
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
                      <option value="Deposited">Deposited</option>
                    </select>
                  </div>
                  
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
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Total Paid ($)</label>
                    <input
                      type="number"
                      step="0.01"
                      value={formData.totalPaid}
                      onChange={(e) => setFormData({...formData, totalPaid: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Payment Methods</label>
                    <input
                      type="text"
                      value={formData.paymentMethods}
                      onChange={(e) => setFormData({...formData, paymentMethods: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                      placeholder="e.g., Cashapp, Apple Pay, Stripe"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Editors</label>
                    <input
                      type="text"
                      value={formData.editors}
                      onChange={(e) => setFormData({...formData, editors: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    />
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
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Edit Status</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Payment</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amounts</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Creator</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {events.map((event) => (
                  <tr key={event.id} className="hover:bg-gray-50">
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                      {new Date(event.filmDate).toLocaleDateString()}
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">{event.client}</td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">{event.instagramUser}</td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">{event.content}</td>
                    <td className="px-4 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(event.contact)}`}>
                        {event.contact}
                      </span>
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(event.editStatus)}`}>
                        {event.editStatus}
                      </span>
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(event.paymentStatus)}`}>
                        {event.paymentStatus}
                      </span>
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                      <div className="text-xs">
                        <div>Owed: ${parseFloat(event.totalOwed || 0).toFixed(2)}</div>
                        <div>Paid: ${parseFloat(event.totalPaid || 0).toFixed(2)}</div>
                      </div>
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${event.createdBy === 'gregg' ? 'bg-blue-100 text-blue-800' : 'bg-purple-100 text-purple-800'}`}>
                        {event.createdBy}
                      </span>
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleEdit(event)}
                          className="text-indigo-600 hover:text-indigo-900"
                        >
                          <Edit3 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(event.id)}
                          className="text-red-600 hover:text-red-900"
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