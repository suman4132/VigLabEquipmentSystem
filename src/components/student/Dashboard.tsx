import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Search,
  Filter,
  Clock,
  Bookmark,
  Calendar,
  User,
  Bell,
  Home,
  BookOpen,
  Settings,
  HelpCircle,
  LogOut,
  AlertCircle,
  Loader2,
  CheckCircle,
  XCircle,
  Plus,
  ChevronDown,
  ChevronUp,
  ChevronRight,
  ChevronLeft,
  MoreVertical
} from 'lucide-react';

// Types
type Equipment = {
  id: string;
  name: string;
  type: string;
  description: string;
  status: 'available' | 'booked';
  imageUrl: string;
  location: string;
  specifications: Record<string, string>;
};

type Booking = {
  id: string;
  equipmentId: string;
  equipmentName: string;
  studentName: string;
  startDate: string;
  endDate: string;
  status: 'approved' | 'pending' | 'rejected';
  imageUrl?: string;
};

type Complaint = {
  id: string;
  equipmentId?: string;
  equipmentName?: string;
  lab: string;
  type: string;
  description: string;
  status: 'pending' | 'resolved';
  date: string;
  imageUrl?: string;
};

type Notification = {
  id: string;
  title: string;
  message: string;
  date: string;
  read: boolean;
  icon: 'bell' | 'clock' | 'alert';
};

type Tab = 'dashboard' | 'equipment' | 'bookings' | 'notifications' | 'complaints';

// Mock API
const mockApi = {
  getEquipment: async (): Promise<Equipment[]> => {
    await new Promise(resolve => setTimeout(resolve, 500));
    return sampleEquipment;
  },

  getBookings: async (): Promise<Booking[]> => {
    await new Promise(resolve => setTimeout(resolve, 600));
    const storedBookings = localStorage.getItem('bookings');
    return storedBookings ? JSON.parse(storedBookings) : sampleBookings;
  },

  createBooking: async (equipmentId: string, dates: { start: string; end: string }): Promise<Booking> => {
    await new Promise(resolve => setTimeout(resolve, 800));
    const equipment = sampleEquipment.find(e => e.id === equipmentId);
    if (!equipment) throw new Error('Equipment not found');

    const newBooking: Booking = {
      id: `booking-${Date.now()}`,
      equipmentId,
      equipmentName: equipment.name,
      studentName: 'Current Student',
      startDate: dates.start,
      endDate: dates.end,
      status: 'pending',
      imageUrl: equipment.imageUrl
    };

    const bookings = await mockApi.getBookings();
    const updatedBookings = [...bookings, newBooking];
    localStorage.setItem('bookings', JSON.stringify(updatedBookings));
    return newBooking;
  },

  cancelBooking: async (id: string): Promise<void> => {
    await new Promise(resolve => setTimeout(resolve, 500));
    const bookings = await mockApi.getBookings();
    const updatedBookings = bookings.filter(b => b.id !== id);
    localStorage.setItem('bookings', JSON.stringify(updatedBookings));
  },

  getComplaints: async (): Promise<Complaint[]> => {
    await new Promise(resolve => setTimeout(resolve, 500));
    const storedComplaints = localStorage.getItem('complaints');
    return storedComplaints ? JSON.parse(storedComplaints) : [];
  },
  
  submitComplaint: async (complaint: Omit<Complaint, 'id' | 'date' | 'status'>): Promise<Complaint> => {
    await new Promise(resolve => setTimeout(resolve, 800));
    const complaints = await mockApi.getComplaints();
    const newComplaint: Complaint = {
      id: `complaint-${Date.now()}`,
      ...complaint,
      date: new Date().toISOString().split('T')[0],
      status: 'pending'
    };
    
    if (complaint.equipmentId) {
      const equipment = sampleEquipment.find(e => e.id === complaint.equipmentId);
      if (equipment) {
        newComplaint.equipmentName = equipment.name;
      }
    }
    
    const updatedComplaints = [...complaints, newComplaint];
    localStorage.setItem('complaints', JSON.stringify(updatedComplaints));
    return newComplaint;
  },

  getNotifications: async (): Promise<Notification[]> => {
    await new Promise(resolve => setTimeout(resolve, 400));
    return sampleNotifications;
  },

  markNotificationAsRead: async (id: string): Promise<void> => {
    await new Promise(resolve => setTimeout(resolve, 300));
  }
};

