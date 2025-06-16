import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Edit, Info, Trash2, Save, ArrowUp, UserPlus, Clock, Plus,
  LayoutGrid, Users, ClipboardList, Settings, Search, Filter, 
  PenTool, AlertTriangle, Server, Network, Database, Monitor, 
  HardDrive, Download, BarChart, Calendar, ChevronDown, Bell,
  UserCircle, HelpCircle, Menu, X, Home, BookOpen, LifeBuoy,
  LogOut, ChevronRight, ChevronLeft, AlertCircle, Mail, MessageSquare
} from 'lucide-react';

// Define types
type Equipment = {
  id: string;
  name: string;
  type: EquipmentType;
  category: LabCategory;
  description: string;
  status: 'available' | 'in-use' | 'maintenance';
  imageUrl: string;
  specifications: Record<string, string>;
  quantity: number;
  location: string;
  manufacturer: string;
  model: string;
  lastMaintenance: string;
  nextMaintenance: string;
};

type Request = {
  id: string;
  userId: string;
  equipmentId: string;
  status: 'pending' | 'approved' | 'rejected';
  requestDate: string;
  duration: number;
  purpose: string;
};

type MaintenanceLog = {
  id: string;
  equipmentId: string;
  date: string;
  technician: string;
  description: string;
  status: 'completed' | 'scheduled' | 'in-progress';
};

type LabCategory = 'PROGRAMMING' | 'NETWORKING' | 'HARDWARE' | 'GENERAL';

type EquipmentType = 'COMPUTER' | 'NETWORK_DEVICE' | 'SERVER' | 'STORAGE' | 'PERIPHERAL' | 'OTHER';

type SoftwareLicense = {
  id: string;
  name: string;
  vendor: string;
  type: 'floating' | 'site' | 'node-locked';
  totalLicenses: number;
  availableLicenses: number;
  expiryDate: string;
  features: string[];
};

type LabUsageStats = {
  labId: string;
  category: LabCategory;
  totalEquipment: number;
  activeBookings: number;
  maintenanceCount: number;
  utilizationRate: number;
  peakHours: string[];
};

type Complaint = {
  id: string;
  studentId: string;
  studentName: string;
  studentEmail: string;
  equipmentId?: string;
  equipmentName?: string;
  complaintType: 'equipment' | 'facility' | 'other';
  title: string;
  description: string;
  status: 'pending' | 'in-progress' | 'resolved' | 'rejected';
  createdAt: string;
  resolvedAt?: string;
  adminComment?: string;
};

type Tab = 'overview' | 'equipment' | 'software' | 'requests' | 'maintenance' | 'reports' | 'complain-box' | 'settings';

const EquipmentTypeEnum: Record<EquipmentType, string> = {
  COMPUTER: 'Computer',
  NETWORK_DEVICE: 'CPU',
  SERVER: 'Server',
  STORAGE: 'Storage',
  PERIPHERAL: 'MOUSE',
  OTHER: 'Other'
};

