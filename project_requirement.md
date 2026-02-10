Create a Next.js web application for an employee lucky draw system with the following specifications:

## Project Overview

Build a lottery-style employee prize drawing application that randomly selects 10 winners from a pool of employees. Each winner receives a 10,000 THB prize. The system uses a slot machine animation style to reveal 7-digit employee IDs digit-by-digit, creating an engaging and suspenseful experience.

## Core Requirements

### 1. Prize Drawing Mechanics

- Draw 10 unique winners sequentially (one at a time)
- Each employee ID consists of 7 digits (format: 2210053)
- Slot machine animation: each digit spins independently before landing on the final number
- Prevent duplicate winners across all 10 draws
- Large, highly visible text and animations (target audience: elderly users)

### 2. User Interface Requirements

- **Primary Target Device**: iPad (both landscape and portrait orientations)
- **Secondary Support**: Desktop web browsers (responsive design)
- **Font Sizes**: Extra large for readability by elderly users
- **Touch Targets**: Large buttons (minimum 60px height) for easy tapping
- **Visual Feedback**: Clear, obvious button states and loading indicators
- **Color Scheme**: High contrast for visibility

### 3. Animation Specifications

- Slot machine style spinning animation for each of the 7 digits
- Staggered reveal: digits should stop spinning one by one (left to right)
- Smooth, professional animations (consider using Framer Motion)
- Celebration effects when a winner is revealed (confetti, sound effects optional)
- Duration: approximately 3-5 seconds per draw

### 4. Features & Functionality

- **Start Screen**: Large "Start Draw" button to begin the process
- **Drawing Screen**: Show current draw number (1 of 10, 2 of 10, etc.)
- **Spinning Animation**: 7 individual slot reels spinning simultaneously
- **Winner Display**: Large employee ID display after animation completes
- **Winners List**: Show all previously drawn winners
- **Reset Function**: Admin ability to restart the entire draw process
- **Employee Data Management**:
  - Import employee list (CSV or manual entry)
  - Minimum data: Employee ID (7 digits)
  - Optional: Employee name, department

### 5. Technical Implementation

#### State Management (Zustand)

- Employee pool (all eligible employees)
- Drawn winners array
- Current draw status (idle, spinning, revealed)
- Current draw number (1-10)
- Animation state for each digit

#### Animations (Framer Motion)

- Slot reel spinning effects
- Staggered digit reveals
- Winner celebration animations
- Screen transitions

#### Responsive Design (Tailwind CSS)

- iPad landscape (1024x768 and up): Primary layout
- iPad portrait (768x1024): Adjusted layout
- Desktop (1280px+): Alternative layout
- Mobile (optional, basic support)

#### UI Components (shadcn/ui)

- Button (for start/reset actions)
- Card (for winner displays)
- Dialog (for confirmations)
- Progress (for draw counter)

### 6. Additional Libraries Needed

- **framer-motion**: For smooth slot machine animations
- **react-confetti** or **canvas-confetti**: For celebration effects
- **react-countup**: For number rolling effects (optional alternative)
- **papaparse**: For CSV import of employee data (if needed)

## Development Phases

### Phase 1: Project Setup & Basic Structure

**Deliverables:**

- Initialize Next.js 14+ project with TypeScript
- Install and configure: Tailwind CSS, shadcn/ui, Zustand, Framer Motion
- Set up project folder structure
- Create basic layout component optimized for iPad
- Implement responsive breakpoints for iPad landscape/portrait

**Files to create:**

- `/src/app/layout.tsx` - Root layout
- `/src/app/page.tsx` - Main draw page
- `/src/components/Layout.tsx` - Responsive container
- `/src/store/drawStore.ts` - Zustand store skeleton
- `tailwind.config.ts` - Custom breakpoints for iPad

### Phase 2: State Management & Data Layer

**Deliverables:**

- Complete Zustand store with all required state
- Employee data structure and type definitions
- Functions to handle:
  - Loading employee list
  - Random winner selection (no duplicates)
  - Reset functionality
- Mock employee data (50-100 employees for testing)

**Files to create:**

