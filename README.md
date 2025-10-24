# Event Management System (POC)

> **⚠️ Work in Progress**: This is a proof-of-concept project demonstrating event management and digital ticketing capabilities. Not production-ready.

A basic event management system built with Next.js 15. Currently supports event creation, contact management, and simple attendance tracking with Google Wallet integration.

---

## Current Features

### ✅ **Working**
- Basic event creation and management
- Contact management (CRUD operations)
- Clerk authentication with Google OAuth
- MongoDB data persistence
- Simple dashboard interface
- Google Wallet integration 
- Email notifications
- QR code generation
- Attendance tracking

### ❌ **Not Implemented Yet**
- Real-time attendance monitoring
- Advanced reporting and analytics
- Bulk operations
- CSV import/export
- Mobile responsive design optimization

---

## Setup Instructions

### Requirements

- Node.js 18+
- MongoDB (Atlas recommended)
- Clerk account
- Google Cloud account (optional, for Google Wallet features)
- Gmail account (for email features)

### Basic Setup

1. Clone and install:
   ```bash
   git clone https://github.com/theridwanade/barcode-attendance-system.git
   cd barcode-attendance-system
   npm install
   ```

2. Create `.env.local`:
   ```env
   # Required
    NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=
    CLERK_SECRET_KEY=
    MONGODB_URI=
    NEXT_PUBLIC_APP_BASE_URL=http://localhost:3000
    CLERK_WEBHOOK_SECRET=
    GOOGLE_PASS_ISSUER_ID=
    SMTP_EMAIL_PASSWORD=
    SMTP_EMAIL_USER=
    JWT_SECRET=
   ```

3. Add `service_account.json` for Google Wallet (optional)

4. Run the development server:
   ```bash
   npm run dev
   ```

5. Visit `http://localhost:3000`

---

## Technical Stack

- **Framework**: Next.js 15, TypeScript
- **Database**: MongoDB with Mongoose
- **Auth**: Clerk (Google OAuth)
- **Styling**: Tailwind CSS, Radix UI
- **Code Quality**: Biome

## Project Structure

```
src/
├── app/                 # Next.js pages and API routes
├── components/          # UI components
├── lib/                # Database and utilities
├── models/             # MongoDB schemas
└── types/              # TypeScript definitions
```

## Data Models

Simple MongoDB collections:

- **Events**: Basic event info (title, dates, venue)
- **Contacts**: Contact details (name, email, phone)  
- **Admins**: User accounts linked to Clerk IDs

---

## How to Use

1. **Sign up** using Google OAuth at `/auth/signup`
2. **Add contacts** in the dashboard
3. **Create events** with basic details
4. **Invite attendees** (email functionality needs testing)
5. **Track attendance** (basic implementation only)

> **Note**: Many features are still being developed. This is a functional prototype for demonstration purposes.

---

## Available API Endpoints

Basic CRUD operations available:

- `POST /api/dashboard/events/new` - Create event
- `GET /api/dashboard/events` - List events  
- `POST /api/dashboard/contacts/new` - Add contact
- `GET /api/dashboard/contacts` - List contacts
- `POST /api/events/[id]/invite` - Invite attendees (partial)

> **Note**: API documentation is minimal. Check the source code for detailed implementation.

---

## Security

- Clerk handles authentication
- Protected routes with middleware
- Environment variables for sensitive data
- Basic input validation (needs improvement)

---

## Known Issues & Limitations

- Email notifications not fully tested
- Google Wallet integration needs verification  
- No proper error handling in many places
- UI is basic and not mobile-optimized
- No data validation on forms
- Missing proper logging and monitoring
- No tests written yet

## Contributing

This is a learning project. Feel free to:
- Report bugs
- Suggest improvements  
- Submit pull requests
- Use as reference for your own projects

## License

MIT License - feel free to use this code for learning or as a starting point for your own projects.

---