// Sample data
const sampleEquipment: Equipment[] = [
  {
    id: '1',
    name: 'Dell Precision Workstation',
    type: 'COMPUTER',
    category: 'PROGRAMMING',
    description: 'High-performance workstation for coding and virtualization',
    status: 'available',
    imageUrl: 'https://i0.wp.com/www.manalicomputers.in/wp-content/uploads/2023/01/WhatsApp-Image-2023-01-27-at-11.49.49-AM-1.jpeg?fit=580,580&ssl=1',
    specifications: {
      processor: 'Intel Xeon E5-2690 v4',
      ram: '64GB DDR4',
      storage: '1TB NVMe SSD + 2TB HDD',
      gpu: 'NVIDIA Quadro RTX 5000',
    },
    quantity: 20,
    location: 'Programming Lab 301',
    manufacturer: 'Dell',
    model: 'Precision 7920',
    lastMaintenance: '2025-01-10',
    nextMaintenance: '2025-07-10',
  },
  {
    id: '2',
    name: 'HP Z8 G4 Workstation',
    type: 'COMPUTER',
    category: 'HARDWARE',
    description: 'Advanced workstation for design and simulation',
    status: 'in-use',
    imageUrl: 'https://i.shgcdn.com/cb49679c-0272-4c26-bea4-f4026c16cfe6/-/format/auto/-/preview/3000x3000/-/quality/lighter/',
    specifications: {
      processor: 'Intel Xeon W-2295',
      ram: '128GB DDR4',
      storage: '2TB NVMe SSD',
      gpu: 'NVIDIA RTX A6000',
    },
    quantity: 10,
    location: 'Hardware Lab 306',
    manufacturer: 'HP',
    model: 'Z8 G4',
    lastMaintenance: '2025-02-15',
    nextMaintenance: '2025-08-15',
  },
  {
    id: '3',
    name: 'Dell OptiPlex Desktop',
    type: 'COMPUTER',
    category: 'GENERAL',
    description: 'Reliable desktop for general-purpose computing',
    status: 'available',
    imageUrl: 'https://encrypted-tbn3.gstatic.com/shopping?q=tbn:ANd9GcQDWfsjI70NZcgGjy1xUEUShcS99vXTMo3qQy3OOJr5igEm_VsNMCteAclxy0ibJXCU4Ce-Rnni-4vaIJKGmQKFCHLxeEc9w9X3zwkkVzpIexey0PklLgUlHS4FZhZcYPbn3w&usqp=CAc',
    specifications: {
      processor: 'Intel Core i7-13700',
      ram: '32GB DDR5',
      storage: '1TB SSD',
    },
    quantity: 25,
    location: 'General Lab 304',
    manufacturer: 'Dell',
    model: 'OptiPlex 7010',
    lastMaintenance: '2025-03-01',
    nextMaintenance: '2025-09-01',
  },
  {
    id: '4',
    name: 'Logitech MX Keys',
    type: 'PERIPHERAL',
    category: 'GENERAL',
    description: 'Premium wireless keyboard for efficient typing',
    status: 'available',
    imageUrl: 'https://images.unsplash.com/photo-1618384887929-16ec33fab9ef?ixlib=rb-4.0.3&auto=format&fit=crop&w=1350&q=80',
    specifications: {
      connection: 'Bluetooth/USB',
      layout: 'QWERTY',
      battery: 'Rechargeable',
    },
    quantity: 50,
    location: 'Storage Room A',
    manufacturer: 'Logitech',
    model: 'MX Keys',
    lastMaintenance: '2025-01-20',
    nextMaintenance: 'N/A',
  },
  {
    id: '5',
    name: 'Logitech MX Master Mouse',
    type: 'PERIPHERAL',
    category: 'GENERAL',
    description: 'Ergonomic wireless mouse for precise navigation',
    status: 'available',
    imageUrl: 'https://djd1xqjx2kdnv.cloudfront.net/photos/38/32/504691_29920_XL.jpg',
    specifications: {
      connection: 'Bluetooth/USB',
      dpi: '4000',
      battery: 'Rechargeable',
    },
    quantity: 50,
    location: 'Storage Room A',
    manufacturer: 'Logitech',
    model: 'MX Master 3S',
    lastMaintenance: '2025-01-20',
    nextMaintenance: 'N/A',
  },
  {
    id: '6',
    name: 'HP EliteDesk CPU',
    type: 'COMPUTER',
    category: 'PROGRAMMING',
    description: 'Compact desktop for programming tasks',
    status: 'available',
    imageUrl: 'https://aonecomputers.in/wp-content/uploads/2025/01/9f53ed3c2f0dd7f945f59f445459e6a8-md-1.jpg.webp',
    specifications: {
      processor: 'Intel Core i5-13500',
      ram: '16GB DDR5',
      storage: '512GB SSD',
    },
    quantity: 15,
    location: 'Programming Lab 401',
    manufacturer: 'HP',
    model: 'EliteDesk 800 G9',
    lastMaintenance: '2025-02-10',
    nextMaintenance: '2025-08-10',
  },
  {
    id: '7',
    name: 'Dell KB216 Keyboard',
    type: 'PERIPHERAL',
    category: 'GENERAL',
    description: 'Durable wired keyboard for lab use',
    status: 'available',
    imageUrl: 'https://m.media-amazon.com/images/I/61-kTKQuDUL._AC_UF1000,1000_QL80_.jpg',
    specifications: {
      connection: 'USB',
      layout: 'QWERTY',
    },
    quantity: 60,
    location: 'Storage Room B',
    manufacturer: 'Dell',
    model: 'KB216',
    lastMaintenance: '2025-03-05',
    nextMaintenance: 'N/A',
  },
  {
    id: '8',
    name: 'Dell MS116 Mouse',
    type: 'PERIPHERAL',
    category: 'GENERAL',
    description: 'Simple wired mouse for everyday use',
    status: 'available',
    imageUrl: 'https://i.ebayimg.com/images/g/nDIAAOSwL1tjyGwv/s-l400.png',
    specifications: {
      connection: 'USB',
      dpi: '1000',
    },
    quantity: 60,
    location: 'Storage Room B',
    manufacturer: 'Dell',
    model: 'MS116',
    lastMaintenance: '2025-03-05',
    nextMaintenance: 'N/A',
  },
];

const sampleSoftwareLicenses: SoftwareLicense[] = [
  {
    id: '1',
    name: 'Visual Studio Enterprise',
    vendor: 'Microsoft',
    type: 'floating',
    totalLicenses: 100,
    availableLicenses: 85,
    expiryDate: '2025-12-31',
    features: ['All IDE features', 'Azure Credits', 'Professional Tools'],
  },
  {
    id: '2',
    name: 'MATLAB',
    vendor: 'MathWorks',
    type: 'site',
    totalLicenses: 500,
    availableLicenses: 500,
    expiryDate: '2025-08-31',
    features: ['All Toolboxes', 'Simulink', 'Parallel Computing'],
  },
];

const sampleLabStats: LabUsageStats[] = [
  {
    labId: '1',
    category: 'PROGRAMMING',
    totalEquipment: 50,
    activeBookings: 35,
    maintenanceCount: 2,
    utilizationRate: 0.85,
    peakHours: ['10:00', '14:00', '16:00'],
  },
  {
    labId: '2',
    category: 'NETWORKING',
    totalEquipment: 30,
    activeBookings: 20,
    maintenanceCount: 1,
    utilizationRate: 0.75,
    peakHours: ['11:00', '15:00'],
  },
];

const sampleRequests: Request[] = [
  {
    id: '1',
    userId: 'user123',
    equipmentId: '1',
    status: 'pending',
    requestDate: '2025-03-01',
    duration: 7,
    purpose: 'Software development project'
  },
  {
    id: '2',
    userId: 'user456',
    equipmentId: '2',
    status: 'approved',
    requestDate: '2025-02-28',
    duration: 3,
    purpose: 'Research lab assignment'
  }
];

const sampleMaintenanceLogs: MaintenanceLog[] = [
  {
    id: '1',
    equipmentId: '1',
    date: '2025-02-15',
    technician: 'John Smith',
    description: 'Routine maintenance and cleaning',
    status: 'completed'
  },
  {
    id: '2',
    equipmentId: '2',
    date: '2025-03-10',
    technician: 'Sarah Johnson',
    description: 'Firmware update scheduled',
    status: 'scheduled'
  }
];

