# Documents Component

## Overview
The Documents component provides a comprehensive document management interface for the KonaAI application. It allows users to view, search, and manage project documents with a clean, modern interface.

## Features

### Core Functionality
- **Document Listing**: Displays documents in a structured table format
- **Search**: Real-time search through document names and comments
- **File Type Icons**: Visual indicators for different file types (PDF, Excel, Word, etc.)
- **Upload Functionality**: Upload buttons for adding new documents
- **Responsive Design**: Works on desktop and mobile devices

### Table Columns
- **Module**: Categorizes documents by project module (All, P2P, T&E, O2C)
- **Name**: Document name with file type icon
- **Size**: File size in MB
- **Date Modified**: Last modification date
- **Next Update Due**: Scheduled update date
- **Type**: Document type (Policy, Procedure, Compliance)
- **Comment**: Additional notes about the document
- **Actions**: Upload button for each document

### File Type Support
- PDF files (red icon)
- Word documents (blue icon)
- Excel spreadsheets (green icon)
- PowerPoint presentations (orange icon)
- Text files (gray icon)
- Generic files (gray icon)

## Usage

### Navigation
The Documents component is accessible through the sidebar navigation:
1. Click on "Admin" in the sidebar
2. Select "Documents" from the submenu
3. The component will load with the documents table

### Search
- Use the search bar to filter documents by name or comment
- Search is case-insensitive and updates in real-time

### Upload
- Click "New Document" button in the header to upload a new document
- Click individual "Upload" buttons in the table rows for specific documents

## Technical Details

### Component Structure
```
documents/
├── documents.component.ts      # Main component logic
├── documents.component.html    # Template
├── documents.component.scss    # Styles
└── README.md                   # This documentation
```

### Dependencies
- Angular Common Module
- Angular Forms Module
- Bootstrap Icons (for file type icons)

### Styling
- Uses Figtree font family
- Follows KonaAI design system colors
- Responsive design with mobile support
- Hover effects and transitions

### Data Interface
```typescript
interface Document {
  id: number;
  module: string;
  name: string;
  size: string;
  dateModified: string;
  nextUpdateDue: string;
  type: string;
  comment: string;
  fileType?: string;
}
```

## Future Enhancements
- File upload dialog with drag-and-drop support
- Document preview functionality
- Bulk operations (delete, move, etc.)
- Document versioning
- Integration with cloud storage services
- Advanced filtering and sorting options
