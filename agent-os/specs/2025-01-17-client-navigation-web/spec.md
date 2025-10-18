# Client Navigation Web Feature - Specification

## Overview

The Client Navigation Web Feature is a comprehensive web-based interface that converts the mobile client experience of the MVP Tigrito professional services marketplace into a responsive web application. This feature enables clients to discover, request, and manage professional services through an intuitive web interface.

## Feature Summary

**Feature Name**: Client Navigation Web  
**Type**: Frontend Web Application  
**Priority**: High  
**Timeline**: 7 weeks (4 phases)  
**Dependencies**: Existing authentication system, database schema, shadcn/ui components

## Technical Architecture

### Frontend Stack
- **Framework**: Next.js 14+ with App Router
- **UI Library**: shadcn/ui components exclusively
- **Styling**: Tailwind CSS with responsive design
- **Language**: TypeScript
- **State Management**: React Context + Local State
- **Data Fetching**: TanStack Query
- **Forms**: React Hook Form with Zod validation

### Backend Integration
- **API**: RESTful endpoints (existing + new)
- **Authentication**: JWT-based (existing)
- **Database**: PostgreSQL with Prisma ORM (existing schema)
- **File Storage**: Media upload handling

## Database Schema Analysis

### ✅ Existing Tables (No Changes Required)
The current Prisma schema already contains all necessary tables:

- **User**: Complete with balance, location, roles (CLIENT/PROFESSIONAL/ADMIN)
- **ServicePosting**: Service requests created by clients
- **Offer**: Professional responses to service postings
- **ServiceTransaction**: Service execution and tracking
- **Payment**: Payment processing and history
- **UserPaymentMethod**: Payment method management
- **Withdrawal**: Fund withdrawal tracking
- **Review**: Service reviews and ratings
- **Media**: File attachments and uploads
- **Notification**: User notifications
- **Profession**: Service categories
- **ProfessionalProfile**: Professional profiles
- **ProfessionalService**: Proactive services offered by professionals

### ❌ Missing API Endpoints (Implementation Required)

#### Service Postings Management
```
GET    /api/services/postings/[id]     - Get single posting details
PUT    /api/services/postings/[id]     - Update posting
DELETE /api/services/postings/[id]     - Delete posting
GET    /api/services/postings/my       - Get user's own postings
```

#### Offers Management
```
GET    /api/services/offers            - List offers with filters
GET    /api/services/offers/[id]       - Get single offer details
PUT    /api/services/offers/[id]       - Update offer status (accept/reject)
```

#### Service Transactions
```
GET    /api/services/transactions      - List user's transactions
GET    /api/services/transactions/[id] - Get transaction details
PUT    /api/services/transactions/[id] - Update transaction status
```

#### Categories & Search
```
GET    /api/professions                - List all service categories
GET    /api/professions/[id]           - Get category details
GET    /api/services/search            - Search services and professionals
GET    /api/professionals/top-rated    - Get top-rated professionals
```

#### User Balance & Payments
```
GET    /api/users/balance              - Get user balance
POST   /api/payments/recharge          - Recharge account balance
GET    /api/payments/history           - Get payment history
```

## User Interface Specification

### Design System
- **Component Library**: shadcn/ui exclusively
- **Style**: "new-york" configuration
- **Base Color**: "neutral"
- **Icons**: Lucide React
- **Responsive**: Mobile-first approach

### Navigation Structure

#### Main Navigation
- **Top Bar**: User info, notifications, balance display
- **Sidebar**: Main navigation (Dashboard, Services, My Requests, Transactions, Profile)
- **Mobile**: Hamburger menu with collapsible sidebar
- **Breadcrumbs**: For deep navigation levels

#### Page Hierarchy
```
/ (Dashboard)
├── /services (Service Discovery)
│   ├── /services/[id] (Service Details)
│   └── /professionals/[id] (Professional Profile)
├── /my-requests (Request Management)
│   ├── /my-requests/[id] (Request Details)
│   └── /my-requests/create (Create Request)
├── /transactions (Transaction Tracking)
│   └── /transactions/[id] (Transaction Details)
└── /profile (Account Management)
    ├── /profile/balance (Balance Management)
    ├── /profile/payments (Payment History)
    └── /profile/settings (Account Settings)
```