// Sample Data
const sampleEquipment: Equipment[] = [
  {
    id: '1',
    name: 'Dell Precision Workstation',
    type: 'COMPUTER',
    description: 'High-performance workstation for coding and virtualization',
    status: 'available',
    imageUrl: 'https://i0.wp.com/www.manalicomputers.in/wp-content/uploads/2023/01/WhatsApp-Image-2023-01-27-at-11.49.49-AM-1.jpeg?fit=580,580&ssl=1',
    location: 'Programming Lab 301',
    specifications: {
      processor: 'Intel Xeon E5-2690 v4',
      ram: '64GB DDR4',
      storage: '1TB NVMe SSD + 2TB HDD',
      gpu: 'NVIDIA Quadro RTX 5000',
    },
  },
  {
    id: '2',
    name: 'HP Z8 G4 Workstation',
    type: 'COMPUTER',
    description: 'Advanced workstation for design and simulation',
    status: 'booked',
    imageUrl: 'https://i.shgcdn.com/cb49679c-0272-4c26-bea4-f4026c16cfe6/-/format/auto/-/preview/3000x3000/-/quality/lighter/',
    location: 'Hardware Lab 306',
    specifications: {
      processor: 'Intel Xeon W-2295',
      ram: '128GB DDR4',
      storage: '2TB NVMe SSD',
      gpu: 'NVIDIA RTX A6000',
    },
  },
  // ... (rest of the sampleEquipment remains unchanged)
];

const sampleNotifications: Notification[] = [
  {
    id: '1',
    title: 'Booking Approved',
    message: 'Your booking for Oscilloscope OSC-2000 has been approved',
    date: '2025-03-10T10:30:00',
    read: false,
    icon: 'bell'
  },
  // ... (rest of the sampleNotifications remains unchanged)
];

const sampleBookings: Booking[] = [];

