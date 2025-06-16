import { motion, AnimatePresence } from 'framer-motion';
import { 
  Microscope, Clock, CheckCircle, BookOpen, 
  Phone, Mail, MapPin, Facebook, Twitter, 
  Linkedin, Youtube, FlaskConical, Laptop2, 
  ChevronLeft, ChevronRight
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';

// University images for slideshow
const universityImages = [
  {
    src: "https://vignan.ac.in/images/course/btechit.jpg",
    alt: "Vignan University IT Department"
  },
  {
    src: "https://vignan.ac.in/images/course/phdca.jpg",
    alt: "Vignan University Computer Applications"
  },
  {
    src: "https://vignan.ac.in/images/course/bca.jpg",
    alt: "Vignan University BCA Program"
  },
  {
    src: "https://vignan.ac.in/hyd/assets/img/CSE3.jpg",
    alt: "Vignan University CSE Department"
  }
];

// Features and other data remain the same
const features = [
  {
    icon: <Microscope className="h-6 w-6" />,
    title: 'Advanced Equipment',
    description: 'Access to state-of-the-art laboratory equipment for your research needs',
  },
  {
    icon: <Clock className="h-6 w-6" />,
    title: 'Easy Booking',
    description: 'Simple and quick equipment reservation system',
  },
  {
    icon: <CheckCircle className="h-6 w-6" />,
    title: 'Real-time Status',
    description: 'Track equipment availability and maintenance status in real-time',
  },
  {
    icon: <BookOpen className="h-6 w-6" />,
    title: 'Documentation',
    description: 'Comprehensive guides and documentation for all equipment',
  },
];

const labEquipment = [
  {
    icon: <FlaskConical className="h-6 w-6" />,
    title: 'Reserch Lab (302)',
    description: 'High-performance systems for computational analysis',
    category: 'Computer Lab'
  },
  {
    icon: <Laptop2 className="h-6 w-6" />,
    title: 'All in one System lab (304,305,402,405)',
    description: 'Computer programming lab with modern workstations',
    category: 'CSE Department'
  },
  {
    icon: <Laptop2 className="h-6 w-6" />,
    title: 'Normal System  Lab (401,504)',
    description: 'High-end systems for graphics and design work',
    category: 'Computer Science'
  },
  {
    icon: <Laptop2 className="h-6 w-6" />,
    title: 'Computer Lab (101,102)',
    description: 'High-performance computing for research projects',
    category: 'Research Lab'
  },
];

const quickLinks = [
  { title: 'About Us', href: '/about' },
  { title: 'Facilities', href: '/facilities' },
  { title: 'Research Labs', href: '/labs' },
  { title: 'Student Portal', href: '/dashboard' },
  { title: 'Faculty', href: '/faculty' },
  { title: 'Contact', href: '/contact' },
];

const departments = [
  'Computer Science & Engineering',
  'Information Technology',
  'Electronics & Communication',
  'Electrical Engineering',
  'Mechanical Engineering',
  'Civil Engineering',
];

// Image slideshow component
const ImageSlideshow = ({ images }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => 
        (prevIndex + 1) % images.length
      );
    }, 5000);
    return () => clearInterval(interval);
  }, [images.length]);

  const goToPrevious = () => {
    setCurrentIndex((prevIndex) => 
      prevIndex === 0 ? images.length - 1 : prevIndex - 1
    );
  };

  const goToNext = () => {
    setCurrentIndex((prevIndex) => 
      (prevIndex + 1) % images.length
    );
  };

  return (
    <div className="relative w-full h-64 md:h-96 overflow-hidden rounded-lg shadow-xl">
      <AnimatePresence initial={false}>
        <motion.img
          key={currentIndex}
          src={images[currentIndex].src}
          alt={images[currentIndex].alt}
          initial={{ opacity: 0, x: 100 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -100 }}
          transition={{ duration: 0.5 }}
          className="absolute inset-0 w-full h-full object-cover"
          onError={(e) => console.log('Image failed to load:', images[currentIndex].src)}
        />
      </AnimatePresence>
      
      <div className="absolute inset-0 bg-gradient-to-t from-gray-900/70 to-transparent" />
      
      <button 
        onClick={goToPrevious}
        className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/30 text-white p-2 rounded-full hover:bg-black/50 transition-all z-10"
      >
        <ChevronLeft className="h-6 w-6" />
      </button>
      
      <button 
        onClick={goToNext}
        className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/30 text-white p-2 rounded-full hover:bg-black/50 transition-all z-10"
      >
        <ChevronRight className="h-6 w-6" />
      </button>
      
      <div className="absolute bottom-4 left-0 right-0 flex justify-center space-x-2 z-10">
        {images.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentIndex(index)}
            className={`h-2 w-2 rounded-full transition-all ${
              index === currentIndex ? 'bg-white w-6' : 'bg-white/50'
            }`}
          />
        ))}
      </div>
    </div>
  );
};

