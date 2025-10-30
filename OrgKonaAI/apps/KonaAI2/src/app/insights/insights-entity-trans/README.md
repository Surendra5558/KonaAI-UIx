# Insights Entity Transaction Component

## Overview
The `InsightsEntityTransComponent` is a new component that provides detailed entity view and transaction analysis functionality for the KonaAI insights system.

## Features
- **Entity Overview**: Displays statistics for total entities, high/medium/low risk entities
- **Transaction Analysis**: Provides filtering and tabular view of entity transactions
- **Navigation**: Seamless navigation back to the main insights component
- **Responsive Design**: Mobile-friendly interface with responsive layouts

## Usage

### Navigation
Users can access this component by clicking on the "Entity View" item in the insights sidebar navigation.

### Routes
- **Path**: `/insights/entity-trans`
- **Parent Route**: `/insights`

### Component Structure
```
insights-entity-trans/
├── insights-entity-trans.component.ts      # Main component logic
├── insights-entity-trans.component.html    # Component template
├── insights-entity-trans.component.scss    # Component styles
├── insights-entity-trans.component.spec.ts # Unit tests
└── README.md                              # This documentation
```

## Dependencies
- Angular Common Module
- Angular Router
- Standalone component architecture

## Styling
The component uses modern CSS with:
- CSS Grid for responsive layouts
- Flexbox for component alignment
- CSS custom properties for theming
- Responsive breakpoints for mobile devices

## Testing
Run the unit tests with:
```bash
ng test insights-entity-trans
```

## Future Enhancements
- Add real-time data integration
- Implement advanced filtering options
- Add export functionality for reports
- Integrate with external data sources