export default function StudentDashboard() {
  const [activeTab, setActiveTab] = useState<Tab>('dashboard');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<string>('all');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  const [stats, setStats] = useState({
    activeBookings: 0,
    availableEquipment: 0,
    upcomingReturns: 0,
    pendingComplaints: 0
  });

  const [equipment, setEquipment] = useState<Equipment[]>([]);
  const [isLoadingEquipment, setIsLoadingEquipment] = useState(false);
  const [selectedEquipment, setSelectedEquipment] = useState<Equipment | null>(null);
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [bookingDates, setBookingDates] = useState({ start: '', end: '' });

  const [bookings, setBookings] = useState<Booking[]>([]);
  const [isLoadingBookings, setIsLoadingBookings] = useState(false);
  const [bookingStatusFilter, setBookingStatusFilter] = useState<'all' | 'approved' | 'pending' | 'rejected'>('all');

  const [complaintForm, setComplaintForm] = useState({
    equipmentId: '',
    lab: '301',
    type: 'broken',
    description: '',
    file: null as File | null
  });
  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [isSubmittingComplaint, setIsSubmittingComplaint] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<{ success: boolean; message: string } | null>(null);
  const [isLoadingComplaints, setIsLoadingComplaints] = useState(false);

  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isLoadingNotifications, setIsLoadingNotifications] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);

  const labs = ['301', '302', '401', '404', '502', '503', '511', '311', '312', '317'];

  useEffect(() => {
    const loadData = async () => {
      switch (activeTab) {
        case 'dashboard':
          await loadDashboardData();
          break;
        case 'equipment':
          await loadEquipment();
          break;
        case 'bookings':
          await loadBookings();
          break;
        case 'notifications':
          await loadNotifications();
          break;
        case 'complaints':
          await loadComplaints();
          break;
      }
    };
    loadData();
  }, [activeTab]);

  const loadDashboardData = async () => {
    const [equipmentData, bookingsData, complaintsData] = await Promise.all([
      mockApi.getEquipment(),
      mockApi.getBookings(),
      mockApi.getComplaints()
    ]);

    setStats({
      activeBookings: bookingsData.filter(b => b.status === 'approved').length,
      availableEquipment: equipmentData.filter(e => e.status === 'available').length,
      upcomingReturns: bookingsData
        .filter(b => b.status === 'approved' && new Date(b.endDate) > new Date())
        .length,
      pendingComplaints: complaintsData.filter(c => c.status === 'pending').length
    });

    setEquipment(equipmentData.slice(0, 3));
    setComplaints(complaintsData);
  };

  const loadEquipment = async () => {
    setIsLoadingEquipment(true);
    try {
      const data = await mockApi.getEquipment();
      setEquipment(data);
    } finally {
      setIsLoadingEquipment(false);
    }
  };

  const loadBookings = async () => {
    setIsLoadingBookings(true);
    try {
      const data = await mockApi.getBookings();
      setBookings(data);
    } finally {
      setIsLoadingBookings(false);
    }
  };

  const loadComplaints = async () => {
    setIsLoadingComplaints(true);
    try {
      const data = await mockApi.getComplaints();
      setComplaints(data);
    } finally {
      setIsLoadingComplaints(false);
    }
  };

  const loadNotifications = async () => {
    setIsLoadingNotifications(true);
    try {
      const data = await mockApi.getNotifications();
      setNotifications(data);
      setUnreadCount(data.filter(n => !n.read).length);
    } finally {
      setIsLoadingNotifications(false);
    }
  };

  const handleBookingSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedEquipment) return;

    try {
      const newBooking = await mockApi.createBooking(selectedEquipment.id, bookingDates);
      setBookings(prev => [newBooking, ...prev]);
      setShowBookingModal(false);
      setSelectedEquipment(null);
      setBookingDates({ start: '', end: '' });
      setStats(prev => ({
        ...prev,
        activeBookings: prev.activeBookings + 1
      }));
    } catch (error) {
      console.error('Failed to create booking:', error);
    }
  };

  const handleCancelBooking = async (id: string) => {
    if (window.confirm('Are you sure you want to cancel this booking?')) {
      try {
        await mockApi.cancelBooking(id);
        setBookings(prev => prev.filter(b => b.id !== id));
        setStats(prev => ({
          ...prev,
          activeBookings: Math.max(0, prev.activeBookings - 1)
        }));
      } catch (error) {
        console.error('Failed to cancel booking:', error);
      }
    }
  };

  const handleComplaintSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmittingComplaint(true);
    setSubmitStatus(null);
    
    try {
      const imageUrl = complaintForm.file 
        ? URL.createObjectURL(complaintForm.file)
        : undefined;

      const complaintData = {
        equipmentId: complaintForm.equipmentId || undefined,
        lab: complaintForm.lab,
        type: complaintForm.type,
        description: complaintForm.description,
        ...(imageUrl && { imageUrl })
      };

      const newComplaint = await mockApi.submitComplaint(complaintData);
      setComplaints(prev => [newComplaint, ...prev]);
      setStats(prev => ({
        ...prev,
        pendingComplaints: prev.pendingComplaints + 1
      }));
      
      setSubmitStatus({
        success: true,
        message: 'Complaint submitted successfully!'
      });
      
      setComplaintForm({
        equipmentId: '',
        lab: '301',
        type: 'broken',
        description: '',
        file: null
      });
      
      setTimeout(() => setSubmitStatus(null), 3000);
    } catch (error) {
      console.error('Failed to submit complaint:', error);
      setSubmitStatus({
        success: false,
        message: 'Failed to submit complaint. Please try again.'
      });
    } finally {
      setIsSubmittingComplaint(false);
    }
  };

  const handleNotificationClick = async (id: string) => {
    await mockApi.markNotificationAsRead(id);
    setNotifications(prev =>
      prev.map(n => n.id === id ? { ...n, read: true } : n)
    );
    setUnreadCount(prev => Math.max(0, prev - 1));
  };

  const filteredEquipment = equipment.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = filterType === 'all' || item.type.toLowerCase() === filterType.toLowerCase();
    return matchesSearch && matchesType;
  });

  const filteredBookings = bookings.filter(booking => 
    bookingStatusFilter === 'all' || booking.status === bookingStatusFilter
  );

  const paginatedEquipment = filteredEquipment.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const totalPages = Math.ceil(filteredEquipment.length / itemsPerPage);

  const renderDashboard = () => (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-indig-500 to-blue-600 rounded-xl shadow-md p-6 text-white">
        <h2 className="text-2xl font-bold">Welcome back, Student!</h2>
        <p className="mt-2">You have {stats.activeBookings} active bookings and {stats.availableEquipment} available equipment to explore.</p>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <div className="bg-white rounded-lg shadow-md p-4">
          <div className="flex items-center">
            <div className="p-2 rounded-full bg-indigo-100 mr-3">
              <Bookmark className="h-5 w-5 text-indigo-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Active Bookings</p>
              <p className="text-xl font-semibold">{stats.activeBookings}</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-md p-4">
          <div className="flex items-center">
            <div className="p-2 rounded-full bg-green-100 mr-3">
              <Clock className="h-5 w-5 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Available Now</p>
              <p className="text-xl font-semibold">{stats.availableEquipment}</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-md p-4">
          <div className="flex items-center">
            <div className="p-2 rounded-full bg-yellow-100 mr-3">
              <Calendar className="h-5 w-5 text-yellow-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Upcoming Returns</p>
              <p className="text-xl font-semibold">{stats.upcomingReturns}</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-md p-4">
          <div className="flex items-center">
            <div className="p-2 rounded-full bg-red-100 mr-3">
              <AlertCircle className="h-5 w-5 text-red-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Pending Complaints</p>
              <p className="text-xl font-semibold">{stats.pendingComplaints}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-6">
        <div>
          <h3 className="text-lg font-semibold mb-4">Available Equipment</h3>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {equipment.filter(e => e.status === 'available').slice(0, 3).map((equipment) => (
              <motion.div
                key={equipment.id}
                whileHover={{ y: -5 }}
                className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-100"
              >
                <img src={equipment.imageUrl} alt={equipment.name} className="w-full h-48 object-cover" />
                <div className="p-5">
                  <div className="flex justify-between items-start">
                    <h3 className="text-lg font-semibold text-gray-900">{equipment.name}</h3>
                    <span className="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">
                      {equipment.type}
                    </span>
                  </div>
                  <p className="mt-2 text-sm text-gray-500">{equipment.description}</p>
                  <div className="mt-4 flex items-center justify-between">
                    <span className="text-sm text-gray-500">{equipment.location}</span>
                    <button 
                      onClick={() => {
                        setSelectedEquipment(equipment);
                        setShowBookingModal(true);
                      }}
                      className="inline-flex items-center px-3 py-1.5 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
                    >
                      <Clock className="h-4 w-4 mr-1.5" />
                      Book Now
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        <div>
          <h3 className="text-lg font-semibold mb-4">Recent Complaints</h3>
          <div className="bg-white shadow-md rounded-lg p-4">
            {complaints.length === 0 ? (
              <p className="text-gray-500 text-center">No recent complaints</p>
            ) : (
              <div className="space-y-4">
                {complaints.slice(0, 3).map(complaint => (
                  <div key={complaint.id} className="border-b pb-2">
                    <div className="flex justify-between items-center">
                      <p className="text-sm font-medium">
                        {complaint.equipmentName ? `${complaint.equipmentName} - ` : ''}{complaint.type}
                      </p>
                      <span className={`text-xs px-2 py-1 rounded-full ${
                        complaint.status === 'pending' ? 'bg-yellow-100 text-yellow-800' : 'bg-green-100 text-green-800'
                      }`}>
                        {complaint.status}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600">Lab {complaint.lab}</p>
                    <p className="text-sm text-gray-500">{complaint.description}</p>
                    <p className="text-xs text-gray-400">{complaint.date}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );

  const renderEquipment = () => (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <h2 className="text-2xl font-bold">Computer & Lab Equipment</h2>
        <div className="flex flex-col md:flex-row gap-3 w-full md:w-auto">
          <div className="relative flex-1">
            <input
              type="text"
              placeholder="Search equipment..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
          </div>
          <div className="flex gap-3">
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="all">All Types</option>
              <option value="computer">Computer</option>
              <option value="peripheral">Peripheral</option>
            </select>
            <button 
              onClick={() => {
                setSearchTerm('');
                setFilterType('all');
              }}
              className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50"
            >
              Reset
            </button>
          </div>
        </div>
      </div>

      {isLoadingEquipment ? (
        <div className="flex justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-indigo-600" />
        </div>
      ) : (
        <>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {paginatedEquipment.map((equipment) => (
              <motion.div
                key={equipment.id}
                whileHover={{ y: -5 }}
                className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-100"
              >
                <img src={equipment.imageUrl} alt={equipment.name} className="w-full h-48 object-cover" />
                <div className="p-5">
                  <div className="flex justify-between items-start">
                    <h3 className="text-lg font-semibold text-gray-900">{equipment.name}</h3>
                    <span className="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">
                      {equipment.type}
                    </span>
                  </div>
                  <p className="mt-2 text-sm text-gray-500">{equipment.description}</p>
                  <div className="mt-4">
                    <h4 className="text-sm font-medium text-gray-700">Specifications:</h4>
                    <ul className="mt-1 text-sm text-gray-500 space-y-1">
                      {Object.entries(equipment.specifications).map(([key, value]) => (
                        <li key={key} className="flex">
                          <span className="font-medium text-gray-600 mr-1">{key}:</span>
                          <span>{value}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="mt-4 flex items-center justify-between">
                    <span className="text-sm text-gray-500">{equipment.location}</span>
                    <button
                      onClick={() => {
                        setSelectedEquipment(equipment);
                        setShowBookingModal(true);
                      }}
                      disabled={equipment.status !== 'available'}
                      className={`inline-flex items-center px-3 py-1.5 border border-transparent text-sm font-medium rounded-md ${
                        equipment.status === 'available'
                          ? 'text-white bg-indigo-600 hover:bg-indigo-700'
                          : 'text-gray-400 bg-gray-100 cursor-not-allowed'
                      }`}
                    >
                      <Clock className="h-4 w-4 mr-1.5" />
                      {equipment.status === 'available' ? 'Book Now' : 'Unavailable'}
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {filteredEquipment.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-500">No equipment found matching your criteria.</p>
            </div>
          )}

          {totalPages > 1 && (
            <div className="flex justify-between items-center mt-6">
              <button
                onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                disabled={currentPage === 1}
                className="flex items-center px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ChevronLeft className="h-5 w-5 mr-1" />
                Previous
              </button>
              <span className="text-sm text-gray-700">
                Page {currentPage} of {totalPages}
              </span>
              <button
                onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                disabled={currentPage === totalPages}
                className="flex items-center px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Next
                <ChevronRight className="h-5 w-5 ml-1" />
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );

  const renderBookings = () => (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <h2 className="text-2xl font-bold">My Bookings</h2>
        <div className="flex gap-3 w-full md:w-auto">
          <select
            value={bookingStatusFilter}
            onChange={(e) => setBookingStatusFilter(e.target.value as any)}
            className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option value="all">All Statuses</option>
            <option value="approved">Approved</option>
            <option value="pending">Pending</option>
            <option value="rejected">Rejected</option>
          </select>
        </div>
      </div>
      
      {isLoadingBookings ? (
        <div className="flex justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-indigo-600" />
        </div>
      ) : (
        <div className="bg-white shadow-md rounded-lg overflow-hidden">
          {filteredBookings.length === 0 ? (
            <div className="p-6 text-center text-gray-500">
              You don't have any bookings yet.
            </div>
          ) : (
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  Redeleted: true
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Equipment</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Dates</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredBookings.map((booking) => (
                  <tr key={booking.id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10">
                          <img 
                            className="h-10 w-10 rounded-full object-cover" 
                            src={booking.imageUrl || sampleEquipment.find(e => e.id === booking.equipmentId)?.imageUrl} 
                            alt="" 
                          />
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">{booking.equipmentName}</div>
                          <div className="text-sm text-gray-500">{booking.studentName}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {new Date(booking.startDate).toLocaleDateString()} to {new Date(booking.endDate).toLocaleDateString()}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        booking.status === 'approved'
                          ? 'bg-green-100 text-green-800'
                          : booking.status === 'pending'
                          ? 'bg-yellow-100 text-yellow-800'
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {booking.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <button className="text-indigo-600 hover:text-indigo-900 mr-4">Details</button>
                      {booking.status === 'pending' && (
                        <button 
                          onClick={() => handleCancelBooking(booking.id)}
                          className="text-red-600 hover:text-red-900"
                        >
                          Cancel
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}
    </div>
  );

  const renderNotifications = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Notifications</h2>
        {unreadCount > 0 && (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800">
            {unreadCount} unread
          </span>
        )}
      </div>
      
      {isLoadingNotifications ? (
        <div className="flex justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-indigo-600" />
        </div>
      ) : (
        <div className="bg-white shadow-md rounded-lg overflow-hidden">
          {notifications.length === 0 ? (
            <div className="p-6 text-center text-gray-500">
              You don't have any notifications yet.
            </div>
          ) : (
            <div className="divide-y divide-gray-200">
              {notifications.map((notification) => (
                <div 
                  key={notification.id} 
                  className={`p-6 hover:bg-gray-50 cursor-pointer ${!notification.read ? 'bg-blue-50' : ''}`}
                  onClick={() => handleNotificationClick(notification.id)}
                >
                  <div className="flex items-start">
                    <div className={`flex-shrink-0 h-10 w-10 rounded-full flex items-center justify-center ${
                      notification.icon === 'bell' ? 'bg-blue-100 text-blue-600' :
                      notification.icon === 'clock' ? 'bg-green-100 text-green-600' :
                      'bg-red-100 text-red-600'
                    }`}>
                      {notification.icon === 'bell' ? (
                        <Bell className="h-5 w-5" />
                      ) : notification.icon === 'clock' ? (
                        <Clock className="h-5 w-5" />
                      ) : (
                        <AlertCircle className="h-5 w-5" />
                      )}
                    </div>
                    <div className="ml-4 flex-1">
                      <div className="flex items-center justify-between">
                        <p className={`text-sm font-medium ${
                          !notification.read ? 'text-gray-900' : 'text-gray-600'
                        }`}>
                          {notification.title}
                        </p>
                        <span className="text-xs text-gray-500">
                          {new Date(notification.date).toLocaleDateString()}
                        </span>
                      </div>
                      <p className="text-sm text-gray-500 mt-1">{notification.message}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );

  const renderComplaints = () => (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Submit a Complaint</h2>
      
      <div лицеlassName="bg-white shadow-md rounded-lg p-6">
        {submitStatus && (
          <div className={`mb-4 p-4 rounded-md ${
            submitStatus.success 
              ? 'bg-green-50 text-green-800' 
              : 'bg-red-50 text-red-800'
          }`}>
            <div className="flex items-center">
              {submitStatus.success ? (
                <CheckCircle className="h-5 w-5 mr-2" />
              ) : (
                <XCircle className="h-5 w-5 mr-2" />
              )}
              <p>{submitStatus.message}</p>
            </div>
          </div>
        )}
        
        <form className="space-y-4" onSubmit={handleComplaintSubmit}>
          <div>
            <label htmlFor="lab" className="block text-sm font-medium text-gray-700">
              Lab Location
            </label>
            <select
              id="lab"
              name="lab"
              value={complaintForm.lab}
              onChange={(e) => setComplaintForm(prev => ({ ...prev, lab: e.target.value }))}
              className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
            >
              {labs.map(lab => (
                <option key={lab} value={lab}>Lab {lab}</option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="equipmentId" className="block text-sm font-medium text-gray-700">
              Equipment (optional)
            </label>
            <select
              id="equipmentId"
              name="equipmentId"
              value={complaintForm.equipmentId}
              onChange={(e) => setComplaintForm(prev => ({ ...prev, equipmentId: e.target.value }))}
              className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
            >
              <option value="">Select equipment...</option>
              {sampleEquipment.map(equip => (
                <option key={equip.id} value={equip.id}>{equip.name}</option>
              ))}
            </select>
          </div>
          
          <div>
            <label htmlFor="type" className="block text-sm font-medium text-gray-700">
              Complaint Type
            </label>
            <select
              id="type"
              name="type"
              value={complaintForm.type}
              onChange={(e) => setComplaintForm(prev => ({ ...prev, type: e.target.value }))}
              className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
            >
              <option value="broken">Broken Equipment</option>
              <option value="missing">Missing Parts</option>
              <option value="cleanliness">Cleanliness Issue</option>
              <option value="software">Software Issue</option>
              <option value="other">Other</option>
            </select>
          </div>
          
          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700">
              Description
            </label>
            <textarea
              id="description"
              name="description"
              value={complaintForm.description}
              onChange={(e) => setComplaintForm(prev => ({ ...prev, description: e.target.value }))}
              rows={4}
              className="mt-1 block w-full shadow-sm sm:text-sm focus:ring-indigo-500 focus:border-indigo-500 border border-gray-300 rounded-md"
              placeholder="Please describe the issue in detail..."
              required
            ></textarea>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Upload Photo (optional)
            </label>
            <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
              <div className="space-y-1 text-center">
                {complaintForm.file ? (
                  <div className="flex flex-col items-center">
                    <img 
                      src={URL.createObjectURL(complaintForm.file)} 
                      alt="Preview" 
                      className="h-32 object-contain mb-2"
                    />
                    <button
                      type="button"
                      onClick={() => setComplaintForm(prev => ({ ...prev, file: null }))}
                      className="text-sm text-red-600 hover:text-red-800"
                    >
                      Remove
                    </button>
                  </div>
                ) : (
                  <>
                    <div className="flex text-sm text-gray-600">
                      <label
                        htmlFor="file-upload"
                        className="relative cursor-pointer bg-white rounded-md font-medium text-indigo-600 hover:text-indigo-500 focus-within:outline-none"
                      >
                        <span>Upload a file</span>
                        <input 
                          id="file-upload" 
                          name="file-upload" 
                          type="file" 
                          className="sr-only" 
                          onChange={(e) => {
                            if (e.target.files && e.target.files[0]) {
                              setComplaintForm(prev => ({
                                ...prev,
                                file: e.target.files![0]
                              }));
                            }
                          }}
                          accept="image/*"
                        />
                      </label>
                      <p className="pl-1">or drag and drop</p>
                    </div>
                    <p className="text-xs text-gray-500">
                      PNG, JPG, GIF up to 10MB
                    </p>
                  </>
                )}
              </div>
            </div>
          </div>
          
          <div className="pt-4">
            <button
              type="submit"
              disabled={isSubmittingComplaint}
              className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmittingComplaint ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Submitting...
                </>
              ) : (
                'Submit Complaint'
              )}
            </button>
          </div>
        </form>
      </div>
      
      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
          <h3 className="text-lg font-medium">My Previous Complaints</h3>
          <button 
            onClick={loadComplaints}
            disabled={isLoadingComplaints}
            className="text-sm text-indigo-600 hover:text-indigo-800 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoadingComplaints ? 'Refreshing...' : 'Refresh'}
          </button>
        </div>
        
        {isLoadingComplaints && complaints.length === 0 ? (
          <div className="p-6 flex justify-center">
            <Loader2 className="h-6 w-6 animate-spin text-gray-400" />
          </div>
        ) : complaints.length === 0 ? (
          <div className="p-6 text-center text-gray-500">
            You haven't submitted any complaints yet.
          </div>
        ) : (
          <div className="divide-y divide-gray-200">
            {complaints.map(complaint => (
              <div key={complaint.id} className="px-6 py-4">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <h4 className="text-sm font-medium text-gray-900">
                        {complaint.equipmentName 
                          ? `${complaint.equipmentName} - ${complaint.type}`
                          : complaint.type}
                      </h4>
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        complaint.status === 'pending'
                          ? 'bg-yellow-100 text-yellow-800'
                          : 'bg-green-100 text-green-800'
                      }`}>
                        {complaint.status}
                      </span>
                    </div>
                    <p className="mt-1 text-sm text-gray-500">Lab {complaint.lab} - Submitted on {complaint.date}</p>
                    <p className="mt-2 text-sm text-gray-600">{complaint.description}</p>
                    
                    {complaint.imageUrl && (
                      <div className="mt-3">
                        <img 
                          src={complaint.imageUrl} 
                          alt="Complaint evidence" 
                          className="h-32 object-contain rounded border border-gray-200"
                        />
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );

  const BookingModal = () => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold">Book {selectedEquipment?.name}</h3>
          <button 
            onClick={() => {
              setShowBookingModal(false);
              setSelectedEquipment(null);
            }}
            className="text-gray-500 hover:text-gray-700"
          >
            <XCircle className="h-6 w-6" />
          </button>
        </div>
        
        <form onSubmit={handleBookingSubmit}>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Start Date</label>
              <input
                type="date"
                value={bookingDates.start}
                onChange={(e) => setBookingDates(prev => ({ ...prev, start: e.target.value }))}
                min={new Date().toISOString().split('T')[0]}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700">End Date</label>
              <input
                type="date"
                value={bookingDates.end}
                onChange={(e) => setBookingDates(prev => ({ ...prev, end: e.target.value }))}
                min={bookingDates.start || new Date().toISOString().split('T')[0]}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                required
              />
            </div>
            
            <div className="pt-4 flex justify-end space-x-3">
              <button
                type="button"
                onClick={() => {
                  setShowBookingModal(false);
                  setSelectedEquipment(null);
                }}
                className="inline-flex justify-center py-2 px-4 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Submit Booking
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-screen bg-gray-50"
    >
      <div className="flex">
        <div className="w-64 bg-white shadow-md fixed h-screen">
          <div className="p-4">
            <h1 className="text-2xl font-bold text-indigo-600">Vignan University</h1>
            <p className="text-sm text-gray-500">Student Dashboard</p>
          </div>
          <nav className="mt-6">
            <button
              onClick={() => setActiveTab('dashboard')}
              className={`w-full flex items-center px-4 py-3 text-sm ${
                activeTab === 'dashboard'
                  ? 'bg-indigo-50 text-indigo-600 border-r-4 border-indigo-600'
                  : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              <Home className="h-5 w-5 mr-3" />
              Dashboard
            </button>
            <button
              onClick={() => setActiveTab('equipment')}
              className={`w-full flex items-center px-4 py-3 text-sm ${
                activeTab === 'equipment'
                  ? 'bg-indigo-50 text-indigo-600 border-r-4 border-indigo-600'
                  : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              <BookOpen className="h-5 w-5 mr-3" />
              Equipment
            </button>
            <button
              onClick={() => setActiveTab('bookings')}
              className={`w-full flex items-center px-4 py-3 text-sm ${
                activeTab === 'bookings'
                  ? 'bg-indigo-50 text-indigo-600 border-r-4 border-indigo-600'
                  : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              <Bookmark className="h-5 w-5 mr-3" />
              My Bookings
            </button>
            <button
              onClick={() => setActiveTab('notifications')}
              className={`w-full flex items-center px-4 py-3 text-sm ${
                activeTab === 'notifications'
                  ? 'bg-indigo-50 text-indigo-600 border-r-4 border-indigo-600'
                  : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              <div className="relative">
                <Bell className="h-5 w-5 mr-3" />
                {unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-red-500 text-white text-xs flex items-center justify-center">
                    {unreadCount}
                  </span>
                )}
              </div>
              Notifications
            </button>
            <button
              onClick={() => setActiveTab('complaints')}
              className={`w-full flex items-center px-4 py-3 text-sm ${
                activeTab === 'complaints'
                  ? 'bg-indigo-50 text-indigo-600 border-r-4 border-indigo-600'
                  : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              <AlertCircle className="h-5 w-5 mr-3" />
              Complaints
            </button>
          </nav>
          <div className="absolute bottom-0 w-full p-4 border-t border-gray-200">
            <button className="w-full flex items-center px-4 py-2 text-sm text-gray-600 hover:bg-gray-50">
              <Settings className="h-5 w-5 mr-3" />
              Settings
            </button>
            <button className="w-full flex items-center px-4 py-2 text-sm text-gray-600 hover:bg-gray-50">
              <HelpCircle className="h-5 w-5 mr-3" />
              Help
            </button>
            <button className="w-full flex items-center px-4 py-2 text-sm text-gray-600 hover:bg-gray-50">
              <LogOut className="h-5 w-5 mr-3" />
              Sign Out
            </button>
          </div>
        </div>

        <div className="ml-64 flex-1 p-8">
          {activeTab === 'dashboard' && renderDashboard()}
          {activeTab === 'equipment' && renderEquipment()}
          {activeTab === 'bookings' && renderBookings()}
          {activeTab === 'notifications' && renderNotifications()}
          {activeTab === 'complaints' && renderComplaints()}
        </div>
      </div>

      {showBookingModal && selectedEquipment && <BookingModal />}
    </motion.div>
  );
}