### Key Pages Specification

#### 1. Dashboard (`/`)
**Purpose**: Main landing page with overview and quick actions

**Components**:
- `BalanceCard`: Display current balance with recharge/withdrawal buttons
- `PromoBanners`: Rotating promotional content
- `CategoryGrid`: Service categories with icons and links
- `TopProfessionals`: Carousel of highly-rated professionals
- `QuickActions`: Create request button and common actions
- `RecentServices`: List of nearby/relevant services

**Layout**:
```tsx
<DashboardLayout>
  <BalanceCard />
  <PromoBanners />
  <CategoryGrid />
  <TopProfessionals />
  <QuickActions />
  <RecentServices />
</DashboardLayout>
```

#### 2. Service Discovery (`/services`)
**Purpose**: Browse and search for services and professionals

**Components**:
- `SearchBar`: Global search with filters
- `CategoryFilters`: Horizontal scrollable category chips
- `ServiceTabs`: Toggle between Services and Professionals
- `ServiceList`: Paginated list of services
- `ProfessionalList`: Paginated list of professionals
- `FilterSidebar`: Advanced filtering options

**Layout**:
```tsx
<ServiceDiscoveryLayout>
  <SearchBar />
  <CategoryFilters />
  <ServiceTabs>
    <ServiceList />
    <ProfessionalList />
  </ServiceTabs>
  <FilterSidebar />
</ServiceDiscoveryLayout>
```

#### 3. Service Details (`/services/[id]`)
**Purpose**: View detailed service information and make requests

**Components**:
- `ServiceHeader`: Title, price, and basic info
- `ServiceDescription`: Detailed description and requirements
- `ServiceMedia`: Image/video gallery
- `ProfessionalInfo`: Professional profile summary
- `LocationMap`: Service area visualization
- `NegotiationPanel`: Price negotiation interface
- `ActionButtons`: Request service or contact professional

**Layout**:
```tsx
<ServiceDetailLayout>
  <ServiceHeader />
  <ServiceDescription />
  <ServiceMedia />
  <ProfessionalInfo />
  <LocationMap />
  <NegotiationPanel />
  <ActionButtons />
</ServiceDetailLayout>
```

#### 4. Request Management (`/my-requests`)
**Purpose**: Create, edit, and manage service requests

**Components**:
- `RequestTabs`: Filter by status (Open, In Progress, Completed)
- `RequestList`: List of user's requests
- `RequestCard`: Individual request summary
- `CreateRequestButton`: Quick access to request creation
- `RequestFilters`: Search and filter options

**Layout**:
```tsx
<RequestManagementLayout>
  <RequestTabs />
  <RequestList>
    <RequestCard />
  </RequestList>
  <CreateRequestButton />
  <RequestFilters />
</RequestManagementLayout>
```

#### 5. Create Request (`/my-requests/create`)
**Purpose**: Create new service requests with detailed information

**Components**:
- `RequestForm`: Multi-step form for request creation
- `CategorySelector`: Service category selection
- `LocationPicker`: Address and coordinates input
- `DateTimePicker`: Service timing selection
- `MediaUpload`: File attachment interface
- `PriceRangeSlider`: Budget range selection
- `UrgencyToggle`: Urgency level setting

**Layout**:
```tsx
<CreateRequestLayout>
  <RequestForm>
    <CategorySelector />
    <LocationPicker />
    <DateTimePicker />
    <MediaUpload />
    <PriceRangeSlider />
    <UrgencyToggle />
  </RequestForm>
</CreateRequestLayout>
```

#### 6. Transaction Tracking (`/transactions`)
**Purpose**: Monitor active and completed service transactions

**Components**:
- `TransactionTabs`: Filter by status (Active, Completed, Cancelled)
- `TransactionList`: List of user's transactions
- `TransactionCard`: Individual transaction summary
- `StatusBadge`: Visual status indicators
- `ActionButtons`: Complete, cancel, or review actions