const sampleComplaints: Complaint[] = [
  {
    id: '1',
    studentId: 's12345',
    studentName: 'Suman Shekhar',
    studentEmail: 'john.doe@university.edu',
    equipmentId: '1',
    equipmentName: 'Dell Precision Workstation',
    complaintType: 'equipment',
    title: 'Keyboard not working',
    description: 'The keyboard on workstation #5 in Programming Lab 101 is not responding. Several keys are stuck.',
    status: 'pending',
    createdAt: '2025-03-15T10:30:00'
  },
  {
    id: '2',
    studentId: 's67890',
    studentName: 'jahanvi ',
    studentEmail: 'jane.smith@university.edu',
    complaintType: 'facility',
    title: 'Air conditioning issue',
    description: 'The air conditioning in Networking Lab 102 is not working properly. The room gets very hot during afternoon sessions.',
    status: 'in-progress',
    createdAt: '2025-03-14T14:45:00',
    adminComment: 'Technician scheduled for March 18'
  },
  {
    id: '3',
    studentId: 's54321',
    studentName: 'Divya ',
    studentEmail: 'alex.johnson@university.edu',
    equipmentId: '3',
    equipmentName: 'HP Z8 G4 Workstation',
    complaintType: 'equipment',
    title: 'Software installation request',
    description: 'Need MATLAB installed on workstation #3 in Hardware Lab 103 for my final project.',
    status: 'resolved',
    createdAt: '2025-03-10T09:15:00',
    resolvedAt: '2025-03-12T11:20:00',
    adminComment: 'Software installed and tested'
  },
  {
    id: '4',
    studentId: 's98765',
    studentName: 'Amrutha',
    studentEmail: 'sarah.williams@university.edu',
    complaintType: 'other',
    title: 'Noise disturbance',
    description: 'Students from the adjacent lab are being too loud during our sessions, making it hard to concentrate.',
    status: 'pending',
    createdAt: '2025-03-16T16:30:00'
  }
];

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState<Tab>('overview');
  const [searchTerm, setSearchTerm] = useState('');
  
  // Equipment tab state
  const [equipmentList, setEquipmentList] = useState<Equipment[]>(sampleEquipment);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editedItem, setEditedItem] = useState<Partial<Equipment>>({});
  const [showAddForm, setShowAddForm] = useState(false);
  const [newEquipment, setNewEquipment] = useState<Omit<Equipment, 'id' | 'specifications'>>({
    name: '',
    type: 'COMPUTER',
    category: 'GENERAL',
    description: '',
    status: 'available',
    imageUrl: '',
    specifications: {},
    quantity: 1,
    location: '',
    manufacturer: '',
    model: '',
    lastMaintenance: new Date().toISOString().split('T')[0],
    nextMaintenance: ''
  });

  // Complaints state
  const [complaints, setComplaints] = useState<Complaint[]>(sampleComplaints);
  const [selectedComplaint, setSelectedComplaint] = useState<Complaint | null>(null);
  const [adminComment, setAdminComment] = useState('');
  const [newStatus, setNewStatus] = useState<'pending' | 'in-progress' | 'resolved' | 'rejected'>('pending');
  const [showComplaintForm, setShowComplaintForm] = useState(false);
  const [newComplaint, setNewComplaint] = useState<Omit<Complaint, 'id' | 'createdAt' | 'status'>>({
    studentId: '',
    studentName: '',
    studentEmail: '',
    complaintType: 'equipment',
    title: '',
    description: '',
    equipmentId: undefined,
    equipmentName: undefined
  });

  const filteredEquipment = equipmentList.filter(item => 
    item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredComplaints = complaints.filter(complaint => 
    complaint.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    complaint.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    complaint.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (complaint.equipmentName && complaint.equipmentName.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  // Equipment handlers
  const handleDelete = (id: string) => {
    setEquipmentList(equipmentList.filter(item => item.id !== id));
  };

  const handleEditStart = (item: Equipment) => {
    setEditingId(item.id);
    setEditedItem({ ...item });
  };

  const handleEditSave = () => {
    if (editingId) {
      setEquipmentList(equipmentList.map(item => 
        item.id === editingId ? { ...item, ...editedItem } as Equipment : item
      ));
      setEditingId(null);
    }
  };

  const handleEditCancel = () => {
    setEditingId(null);
  };

  const handleEditChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setEditedItem(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleNewEquipmentChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setNewEquipment(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleAddEquipment = () => {
    const newId = (Math.max(...equipmentList.map(item => parseInt(item.id))) + 1).toString();
    setEquipmentList([
      ...equipmentList,
      {
        ...newEquipment,
        id: newId,
        specifications: newEquipment.specifications || {}
      } as Equipment
    ]);
    setShowAddForm(false);
    setNewEquipment({
      name: '',
      type: 'COMPUTER',
      category: 'GENERAL',
      description: '',
      status: 'available',
      imageUrl: '',
      specifications: {},
      quantity: 1,
      location: '',
      manufacturer: '',
      model: '',
      lastMaintenance: new Date().toISOString().split('T')[0],
      nextMaintenance: ''
    });
  };

  // Complaint handlers
  const handleComplaintStatusUpdate = (complaintId: string) => {
    if (!adminComment && newStatus !== 'pending') return;
    
    setComplaints(complaints.map(complaint => {
      if (complaint.id === complaintId) {
        const updatedComplaint = {
          ...complaint,
          status: newStatus,
          adminComment: newStatus !== 'pending' ? adminComment : complaint.adminComment
        };
        
        if (newStatus === 'resolved') {
          updatedComplaint.resolvedAt = new Date().toISOString();
        }
        
        return updatedComplaint;
      }
      return complaint;
    }));
    
    setSelectedComplaint(null);
    setAdminComment('');
    setNewStatus('pending');
  };

  const handleSubmitComplaint = () => {
    const newComplaintObj: Complaint = {
      ...newComplaint,
      id: `comp-${complaints.length + 1}`,
      status: 'pending',
      createdAt: new Date().toISOString()
    };
    
    setComplaints([...complaints, newComplaintObj]);
    setShowComplaintForm(false);
    setNewComplaint({
      studentId: '',
      studentName: '',
      studentEmail: '',
      complaintType: 'equipment',
      title: '',
      description: '',
      equipmentId: undefined,
      equipmentName: undefined
    });
  };

  const handleComplaintDelete = (id: string) => {
    setComplaints(complaints.filter(complaint => complaint.id !== id));
  };

  const renderOverview = () => (
    <div className="grid gap-6 mb-8 md:grid-cols-2 xl:grid-cols-4">
      {/* Total Equipment Card */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.1 }}
        whileHover={{ y: -5 }}
        className="min-w-0 rounded-lg shadow-lg overflow-hidden bg-white border border-gray-100 hover:shadow-xl transition-all duration-300"
      >
        <div className="p-4 flex items-center">
          <div className="p-3 rounded-full bg-indigo-100 mr-4 text-indigo-600 shadow-md">
            <Monitor className="h-6 w-6" />
          </div>
          <div>
            <p className="mb-1 text-sm font-medium text-gray-500 uppercase tracking-wider">
              Total Equipment
            </p>
            <p className="text-2xl font-bold text-gray-800">
              {sampleEquipment.reduce((acc, curr) => acc + curr.quantity, 0)}
            </p>
            <div className="mt-1 text-xs text-indigo-600 font-medium">
              <span className="inline-flex items-center">
                <ArrowUp className="h-3 w-3 mr-1" />
                12% from last month
              </span>
            </div>
          </div>
        </div>
        <div className="bg-indigo-50 px-4 py-2 text-xs text-indigo-700">
          Updated just now
        </div>
      </motion.div>
  
      {/* Software Licenses Card */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.2 }}
        whileHover={{ y: -5 }}
        className="min-w-0 rounded-lg shadow-lg overflow-hidden bg-white border border-gray-100 hover:shadow-xl transition-all duration-300"
      >
        <div className="p-4 flex items-center">
          <div className="p-3 rounded-full bg-green-100 mr-4 text-green-600 shadow-md">
            <Download className="h-6 w-6" />
          </div>
          <div>
            <p className="mb-1 text-sm font-medium text-gray-500 uppercase tracking-wider">
              Software Licenses
            </p>
            <p className="text-2xl font-bold text-gray-800">
              {sampleSoftwareLicenses.length}
            </p>
            <div className="mt-1 text-xs text-green-600 font-medium">
              <span className="inline-flex items-center">
                <ArrowUp className="h-3 w-3 mr-1" />
                5 new this month
              </span>
            </div>
          </div>
        </div>
        <div className="bg-green-50 px-4 py-2 text-xs text-green-700">
          Includes all active licenses
        </div>
      </motion.div>
  
      {/* Active Users Card */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.3 }}
        whileHover={{ y: -5 }}
        className="min-w-0 rounded-lg shadow-lg overflow-hidden bg-white border border-gray-100 hover:shadow-xl transition-all duration-300"
      >
        <div className="p-4 flex items-center">
          <div className="p-3 rounded-full bg-blue-100 mr-4 text-blue-600 shadow-md">
            <Users className="h-6 w-6" />
          </div>
          <div>
            <p className="mb-1 text-sm font-medium text-gray-500 uppercase tracking-wider">
              Active Users
            </p>
            <p className="text-2xl font-bold text-gray-800">
              156
            </p>
            <div className="mt-1 text-xs text-blue-600 font-medium">
              <span className="inline-flex items-center">
                <UserPlus className="h-3 w-3 mr-1" />
                8 new this week
              </span>
            </div>
          </div>
        </div>
        <div className="bg-blue-50 px-4 py-2 text-xs text-blue-700">
          Currently logged in users
        </div>
      </motion.div>
  
      {/* Pending Requests Card */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.4 }}
        whileHover={{ y: -5 }}
        className="min-w-0 rounded-lg shadow-lg overflow-hidden bg-white border border-gray-100 hover:shadow-xl transition-all duration-300"
      >
        <div className="p-4 flex items-center">
          <div className="p-3 rounded-full bg-yellow-100 mr-4 text-yellow-600 shadow-md">
            <AlertTriangle className="h-6 w-6" />
          </div>
          <div>
            <p className="mb-1 text-sm font-medium text-gray-500 uppercase tracking-wider">
              Pending Requests
            </p>
            <p className="text-2xl font-bold text-gray-800">
              {sampleRequests.filter(r => r.status === 'pending').length}
            </p>
            <div className="mt-1 text-xs text-yellow-600 font-medium">
              <span className="inline-flex items-center">
                <Clock className="h-3 w-3 mr-1" />
                Requires attention
              </span>
            </div>
          </div>
        </div>
        <div className="bg-yellow-50 px-4 py-2 text-xs text-yellow-700">
          Average resolution time: 2 days
        </div>
      </motion.div>
    </div>
  );

  const renderTabContent = () => {
    switch (activeTab) {
      case 'overview':
        return (
          <div className="space-y-8">
            <div className="pb-2 border-b border-gray-200">
              <h2 className="text-3xl font-bold text-gray-800">Dashboard Overview</h2>
            </div>
  
            {renderOverview()}
  
            <div className="grid gap-8 md:grid-cols-2">
              <div className="p-6 bg-white rounded-xl shadow-md transition-all hover:shadow-lg">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xl font-semibold text-gray-800">
                    Lab Utilization
                  </h3>
                  <div className="px-3 py-1 text-sm font-medium bg-indigo-100 text-indigo-800 rounded-full">
                    Real-time
                  </div>
                </div>
                
                <div className="space-y-6">
                  {sampleLabStats.map((stat) => (
                    <div key={stat.labId} className="mb-4">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium text-gray-600">
                          {stat.category} Lab
                        </span>
                        <span className="text-sm font-medium text-gray-800">
                          {Math.round(stat.utilizationRate * 100)}%
                        </span>
                      </div>
                      <div className="w-full h-2.5 bg-gray-100 rounded-full">
                        <div
                          className="h-2.5 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full"
                          style={{ width: `${stat.utilizationRate * 100}%` }}
                        ></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
  
              <div className="p-6 bg-white rounded-xl shadow-md transition-all hover:shadow-lg">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xl font-semibold text-gray-800">
                    Equipment Status
                  </h3>
                  <div className="px-3 py-1 text-sm font-medium bg-green-100 text-green-800 rounded-full">
                    Inventory
                  </div>
                </div>
                
                <div className="space-y-4">
                  {Object.entries(EquipmentTypeEnum).map(([key, value]) => {
                    const count = sampleEquipment.filter(e => e.type === key).reduce((acc, curr) => acc + curr.quantity, 0);
                    return (
                      <div key={key} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div className="flex items-center">
                          <div className="p-2 mr-3 bg-blue-100 rounded-lg">
                            <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                            </svg>
                          </div>
                          <span className="font-medium text-gray-700">{value}</span>
                        </div>
                        <span className="px-3 py-1 text-sm font-semibold bg-white text-gray-800 rounded-full shadow-sm">
                          {count} units
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        );
  
      case 'equipment':
        return (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold">IT Equipment Management</h2>
              <button 
                onClick={() => setShowAddForm(true)}
                className="bg-indigo-600 text-white px-4 py-2 rounded-md flex items-center hover:bg-indigo-700 transition-colors"
              >
                <Plus className="h-5 w-5 mr-2" />
                Add Equipment
              </button>
            </div>
            
            <div className="flex gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search equipment..."
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <button className="flex items-center px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors">
                <Filter className="h-5 w-5 mr-2" />
                Filter
              </button>
            </div>
      
            {showAddForm && (
              <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
                <h3 className="text-lg font-semibold mb-4">Add New Equipment</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                    <input
                      type="text"
                      name="name"
                      value={newEquipment.name}
                      onChange={handleNewEquipmentChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
                    <select
                      name="type"
                      value={newEquipment.type}
                      onChange={handleNewEquipmentChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    >
                      {Object.entries(EquipmentTypeEnum).map(([key, value]) => (
                        <option key={key} value={key}>{value}</option>
                      ))}
                    </select>
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                    <textarea
                      name="description"
                      value={newEquipment.description}
                      onChange={handleNewEquipmentChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Quantity</label>
                    <input
                      type="number"
                      name="quantity"
                      value={newEquipment.quantity}
                      onChange={handleNewEquipmentChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                    <select
                      name="status"
                      value={newEquipment.status}
                      onChange={handleNewEquipmentChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    >
                      <option value="available">Available</option>
                      <option value="in-use">In Use</option>
                      <option value="maintenance">Maintenance</option>
                    </select>
                  </div>
                </div>
                <div className="mt-4 flex justify-end gap-2">
                  <button
                    onClick={() => setShowAddForm(false)}
                    className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleAddEquipment}
                    className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors"
                  >
                    Save Equipment
                  </button>
                </div>
              </div>
            )}
      
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {filteredEquipment.map((equipment) => (
                <motion.div
                  key={equipment.id}
                  initial={{ scale: 0.95, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  whileHover={{ y: -5 }}
                  className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-100"
                >
                  <div className="relative">
                    <img
                      src={equipment.imageUrl}
                      alt={equipment.name}
                      className="w-full h-48 object-cover"
                    />
                    <span className="absolute top-2 right-2 bg-white/90 text-xs font-medium px-2 py-1 rounded">
                      Qty: {equipment.quantity}
                    </span>
                  </div>
                  <div className="p-6">
                    {editingId === equipment.id ? (
                      <div className="space-y-4">
                        <input
                          type="text"
                          name="name"
                          value={editedItem.name || ''}
                          onChange={handleEditChange}
                          className="w-full px-2 py-1 border border-gray-300 rounded"
                        />
                        <select
                          name="status"
                          value={editedItem.status || 'available'}
                          onChange={handleEditChange}
                          className="w-full px-2 py-1 border border-gray-300 rounded"
                        >
                          <option value="available">Available</option>
                          <option value="in-use">In Use</option>
                          <option value="maintenance">Maintenance</option>
                        </select>
                        <input
                          type="number"
                          name="quantity"
                          value={editedItem.quantity || 0}
                          onChange={handleEditChange}
                          className="w-full px-2 py-1 border border-gray-300 rounded"
                        />
                        <textarea
                          name="description"
                          value={editedItem.description || ''}
                          onChange={handleEditChange}
                          className="w-full px-2 py-1 border border-gray-300 rounded"
                        />
                      </div>
                    ) : (
                      <>
                        <div className="flex justify-between items-start">
                          <h3 className="text-lg font-semibold text-gray-900">
                            {equipment.name}
                          </h3>
                          <span className="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">
                            {EquipmentTypeEnum[equipment.type]}
                          </span>
                        </div>
                        <p className="mt-2 text-sm text-gray-500">
                          {equipment.description}
                        </p>
                        <div className="mt-4 grid grid-cols-2 gap-4 text-sm">
                          <div>
                            <span className="text-gray-500">Location:</span>
                            <span className="ml-2 font-medium">{equipment.location}</span>
                          </div>
                          <div>
                            <span className="text-gray-500">Last Maint:</span>
                            <span className="ml-2 font-medium">
                              {equipment.lastMaintenance}
                            </span>
                          </div>
                          <div>
                            <span className="text-gray-500">Status:</span>
                            <span
                              className={`ml-2 font-medium ${
                                equipment.status === 'available'
                                  ? 'text-green-600'
                                  : equipment.status === 'in-use'
                                  ? 'text-blue-600'
                                  : 'text-red-600'
                              }`}
                            >
                              {equipment.status}
                            </span>
                          </div>
                        </div>
                      </>
                    )}
                    <div className="mt-6 flex justify-between">
                      {editingId === equipment.id ? (
                        <>
                          <button
                            onClick={handleEditCancel}
                            className="text-gray-600 hover:text-gray-800 text-sm font-medium flex items-center"
                          >
                            <X className="h-4 w-4 mr-1" />
                            Cancel
                          </button>
                          <button
                            onClick={handleEditSave}
                            className="text-indigo-600 hover:text-indigo-800 text-sm font-medium flex items-center"
                          >
                            <Save className="h-4 w-4 mr-1" />
                            Save
                          </button>
                        </>
                      ) : (
                        <>
                          <button
                            onClick={() => handleEditStart(equipment)}
                            className="text-indigo-600 hover:text-indigo-800 text-sm font-medium flex items-center"
                          >
                            <Edit className="h-4 w-4 mr-1" />
                            Edit
                          </button>
                          <button className="text-gray-600 hover:text-gray-800 text-sm font-medium flex items-center">
                            <Info className="h-4 w-4 mr-1" />
                            Details
                          </button>
                          <button
                            onClick={() => handleDelete(equipment.id)}
                            className="text-red-600 hover:text-red-800 text-sm font-medium flex items-center"
                          >
                            <Trash2 className="h-4 w-4 mr-1" />
                            Remove
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        );

      case 'software':
        return (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold">Software Licenses</h2>
              <button className="bg-indigo-600 text-white px-4 py-2 rounded-md flex items-center hover:bg-indigo-700">
                <Plus className="h-5 w-5 mr-2" />
                Add License
              </button>
            </div>
            <div className="bg-white shadow-md rounded-lg overflow-hidden">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Vendor</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Licenses</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Expiry</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {sampleSoftwareLicenses.map((license) => (
                    <tr key={license.id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {license.name}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {license.vendor}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {license.type}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {license.availableLicenses}/{license.totalLicenses}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {license.expiryDate}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        <button className="text-indigo-600 hover:text-indigo-900 mr-4">
                          View
                        </button>
                        <button className="text-indigo-600 hover:text-indigo-900">
                          Edit
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        );

      case 'complain-box':
        return (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold">Complaint Management</h2>
              <button 
                onClick={() => setShowComplaintForm(true)}
                className="bg-indigo-600 text-white px-4 py-2 rounded-md flex items-center hover:bg-indigo-700 transition-colors"
              >
                <Plus className="h-5 w-5 mr-2" />
                Add Complaint
              </button>
            </div>
            
            {showComplaintForm && (
              <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
                <h3 className="text-lg font-semibold mb-4">Submit New Complaint</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Student ID</label>
                    <input
                      type="text"
                      name="studentId"
                      value={newComplaint.studentId}
                      onChange={(e) => setNewComplaint({...newComplaint, studentId: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Student Name</label>
                    <input
                      type="text"
                      name="studentName"
                      value={newComplaint.studentName}
                      onChange={(e) => setNewComplaint({...newComplaint, studentName: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Student Email</label>
                    <input
                      type="email"
                      name="studentEmail"
                      value={newComplaint.studentEmail}
                      onChange={(e) => setNewComplaint({...newComplaint, studentEmail: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Complaint Type</label>
                    <select
                      name="complaintType"
                      value={newComplaint.complaintType}
                      onChange={(e) => setNewComplaint({...newComplaint, complaintType: e.target.value as any})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    >
                      <option value="equipment">Equipment Issue</option>
                      <option value="facility">Facility Issue</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                  {newComplaint.complaintType === 'equipment' && (
                    <>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Equipment ID</label>
                        <input
                          type="text"
                          name="equipmentId"
                          value={newComplaint.equipmentId || ''}
                          onChange={(e) => setNewComplaint({...newComplaint, equipmentId: e.target.value})}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Equipment Name</label>
                        <input
                          type="text"
                          name="equipmentName"
                          value={newComplaint.equipmentName || ''}
                          onChange={(e) => setNewComplaint({...newComplaint, equipmentName: e.target.value})}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md"
                        />
                      </div>
                    </>
                  )}
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                    <input
                      type="text"
                      name="title"
                      value={newComplaint.title}
                      onChange={(e) => setNewComplaint({...newComplaint, title: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md"
                      required
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                    <textarea
                      name="description"
                      value={newComplaint.description}
                      onChange={(e) => setNewComplaint({...newComplaint, description: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md"
                      rows={4}
                      required
                    />
                  </div>
                </div>
                <div className="mt-4 flex justify-end gap-2">
                  <button
                    onClick={() => setShowComplaintForm(false)}
                    className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSubmitComplaint}
                    className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors"
                  >
                    Submit Complaint
                  </button>
                </div>
              </div>
            )}
            
            <div className="bg-white shadow-md rounded-lg overflow-hidden">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Student</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Title</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredComplaints.map((complaint) => (
                    <tr key={complaint.id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {complaint.id}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {complaint.studentName}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {complaint.title}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {complaint.complaintType}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            complaint.status === 'pending'
                              ? 'bg-yellow-100 text-yellow-800'
                              : complaint.status === 'in-progress'
                              ? 'bg-blue-100 text-blue-800'
                              : complaint.status === 'resolved'
                              ? 'bg-green-100 text-green-800'
                              : 'bg-red-100 text-red-800'
                          }`}
                        >
                          {complaint.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(complaint.createdAt).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        <button 
                          onClick={() => setSelectedComplaint(complaint)}
                          className="text-indigo-600 hover:text-indigo-900 mr-4"
                        >
                          View
                        </button>
                        <button
                          onClick={() => handleComplaintDelete(complaint.id)}
                          className="text-red-600 hover:text-red-900"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            
            {/* Complaint Detail Modal */}
            {selectedComplaint && (
              <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                  <div className="p-6">
                    <div className="flex justify-between items-start">
                      <h3 className="text-xl font-bold text-gray-800">{selectedComplaint.title}</h3>
                      <button 
                        onClick={() => setSelectedComplaint(null)}
                        className="text-gray-500 hover:text-gray-700"
                      >
                        <X className="h-6 w-6" />
                      </button>
                    </div>
                    
                    <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm font-medium text-gray-500">Student Information</p>
                        <p className="mt-1 text-sm text-gray-900">
                          {selectedComplaint.studentName} ({selectedComplaint.studentId})
                        </p>
                        <p className="text-sm text-gray-900">{selectedComplaint.studentEmail}</p>
                      </div>
                      
                      <div>
                        <p className="text-sm font-medium text-gray-500">Complaint Details</p>
                        <p className="mt-1 text-sm text-gray-900">
                          Type: {selectedComplaint.complaintType}
                        </p>
                        {selectedComplaint.equipmentName && (
                          <p className="text-sm text-gray-900">
                            Equipment: {selectedComplaint.equipmentName} ({selectedComplaint.equipmentId})
                          </p>
                        )}
                        <p className="text-sm text-gray-900">
                          Submitted: {new Date(selectedComplaint.createdAt).toLocaleString()}
                        </p>
                        {selectedComplaint.resolvedAt && (
                          <p className="text-sm text-gray-900">
                            Resolved: {new Date(selectedComplaint.resolvedAt).toLocaleString()}
                          </p>
                        )}
                      </div>
                    </div>
                    
                    <div className="mt-4">
                      <p className="text-sm font-medium text-gray-500">Description</p>
                      <p className="mt-1 text-sm text-gray-900 whitespace-pre-line">
                        {selectedComplaint.description}
                      </p>
                    </div>
                    
                    {selectedComplaint.adminComment && (
                      <div className="mt-4">
                        <p className="text-sm font-medium text-gray-500">Admin Response</p>
                        <p className="mt-1 text-sm text-gray-900 whitespace-pre-line">
                          {selectedComplaint.adminComment}
                        </p>
                      </div>
                    )}
                    
                    <div className="mt-6">
                      <p className="text-sm font-medium text-gray-500 mb-2">Update Status</p>
                      <div className="flex flex-col md:flex-row gap-4">
                        <select
                          value={newStatus}
                          onChange={(e) => setNewStatus(e.target.value as any)}
                          className="flex-1 px-3 py-2 border border-gray-300 rounded-md"
                        >
                          <option value="pending">Pending</option>
                          <option value="in-progress">In Progress</option>
                          <option value="resolved">Resolved</option>
                          <option value="rejected">Rejected</option>
                        </select>
                        
                        <textarea
                          placeholder="Add comment or resolution details..."
                          value={adminComment}
                          onChange={(e) => setAdminComment(e.target.value)}
                          className="flex-1 px-3 py-2 border border-gray-300 rounded-md"
                          rows={2}
                        />
                        
                        <button
                          onClick={() => handleComplaintStatusUpdate(selectedComplaint.id)}
                          className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
                        >
                          Update
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        );

      case 'requests':
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold">Equipment Requests</h2>
            <div className="bg-white shadow-md rounded-lg overflow-hidden">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Request ID
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      User ID
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Equipment
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {sampleRequests.map((request) => (
                    <tr key={request.id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {request.id}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {request.userId}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {sampleEquipment.find(e => e.id === request.equipmentId)?.name || request.equipmentId}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            request.status === 'pending'
                              ? 'bg-yellow-100 text-yellow-800'
                              : request.status === 'approved'
                              ? 'bg-green-100 text-green-800'
                              : 'bg-red-100 text-red-800'
                          }`}
                        >
                          {request.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        <button className="text-indigo-600 hover:text-indigo-900 mr-4">
                          View Details
                        </button>
                        {request.status === 'pending' && (
                          <>
                            <button className="text-green-600 hover:text-green-900 mr-4">
                              Approve
                            </button>
                            <button className="text-red-600 hover:text-red-900">
                              Reject
                            </button>
                          </>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        );

      case 'maintenance':
        return (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold">Maintenance Logs</h2>
              <button className="bg-indigo-600 text-white px-4 py-2 rounded-md flex items-center hover:bg-indigo-700">
                <Plus className="h-5 w-5 mr-2" />
                Schedule Maintenance
              </button>
            </div>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {sampleMaintenanceLogs.map((log) => (
                <div
                  key={log.id}
                  className="bg-white rounded-lg shadow-md p-6 space-y-4"
                >
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold">
                      {sampleEquipment.find(e => e.id === log.equipmentId)?.name || log.equipmentId}
                    </h3>
                    <span
                      className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        log.status === 'completed'
                          ? 'bg-green-100 text-green-800'
                          : log.status === 'scheduled'
                          ? 'bg-blue-100 text-blue-800'
                          : 'bg-yellow-100 text-yellow-800'
                      }`}
                    >
                      {log.status}
                    </span>
                  </div>
                  <div className="space-y-2">
                    <p className="text-sm text-gray-500">
                      <span className="font-medium">Date:</span> {log.date}
                    </p>
                    <p className="text-sm text-gray-500">
                      <span className="font-medium">Technician:</span>{' '}
                      {log.technician}
                    </p>
                    <p className="text-sm text-gray-500">
                      <span className="font-medium">Description:</span>{' '}
                      {log.description}
                    </p>
                  </div>
                  <div className="pt-4 flex justify-end">
                    <button className="text-indigo-600 hover:text-indigo-800 text-sm">
                      Update Status
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );

      case 'reports':
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold">Reports</h2>
            <div className="grid gap-6 md:grid-cols-2">
              <div className="bg-white p-6 rounded-lg shadow-md">
                <h3 className="text-lg font-semibold mb-4">Equipment Utilization</h3>
                <div className="h-64 bg-gray-100 rounded flex items-center justify-center">
                  <p className="text-gray-500">Chart will be displayed here</p>
                </div>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-md">
                <h3 className="text-lg font-semibold mb-4">Maintenance History</h3>
                <div className="h-64 bg-gray-100 rounded flex items-center justify-center">
                  <p className="text-gray-500">Chart will be displayed here</p>
                </div>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-md md:col-span-2">
                <h3 className="text-lg font-semibold mb-4">Recent Activities</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded">
                    <p className="text-sm">New equipment added - Dell Precision Workstation</p>
                    <span className="text-xs text-gray-500">2 days ago</span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded">
                    <p className="text-sm">Maintenance completed for Cisco Network Lab Kit</p>
                    <span className="text-xs text-gray-500">1 week ago</span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded">
                    <p className="text-sm">5 new software license requests approved</p>
                    <span className="text-xs text-gray-500">2 weeks ago</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      case 'settings':
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold">System Settings</h2>
            <div className="bg-white shadow-md rounded-lg p-6">
              <div className="space-y-4">
                <h3 className="text-lg font-medium">General Settings</h3>
                <div className="grid gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Maximum Booking Duration (days)
                    </label>
                    <input
                      type="number"
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                      defaultValue={14}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Maintenance Reminder (days before)
                    </label>
                    <input
                      type="number"
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                      defaultValue={7}
                    />
                  </div>
                </div>
              </div>
              <div className="mt-8 space-y-4">
                <h3 className="text-lg font-medium">Notification Settings</h3>
                <div className="space-y-2">
                  <div className="flex items-center">
                    <input
                      id="email-notifications"
                      type="checkbox"
                      className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                      defaultChecked
                    />
                    <label htmlFor="email-notifications" className="ml-2 block text-sm text-gray-700">
                      Email notifications
                    </label>
                  </div>
                  <div className="flex items-center">
                    <input
                      id="push-notifications"
                      type="checkbox"
                      className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                      defaultChecked
                    />
                    <label htmlFor="push-notifications" className="ml-2 block text-sm text-gray-700">
                      Push notifications
                    </label>
                  </div>
                </div>
              </div>
              <div className="mt-8">
                <button className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700">
                  Save Settings
                </button>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex">
        {/* Sidebar */}
        <div className="w-60 bg-white shadow-md fixed h-screen">
        <div className="p-2 flex justify-center items-center">
  <h1 className="text-2xl font-bold text-indigo-600 text-center">
    Vignan's <br /> University
  </h1>
</div>
          <nav className="mt-4">
            <button
              onClick={() => setActiveTab('overview')}
              className={`w-full flex items-center px-4 py-2 text-sm ${
                activeTab === 'overview'
                  ? 'bg-indigo-50 text-indigo-600'
                  : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              <BarChart className="h-5 w-5 mr-2" />
              Overview
            </button>
            <button
              onClick={() => setActiveTab('equipment')}
              className={`w-full flex items-center px-4 py-2 text-sm ${
                activeTab === 'equipment'
                  ? 'bg-indigo-50 text-indigo-600'
                  : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              <Monitor className="h-5 w-5 mr-2" />
              Equipment
            </button>
            <button
              onClick={() => setActiveTab('software')}
              className={`w-full flex items-center px-4 py-2 text-sm ${
                activeTab === 'software'
                  ? 'bg-indigo-50 text-indigo-600'
                  : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              <HardDrive className="h-5 w-5 mr-2" />
              Software
            </button>
            <button
              onClick={() => setActiveTab('requests')}
              className={`w-full flex items-center px-4 py-2 text-sm ${
                activeTab === 'requests'
                  ? 'bg-indigo-50 text-indigo-600'
                  : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              <ClipboardList className="h-5 w-5 mr-2" />
              Requests
            </button>
            <button
              onClick={() => setActiveTab('maintenance')}
              className={`w-full flex items-center px-4 py-2 text-sm ${
                activeTab === 'maintenance'
                  ? 'bg-indigo-50 text-indigo-600'
                  : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              <PenTool className="h-5 w-5 mr-2" />
              Maintenance
            </button>
            <button
              onClick={() => setActiveTab('reports')}
              className={`w-full flex items-center px-4 py-2 text-sm ${
                activeTab === 'reports'
                  ? 'bg-indigo-50 text-indigo-600'
                  : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              <BarChart className="h-5 w-5 mr-2" />
              Reports
            </button>
            <button
              onClick={() => setActiveTab('complain-box')}
              className={`w-full flex items-center px-4 py-2 text-sm ${
                activeTab === 'complain-box'
                  ? 'bg-indigo-50 text-indigo-600'
                  : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              <AlertCircle className="h-5 w-5 mr-2" />
              Complain Box
            </button>
            <button
              onClick={() => setActiveTab('settings')}
              className={`w-full flex items-center px-4 py-2 text-sm ${
                activeTab === 'settings'
                  ? 'bg-indigo-50 text-indigo-600'
                  : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              <Settings className="h-5 w-5 mr-2" />
              Settings
            </button>
          </nav>
        </div>

        {/* Main content */}
        <div className="ml-64 flex-1 p-8">
          <div className="mb-8 flex items-center justify-between">
            <div className="flex-1 max-w-xl">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
                <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <button className="flex items-center px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50">
                <Filter className="h-5 w-5 mr-2" />
                Filter
              </button>
              {activeTab !== 'complain-box' && (
                <button className="flex items-center px-4 py-2 bg-yellow-100 text-yellow-800 rounded-md hover:bg-yellow-200">
                  <AlertTriangle className="h-5 w-5 mr-2" />
                  Pending Requests ({sampleRequests.filter(r => r.status === 'pending').length})
                </button>
              )}
              {activeTab === 'complain-box' && (
                <button className="flex items-center px-4 py-2 bg-yellow-100 text-yellow-800 rounded-md hover:bg-yellow-200">
                  <AlertTriangle className="h-5 w-5 mr-2" />
                  Pending Complaints ({complaints.filter(c => c.status === 'pending').length})
                </button>
              )}
            </div>
          </div>

          {renderTabContent()}
        </div>
      </div>
    </div>
  );
}