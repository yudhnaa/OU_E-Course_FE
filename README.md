# E-Course Frontend

A modern, feature-rich online learning platform built with React that provides comprehensive course management, interactive learning experiences, and seamless payment integration. This platform enables students to browse courses, enroll, learn through video lessons, complete exercises and tests, and earn certificates.

<div align="center">
    <img src="https://github.com/user-attachments/assets/d0c7ea30-45be-4479-8a12-a2a024f6ef7e" alt="E-Course Platform Logo" width="400">
</div>
<!-- ![E-Course Platform](https://github.com/user-attachments/assets/d0c7ea30-45be-4479-8a12-a2a024f6ef7e) -->

## Skills & Technologies

<p align="center">
    <img src="https://skillicons.dev/icons?i=react,js,html,css,bootstrap,nodejs,git&theme=light" />
</p>

<p align="center">
    <a href="https://choosealicense.com/licenses/mit/">
        <img src="https://img.shields.io/badge/License-MIT-green.svg" alt="MIT License">
    </a>
    <a href="https://github.com/facebook/create-react-app">
        <img src="https://img.shields.io/badge/React-18.2.0-blue" alt="React Version">
    </a>
    <a href="https://getbootstrap.com/">
        <img src="https://img.shields.io/badge/Bootstrap-5.3.0-purple" alt="Bootstrap">
    </a>
    <a href="https://nodejs.org/">
        <img src="https://img.shields.io/badge/Node.js-18+-green" alt="Node Version">
    </a>
</p>

## Features

### 🎓 **Core Learning Features**

- **Interactive Video Lessons** - YouTube and Google Drive video integration with progress tracking
- **Exercise System** - Hands-on coding exercises with auto-grading and scoring
- **Testing & Assessment** - Comprehensive testing system with time limits and instant feedback
- **Progress Tracking** - Real-time learning progress with completion certificates
- **Course Categories** - Organized learning paths across multiple subjects

### 🛒 **E-commerce Features**

- **Shopping Cart** - Add/remove courses with persistent cart state
- **Secure Payment** - Integrated payment gateway with session management
- **Course Enrollment** - Seamless enrollment process with instant access
- **Payment Success Handling** - Automated course activation post-payment

### 👤 **User Experience**

- **User Authentication** - Secure login/signup with JWT token management
- **Responsive Design** - Mobile-first design that works on all devices
- **Dark/Light Mode Support** - Customizable UI themes
- **Search & Filtering** - Advanced course discovery with multiple filters
- **User Profiles** - Personalized dashboards and learning history

### 🎯 **Advanced Features**

- **Course Reviews & Ratings** - Student feedback system with 5-star ratings
- **Instructor Profiles** - Detailed instructor information and course listings
- **Certificate Generation** - Downloadable completion certificates
- **Course Attachments** - Additional resources and materials download
- **Real-time Notifications** - Toast notifications for user actions

## Tech Stack

### Frontend Core

- **React 19.1.0** - Modern React with hooks and context API
- **React Router 6.30.1** - Client-side routing and navigation
- **React Bootstrap 2.10.10** - UI components and responsive design
- **Bootstrap 5.3.6** - CSS framework for styling

### State Management & API

- **Context API** - Global state management for user and cart data
- **Axios 1.9.0** - HTTP client for API requests
- **React Cookies** - Cookie management for authentication

### Media & UI Libraries

- **React YouTube 10.1.0** - YouTube video player integration
- **React Icons 5.5.0** - Comprehensive icon library
- **React Toastify 10.0.6** - Toast notifications
- **RC Progress 4.0.0** - Progress bars and indicators

### Development Tools

- **React Scripts 5.0.1** - Build toolchain and development server
- **Testing Library** - Comprehensive testing utilities
- **ESLint** - Code linting and formatting

## Installation

### Prerequisites

- Node.js 18+ and npm/yarn
- Modern web browser
- Git for version control

### Setup Instructions

1. **Clone the repository**

```bash
git clone <repository-url>
cd E_Course/Frontend
```

2. **Install dependencies**

```bash
npm install
# or
yarn install
```

3. **Environment Configuration**

```bash
# Create .env file in the root directory
cp .env.example .env

# Configure your environment variables
API_BASE_URL=http://localhost:8080/Ecourse/api
```

4. **Start the development server**

```bash
npm start
# or
yarn start
```

5. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000) to view the application.

## Available Scripts

### Development

```bash
npm start          # Start development server
npm test           # Run test suite
npm run build      # Build for production
npm run eject      # Eject from Create React App (irreversible)
```

### Production Build

```bash
npm run build      # Creates optimized production build
npm run preview    # Preview production build locally
```

## Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── CallToAction.jsx
│   ├── Companies.jsx
│   ├── CourseCard.jsx
│   ├── CourseFilters.jsx
│   ├── Footer.jsx
│   ├── Hero.jsx
│   ├── Navbar.jsx
│   ├── Pagination.jsx
│   ├── Rating.jsx
│   └── Searchbar.jsx
├── pages/              # Page components
│   ├── Cart.jsx
│   ├── CourseDetails.jsx
│   ├── CourseLearning.jsx
│   ├── CoursesList.jsx
│   ├── ExerciseAttempt.jsx
│   ├── Home.jsx
│   ├── LogIn.jsx
│   ├── MyEnrollments.jsx
│   ├── Profile.jsx
│   └── SignUp.jsx
├── contexts/           # React Context providers
│   ├── AppContext.jsx
│   └── CartContext.jsx
├── configs/           # Configuration files
│   ├── Apis.jsx
│   └── AppConfig.jsx
├── hooks/             # Custom React hooks
│   └── useFormValidation.js
├── utils/             # Utility functions
├── assets/            # Static assets and images
└── styles/            # CSS and styling files
```

## Key Features Documentation

### Course Learning System

- **Video Player Integration**: Supports YouTube and Google Drive videos
- **Lesson Progress**: Automatic progress tracking with completion status
- **Interactive Exercises**: Coding challenges with instant feedback
- **Timed Tests**: Assessment system with countdown timers
- **Certificate Generation**: Automated certificate creation upon course completion

### User Authentication

- **JWT Token Management**: Secure authentication with refresh tokens
- **Protected Routes**: Route-level access control
- **Persistent Sessions**: Maintain login state across browser sessions

### Shopping Cart & Payments

- **Cart State Management**: Persistent cart using local storage
- **Payment Integration**: Secure payment processing
- **Order Management**: Post-payment course activation

### Responsive Design

- **Mobile-First Approach**: Optimized for mobile devices
- **Tablet Support**: Enhanced UI for tablet screens
- **Desktop Experience**: Full-featured desktop interface

## API Integration

### Endpoints Structure

```javascript
// Course Management
GET /api/courses                    # Get all courses
GET /api/courses/:id               # Get course details
POST /api/courses/:id/enroll       # Enroll in course

// Learning Progress
POST /api/courses/:id/lessons/:lessonId/complete
GET /api/courses/:id/progress
GET /api/courses/:id/certificate

// User Management
POST /api/auth/login
POST /api/auth/register
GET /api/user/profile
PUT /api/user/profile
```

### Authentication

The application uses JWT tokens for authentication:

- Access tokens for API requests
- Refresh tokens for session management
- Automatic token refresh on expiration

## Browser Support

- **Chrome** 88+
- **Firefox** 85+
- **Safari** 14+
- **Edge** 88+
- **Mobile browsers** (iOS Safari, Chrome Mobile)

## Performance Optimizations

- **Code Splitting**: Lazy loading of route components
- **Image Optimization**: Responsive images with proper sizing
- **Bundle Optimization**: Tree shaking and minification
- **Caching Strategy**: Browser caching for static assets

## Contributing

We welcome contributions to the E-Course platform! Please follow these guidelines:

1. **Fork the repository**
2. **Create a feature branch**: `git checkout -b feature/amazing-feature`
3. **Commit your changes**: `git commit -m 'Add amazing feature'`
4. **Push to the branch**: `git push origin feature/amazing-feature`
5. **Open a Pull Request**

### Development Guidelines

- Follow React best practices and hooks patterns
- Use TypeScript for new components (migration in progress)
- Write unit tests for new features
- Ensure responsive design compatibility
- Follow the existing code style and formatting

### Code Style

- Use functional components with hooks
- Implement proper error handling
- Follow component composition patterns
- Use semantic HTML and accessibility standards

## Deployment

### Production Build

```bash
npm run build
```

This creates a `build` folder with optimized production files.

### Deployment Options

- **Vercel**: Zero-config deployment with GitHub integration

### Environment Variables

```bash
API_BASE_URL=http://localhost:8080/Ecourse/api
```

## Troubleshooting

### Common Issues

1. **Build fails to minify**

   - Check for ES6+ syntax in dependencies
   - Update webpack configuration if needed

2. **API connection issues**

   - Verify API endpoint URLs
   - Check CORS configuration
   - Validate authentication tokens

3. **Payment integration problems**
   - Confirm payment gateway credentials
   - Check webhook configurations
   - Verify SSL certificates

### Performance Issues

- Use React DevTools for component profiling
- Check for unnecessary re-renders
- Optimize image sizes and formats
- Review bundle size with webpack-bundle-analyzer

## Roadmap

### Upcoming Features

- Video progress tracking
- Multi-language support
- Dark mode toggle
- Real-time chat support for students


### Technical Improvements

- TypeScript migration for all components
- Enhanced error handling and logging
- Improved performance optimizations

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- [Create React App](https://create-react-app.dev/) - React application foundation
- [React Bootstrap](https://react-bootstrap.github.io/) - UI component library
- [React Router](https://reactrouter.com/) - Client-side routing
- [Axios](https://axios-http.com/) - HTTP client library
- [React Icons](https://react-icons.github.io/react-icons/) - Icon library

## Support

For support and questions:

- 📱 GitHub Issues: Create an issue in this repository
- 📧 Email:
- 📖 Documentation:
- 💬 Community:

---