**Layout**:
```tsx
<TransactionLayout>
  <TransactionTabs />
  <TransactionList>
    <TransactionCard />
  </TransactionList>
</TransactionLayout>
```

#### 7. Profile Management (`/profile`)
**Purpose**: Account settings and balance management

**Components**:
- `ProfileHeader`: User info and verification status
- `BalanceCard`: Current balance and quick actions
- `PaymentMethods`: Manage payment methods
- `TransactionHistory`: Payment and withdrawal history
- `AccountSettings`: Profile and preference settings
- `RoleToggle`: Switch between client and professional modes

**Layout**:
```tsx
<ProfileLayout>
  <ProfileHeader />
  <BalanceCard />
  <PaymentMethods />
  <TransactionHistory />
  <AccountSettings />
  <RoleToggle />
</ProfileLayout>
```

## Component Specifications

### Core Components

#### BalanceCard
```tsx
interface BalanceCardProps {
  balance: number;
  currency: string;
  onRecharge: () => void;
  onWithdraw: () => void;
}
```

#### ServiceCard
```tsx
interface ServiceCardProps {
  service: ServicePosting | ProfessionalService;
  type: 'posting' | 'proactive';
  onSelect: (id: string) => void;
}
```

#### RequestCard
```tsx
interface RequestCardProps {
  request: ServicePosting;
  offerCount: number;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
  onViewOffers: (id: string) => void;
}
```

#### TransactionCard
```tsx
interface TransactionCardProps {
  transaction: ServiceTransaction;
  onComplete: (id: string) => void;
  onCancel: (id: string) => void;
  onReview: (id: string) => void;
}
```

### Form Components

#### RequestForm
```tsx
interface RequestFormData {
  title: string;
  description: string;
  categoryId: string;
  location: {
    address: string;
    lat: number;
    lng: number;
  };
  requiredFrom: Date;
  requiredTo: Date;
  priceMin: number;
  priceMax: number;
  isUrgent: boolean;
  mediaIds: string[];
}
```

#### NegotiationPanel
```tsx
interface NegotiationPanelProps {
  serviceId: string;
  currentPrice: number;
  onNegotiate: (min: number, max: number, note: string) => void;
  onAccept: (offerId: string) => void;
  onReject: (offerId: string) => void;
}
```

## API Integration

### Data Fetching Strategy
- **Server Components**: Initial page loads and SEO-critical data
- **Client Components**: Interactive features and real-time updates
- **TanStack Query**: Caching, background updates, and optimistic updates
- **React Hook Form**: Form state management and validation

### API Endpoints Implementation

#### Service Postings
```typescript
// Get user's postings
const { data: postings } = useQuery({
  queryKey: ['postings', 'my'],
  queryFn: () => api.get('/api/services/postings/my')
});

// Create posting
const createPosting = useMutation({
  mutationFn: (data: CreatePostingRequest) => 
    api.post('/api/services/postings', data),
  onSuccess: () => {
    queryClient.invalidateQueries(['postings']);
  }
});
```

#### Offers Management
```typescript
// Get offers for a posting
const { data: offers } = useQuery({
  queryKey: ['offers', postingId],
  queryFn: () => api.get(`/api/services/offers?postingId=${postingId}`)
});

// Update offer status
const updateOfferStatus = useMutation({
  mutationFn: ({ offerId, status }: { offerId: string; status: string }) =>
    api.put(`/api/services/offers/${offerId}`, { status }),
  onSuccess: () => {
    queryClient.invalidateQueries(['offers']);
  }
});
```

#### Search and Discovery
```typescript
// Search services
const { data: searchResults } = useQuery({
  queryKey: ['search', query, filters],
  queryFn: () => api.get('/api/services/search', { params: { query, ...filters } })
});

// Get top-rated professionals
const { data: topProfessionals } = useQuery({
  queryKey: ['professionals', 'top-rated'],
  queryFn: () => api.get('/api/professionals/top-rated')
});
```

## State Management

### Global State (React Context)
```typescript
interface AppState {
  user: User | null;
  balance: number;
  notifications: Notification[];
  currentLocation: Location | null;
}

const AppContext = createContext<AppState | null>(null);
```