- `/src/store/drawStore.ts` - Complete store
- `/src/types/employee.ts` - TypeScript types
- `/src/lib/drawLogic.ts` - Winner selection algorithm
- `/src/data/mockEmployees.ts` - Test data

### Phase 3: Slot Machine Animation Component

**Deliverables:**

- Reusable SlotReel component for single digit
- SlotMachine component combining 7 reels
- Spinning animation logic
- Staggered stop sequence (each reel stops with delay)
- Number randomization during spin

**Files to create:**

- `/src/components/SlotReel.tsx` - Single digit reel
- `/src/components/SlotMachine.tsx` - 7-digit container
- `/src/hooks/useSlotAnimation.ts` - Animation control hook
- `/src/lib/animationConfig.ts` - Animation timing constants

### Phase 4: Main Draw Interface

**Deliverables:**

- Start screen with large "Start Draw" button
- Draw counter display (X of 10)
- Main slot machine display (extra large)
- "Draw Next Winner" button
- Winner reveal screen with celebration
- Large, elderly-friendly typography throughout

**Files to create:**

- `/src/components/StartScreen.tsx`
- `/src/components/DrawScreen.tsx`
- `/src/components/WinnerReveal.tsx`
- `/src/components/DrawCounter.tsx`

### Phase 5: Winners Display & History

**Deliverables:**

- Side panel or bottom section showing all winners
- Clear numbering (Winner #1, #2, etc.)
- Responsive layout that works in both orientations
- Highlight newly drawn winner
- Export winners list functionality (optional)

**Files to create:**

- `/src/components/WinnersList.tsx`
- `/src/components/WinnerCard.tsx`
- `/src/lib/exportWinners.ts` (optional)

### Phase 6: iPad Optimization & Polish

**Deliverables:**

- Test and optimize for iPad Safari
- Landscape mode: slot machine center, winners on side
- Portrait mode: slot machine top, winners below
- Large touch targets (minimum 60px)
- Prevent accidental zoom/scroll
- Add haptic feedback for iPad (if possible via web)
- Performance optimization for smooth animations

**Updates to:**

- All component files for iPad-specific sizing
- `globals.css` - Touch optimization, prevent zoom
- Add viewport meta tags

### Phase 7: Additional Features & Admin Panel

**Deliverables:**

- Reset/restart functionality with confirmation
- Settings panel (animation speed, sound toggle)
- CSV import for employee list
- Basic admin authentication (optional)
- Print winners list feature

**Files to create:**

- `/src/components/AdminPanel.tsx`
- `/src/components/Settings.tsx`
- `/src/components/EmployeeImport.tsx`
- `/src/lib/csvParser.ts`

### Phase 8: Testing & Deployment

**Deliverables:**

- Cross-device testing (iPad, desktop)
- Test with real employee data
- Performance testing (animation smoothness)
- Build optimization
- Deployment setup (Vercel recommended)
- Documentation

## Technical Stack Summary

- **Framework**: Next.js 14+ (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: shadcn/ui
- **State Management**: Zustand
- **Animations**: Framer Motion
- **Confetti Effects**: canvas-confetti or react-confetti
- **CSV Parsing**: papaparse (if needed)
- **Deployment**: Vercel

## Design Guidelines

- **Typography**: Use 'Inter' or 'Roboto' font, minimum 24px for body text
- **Primary Actions**: Minimum 60px height buttons with clear labels
- **Color Palette**:
  - Primary: Bold, energetic color (e.g., #3B82F6)
  - Success: Green for winners (#10B981)
  - Background: Clean white or light gray
  - High contrast text
- **Spacing**: Generous padding and margins (minimum 20px)
- **Animations**: Smooth but not too fast (elderly users need time to process)

## Success Criteria

- Smooth slot machine animation at 60fps on iPad
- All 10 winners drawn without duplicates
- Readable from 2-3 feet away
- No accidental taps or gestures
- Works reliably in both iPad orientations
- Loads in under 3 seconds
- Celebration effects enhance excitement without being overwhelming

## Edge Cases to Handle

- Less than 10 eligible employees in pool
- Network issues during draw
- Mid-draw page refresh/reload
- Multiple people trying to use simultaneously (optional lock mechanism)
- Very long employee lists (1000+ employees)