export default function HomePage() {
  const [heroIndex, setHeroIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setHeroIndex((prevIndex) => 
        (prevIndex + 1) % universityImages.length
      );
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative bg-white overflow-hidden">
      {/* Hero section with slideshow background */}
      <div className="relative pt-6 pb-16 sm:pb-24">
        <div className="absolute inset-0 overflow-hidden -z-10">
          <AnimatePresence initial={false}>
            <motion.img
              key={heroIndex}
              src={universityImages[heroIndex].src}
              alt={universityImages[heroIndex].alt}
              initial={{ opacity: 0, x: 100 }}
              animate={{ opacity: 0.2, x: 0 }}
              exit={{ opacity: 0, x: -100 }}
              transition={{ duration: 0.5 }}
              className="w-full h-full object-cover"
              onError={(e) => console.log('Hero image failed to load:', universityImages[heroIndex].src)}
            />
          </AnimatePresence>
          <div className="absolute inset-0 bg-gradient-to-b from-indigo-900/10 to-indigo-900/30" />
        </div>

        <div className="absolute bottom-4 left-0 right-0 flex justify-center space-x-2 z-10">
          {universityImages.map((_, index) => (
            <button
              key={index}
              onClick={() => setHeroIndex(index)}
              className={`h-2 w-2 rounded-full transition-all ${
                index === heroIndex ? 'bg-white w-6' : 'bg-white/50'
              }`}
            />
          ))}
        </div>

        <main className="mt-16 mx-auto max-w-7xl px-4 sm:mt-24 relative z-10">
          <div className="text-center">
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-4xl tracking-tight font-extrabold text-gray-900 sm:text-5xl md:text-6xl"
            >
              <span className="block">Vignan University</span>
              <span className="block text-indigo-600">Lab Management System</span>
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="mt-3 max-w-md mx-auto text-base text-gray-700 sm:text-lg md:mt-5 md:text-xl md:max-w-3xl"
            >
              Empowering research and innovation through advanced laboratory resource management
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="mt-5 max-w-md mx-auto sm:flex sm:justify-center md:mt-8"
            >
              <div className="rounded-md shadow">
                <Link
                  to="/login"
                  className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 md:py-4 md:text-lg md:px-10"
                >
                  Get Started
                </Link>
              </div>
              <div className="mt-3 rounded-md shadow sm:mt-0 sm:ml-3">
                <a
                  href="#features"
                  className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-indigo-600 bg-white hover:bg-gray-50 md:py-4 md:text-lg md:px-10"
                >
                  Learn More
                </a>
              </div>
            </motion.div>
          </div>
        </main>
      </div>

      {/* Features section */}
      <div id="features" className="relative bg-gray-50 py-16 sm:py-24 lg:py-32">
        <div className="mx-auto max-w-md px-4 text-center sm:max-w-3xl sm:px-6 lg:max-w-7xl lg:px-8">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-base font-semibold uppercase tracking-wider text-indigo-600"
          >
            Everything you need
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="mt-2 text-3xl font-extrabold text-gray-900 tracking-tight sm:text-4xl"
          >
            Comprehensive Lab Management
          </motion.p>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="mt-5 max-w-prose mx-auto text-xl text-gray-500"
          >
            Our system provides everything you need to manage your laboratory equipment efficiently
          </motion.p>
          <div className="mt-12">
            <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
              {features.map((feature, index) => (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.8, delay: index * 0.2 }}
                  className="pt-6"
                >
                  <div className="flow-root bg-white rounded-lg px-6 pb-8 shadow-md hover:shadow-lg transition-shadow">
                    <div className="-mt-6">
                      <div>
                        <span className="inline-flex items-center justify-center p-3 bg-indigo-500 rounded-md shadow-lg text-white">
                          {feature.icon}
                        </span>
                      </div>
                      <h3 className="mt-8 text-lg font-medium text-gray-900 tracking-tight">
                        {feature.title}
                      </h3>
                      <p className="mt-5 text-base text-gray-500">{feature.description}</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* University Image Slideshow */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <ImageSlideshow images={universityImages} />
      </div>

      {/* Lab Equipment Section */}
      <div className="relative bg-indigo-50 py-16 sm:py-24 lg:py-32">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="text-base font-semibold uppercase tracking-wider text-indigo-600"
            >
              Vignan University
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="mt-2 text-3xl font-extrabold text-gray-900 tracking-tight sm:text-4xl"
            >
              Featured Lab Equipment
            </motion.p>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="mt-5 max-w-prose mx-auto text-xl text-gray-600"
            >
              Explore our state-of-the-art laboratory equipment available for research and academic purposes
            </motion.p>
          </div>

          <div className="mt-12">
            <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
              {labEquipment.map((equipment, index) => (
                <motion.div
                  key={equipment.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.8, delay: index * 0.2 }}
                  whileHover={{ y: -5 }}
                  className="flex flex-col rounded-xl bg-white shadow-lg overflow-hidden transition-all hover:shadow-xl"
                >
                  <div className="flex-1 p-6">
                    <div className="flex items-center justify-center h-12 w-12 rounded-md bg-indigo-500 text-white mx-auto">
                      {equipment.icon}
                    </div>
                    <h3 className="mt-4 text-lg font-medium text-center text-gray-900">
                      {equipment.title}
                    </h3>
                    <p className="mt-2 text-base text-gray-500 text-center">
                      {equipment.description}
                    </p>
                  </div>
                  <div className="px-6 py-4 bg-gray-50 border-t border-gray-100">
                    <div className="flex items-center justify-center">
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800">
                        {equipment.category}
                      </span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="mt-12 text-center"
          >
            <Link
              to="/equipment"
              className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700"
            >
              View All Equipment
              <svg className="ml-3 -mr-1 h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </Link>
          </motion.div>
        </div>
      </div>

      {/* Stats section */}
      <div className="relative bg-white">
        <div className="h-80 absolute inset-x-0 bottom-0 xl:top-0 xl:h-full">
          <div className="h-full w-full xl:grid xl:grid-cols-2">
            <div className="h-full xl:relative xl:col-start-2">
              <img
                className="h-full w-full object-cover opacity-25 xl:absolute xl:inset-0"
                src="https://vignan.ac.in/newvignan/assets/images/DepartmentHomeImages/diplomahome.jpg"
                alt="Vignan University Labs"
              />
              <div
                aria-hidden="true"
                className="absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-gray-50 xl:inset-y-0 xl:left-0 xl:h-full xl:w-32 xl:bg-gradient-to-r"
              />
            </div>
          </div>
        </div>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:max-w-7xl lg:px-8 xl:grid xl:grid-cols-2 xl:grid-flow-col-dense xl:gap-x-8">
          <div className="relative pt-12 pb-64 sm:pt-24 sm:pb-64 xl:col-start-1 xl:pb-24">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="text-sm font-semibold text-indigo-600 tracking-wide uppercase"
            >
              Valuable Metrics
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="mt-3 text-3xl font-extrabold text-gray-900"
            >
              Better understand your lab usage
            </motion.p>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="mt-5 text-lg text-gray-500"
            >
              Get detailed insights into equipment usage, maintenance schedules, and resource allocation.
              Make data-driven decisions to optimize your laboratory operations.
            </motion.p>
            <div className="mt-12 grid grid-cols-1 gap-y-12 gap-x-6 sm:grid-cols-2">
              {[
                { id: 1, stat: '8K+', label: 'Students served' },
                { id: 2, stat: '25+', label: 'Lab equipment types' },
                { id: 3, stat: '98%', label: 'Equipment uptime' },
                { id: 4, stat: '12hrs', label: 'Average response time' },
              ].map((item, index) => (
                <motion.p
                  key={item.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.8, delay: 0.2 + index * 0.2 }}
                >
                  <span className="block text-2xl font-bold text-indigo-600">
                    {item.stat}
                  </span>
                  <span className="mt-1 block text-base text-gray-500">
                    <span className="font-medium text-gray-900">{item.label}</span>
                  </span>
                </motion.p>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-900 text-white mt-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div>
              <h3 className="text-lg font-semibold mb-4">Contact Us</h3>
              <ul className="space-y-3">
                <li className="flex items-start">
                  <MapPin className="h-5 w-5 mr-2 mt-1 text-indigo-400" />
                  <span>Vignan's Foundation for Science, Technology & Research (Deemed to be University), Vadlamudi, Guntur, Andhra Pradesh 522213</span>
                </li>
                <li className="flex items-center">
                  <Phone className="h-5 w-5 mr-2 text-indigo-400" />
                  <span>+91 863 234 4700</span>
                </li>
                <li className="flex items-center">
                  <Mail className="h-5 w-5 mr-2 text-indigo-400" />
                  <span>labsupport@vignan.ac.in</span>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
              <ul className="space-y-2">
                {quickLinks.map((link) => (
                  <li key={link.title}>
                    <Link
                      to={link.href}
                      className="hover:text-indigo-400 transition-colors"
                    >
                      {link.title}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-4">Departments</h3>
              <ul className="space-y-2">
                {departments.map((dept) => (
                  <li key={dept}>
                    <Link
                      to="#"
                      className="hover:text-indigo-400 transition-colors"
                    >
                      {dept}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-4">Connect with Us</h3>
              <div className="flex space-x-4">
                <a href="#" className="hover:text-indigo-400 transition-colors">
                  <Facebook className="h-6 w-6" />
                </a>
                <a href="#" className="hover:text-indigo-400 transition-colors">
                  <Twitter className="h-6 w-6" />
                </a>
                <a href="#" className="hover:text-indigo-400 transition-colors">
                  <Linkedin className="h-6 w-6" />
                </a>
                <a href="#" className="hover:text-indigo-400 transition-colors">
                  <Youtube className="h-6 w-6" />
                </a>
              </div>
              <div className="mt-6">
                <h4 className="text-sm font-semibold mb-2">Newsletter</h4>
                <form className="flex">
                  <input
                    type="email"
                    placeholder="Enter your email"
                    className="flex-1 px-4 py-2 rounded-l-md text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                  <button
                    type="submit"
                    className="px-4 py-2 bg-indigo-600 rounded-r-md hover:bg-indigo-700 transition-colors"
                  >
                    Subscribe
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-800">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <div className="md:flex md:items-center md:justify-between">
              <div className="text-sm text-gray-400">
                © {new Date().getFullYear()} Vignan University Lab Management System. All rights reserved.
              </div>
              <div className="mt-4 md:mt-0">
                <ul className="flex space-x-6 text-sm text-gray-400">
                  <li>
                    <Link to="#" className="hover:text-indigo-400 transition-colors">
                      Privacy Policy
                    </Link>
                  </li>
                  <li>
                    <Link to="#" className="hover:text-indigo-400 transition-colors">
                      Terms of Service
                    </Link>
                  </li>
                  <li>
                    <Link to="#" className="hover:text-indigo-400 transition-colors">
                      Cookie Policy
                    </Link>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}