### Local State (Component Level)
- Form data and validation states
- UI interaction states (modals, dropdowns)
- Filter and search states
- Pagination states

### URL State
- Search parameters for filters
- Pagination parameters
- Navigation state

## Responsive Design

### Breakpoints
- **Mobile**: 320px - 768px
- **Tablet**: 768px - 1024px
- **Desktop**: 1024px+

### Mobile-First Approach
- Touch-friendly interface elements
- Swipe gestures for carousels
- Collapsible navigation
- Optimized form layouts

### Desktop Enhancements
- Hover states and interactions
- Keyboard navigation
- Multi-column layouts
- Advanced filtering panels

## Performance Requirements

### Loading Performance
- **First Contentful Paint**: < 1.5s
- **Largest Contentful Paint**: < 2.5s
- **Cumulative Layout Shift**: < 0.1
- **First Input Delay**: < 100ms

### Runtime Performance
- **API Response Time**: < 500ms
- **Page Navigation**: < 200ms
- **Image Loading**: Lazy loading with placeholders
- **Bundle Size**: < 500KB initial load

### Optimization Strategies
- Server-side rendering for initial loads
- Code splitting and lazy loading
- Image optimization and WebP format
- Caching strategies for API calls
- Memoization for expensive computations

## Security Considerations

### Authentication
- JWT token validation on all protected routes
- Automatic token refresh
- Secure token storage
- Logout on token expiration

### Input Validation
- Client-side validation with Zod schemas
- Server-side validation on all API endpoints
- XSS protection for user inputs
- CSRF protection for state-changing operations

### Data Protection
- Sensitive data encryption
- Secure file upload handling
- Rate limiting on API endpoints
- Input sanitization

## Accessibility Requirements

### WCAG 2.1 AA Compliance
- Keyboard navigation support
- Screen reader compatibility
- Color contrast ratios
- Focus management
- Alternative text for images

### Implementation
- Semantic HTML structure
- ARIA labels and roles
- Focus indicators
- Skip navigation links
- Error message associations

## Testing Strategy

### Unit Testing
- Component testing with React Testing Library
- Hook testing with custom test utilities
- Utility function testing
- Schema validation testing

### Integration Testing
- API integration testing
- Form submission testing
- Navigation flow testing
- Authentication flow testing

### End-to-End Testing
- Critical user journey testing
- Cross-browser compatibility
- Mobile device testing
- Performance testing

## Deployment and Monitoring

### Build Process
- TypeScript compilation
- Tailwind CSS optimization
- Image optimization
- Bundle analysis and optimization

### Environment Configuration
- Development environment setup
- Staging environment for testing
- Production environment configuration
- Environment-specific API endpoints

### Monitoring
- Error tracking and reporting
- Performance monitoring
- User analytics
- API usage monitoring

## Success Metrics

### Functional Metrics
- Complete user journey implementation
- All API endpoints functional
- Responsive design across devices
- Accessibility compliance

### Performance Metrics
- Page load times < 2 seconds
- API response times < 500ms
- 99.9% uptime for critical features
- Support for 1000+ concurrent users

### User Experience Metrics
- Intuitive navigation and workflows
- Consistent design language
- Mobile-first responsive design
- Accessible interface (WCAG 2.1 AA)

## Risk Assessment

### Technical Risks
- **API Integration Complexity**: Mitigated by existing backend infrastructure
- **Performance Issues**: Addressed through optimization strategies
- **Browser Compatibility**: Tested across major browsers
- **Mobile Responsiveness**: Mobile-first design approach

### Business Risks
- **User Adoption**: Intuitive design and familiar patterns
- **Performance Impact**: Optimized loading and runtime performance
- **Maintenance Overhead**: Well-structured code and documentation

## Conclusion

The Client Navigation Web Feature provides a comprehensive, responsive web interface for the MVP Tigrito professional services marketplace. By leveraging existing backend infrastructure and following modern web development best practices, this feature will deliver an excellent user experience across all devices while maintaining high performance and accessibility standards.

The implementation will be divided into four phases, each building upon the previous phase to create a complete client navigation experience that seamlessly integrates with the existing system architecture.
